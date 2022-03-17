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
// eslint-disable-next-line no-unused-vars
const recMsgEnum = Object.freeze({
    // ReID || Hex value
    'getState' : 0x02,              // Request sensor recording state
    'eraseFlash' : 0x30,            // Clear all recording data space
    'startRecording' : 0x40,        // Start recording message
    'stopRecording' : 0x41,         // Stop recording
    'requestRecordingTime' : 0x42,  // Request recording time since recording started
    'requestFlashInfo' : 0x50,      // Request recording flash information
    'requestFileInfo' : 0x60,       // Request recording file information by index
    'requestFileData' : 0x70,       // Request recording file data information by index
    'stopExportData' : 0x73,        // Stop data export
    'selectExportData' : 0x74,      // Configure export data options
    'retransmission' : 0x75         // Retransmit all the data from retransDataNumber packet
});

// Recording message types
// eslint-disable-next-line no-unused-vars
const recMsgTypeEnum = Object.freeze({
    // MID || Hex value
    'recording_message' : 0x01,
    'sync_message' : 0x02
})

// Recording acknowledgements messages
// eslint-disable-next-line no-unused-vars
const recMsgAckEnum = Object.freeze({
    // ReID res || Hex value
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
// eslint-disable-next-line no-unused-vars
const recMsgNotEnum = Object.freeze({
    // ReID || Hex value
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
// eslint-disable-next-line no-unused-vars
const syncMsgEnum = Object.freeze({
    // SyID || Hex value
    'startSync' : 0x01,     // Start the synchronization
    'stopSync' : 0x02,      // Stop the synchronization (stopSyncResult notification will be sent)
    'getSyncStatus' : 0x08  // Check if the sensor is already synced (syncStatus notification will be sent)
});

// Synchronization notification messages
// eslint-disable-next-line no-unused-vars
const syncMsgNotEnum = Object.freeze({
      // SyID || Hex value
    'stopSyncResult' : 0x50, // The result of the stop sync command 0x00 = success 0x01 = fail
    'syncStatus' : 0x51      // The sync status of the sensor. 0x04 = synced, 0x09 = un-synced
});

function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}

// =========================================================================
//                            XSENS DOT BLE OBJECT
// =========================================================================

class XsensDot {

    constructor(verbose = true) {
        this.device = null;
        this.onDisconnected = this.onDisconnected.bind(this);
        this.verbose = verbose;
    }

    /**
     * requestDevice allows you to select a bluetooth device to connect to
     */
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

    /**
     * connect allows you to connect to the selected device
     */
    connect() {
        if (!this.device) {
            return Promise.reject('Device is not connected.');
        }
        return this.device.gatt.connect();
    }

    /**
     * disconnect allows you to disconnect from the currently connected device
     */
    disconnect() {
        if (!this.device) {
            return Promise.reject('Device is not connected.');
        }
        return this.device.gatt.disconnect();
    }

    /**
     * onDisonnected is executed when the connected device disconnects
     */
    onDisconnected() {
        console.log('Device is disconnected.');
    }

    /**
     * getCharacteristicData allows you to read a dataView object from the given characteristic
     */
    getCharacteristicData(service, characteristic) {
        return this.device.gatt.getPrimaryService((prefix + service + suffix))
        .then(service => { return service.getCharacteristic((prefix + characteristic + suffix)); })
        .then(characteristic => { return characteristic.readValue(); })
    }

    /**
     * readMessageAck reads the acknowledge of a given dataViewObject
     */
    readMessageAck(dataViewObject) {
        return XsensDotSensor.getCharacteristicData(serviceEnum.message_service, serviceEnum.message_acknowledge)
        .then((value) => {
            if(this.verbose){
                let str = `${getKeyByValue(recMsgEnum, dataViewObject.getUint8(2, true))} ack: ${getKeyByValue(recMsgAckEnum, value.getUint8(3, true))}`
                console.log(str)
            }
            return value
        })
    }

    /**
     * writeCharacteristicData allows you to write a dataViewObject to the given characteristic
     */
    writeCharacteristicData(service, characteristic, dataViewObject) {
        return this.device.gatt.getPrimaryService((prefix + service + suffix))
        .then(service => { return service.getCharacteristic((prefix + characteristic + suffix)); })
        .then(characteristic => { return characteristic.writeValue(dataViewObject); })
        .then(() => {
            return XsensDotSensor.readMessageAck(dataViewObject)
        })
        .catch(error => { console.error(error); })
    }

    /**
     * readDeviceName reads the device name from the device_control information, returns it and prints it to the console
     */
    readDeviceName() {
        return this.getCharacteristicData(serviceEnum.configuration_service, serviceEnum.device_control)
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

    /**
     * blinkDeviceLED sends a command to the connected sensor to make its LED blink rapidly for a few seconds
     */
    blinkDeviceLED() {
        let dataViewObject
        return this.getCharacteristicData(serviceEnum.configuration_service, serviceEnum.device_control)
        .then(value => { dataViewObject = value; }) // Get the current device control data and save it
        .then(() => { return this.device.gatt.getPrimaryService((prefix + serviceEnum.configuration_service + suffix)); })
        .then(service => { return service.getCharacteristic((prefix + serviceEnum.device_control + suffix)); })
        .then(characteristic => {
            dataViewObject.setUint8(0, 0x1); // Enable identify function on sensor
            dataViewObject.setUint8(1, 0x01); // Set the identify bit
            return characteristic.writeValue(dataViewObject); // Write the full object back to the sensor
        })
        .then(() => { console.log('Identifying sensor'); })
        .catch(error => { console.error(error); });
    }

    /**
     * getBatteryLevel function returns the current battery level and prints it to the console
     */
    getBatteryLevel() {
        return this.getCharacteristicData(serviceEnum.battery_service, serviceEnum.battery_level)
        .then(value => { console.log(`Battery percentage: ${value.getUint8(0, true)}`); return value.getUint8(0, true);})
        .catch(error => { console.error(error); });
    }

    /**
     * subscribeToCharacteristicChangedNotifications function allows you to add a listener function
     * to a specific bluetooth characteristic which is called when this characteristic changes.
     */
    subscribeToCharacteristicChangedNotifications(listenerFunction, service, characteristic) {
        return this.device.gatt.getPrimaryService((prefix + service + suffix))
        .then(service => service.getCharacteristic((prefix + characteristic + suffix)))
        .then(characteristic => characteristic.startNotifications())
        .then(characteristic => characteristic.addEventListener('characteristicvaluechanged', listenerFunction))
        .catch(error => { console.error(error); });
    }

    /**
     * createMessageObject function creates a dataView object which can be written to
     * to a bluetooth charactaristic.
     */
    createMessageObject(MID, LEN, ReID, ReDATA) {
        let realLEN = LEN + 1
        let buffer = new ArrayBuffer(160)
        let dataViewObject = new DataView(buffer)

        dataViewObject.setUint8(0, MID)      // set MID
        dataViewObject.setUint8(1, realLEN)  // set length
        dataViewObject.setUint8(2, ReID)     // Set ReID
        for(let i = 0; i < LEN; i++) {
            dataViewObject.setUint8((i+3), ReDATA[i]) // set ReDATA
        }
        dataViewObject.setUint8(realLEN+2, this.computeChecksum(dataViewObject)) // set checksum

        // Append message with all zeroes
        for(let i = (LEN + 4); i < (160 - (LEN + 4)); i++) {
            dataViewObject.setUint8(i, 0)
        }

        return dataViewObject
    }

    /**
    * computeChecksum function returns a single byte checksum of the given dataViewObject
    * Function from: https://github.com/xsens/xsens_dot_server/blob/master/bleHandler.js#L473
    */
    computeChecksum(dataViewObject) {
        let sum = 0;
        let len = dataViewObject.getUint8(1, true) + 2;

        // Sum all the bytes
        for(let i = 0; i < len; i++) {
            sum += dataViewObject.getUint8(i, true);
        }
        // Invert sum and get lower byte
        return (0x00FF & (-sum))
    }
}

// END OF XSENS DOT OBJECT
// BELOW ARE HELPER FUNCTIONS

let XsensDotSensor = new XsensDot();

/**
 * intToBytesArray takes an int and converts it to a 4 bytes array
 */
// eslint-disable-next-line no-unused-vars
function intToBytesArray(int) {
    let ByteArray = new Array(4);

    for (let i = 0; i < ByteArray.length; i++) {
        let byte = int & 0xff
        ByteArray[i] = byte
        int = (int - byte) / 256
    }

    return ByteArray
}

/**
 * handleBatteryChanged is executed when the battery characteristic changes
 */
function handleBatteryChanged(event) {
    const value = event.target.value
    let element = document.getElementById("batterylevel")
    element.innerHTML = value.getUint8(0, true)
    console.log("Received new battery level: " + value.getUint8(0, true));
}
// eslint-disable-next-line no-unused-vars
var latestNotificationType = 0x00
// eslint-disable-next-line no-unused-vars
var latestNotificationObject
// eslint-disable-next-line no-unused-vars
var dataArr = [];
/**
 * handleNotificationChanged is executed when the message_service notification characteristic is changed
 */
// eslint-disable-next-line no-unused-vars
function handleNotificationChanged(event) {
    const value = event.target.value
    latestNotificationObject = value
    latestNotificationType = value.getUint8(2, true)
    console.log(`New notification message: ${getKeyByValue(recMsgNotEnum, value.getUint8(2, true))}`)
    console.log(value)
    if (latestNotificationType == recMsgNotEnum.storeFlashInfoDone1 || latestNotificationType == recMsgNotEnum.storeFlashInfoDone2){
        console.log("CALLING NEXT PART OF START RECORDING")
        startRecording2()
    } else if (latestNotificationType == recMsgNotEnum.exportFileData) {
        let timestampArr = []
        for (var i = 7; i < 11; i++){
            timestampArr.push(value.getUint8(i, true))
        }
        var result = ((timestampArr[timestampArr.length - 24]) |
                      (timestampArr[timestampArr.length - 2] << 16) |
                      (timestampArr[timestampArr.length - 3] << 8) |
                      (timestampArr[timestampArr.length - 4] << 1));
        result = result / 1000
        dataArr.push(result)
    } else if (latestNotificationType == recMsgNotEnum.exportFileDataDone) {
        console.log("EXPORT FILE DATA DONE")
        console.log(dataArr)
    }
}

//                                                                      END OF HELPER FUNCTIONS
// ============================================================================================================================================================
//                                                                    BELOW ARE PUBLIC FUNCTIONS

function findBluetoothDevices() {
    XsensDotSensor.request()
    .then(() => { return XsensDotSensor.connect()})
    .then(() => { XsensDotSensor.readDeviceName()})
    .then(() => { XsensDotSensor.getBatteryLevel()})
    .then(() => { XsensDotSensor.subscribeToCharacteristicChangedNotifications(handleBatteryChanged, serviceEnum.battery_service, serviceEnum.battery_level) });
}

function startRecording() {
    console.log("")
    console.log("=====================startRecording=====================")
    // Enable notifications
    XsensDotSensor.subscribeToCharacteristicChangedNotifications(handleNotificationChanged, serviceEnum.message_service, serviceEnum.message_notification)
    .then(() => {
        // Erase flash
        let res = intToBytesArray(Math.floor(Date.now() / 1000))
        let ReData = new Array(3)
        for (let i = 0; i < res.length; i++) {
            ReData[i] = res[i]
        }
        let dataViewObject = XsensDotSensor.createMessageObject(recMsgTypeEnum.recording_message, 4, recMsgEnum.eraseFlash, ReData)
        console.log("Erase flash")
        console.log(dataViewObject)
        return XsensDotSensor.writeCharacteristicData(serviceEnum.message_service, serviceEnum.message_control, dataViewObject)
    })
    .catch(error => { console.error(error); })
}

function startRecording2() {

    XsensDotSensor.subscribeToCharacteristicChangedNotifications(handleNotificationChanged, serviceEnum.message_service, serviceEnum.message_notification)
    .then(() => {
        // Request flash info
        let dataViewObject = XsensDotSensor.createMessageObject(recMsgTypeEnum.recording_message, 0, recMsgEnum.requestFlashInfo, [])
        console.log("Request flash info")
        console.log(dataViewObject)
        return XsensDotSensor.writeCharacteristicData(serviceEnum.message_service, serviceEnum.message_control, dataViewObject)
    })
    .then(() => {
        // Start recording
        let res = intToBytesArray(Math.floor(Date.now() / 1000))
        let ReData = new Array(5)
        for (let i = 0; i < res.length; i++) {
            ReData[i] = res[i]
        }
        ReData[4] = 0xFF
        ReData[5] = 0xFF
        let dataViewObject = XsensDotSensor.createMessageObject(recMsgTypeEnum.recording_message, 6, recMsgEnum.startRecording, ReData)
        console.log("Start recording")
        console.log(dataViewObject)
        return XsensDotSensor.writeCharacteristicData(serviceEnum.message_service, serviceEnum.message_control, dataViewObject)
    })
    .then(() => {
        console.log("=======================================================")
        return
    })
    .catch(error => { console.error(error); })
}

function stopRecording() {
    console.log("")
    console.log("=====================stopRecording=====================")
    XsensDotSensor.subscribeToCharacteristicChangedNotifications(handleNotificationChanged, serviceEnum.message_service, serviceEnum.message_notification)
    .then(() => {
        let dataViewObject = XsensDotSensor.createMessageObject(recMsgTypeEnum.recording_message, 0, recMsgEnum.getState, [])
        console.log("Request sensor state")
        console.log(dataViewObject)
        return XsensDotSensor.writeCharacteristicData(serviceEnum.message_service, serviceEnum.message_control, dataViewObject)
    })
    .then(() => {
        // Request recording time
        let dataViewObject = XsensDotSensor.createMessageObject(recMsgTypeEnum.recording_message, 0, recMsgEnum.requestRecordingTime, [])
        console.log("Request recording time")
        console.log(dataViewObject)
        return XsensDotSensor.writeCharacteristicData(serviceEnum.message_service, serviceEnum.message_control, dataViewObject)
    })
    .then(() => {
        let dataViewObject = XsensDotSensor.createMessageObject(recMsgTypeEnum.recording_message, 0, recMsgEnum.stopRecording, [])
        console.log("Stop recording")
        console.log(dataViewObject)
        return XsensDotSensor.writeCharacteristicData(serviceEnum.message_service, serviceEnum.message_control, dataViewObject)
    })
    .then(() => {
        let dataViewObject = XsensDotSensor.createMessageObject(recMsgTypeEnum.recording_message, 0, recMsgEnum.getState, [])
        console.log("Request sensor state")
        console.log(dataViewObject)
        return XsensDotSensor.writeCharacteristicData(serviceEnum.message_service, serviceEnum.message_control, dataViewObject)
    })
    .then(() => {
        console.log("=======================================================")
        return
    })
    .catch(error => { console.error(error); })
}

function exportData() {
    console.log("")
    console.log("======================requestData======================")
    XsensDotSensor.subscribeToCharacteristicChangedNotifications(handleNotificationChanged, serviceEnum.message_service, serviceEnum.message_notification)
    .then(() => {
        let dataViewObject = XsensDotSensor.createMessageObject(recMsgTypeEnum.recording_message, 1, recMsgEnum.selectExportData, [0x00]) //0x04 = Euler Angles
        console.log("Select export data")
        console.log(dataViewObject)
        return XsensDotSensor.writeCharacteristicData(serviceEnum.message_service, serviceEnum.message_control, dataViewObject)
    }) // Select export data
    .then(() => {
        let dataViewObject = XsensDotSensor.createMessageObject(recMsgTypeEnum.recording_message, 1, recMsgEnum.requestFileInfo, [0x01])
        console.log("Request file info")
        console.log(dataViewObject)
        return XsensDotSensor.writeCharacteristicData(serviceEnum.message_service, serviceEnum.message_control, dataViewObject)
    }) // Request file info
    .then(() => {
        let dataViewObject = XsensDotSensor.createMessageObject(recMsgTypeEnum.recording_message, 1, recMsgEnum.requestFileData, [0x01])
        console.log("Request file data")
        console.log(dataViewObject)
        return XsensDotSensor.writeCharacteristicData(serviceEnum.message_service, serviceEnum.message_control, dataViewObject)
    })
    .then(() => {
        console.log("=======================================================")
        return
    })
    .catch(error => { console.error(error); })
}

// Exports
export { findBluetoothDevices };
export { startRecording };
export { stopRecording };
export { exportData };
export { XsensDotSensor };