/* eslint-disable */
import * as THREE from 'three';

// =========================================================================================
//                                     HELPER FUNCTIONS
// =========================================================================================

function normalize(val, max, min){
    return (val - min) / (max - min)
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
    return result
}

// calculate angle between two quaternions
function angleQuaternion(start, end) {
    // let s2 = start.clone()
    // let e2 = end.clone()

    // let z = s2.multiply(e2.conjugate())
    // let angleDifference = new THREE.Euler().setFromQuaternion(z)
    // console.log([(angleDifference.x * 57.2957795).toFixed(0), (angleDifference.y * 57.2957795).toFixed(0), (angleDifference.z * 57.2957795).toFixed(0)])

    let angle = 2 * Math.acos(start.dot(end) / (start.length() * end.length())) * 57.2957795
    console.log(angle)
    return angle
}

// =========================================================================================
//                                      PARSE FUNCTIONS
// =========================================================================================

function parseTime(value, offset) {
    // The first element from the event is 4 bits worth of time
    let timestampArr = []
    for (var i = 0; i < 4; i++){
        timestampArr.push(value.getUint8(i + offset, true))
    }
    return ((timestampArr[timestampArr.length - 24])      |
            (timestampArr[timestampArr.length - 2] << 16) |
            (timestampArr[timestampArr.length - 3] << 8)  |
            (timestampArr[timestampArr.length - 4] << 1)  );
}

function parseQuaternion(value, offset) {
    // Parse quaternion values
    // Parse w
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

    return new THREE.Quaternion(x, y, z, w)
}


// =========================================================================================
//                                     PAYLOAD HANDLERS
// =========================================================================================

function orientationQuaternionHandler(event, sensor) {
    let value = event.target.value;

    let result = parseTime(value, 0)
    result = result / 1000
    sensor.timeArr.push(result)
    if(sensor.timeArr.length > 1){
        if(sensor.timeArr[sensor.timeArr.length - 1] > sensor.timeArr[sensor.timeArr.length - 2]){
            sensor.rawTime += sensor.timeArr[sensor.timeArr.length - 1] - sensor.timeArr[sensor.timeArr.length - 2]
        } else {
            sensor.rawTime += sensor.timeArr[sensor.timeArr.length - 2] - sensor.timeArr[sensor.timeArr.length - 1]
        }
    }

    // Filter data and store it in the member variables
    let prevQuaternion = sensor.quaternion
    sensor.quaternion = parseQuaternion(value, 4)
    let prevRotation = sensor.rotation
    sensor.rotation = new THREE.Euler().setFromQuaternion(sensor.quaternion, "XYZ")
    if (Math.round(Math.abs(sensor.rotation.x * 57.2957795)) == 90 || Math.round(Math.abs(sensor.rotation.x * 57.2957795)) == 180){
        sensor.rotation.x = prevRotation.x
        sensor.quaternion = prevQuaternion
    }
    if (Math.round(Math.abs(sensor.rotation.y * 57.2957795)) == 90 || Math.round(Math.abs(sensor.rotation.y * 57.2957795)) == 180){
        sensor.rotation.y = prevRotation.y
        sensor.quaternion = prevQuaternion
    }
    if (Math.round(Math.abs(sensor.rotation.z * 57.2957795)) == 0 || Math.round(Math.abs(sensor.rotation.z * 57.2957795)) == 180){
        sensor.rotation.z = prevRotation.z
        sensor.quaternion = prevQuaternion
    }

    let tmpArr = [sensor.quaternion,
                  sensor.rotation,
                 (sensor.rawTime / 1000).toFixed(2)]
    sensor.data.push(tmpArr)
}

export { orientationQuaternionHandler, angleQuaternion }