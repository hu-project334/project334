/* eslint-disable */
import { prefix, suffix, serviceEnum, recMsgEnum, recMsgTypeEnum, recMsgAckEnum, recMsgNotEnum, getKeyByValue } from './bluetooth_enums.js'
import * as THREE from 'three';

// =========================================================================
//                            XSENS DOT BLE OBJECT
// =========================================================================

class XsensDot {

    constructor(verbose = true) {
        this.device = null;
        this.onDisconnected = this.onDisconnected.bind(this);
        this.verbose = verbose;
        this.battery_level = 0;
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
    getInitialBatteryLevel() {
        return this.getCharacteristicData(serviceEnum.battery_service, serviceEnum.battery_level)
        .then((value) => { return value.getUint8(0, true) })
        .catch((error) => { console.error(error); });
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

    /**
    * handleBatteryChanged is executed when the battery characteristic changes
    */
    handleBatteryChanged(event) {
        const value = event.target.value
        this.battery_level = value.getUint8(0, true)
        let element = document.getElementById("batterylevel")
        element.innerHTML = this.battery_level
    }
}

// =========================================================================
//                           NOTIFICATION HANDLER
// =========================================================================


class notification_handler {

    /**
     * genericNotHandler is the default function which is called when a notication comes in
     */
    genericNotHandler = function (event) {
        const value = event.target.value
        console.log(`New notification message: ${getKeyByValue(recMsgNotEnum, value.getUint8(2, true))}`)
        console.log(value)
    }

    /**
     * The constructor adds all possible notifications to its own member variables
     * and assigns the default notification handler
     */
    constructor() {
        Object.keys(recMsgNotEnum).map(key => { notification_handler[key] = this.genericNotHandler })
    }

    /**
     * The setCallback function assigns a new callback to a notification type
     *
     */
    setCallback(notification_type, callback_function){
        notification_handler[getKeyByValue(recMsgNotEnum, notification_type)] = callback_function
    }

    /**
     * The handle notification function calls the function assigned to the notification
     */
    handleNotification(event) {
        const value = event.target.value
        let notification_type = getKeyByValue(recMsgNotEnum, value.getUint8(2, true))
        return notification_handler[notification_type](event)
    }

}

// =========================================================================
//                            HELPER FUNCTIONS
// =========================================================================

/**
 * intToBytesArray takes an int and converts it to a 4 bytes array
 */
function intToBytesArray(int) {
    let ByteArray = new Array(4);

    for (let i = 0; i < ByteArray.length; i++) {
        let byte = int & 0xff
        ByteArray[i] = byte
        int = (int - byte) / 256
    }

    return ByteArray
}

function parseIEEE754(singleByteDataView){

    let axisString = ""
    for (let i = 0; i < 4; i++) {
        let tmpValue = (singleByteDataView.getUint8(i, true) >>> 0).toString(2)
        axisString =  ("0".repeat(8-tmpValue.length) + tmpValue) + axisString
    }

    let a = parseInt(axisString.charAt(0), 2)
    let b = parseInt(axisString.substring(1,9), 2)
    let c = parseInt("1"+axisString.substring(9), 2)

    let result = ((-1)**a * c /( 1<<( axisString.length-9 - (b-127) ))).toFixed(2)
    // if (result > 180 || result < -180){
        // result = 0
    // }
    return result
}

// =========================================================================
//                            PUBLIC FUNCTIONS
// =========================================================================

let XsensDotSensor = new XsensDot();
let NotificationHandler = new notification_handler();
var timeDataArr = [];
var eulerDataArr = [];
var recordingTimeRaw = 0

function findBluetoothDevices() {
    XsensDotSensor.request()
    .then(() => { return XsensDotSensor.connect()})
    .then(() => { return XsensDotSensor.readDeviceName().then((value) => {console.log(value)}) })
    .then(() => { return XsensDotSensor.getInitialBatteryLevel().then((value) => {console.log("Battery Level: " + value)}) })
    .then(() => { XsensDotSensor.subscribeToCharacteristicChangedNotifications(XsensDotSensor.handleBatteryChanged, serviceEnum.battery_service, serviceEnum.battery_level) });
}

function startRecording() {

    NotificationHandler.setCallback(recMsgNotEnum.storeFlashInfoDone1, startRecording2)

    console.log("")
    recordingTimeRaw = 0
    console.log("=====================startRecording=====================")
    // Enable notifications
    XsensDotSensor.subscribeToCharacteristicChangedNotifications(NotificationHandler.handleNotification, serviceEnum.message_service, serviceEnum.message_notification)
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

export function startRecording2() {

    XsensDotSensor.subscribeToCharacteristicChangedNotifications(NotificationHandler.handleNotification, serviceEnum.message_service, serviceEnum.message_notification)
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
    XsensDotSensor.subscribeToCharacteristicChangedNotifications(NotificationHandler.handleNotification, serviceEnum.message_service, serviceEnum.message_notification)
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

function differenceStartEnd(begin, end) {
    if (begin < 0){
        begin = 360 + parseFloat(begin)
    }
    if (end < 0){
        end = 360 + parseFloat(end)
    }
    return Math.abs(begin - end).toFixed(2)
}

function parseCompleteEulerData(event, adjust = 0) {
    const value = event.target.value
    let timestampArr = []
    for (var i = 7 - adjust; i < 11 - adjust; i++){                       // Get the currect sensor time
        timestampArr.push(value.getUint8(i, true))
    }
    var result = ((timestampArr[timestampArr.length - 24]) |
                    (timestampArr[timestampArr.length - 2] << 16) |
                    (timestampArr[timestampArr.length - 3] << 8) |
                    (timestampArr[timestampArr.length - 4] << 1));

    result = result / 1000
    timeDataArr.push(result)
    if(timeDataArr.length > 1){
        if(timeDataArr[timeDataArr.length - 1] > timeDataArr[timeDataArr.length - 2]){
            recordingTimeRaw += timeDataArr[timeDataArr.length - 1] - timeDataArr[timeDataArr.length - 2]
        } else {
            recordingTimeRaw += timeDataArr[timeDataArr.length - 2] - timeDataArr[timeDataArr.length - 1]
        }
    }
    var axis = []

    let axisString = ""
    for (var j = 0; j < 3; j++){                        // Get the Euler Angle data
        for (var k = 11 + (4*j) - adjust; k < 15 + (4*j) - adjust; k++){
            var tmpValue = (value.getUint8(k, true) >>> 0).toString(2)
            axisString =  ("0".repeat(8-tmpValue.length) + tmpValue) + axisString
        }

        var a = parseInt(axisString.charAt(0), 2)
        var b = parseInt(axisString.substring(1,9), 2)
        var c = parseInt("1"+axisString.substring(9), 2)

        result = ((-1)**a * c /( 1<<( axisString.length-9 - (b-127) ))).toFixed(2)
        if (result > 180 || result < -180){
            result = 0
        }
        axis.push(result)
        axisString = ""
    }
    axis.push(timeDataArr[timeDataArr.length - 1])
    eulerDataArr.push(axis)
    return axis
}

function exportData() {

    NotificationHandler.setCallback(recMsgNotEnum.exportFileDataDone, () => {
        console.log("EXPORT FILE DATA DONE")
        console.log("Euler data:")
        console.log(eulerDataArr)
        console.log("Euler data difference:")
        console.log("Aan het begin: ", eulerDataArr[0][0]," X, ", eulerDataArr[0][1]," Y, ", eulerDataArr[0][2]," Z")
        console.log("Aan het eind:  ", eulerDataArr[eulerDataArr.length-1][0]," X, ", eulerDataArr[eulerDataArr.length-1][1]," Y, ", eulerDataArr[eulerDataArr.length-1][2]," Z")
        var diffX = differenceStartEnd(eulerDataArr[0][0], eulerDataArr[eulerDataArr.length-1][0])
        var diffY = differenceStartEnd(eulerDataArr[0][1], eulerDataArr[eulerDataArr.length-1][1])
        var diffZ = differenceStartEnd(eulerDataArr[0][2], eulerDataArr[eulerDataArr.length-1][2])
        console.log(diffX*100," X, ", diffY*100," Y, ", diffZ*100," Z")
        console.log("Recording duurde:", (recordingTimeRaw / 1000).toFixed(2), "seconden")
    })

    NotificationHandler.setCallback(recMsgNotEnum.exportFileData, parseCompleteEulerData)

    console.log("")
    console.log("======================requestData======================")
    XsensDotSensor.subscribeToCharacteristicChangedNotifications(NotificationHandler.handleNotification, serviceEnum.message_service, serviceEnum.message_notification)
    .then(() => {
        let dataViewObject = XsensDotSensor.createMessageObject(recMsgTypeEnum.recording_message, 2, recMsgEnum.selectExportData, [0x00, 0x04]) //0x04 = Euler Angles
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

function startRTStream() {
    console.log("Real time streaming started")
    recordingTimeRaw = 0

    let handlePayload = (event) => {
        // parseCompleteEulerData(event)
        let value = event.target.value;
        let offset = 4
        const buffer = new ArrayBuffer(4);
        let w = new DataView(buffer);
        for (let i = 0; i < 4; i++) {
            w.setInt8(i, value.getUint8(i + offset, true))
        }
        w = parseIEEE754(w)
        offset += 4

        const buffer_x = new ArrayBuffer(4);
        let x = new DataView(buffer_x);
        for (let i = 0; i < 4; i++) {
            x.setInt8(i, value.getUint8(i + offset, true))
        }
        x = parseIEEE754(x)
        offset += 4

        const buffer_y = new ArrayBuffer(4);
        let y = new DataView(buffer_y);
        for (let i = 0; i < 4; i++) {
            y.setInt8(i, value.getUint8(i + offset, true))
        }
        y = parseIEEE754(y)
        offset += 4

        const buffer_z = new ArrayBuffer(4);
        let z = new DataView(buffer_z);
        for (let i = 0; i < 4; i++) {
            z.setInt8(i, value.getUint8(i + offset, true))
        }
        z = parseIEEE754(z)

        let quaternion = new THREE.Quaternion(x, y, z, w)
        console.log(quaternion)
        let rotation = new THREE.Euler().setFromQuaternion(quaternion, "XYZ")
        console.log(rotation)

        // let axis = parseCompleteEulerData(event, 7)
        let element = document.getElementById("x-axis")
        element.innerHTML = rotation.x
        element = document.getElementById("y-axis")
        element.innerHTML = rotation.y
        element = document.getElementById("z-axis")
        element.innerHTML = rotation.z
    }

    // Set notifications for medium payload
    XsensDotSensor.subscribeToCharacteristicChangedNotifications(handlePayload, serviceEnum.measurement_service, serviceEnum.short_payload_length)
    .then(() => { // Set the normal message notification handler
        return XsensDotSensor.subscribeToCharacteristicChangedNotifications(NotificationHandler.handleNotification, serviceEnum.message_service, serviceEnum.message_notification)
    })
    .then(() => {
        let buffer = new ArrayBuffer(3)
        let dataViewObject = new DataView(buffer)
        dataViewObject.setUint8(0, 0x01) // Set type of control 1: measurement
        dataViewObject.setUint8(1, 0x01) // Set start or stop 1: start 0: stop
        dataViewObject.setUint8(2, 0x05) // Set payload mode 16: complete euler
        XsensDotSensor.verbose = false
        XsensDotSensor.writeCharacteristicData(serviceEnum.measurement_service, serviceEnum.control, dataViewObject).then(() => {XsensDotSensor.verbose = true; return})
        return
    })
    .catch(error => { console.error(error);})
}

function stopRTStream() {
    console.log("Real time streaming stopped")
    XsensDotSensor.subscribeToCharacteristicChangedNotifications(NotificationHandler.handleNotification, serviceEnum.message_service, serviceEnum.message_notification)
    .then(() => {
        let buffer = new ArrayBuffer(3)
        let dataViewObject = new DataView(buffer)
        dataViewObject.setUint8(0, 0x01) // Set type of control 1: measurement
        dataViewObject.setUint8(1, 0x00) // Set start or stop 1: start 0: stop
        dataViewObject.setUint8(2, 0x05) // Set payload mode 16: complete euler
        XsensDotSensor.verbose = false
        XsensDotSensor.writeCharacteristicData(serviceEnum.measurement_service, serviceEnum.control, dataViewObject).then(()=>{XsensDotSensor.verbose = true; return})
        return
    })
    .then(() => {
        console.log("EXPORT FILE DATA DONE")
        console.log("Euler data:")
        console.log(eulerDataArr)
        console.log("Euler data difference:")
        console.log("Aan het begin: ", eulerDataArr[0][0]," X, ", eulerDataArr[0][1]," Y, ", eulerDataArr[0][2]," Z")
        console.log("Aan het eind:  ", eulerDataArr[eulerDataArr.length-1][0]," X, ", eulerDataArr[eulerDataArr.length-1][1]," Y, ", eulerDataArr[eulerDataArr.length-1][2]," Z")
        var diffX = differenceStartEnd(eulerDataArr[0][0], eulerDataArr[eulerDataArr.length-1][0])
        var diffY = differenceStartEnd(eulerDataArr[0][1], eulerDataArr[eulerDataArr.length-1][1])
        var diffZ = differenceStartEnd(eulerDataArr[0][2], eulerDataArr[eulerDataArr.length-1][2])
        console.log(diffX," X, ", diffY," Y, ", diffZ," Z")
        console.log("Recording duurde:", (recordingTimeRaw / 1000).toFixed(2), "seconden")
        return
    })
    .catch(error => { console.error(error);})
}

// Exports
export { findBluetoothDevices };
export { startRecording };
export { stopRecording };
export { exportData };
export { XsensDotSensor };
export { startRTStream, stopRTStream };