/* eslint-disable */
import { serviceEnum, recMsgEnum, recMsgTypeEnum, msgAckEnum, notificationEnum, syncMsgEnum, getKeyByValue } from './bluetooth_enums.js'
import { NotificationHandler } from './notification_handler.js'
import * as THREE from 'three';

let XsensDotSensor = null;

function setGlobal(sensor){
    XsensDotSensor = sensor
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
    return result
}

// calculate angle between two quaternions
function angleQuaternion(start, end) {
    let s2 = start.clone()
    let e2 = end.clone()

    let z = s2.multiply(e2.conjugate())
    let angleDifference = new THREE.Euler().setFromQuaternion(z)
    console.log([(angleDifference.x * 57.2957795).toFixed(0), (angleDifference.y * 57.2957795).toFixed(0), (angleDifference.z * 57.2957795).toFixed(0)])

    let angle = 2 * Math.acos(start.dot(end) / (start.length() * end.length())) * 57.2957795
    console.log(angle)
    return angle
}

// =========================================================================
//                            PUBLIC FUNCTIONS
// =========================================================================

async function findBluetoothDevices(XsensDotSensor) {

    await XsensDotSensor.request()
    await XsensDotSensor.connect()
    XsensDotSensor.sensor_status = "online";

    await XsensDotSensor.readDeviceName()
    await XsensDotSensor.getInitialBatteryLevel()

    await XsensDotSensor.subscribeToCharacteristicChangedNotifications(
        (event) => { XsensDotSensor.changeBatteryLevel(event.target.value.getUint8(0, true)) },
        serviceEnum.battery_service, serviceEnum.battery_level);
}

function startRTStream(XsensDotSensor) {
    render3Dsensor()
    console.log("Real time streaming started")
    // Reset member variables
    XsensDotSensor.data = []
    XsensDotSensor.timeArr = []
    XsensDotSensor.rawTime = 0

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
                      XsensDotSensor.rotation,
                     (XsensDotSensor.rawTime / 1000).toFixed(2)]
        XsensDotSensor.data.push(tmpArr)

        // // Display the data, in the future this will be done in a different way
        // let element = document.getElementById("x-axis")
        // element.innerHTML = (XsensDotSensor.rotation.x * 57.2957795).toFixed(2)
        // element = document.getElementById("y-axis")
        // element.innerHTML = (XsensDotSensor.rotation.y * 57.2957795).toFixed(2)
        // element = document.getElementById("z-axis")
        // element.innerHTML = (XsensDotSensor.rotation.z * 57.2957795).toFixed(2)
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

function stopRTStream(XsensDotSensor) {
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
        let firstIndex
        for (let i = 0; i < XsensDotSensor.data.length; i++) {
            if (XsensDotSensor.data[i][0].x != 0 && XsensDotSensor.data[i][0].y != 0 && XsensDotSensor.data[i][0].z != 0 && XsensDotSensor.data[i][0].w != 0) {
                firstIndex = i
                break
            }
        }
        console.log(`Quat angle: ${angleQuaternion(XsensDotSensor.data[firstIndex][0], XsensDotSensor.data[XsensDotSensor.data.length - 1][0])}`)
        console.log("Recording duurde:", (XsensDotSensor.rawTime / 1000).toFixed(2), "seconden")

        return
    })
    .catch(error => { console.error(error);})

}

function syncSensor(XsensDotSensor) {
    console.log("Synchronization started")

    NotificationHandler.setCallback(notificationEnum.syncStatus, (event) => {
        let value = event.target.value
        let status = getKeyByValue(msgAckEnum, value.getUint8(3, false))
        console.log(`Device is: ${status}`)
    })

    XsensDotSensor.subscribeToCharacteristicChangedNotifications(NotificationHandler.handleNotification, serviceEnum.message_service, serviceEnum.message_notification)
    .then(() => { // Start sync
        let dataViewObject = XsensDotSensor.createMessageObject(recMsgTypeEnum.sync_message, 6, syncMsgEnum.startSync, [0x4E,0x02,0x00,0xCD,0x22,0xD4])
        return XsensDotSensor.writeCharacteristicData(serviceEnum.message_service, serviceEnum.message_control, dataViewObject)
    })
    .then(() => {
        XsensDotSensor.device.gatt.disconnect()
        XsensDotSensor.sensor_status = "synchronizing";

        setTimeout(() => {
            console.log("Attempting to connect to device")
            XsensDotSensor.device.gatt.connect()
            .then(() => {
                console.log("Connection re-established")
                XsensDotSensor.sensor_status = "online";
                XsensDotSensor.subscribeToCharacteristicChangedNotifications(NotificationHandler.handleNotification, serviceEnum.message_service, serviceEnum.message_notification)
                .then(() => {
                    let dataViewObject = XsensDotSensor.createMessageObject(recMsgTypeEnum.sync_message, 0, syncMsgEnum.getSyncStatus, []);
                    return XsensDotSensor.writeCharacteristicData(serviceEnum.message_service, serviceEnum.message_control, dataViewObject)
                })
                .catch(err => { console.error(err); })
            })
        }, 14000) // End of setTimeout

        return
        })
    .catch(err => { console.error(err); })
}

function getSyncStatusSensor(XsensDotSensor) {
    NotificationHandler.setCallback(notificationEnum.syncStatus, (event) => {
        let value = event.target.value
        let status = getKeyByValue(msgAckEnum, value.getUint8(3, false))
        console.log(`Device is: ${status}`)
        if (value.getUint8(3, false) == msgAckEnum.synced) {
            let dataViewObject = XsensDotSensor.createMessageObject(recMsgTypeEnum.sync_message, 0, syncMsgEnum.stopSync, []);
            XsensDotSensor.writeCharacteristicData(serviceEnum.message_service, serviceEnum.message_control, dataViewObject)
            .then(() => {console.log("Sync stopped")})
        } else if (value.getUint8(3, false) == msgAckEnum['un-synced']) {
            syncSensor()
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
        // console.log(`${cube.quaternion.x} ${cube.quaternion.y} ${cube.quaternion.z}  ${cube.quaternion.w}`)
        // console.log(`${XsensDotSensor.quaternion.x} ${XsensDotSensor.quaternion.y} ${XsensDotSensor.quaternion.z}  ${XsensDotSensor.quaternion.w}`)
        renderer.render( scene, camera );
    };

    animate();
}

// Exports
export { findBluetoothDevices, startRTStream, stopRTStream, getSyncStatusSensor, setGlobal };