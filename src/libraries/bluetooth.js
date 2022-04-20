/* eslint-disable */
import { prefix, suffix, serviceEnum, recMsgEnum, recMsgTypeEnum, msgAckEnum, notificationEnum, syncMsgEnum, getKeyByValue } from './bluetooth_enums.js'
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
        this.rotation = new THREE.Euler(0, 0, 0, 'XYZ')
        this.quaternion = new THREE.Quaternion(0, 0, 0, 0)
        this.data = []
        this.timeArr = []
        this.rawTime = 0
        this.min = new THREE.Euler(Infinity, Infinity, Infinity, 'XYZ')
        this.max = new THREE.Euler(-Infinity, -Infinity, -Infinity, 'XYZ')
        this.minQuat = undefined
        this.maxQuat = undefined
        this.ackEnum = recMsgEnum
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
            this.changeSensorStatus("disconnected")
            return Promise.reject('Device is not connected.');
        }
        return this.device.gatt.connect()
    }

    /**
     * disconnect allows you to disconnect from the currently connected device
     */
    disconnect() {
        if (!this.device) {
            this.changeSensorStatus("disconnected")
            return Promise.reject('Device is not connected.');
        }
        return this.device.gatt.disconnect();
    }

    /**
     * onDisonnected is executed when the connected device disconnects
     */
    onDisconnected() {
        this.changeSensorStatus("disconnected")
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
                let cmd = getKeyByValue(recMsgEnum, dataViewObject.getUint8(2, true))
                if (cmd == undefined ) {
                    cmd = getKeyByValue(syncMsgEnum, dataViewObject.getUint8(2, true))
                }
                let str = `${cmd} ack: ${getKeyByValue(msgAckEnum, value.getUint8(3, true))}`
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
        .catch(error => { 
            XsensDotSensor.changeSensorStatus("connection error")
            console.error(error); 
        });
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
        .catch(error => { 
            XsensDotSensor.changeSensorStatus("connection error")
            console.error(error); 
        });
    }

    /**
     * getBatteryLevel function returns the current battery level and prints it to the console
     */
    getInitialBatteryLevel() {
        return this.getCharacteristicData(serviceEnum.battery_service, serviceEnum.battery_level)
        .then((value) => { return value.getUint8(0, true) })
        .catch((error) => { 
            XsensDotSensor.changeSensorStatus("connection error")
            console.error(error); 
        });
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
     * downloadDataToCSV writes the internal data array to a csv file and downloads it to the filesystem
     */
    downloadDataToCSV(){
        let csvContent = "data:text/csv;charset=utf-8,"

        let downloadArray = [['X','      Y','      Z', '      T']].concat(this.data)

        downloadArray.forEach(function(rowArray) {
            let row = rowArray.join(", ");
            csvContent += row + "\r\n";
        });

        var encodedUri = encodeURI(csvContent);
        var link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "XsensUserData.csv");
        document.body.appendChild(link);

        link.click();
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

    changeSensorStatus(status) {
        let element = document.getElementById("sensorStatus")
        element.innerHTML = status
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
        console.log(`New notification message: ${getKeyByValue(notificationEnum, value.getUint8(2, true))}`)
        console.log(value)
    }

    /**
     * The constructor adds all possible notifications to its own member variables
     * and assigns the default notification handler
     */
    constructor(sync = false) {
        if (sync) {this.enum = syncNotEnum} else {this.enum = notificationEnum}
        Object.keys(this.enum).map(key => { notification_handler[key] = this.genericNotHandler })
    }

    /**
     * The setCallback function assigns a new callback to a notification type
     *
     */
    setCallback(notification_type, callback_function){
        notification_handler[getKeyByValue(notificationEnum, notification_type)] = callback_function
    }

    /**
     * The handle notification function calls the function assigned to the notification
     */
    handleNotification(event) {
        const value = event.target.value
        let notification_type = getKeyByValue(notificationEnum, value.getUint8(2, true))
        return notification_handler[notification_type](event)
    }

}

// =========================================================================
//                            HELPER FUNCTIONS
// =========================================================================

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

function findBluetoothDevices() {
    XsensDotSensor.request()
    .then(() => { return XsensDotSensor.connect()})
    .then(() => { 
        return XsensDotSensor.readDeviceName()
        .then((value) => {
            XsensDotSensor.changeSensorStatus("online")
            XsensDotSensor.name = value
            console.log(XsensDotSensor.name)
        })
    })
    .then(() => { return XsensDotSensor.getInitialBatteryLevel()
        .then((value) => {
            XsensDotSensor.battery_level = value;
            console.log("Battery Level: " + XsensDotSensor.battery_level)
        })
    })
    .then(() => { XsensDotSensor.subscribeToCharacteristicChangedNotifications(XsensDotSensor.handleBatteryChanged, serviceEnum.battery_service, serviceEnum.battery_level) });
}

