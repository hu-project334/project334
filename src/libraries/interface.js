/* eslint-disable */
import { serviceEnum, recMsgEnum, recMsgTypeEnum, msgAckEnum, notificationEnum, syncMsgEnum, getKeyByValue, payloadIDsEnum } from './bluetooth_enums.js'
import { NotificationHandler } from './notification_handler.js'
import { orientationQuaternionHandler, angleQuaternion } from './payload_handlers.js'
import * as THREE from 'three';

async function startRTStream(XsensDotSensor) {
    render3Dsensor(XsensDotSensor)
    console.log("Real time streaming started")
    // Reset member variables
    XsensDotSensor.data = []
    XsensDotSensor.timeArr = []
    XsensDotSensor.rawTime = 0

    // Set notifications for short payload
    await XsensDotSensor.subCharChanged(orientationQuaternionHandler, serviceEnum.measurement_service, serviceEnum.short_payload_length)

    await XsensDotSensor.subCharChanged(NotificationHandler.handleNotification, serviceEnum.message_service, serviceEnum.message_notification)

    XsensDotSensor.data = []
    XsensDotSensor.timeArr = []
    XsensDotSensor.rawTime = 0
    let buffer = new ArrayBuffer(3)
    let dataViewObject = new DataView(buffer)
    dataViewObject.setUint8(0, 0x01) // Set type of control 1: measurement
    dataViewObject.setUint8(1, 0x01) // Set start or stop 1: start 0: stop
    dataViewObject.setUint8(2, payloadIDsEnum.orientationQuaternion)
    XsensDotSensor.verbose = false
    await XsensDotSensor.writeCharacteristicData(serviceEnum.measurement_service, serviceEnum.control, dataViewObject).then(() => {XsensDotSensor.verbose = true; return})
}

async function stopRTStream(XsensDotSensor) {
    document.body.removeChild(document.body.lastChild)
    console.log("Real time streaming stopped")
    await XsensDotSensor.subCharChanged(NotificationHandler.handleNotification, serviceEnum.message_service, serviceEnum.message_notification)

    let buffer = new ArrayBuffer(3)
    let dataViewObject = new DataView(buffer)
    dataViewObject.setUint8(0, 0x01) // Set type of control 1: measurement
    dataViewObject.setUint8(1, 0x00) // Set start or stop 1: start 0: stop
    dataViewObject.setUint8(2, payloadIDsEnum.orientationQuaternion) // Set payload mode
    XsensDotSensor.verbose = false
    await XsensDotSensor.writeCharacteristicData(serviceEnum.measurement_service, serviceEnum.control, dataViewObject).then(()=>{XsensDotSensor.verbose = true; return})

    let firstIndex
    for (let i = 0; i < XsensDotSensor.data.length; i++) {
        if (XsensDotSensor.data[i][0].x != 0 && XsensDotSensor.data[i][0].y != 0 && XsensDotSensor.data[i][0].z != 0 && XsensDotSensor.data[i][0].w != 0) {
            firstIndex = i
            break
        }
    }

    XsensDotSensor.max_angle = angleQuaternion(XsensDotSensor.data[firstIndex][0], XsensDotSensor.data[XsensDotSensor.data.length - 1][0]).toFixed(2)
    console.log(`Quat angle: ${XsensDotSensor.max_angle}`)
    console.log("Recording duurde:", (XsensDotSensor.rawTime / 1000).toFixed(2), "seconden")

}

async function syncSensor(XsensDotSensor) {
    console.log("Synchronization started")

    NotificationHandler.setCallback(notificationEnum.syncStatus, (event) => {
        let value = event.target.value
        let status = getKeyByValue(msgAckEnum, value.getUint8(3, false))
        console.log(`Device is: ${status}`)
    })

    await XsensDotSensor.subCharChanged(NotificationHandler.handleNotification, serviceEnum.message_service, serviceEnum.message_notification)

    let dataViewObject = XsensDotSensor.createMessageObject(recMsgTypeEnum.sync_message, 6, syncMsgEnum.startSync, [0x4E,0x02,0x00,0xCD,0x22,0xD4])
    await XsensDotSensor.writeCharacteristicData(serviceEnum.message_service, serviceEnum.message_control, dataViewObject)

    await XsensDotSensor.device.gatt.disconnect()
    XsensDotSensor.sensor_status = "synchronizing";

    setTimeout(async () => {
        console.log("Attempting to connect to device")
        await XsensDotSensor.device.gatt.connect()

        console.log("Connection re-established")
        XsensDotSensor.sensor_status = "online";
        await XsensDotSensor.subCharChanged(NotificationHandler.handleNotification, serviceEnum.message_service, serviceEnum.message_notification)

        let dataViewObject = XsensDotSensor.createMessageObject(recMsgTypeEnum.sync_message, 0, syncMsgEnum.getSyncStatus, []);
        await XsensDotSensor.writeCharacteristicData(serviceEnum.message_service, serviceEnum.message_control, dataViewObject)

    }, 14000) // End of setTimeout
}

async function getSyncStatusSensor(XsensDotSensor) {
    NotificationHandler.setCallback(notificationEnum.syncStatus, async (event) => {
        let value = event.target.value
        let status = getKeyByValue(msgAckEnum, value.getUint8(3, false))
        console.log(`Device is: ${status}`)
        if (value.getUint8(3, false) == msgAckEnum.synced) {
            let dataViewObject = XsensDotSensor.createMessageObject(recMsgTypeEnum.sync_message, 0, syncMsgEnum.stopSync, []);
            await XsensDotSensor.writeCharacteristicData(serviceEnum.message_service, serviceEnum.message_control, dataViewObject)
            console.log("Sync stopped")
        } else if (value.getUint8(3, false) == msgAckEnum['un-synced']) {
            syncSensor(XsensDotSensor)
        }
    })

    await XsensDotSensor.subCharChanged(NotificationHandler.handleNotification, serviceEnum.message_service, serviceEnum.message_notification)

    let dataViewObject = XsensDotSensor.createMessageObject(recMsgTypeEnum.sync_message, 0, syncMsgEnum.getSyncStatus, []);
    await XsensDotSensor.writeCharacteristicData(serviceEnum.message_service, serviceEnum.message_control, dataViewObject)
}

// 3D representation of sensor
function render3Dsensor(XsensDotSensor) {
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
export {startRTStream, stopRTStream, getSyncStatusSensor };