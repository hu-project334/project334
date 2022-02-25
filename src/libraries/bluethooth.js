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

function findBluetoothDevices() {
  navigator.bluetooth.requestDevice({
      filters: [{
      manufacturerData: [{
        companyIdentifier: 0x0886 //Xsens Technologies B.V. bluetooth identifier (decimal: 2182, hex: 0x0886)
      }]
    }],
    optionalServices: [(prefix + serviceEnum.battery_service + suffix),
                       (prefix + serviceEnum.measurement_service + suffix),
                       (prefix + serviceEnum.configuration_service + suffix),
                       (prefix + serviceEnum.message_service + suffix)
                      ]
  })
  .then(device => { return device.gatt.connect(); }) // Connect to device
  .then(server => { return server.getPrimaryService((prefix + serviceEnum.battery_service + suffix)); })
  .then(service => { return service.getCharacteristic((prefix + serviceEnum.battery_level + suffix)); })
  .then(characteristic => { return characteristic.readValue(); })
  .then(value => { console.log(`Battery percentage is ${value.getUint8(0)}`); })
  .catch(error => { console.error(error); });
}

export { findBluetoothDevices };