// calculate angle between two quaternions
function angleQuaternion(start, end) {
    let z = start.multiply(end.conjugate())
    let angleDifference = new THREE.Euler().setFromQuaternion(z)
    return [Math.abs(angleDifference.x * 57.2957795).toFixed(0), Math.abs(angleDifference.y * 57.2957795).toFixed(0), Math.abs(angleDifference.z * 57.2957795).toFixed(0)]
}

function startRTStream() {
    render3Dsensor()
    console.log("Real time streaming started")
    XsensDotSensor.rawTime = 0 // Clear the rawTime

    let handlePayload = (event) => {
        // parseCompleteEulerData(event)
        let normalize = (val, max, min) => { return (val - min) / (max - min); }
        let value = event.target.value;

        // The first element from the event is 4 bits worth of time
        let timestampArr = []
        for (var i = 0; i < 4; i++){
            timestampArr.push(value.getUint8(i, true))
        }
        var result = ((timestampArr[timestampArr.length - 24]) |
                        (timestampArr[timestampArr.length - 2] << 16) |
                        (timestampArr[timestampArr.length - 3] << 8) |
                        (timestampArr[timestampArr.length - 4] << 1));

        result = result / 1000
        XsensDotSensor.timeArr.push(result)
        if(XsensDotSensor.timeArr.length > 1){
            if(XsensDotSensor.timeArr[XsensDotSensor.timeArr.length - 1] > XsensDotSensor.timeArr[XsensDotSensor.timeArr.length - 2]){
                XsensDotSensor.rawTime += XsensDotSensor.timeArr[XsensDotSensor.timeArr.length - 1] - XsensDotSensor.timeArr[XsensDotSensor.timeArr.length - 2]
            } else {
                XsensDotSensor.rawTime += XsensDotSensor.timeArr[XsensDotSensor.timeArr.length - 2] - XsensDotSensor.timeArr[XsensDotSensor.timeArr.length - 1]
            }
        }

        // Parse quaternion values
        // Parse w
        let offset = 4
        const buffer = new ArrayBuffer(4);
        let w = new DataView(buffer);
        for (let i = 0; i < 4; i++) {
            w.setInt8(i, value.getUint8(i + offset, true))
        }
        w = normalize(parseIEEE754(w), 1, 0)
        offset += 4

        // Parse x
        const buffer_x = new ArrayBuffer(4);
        let x = new DataView(buffer_x);
        for (let i = 0; i < 4; i++) {
            x.setInt8(i, value.getUint8(i + offset, true))
        }
        x = normalize(parseIEEE754(x), 1, 0)
        offset += 4

        // Parse y
        const buffer_y = new ArrayBuffer(4);
        let y = new DataView(buffer_y);
        for (let i = 0; i < 4; i++) {
            y.setInt8(i, value.getUint8(i + offset, true))
        }
        y = normalize(parseIEEE754(y), 1, 0)
        offset += 4

        // Parse z
        const buffer_z = new ArrayBuffer(4);
        let z = new DataView(buffer_z);
        for (let i = 0; i < 4; i++) {
            z.setInt8(i, value.getUint8(i + offset, true))
        }
        z = normalize(parseIEEE754(z), 1, 0)

        // Filter data and store it in the member variables
        let prevQuaternion = XsensDotSensor.quaternion
        XsensDotSensor.quaternion = new THREE.Quaternion(x, y, z, w)
        let prevRotation = XsensDotSensor.rotation
        XsensDotSensor.rotation = new THREE.Euler().setFromQuaternion(XsensDotSensor.quaternion, "XYZ")
        if (Math.round(Math.abs(XsensDotSensor.rotation.x * 57.2957795)) == 90 || Math.round(Math.abs(XsensDotSensor.rotation.x * 57.2957795)) == 180){
            XsensDotSensor.rotation.x = prevRotation.x
            XsensDotSensor.quaternion = prevQuaternion

        }
        if (Math.round(Math.abs(XsensDotSensor.rotation.y * 57.2957795)) == 90 || Math.round(Math.abs(XsensDotSensor.rotation.y * 57.2957795)) == 180){
            XsensDotSensor.rotation.y = prevRotation.y
            XsensDotSensor.quaternion = prevQuaternion

        }
        if (Math.round(Math.abs(XsensDotSensor.rotation.z * 57.2957795)) == 0 || Math.round(Math.abs(XsensDotSensor.rotation.z * 57.2957795)) == 180){
            XsensDotSensor.rotation.z = prevRotation.z
            XsensDotSensor.quaternion = prevQuaternion

        }
        let tmpArr = [XsensDotSensor.quaternion,
                     (XsensDotSensor.rotation.x*57.2957795).toFixed(2),
                     (XsensDotSensor.rotation.y*57.2957795).toFixed(2),
                     (XsensDotSensor.rotation.z*57.2957795).toFixed(2),
                     (XsensDotSensor.rawTime / 1000).toFixed(2)]
        XsensDotSensor.data.push(tmpArr)

        // Display the data, in the future this will be done in a different way
        let element = document.getElementById("x-axis")
        element.innerHTML = (XsensDotSensor.rotation.x * 57.2957795).toFixed(2)
        element = document.getElementById("y-axis")
        element.innerHTML = (XsensDotSensor.rotation.y * 57.2957795).toFixed(2)
        element = document.getElementById("z-axis")
        element.innerHTML = (XsensDotSensor.rotation.z * 57.2957795).toFixed(2)
    }

    // Set notifications for short payload
    XsensDotSensor.subscribeToCharacteristicChangedNotifications(handlePayload, serviceEnum.measurement_service, serviceEnum.short_payload_length)
    .then(() => { // Set the normal message notification handler
        return XsensDotSensor.subscribeToCharacteristicChangedNotifications(NotificationHandler.handleNotification, serviceEnum.message_service, serviceEnum.message_notification)
    })
    .then(() => {
        XsensDotSensor.data = []
        XsensDotSensor.timeArr = []
        XsensDotSensor.rawTime = 0
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
    document.body.removeChild(document.body.lastChild)
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
        // console.log("Euler data difference y:")
        // console.log(`Min: ${XsensDotSensor.min}, Max: ${XsensDotSensor.max}`)
        console.log(`First quaternion: `)
        let firstIndex
        for (let i = 0; i < XsensDotSensor.data.length; i++) {
            if (XsensDotSensor.data[i][0].x != 0 && XsensDotSensor.data[i][0].y != 0 && XsensDotSensor.data[i][0].z != 0 && XsensDotSensor.data[i][0].w != 0) {
                firstIndex = i
                break
            }
        }
        console.log(XsensDotSensor.data[firstIndex][0])
        console.log(`last quaternion`)
        console.log(XsensDotSensor.data[XsensDotSensor.data.length - 1][0])
        console.log(`Quat angle: ${angleQuaternion(XsensDotSensor.data[firstIndex][0], XsensDotSensor.data[XsensDotSensor.data.length - 1][0])}`)
        console.log("Recording duurde:", (XsensDotSensor.rawTime / 1000).toFixed(2), "seconden")

        // Reset member variables
        XsensDotSensor.data = []
        XsensDotSensor.timeArr = []
        XsensDotSensor.rawTime = 0

        return
    })
    .catch(error => { console.error(error);})
}

