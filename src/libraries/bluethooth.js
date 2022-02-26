let prefix = '1517'
let suffix = '-4947-11e9-8646-d663bd873d93'
const serviceEnum = Object.freeze({
  // Configuration service
  'configuration_service' : 1000,
  'device_info' : 1001,
  'device_control' : 1002,
  'device_report' : 1004,
  // Measurement service
  'measurement_service' : 2000,
  'control' : 2001,
  'long_payload_length' : 2002,
  'medium_payload_length' : 2003,
  'short_payload_length' : 2004,
  'magnetic_field_mapper' : 2005,
  'orientation_reset_control' : 2006,
  'orientation_reset_status' : 2007,
  'orientation_reset_data' : 2008,
  // Battery service
  'battery_service' : 3000,
  'battery_level': 3001,
  // Message service
  'message_service' : 7000,
  'message_control' : 7001,
  'message_acknowledge' : 7002,
  'message_notification' : 7003
});


class XsensDot {

  constructor() {
    this.device = null;
    this.onDisconnected = this.onDisconnected.bind(this);
  }

  request() {
    return navigator.bluetooth.requestDevice({
      filters: [{
        manufacturerData: [{
          companyIdentifier: 0x0886 //Xsens Technologies B.V. bluetooth identifier (decimal: 2182, hex: 0x0886)
        }]
      }],
      optionalServices: [(prefix + serviceEnum.battery_service + suffix),
                         (prefix + serviceEnum.measurement_service + suffix),
                         (prefix + serviceEnum.configuration_service + suffix),
                         (prefix + serviceEnum.message_service + suffix)]
    })
    .then(device => {
      this.device = device;
      this.device.addEventListener('gattserverdisconnected', this.onDisconnected);
    });
  }

  connect() {
    if (!this.device) {
      return Promise.reject('Device is not connected.');
    }
    return this.device.gatt.connect();
  }

  disconnect() {
    if (!this.device) {
      return Promise.reject('Device is not connected.');
    }
    return this.device.gatt.disconnect();
  }

  onDisconnected() {
    console.log('Device is disconnected.');
  }

  getDeviceControlData() {
    return XsensDotSensor.device.gatt.getPrimaryService((prefix + serviceEnum.configuration_service + suffix))
    .then(service => { return service.getCharacteristic((prefix + serviceEnum.device_control + suffix)); })
    .then(characteristic => { return characteristic.readValue(); })
  }

  readDeviceName() {
    return this.device.gatt.getPrimaryService((prefix + serviceEnum.configuration_service + suffix))
    .then(service => service.getCharacteristic((prefix + serviceEnum.device_control + suffix)))
    .then(characteristic => characteristic.readValue())
    .then(value => {
      let startOffset = 8;
      let res = '';
      for (let index = startOffset; index < (16 + startOffset); index++) {
        res += String.fromCharCode(value.getUint8(index, true));
      }
      console.log(res);
     })
    .catch(error => { console.error(error); });
  }

  getBatteryLevel() {
    return this.device.gatt.getPrimaryService((prefix + serviceEnum.battery_service + suffix))
    .then(service => service.getCharacteristic((prefix + serviceEnum.battery_level + suffix)))
    .then(characteristic => characteristic.readValue())
    .then(value => { console.log(`Battery percentage: ${value.getUint8(0, true)}`); })
    .catch(error => { console.error(error); });
  }
}

let XsensDotSensor = new XsensDot();

function findBluetoothDevices() {
  XsensDotSensor.request()
  .then(() => { return XsensDotSensor.connect()})
  .then(() => { XsensDotSensor.readDeviceName()})
  .then(() => { XsensDotSensor.getBatteryLevel()});
}

function identifyDevice() {
  // For this function to work there needs to be a device connected.
  let dataViewObject
  return XsensDotSensor.getDeviceControlData()
  .then(value => { dataViewObject = value; }) // Get the current device control data and save it
  .then(() => { return XsensDotSensor.device.gatt.getPrimaryService((prefix + serviceEnum.configuration_service + suffix)); })
  .then(service => { return service.getCharacteristic((prefix + serviceEnum.device_control + suffix)); })
  .then(characteristic => {
    console.log(dataViewObject)
    dataViewObject.setUint8(0, 0x1); // Enable identify function on sensor
    dataViewObject.setUint8(1, 0x01); // Set the identify bit
    console.log(dataViewObject)
    return characteristic.writeValue(dataViewObject); // Write the full object back to the sensor
   })
  .then(() => { console.log('Identifying sensor'); })
  .catch(error => { console.error(error); });
}

export { findBluetoothDevices };
export { identifyDevice };
