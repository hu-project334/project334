// DIFFERENT XSENS DOT SERVICES AND UUID's
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

// ========================================================================
// ALL MESSAGES CAN FOUND IN 5.4 OF THE XSENS DOT BLE SERVICE SPECIFICATION
// ========================================================================

// Recording messages
const recMsgEnum = Object.freeze({
    // MID || Hex value
    'getState' : 0x02,              // Request sensor recording state
    'eraseFlash' : 0x30,            // Clear all recording data space
    'startRecording' : 0x40,        // Start recording message
    'stopRecording' : 0x41,         // Stop recording
    'requestRecordingtime' : 0x42,  // Request recording time since recording started
    'requestFlashInfo' : 0x50,      // Request recording flash information
    'requestFileInfo' : 0x60,       // Request recording file information by index
    'requestFileData' : 0x70,       // Request recording file data information by index
    'stopExportData' : 0x73,        // Stop data export
    'selectExportData' : 0x74,      // Configure export data options
    'retransmission' : 0x75         // Retransmit all the data from retransDataNumber packet
});

// Recording acknowledgements messages
const recMsgAckEnum = Object.freeze({
    // ReDATA res || Hex value
    'success' : 0x00,                   // Control message write success
    'invalidCmd' : 0x02,                // Invalid command
    'flashProcessBusy' : 0x03,          // Flash is occupied by other process
    'idleState' : 0x06,                 // Idle state
    'onErasing' : 0x30,                 // Erasing internal storage
    'onRecording' : 0x40,               // In recording state
    'onExportFlashInfo' : 0x50,         // Exporting flash information
    'onExportRecordingFileInfo' : 0x60, // Exporting flash information
    'onExportRecordingFileData' : 0x70  // Exporting recording data
});

// Recording notification messages
const recMsgNotEnum = Object.freeze({
    // ID || Hex value
    'flashProcessBusy' : 0x03,     // Flash is occupied by other process
    'storeFlashInfoDone1' : 0x33,  // Recording flash erase is completed
    'storeFlashInfoDone2' : 0x31,  // Recording flash erase is completed
    'flashFull' : 0x34,            // Recording flash space is full
    'invalidFlashFormat' : 0x35,   // Recording flash format is invalid (erase flash!)
    'recordingStopped' : 0x41,     // Recording stopped
    'recordingTime' : 0x43,        // StartUTC 4 bytes TotRecTime 2 bytes RemRecTie 2 bytes
    'exportFlashInfo' : 0x51,      // Recording file system info
    'exportFlashInfoDone' : 0x52,  // Recording flash information export completed
    'exportFileInfo' : 0x61,       // File structure header
    'exportFileInfoDone' : 0x62,   // Recording file information export is completed
    'noRecordingFile' : 0x63,      // Recording file information export is completed
    'exportFileData' : 0x71,       // Export file data based on fileIndex and selectedData
    'exportFileDataDone' : 0x72,   // Recording data export is completed
    'exportDataStopped' : 0x73,    // Export data has been stopped
    'exportFileDataInvalid' : 0x76 // Invalid data packet due to internal data checksum fail
});

// Synchronization control messages
const syncMsgEnum = Object.freeze({
    // SyID || Hex value
    'startSync' : 0x01,     // Start the synchronization
    'stopSync' : 0x02,      // Stop the synchronization (stopSyncResult notification will be sent)
    'getSyncStatus' : 0x08  // Check if the sensor is already synced (syncStatus notification will be sent)
});

// Synchronization notification messages
const syncMsgNotEnum = Object.freeze({
      // SyID || Hex value
    'stopSyncResult' : 0x50, // The result of the stop sync command 0x00 = success 0x01 = fail
    'syncStatus' : 0x51      // The sync status of the sensor. 0x04 = synced, 0x09 = un-synced
});

// =========================================================================
//                            XSENS DOT BLE OBJECT
// =========================================================================

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
            return res;
        })
        .catch(error => { console.error(error); });
    }

  getBatteryLevel() {
    return this.device.gatt.getPrimaryService((prefix + serviceEnum.battery_service + suffix))
    .then(service => service.getCharacteristic((prefix + serviceEnum.battery_level + suffix)))
    .then(characteristic => characteristic.readValue())
    .then(value => { console.log(`Battery percentage: ${value.getUint8(0, true)}`); return value.getUint8(0, true);})
    .catch(error => { console.error(error); });
  }
}

// End of XsensDot Object

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
        dataViewObject.setUint8(0, 0x1); // Enable identify function on sensor
        dataViewObject.setUint8(1, 0x01); // Set the identify bit
        return characteristic.writeValue(dataViewObject); // Write the full object back to the sensor
    })
    .then(() => { console.log('Identifying sensor'); })
    .catch(error => { console.error(error); });
}


// Exports
export { findBluetoothDevices };
export { identifyDevice };