function syncSensor() {
    console.log("Synchronization started")

    NotificationHandler.setCallback(notificationEnum.syncStatus, (event) => {
        let value = event.target.value
        let status = getKeyByValue(msgAckEnum, value.getUint8(3, false))
        console.log(`Device is: ${status}`)
        if (status == msgAckEnum.synced) {
            let dataViewObject = XsensDotSensor.createMessageObject(recMsgTypeEnum.sync_message, 0, syncMsgEnum.stopSync, []);
            XsensDotSensor.writeCharacteristicData(serviceEnum.message_service, serviceEnum.message_control, dataViewObject)
        }
    })

    XsensDotSensor.subscribeToCharacteristicChangedNotifications(NotificationHandler.handleNotification, serviceEnum.message_service, serviceEnum.message_notification)
    .then(() => {
        let dataViewObject = XsensDotSensor.createMessageObject(recMsgTypeEnum.sync_message, 0, syncMsgEnum.getSyncStatus, []);
        return XsensDotSensor.writeCharacteristicData(serviceEnum.message_service, serviceEnum.message_control, dataViewObject)
    })
    .catch(err => { console.error(err); })
}

// 3D representation of sensor
function render3Dsensor() {
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

    var renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    var geometry = new THREE.BoxGeometry( 1.5, 1, 0.5 );
    var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    var cube = new THREE.Mesh( geometry, material );
    scene.add( cube );

    camera.position.z = 3;

    var animate = function () {
        requestAnimationFrame( animate );
        cube.setRotationFromQuaternion(XsensDotSensor.quaternion);
        renderer.render( scene, camera );
    };

    animate();
}

// Exports
export { XsensDotSensor };
export { findBluetoothDevices, startRTStream, stopRTStream, syncSensor };