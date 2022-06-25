/* eslint-disable */
import { prefix, suffix, serviceEnum, recMsgEnum, recMsgTypeEnum, msgAckEnum, notificationEnum, syncMsgEnum, getKeyByValue, payloadIDsEnum } from './bluetooth_enums.js'
import { orientationQuaternionHandler, angleQuaternion } from './payload_handlers.js'
import { notification_handler } from './notification_handler.js'
import * as THREE from 'three';

// =========================================================================
//                            XSENS DOT BLE OBJECT
// =========================================================================

class XsensDot {

    constructor(verbose = true) {
        this.device = null;
        this.device_name = null;
        this.sensor_status = 'disconnected'
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
        this.max_angle = 0
        this.minQuat = undefined
        this.maxQuat = undefined
        this.ackEnum = recMsgEnum
        this.NotificationHandler = new notification_handler();
    }

    /**
     * requestDevice allows you to select a bluetooth device to connect to
     */
    async request() {
        this.device = await navigator.bluetooth.requestDevice({
        filters: [{ manufacturerData: [{ companyIdentifier: 0x0886 }] }], //Xsens Technologies B.V. bluetooth identifier (decimal: 2182, hex: 0x0886)
        optionalServices: [(prefix + serviceEnum.battery_service       + suffix),
                           (prefix + serviceEnum.measurement_service   + suffix),
                           (prefix + serviceEnum.configuration_service + suffix),
                           (prefix + serviceEnum.message_service       + suffix)]
        })
        this.device.addEventListener('gattserverdisconnected', this.onDisconnected);
    }

    /**
     * connect allows you to connect to the selected device
     */
    connect() {
        if (!this.device) {
            this.sensor_status = "disconnected";
            return Promise.reject('Device is not connected.');
        }
        return this.device.gatt.connect()
    }

    /**
     * disconnect allows you to disconnect from the currently connected device
     */
    disconnect() {
        this.sensor_status = "disconnected";
        if (!this.device) {
            return Promise.reject('Device is not connected.');
        }
        return this.device.gatt.disconnect();
    }

    /**
     * onDisonnected is executed when the connected device disconnects
     */
    onDisconnected() {
        this.sensor_status = "disconnected";
        console.log('Device is disconnected.');
    }

    /**
     * findAndConnect shows all nearby xsens sensors and connects to the chosen device
     */
    async findAndConnect() {
        try {
            await this.request()
            this.sensor_status = "connecting...";
            await this.connect()

            await this.readDeviceName()
            await this.getInitialBatteryLevel()
            this.sensor_status = "online";

            await this.subCharChanged(this.handleBatteryChanged, serviceEnum.battery_service, serviceEnum.battery_level);

        } catch (error) {
            console.log(error.name)
            console.log(error.code)
            console.error(error);
            if (error.name == 'NetworkError') {
                this.sensor_status = "error";
                alert("Something went wrong please refresh this tab and try again.");
            }
        }
    }

    /**
     * getCharacteristicData allows you to read a dataView object from the given characteristic
     */
    async getCharacteristicData(serviceEnum, characteristicEnum) {
        let service = await this.device.gatt.getPrimaryService((prefix + serviceEnum + suffix))
        let characteristic = await service.getCharacteristic((prefix + characteristicEnum + suffix))
        return characteristic.readValue();
    }

    /**
     * readMessageAck reads the acknowledge of a given dataViewObject
     */
    async readMessageAck(dataViewObject) {
        let value = await this.getCharacteristicData(serviceEnum.message_service, serviceEnum.message_acknowledge)

        if(this.verbose){
            let cmd = getKeyByValue(recMsgEnum, dataViewObject.getUint8(2, true))
            if (cmd == undefined ) {
                cmd = getKeyByValue(syncMsgEnum, dataViewObject.getUint8(2, true))
            }
            let str = `${cmd} ack: ${getKeyByValue(msgAckEnum, value.getUint8(3, true))}`
            console.log(str)
        }
        return value
    }

    /**
     * writeCharacteristicData allows you to write a dataViewObject to the given characteristic
     */
    async writeCharacteristicData(serviceEnum, characteristicEnum, dataViewObject) {
        let service = await this.device.gatt.getPrimaryService((prefix + serviceEnum + suffix))
        let characteristic = await service.getCharacteristic((prefix + characteristicEnum + suffix))
        await characteristic.writeValue(dataViewObject);
        return this.readMessageAck(dataViewObject)
    }

    /**
     * writeDeviceName allows you to change the name of the device in the device control characteristic
     */
    writeDeviceName(name) {
        return this.getCharacteristicData(serviceEnum.configuration_service, serviceEnum.device_control)
        .then(value => {

            if(name.length > 16){
                return Promise.reject('Name is too long, max 16 characters')
            }

            // Clear the old name before writing a new one
            let initialLength = value.getUint8(7, true)
            for(let i = 0; i < initialLength; i++){
                value.setUint8(i, 0x0, true)
            }

            value.setUint8(0, 0x8, true) // Set the write name
            value.setUint8(7, name.length, true) // Set the new name length

            // Write the new name
            let charArray = Array.from(name)
            for(let i = 0; i < name.length; i++) {
                value.setUint8(8 + i, charArray[i].charCodeAt(0), true)
            }

            // Write new name to object
            this.device_name = name
            this.verbose = false
            return this.writeCharacteristicData(serviceEnum.configuration_service, serviceEnum.device_control, value)
            .then(() => {
                this.verbose = true
                return this.readDeviceName()
                .then((res) => {
                    console.log("New Name:")
                    console.log(res)
                })
            })
        })
        .catch(error => {
            if (error == 'Name is too long, max 16 characters'){
                console.error(error);
            }
            else{
                this.sensor_status = "connection error";
                console.error(error);
            }
        });
    }

    /**
     * readDeviceName reads the device name from the device_control information, returns it and prints it to the console
     */
    async readDeviceName() {
        let value = await this.getCharacteristicData(serviceEnum.configuration_service, serviceEnum.device_control)

        let startOffset = 8;
        let res = '';
        for (let index = startOffset; index < (value.getUint8(7, true) + startOffset); index++) {
            res += String.fromCharCode(value.getUint8(index, true));
        }
        this.device_name = res
        return this.device_name
        }

    /**
     * blinkDeviceLED sends a command to the connected sensor to make its LED blink rapidly for a few seconds
     */
    async blinkDeviceLED() {
        try {
            let dataViewObject = await this.getCharacteristicData(serviceEnum.configuration_service, serviceEnum.device_control)

            let service = await this.device.gatt.getPrimaryService((prefix + serviceEnum.configuration_service + suffix));
            let characteristic = await service.getCharacteristic((prefix + serviceEnum.device_control + suffix));

            dataViewObject.setUint8(0, 0x1); // Enable identify function on sensor
            dataViewObject.setUint8(1, 0x01); // Set the identify bit
            console.log("Blinking LED...")
            await characteristic.writeValue(dataViewObject); // Write the full object back to the sensor
        } catch (error) {
            console.error(error)
            console.log(error.name)
        }
    }

    /**
     * getBatteryLevel function returns the current battery level and prints it to the console
     */
    async getInitialBatteryLevel() {
        let value = await this.getCharacteristicData(serviceEnum.battery_service, serviceEnum.battery_level)
        let batteryLevel = value.getUint8(0, true)
        this.battery_level = batteryLevel
        return batteryLevel
    }

    /**
     * subCharChanged function allows you to add a listener function
     * to a specific bluetooth characteristic which is called when this characteristic changes.
     */
    async subCharChanged(listenerFunction, serviceEnum, characteristicEnum) {
        let service = await this.device.gatt.getPrimaryService((prefix + serviceEnum + suffix))
        let characteristic = await service.getCharacteristic((prefix + characteristicEnum + suffix))
        characteristic.startNotifications()
        characteristic.addEventListener('characteristicvaluechanged', (event) => {listenerFunction(event, this)})
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
     * this function currently only works when you've got quaternion data, euler data and time data
     */
    downloadDataToCSV(){
        let csvContent = "data:text/csv;charset=utf-8,"

        let downloadArray = [['Qx', 'Qy', 'Qz', 'Qw', 'E', 'N', 'U', 'T']].concat(this.data)

        // Go through all data points
        downloadArray.forEach(function(rowArray) {
            let tmpArr = []
            // Each data point has a quaternion object, euler object and time stamp.
            // The floats have to be extracted from the objects
            for(let i = 0; i < rowArray.length; i++) {
                if (rowArray[i].constructor.name === 'Quaternion'){
                    tmpArr.push(rowArray[i].x.toString(), rowArray[i].y.toString(), rowArray[i].z.toString(), rowArray[i].w.toString())
                } else if (rowArray[i].constructor.name === 'Euler'){
                    tmpArr.push(rowArray[i].x.toString(), rowArray[i].y.toString(), rowArray[i].z.toString())
                } else {
                    tmpArr.push(rowArray[i].toString())
                }
            }
            let row = tmpArr.join(", ");
            tmpArr = [];
            csvContent += row + "\r\n";
        });
        console.log(`Amount of data points: ${downloadArray.length}, amount of columns for each data point: ${downloadArray[0].length}`)

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
    handleBatteryChanged(event, sensor) {
        const value = event.target.value
        sensor.battery_level = value.getUint8(0, true)
    }

    /**
     * syncSensor tries to synchronize the internal clock with other xsens sensors in the vicinity
     */
    async syncSensor() {
        console.log("Synchronization started")

        this.NotificationHandler.setCallback(notificationEnum.syncStatus, (event) => {
            let value = event.target.value
            let status = getKeyByValue(msgAckEnum, value.getUint8(3, false))
            console.log(`Device is: ${status}`)
        })

        await this.subCharChanged(this.NotificationHandler.handleNotification, serviceEnum.message_service, serviceEnum.message_notification)

        // WARNING!!! There is a mac address hardcoded here! This is due to the WebBluetooth not exposing mac address,
        // a feature is needed to save the mac address to the device object so it can be passed dynamically
        let dataViewObject = this.createMessageObject(recMsgTypeEnum.sync_message, 6, syncMsgEnum.startSync, [0x4E,0x02,0x00,0xCD,0x22,0xD4])
        await this.writeCharacteristicData(serviceEnum.message_service, serviceEnum.message_control, dataViewObject)

        await this.device.gatt.disconnect()
        this.sensor_status = "synchronizing";

        setTimeout(async () => {
            console.log("Attempting to connect to device")
            await this.device.gatt.connect()

            console.log("Connection re-established")
            this.sensor_status = "online";
            await this.subCharChanged(this.NotificationHandler.handleNotification, serviceEnum.message_service, serviceEnum.message_notification)

            let dataViewObject = this.createMessageObject(recMsgTypeEnum.sync_message, 0, syncMsgEnum.getSyncStatus, []);
            await this.writeCharacteristicData(serviceEnum.message_service, serviceEnum.message_control, dataViewObject)

        }, 14000) // End of setTimeout
    }

    /**
     * getSyncStatusSensor get the sensor its sync status and if it is not synced calls the sync function
     */
    async getSyncStatusSensor() {

        this.NotificationHandler.setCallback(notificationEnum.syncStatus, async (event) => {
            let value = event.target.value
            let status = getKeyByValue(msgAckEnum, value.getUint8(3, false))
            console.log(`Device is: ${status}`)
            if (value.getUint8(3, false) == msgAckEnum.synced) {
                let dataViewObject = this.createMessageObject(recMsgTypeEnum.sync_message, 0, syncMsgEnum.stopSync, []);
                await this.writeCharacteristicData(serviceEnum.message_service, serviceEnum.message_control, dataViewObject)
                console.log("Sync stopped")
            } else if (value.getUint8(3, false) == msgAckEnum['un-synced']) {
                this.syncSensor()
            }
        })

        await this.subCharChanged(this.NotificationHandler.handleNotification, serviceEnum.message_service, serviceEnum.message_notification)

        let dataViewObject = this.createMessageObject(recMsgTypeEnum.sync_message, 0, syncMsgEnum.getSyncStatus, []);
        await this.writeCharacteristicData(serviceEnum.message_service, serviceEnum.message_control, dataViewObject)
    }

    async startRTStream() {
        console.log("Real time streaming started")
        // Reset member variables
        this.data = []
        this.timeArr = []
        this.rawTime = 0

        // Set notifications for short payload
        await this.subCharChanged(orientationQuaternionHandler, serviceEnum.measurement_service, serviceEnum.short_payload_length)

        await this.subCharChanged(this.NotificationHandler.handleNotification, serviceEnum.message_service, serviceEnum.message_notification)

        this.data = []
        this.timeArr = []
        this.rawTime = 0
        let buffer = new ArrayBuffer(3)
        let dataViewObject = new DataView(buffer)
        dataViewObject.setUint8(0, 0x01) // Set type of control 1: measurement
        dataViewObject.setUint8(1, 0x01) // Set start or stop 1: start 0: stop
        dataViewObject.setUint8(2, payloadIDsEnum.orientationQuaternion)
        this.verbose = false
        await this.writeCharacteristicData(serviceEnum.measurement_service, serviceEnum.control, dataViewObject).then(() => {this.verbose = true; return})
    }

    async stopRTStream() {
        console.log("Real time streaming stopped")
        await this.subCharChanged(this.NotificationHandler.handleNotification, serviceEnum.message_service, serviceEnum.message_notification)

        let buffer = new ArrayBuffer(3)
        let dataViewObject = new DataView(buffer)
        dataViewObject.setUint8(0, 0x01) // Set type of control 1: measurement
        dataViewObject.setUint8(1, 0x00) // Set start or stop 1: start 0: stop
        dataViewObject.setUint8(2, payloadIDsEnum.orientationQuaternion) // Set payload mode
        this.verbose = false
        await this.writeCharacteristicData(serviceEnum.measurement_service, serviceEnum.control, dataViewObject).then(()=>{this.verbose = true; return})

        let firstIndex
        for (let i = 0; i < this.data.length; i++) {
            if (this.data[i][0].x != 0 && this.data[i][0].y != 0 && this.data[i][0].z != 0 && this.data[i][0].w != 0) {
                firstIndex = i
                break
            }
        }

        this.max_angle = angleQuaternion(this.data[firstIndex][0], this.data[this.data.length - 1][0]).toFixed(2)
        console.log(`Quat angle: ${this.max_angle}`)
        console.log("Recording duurde:", (this.rawTime / 1000).toFixed(2), "seconden")
    }

}

let XsensDotSensor = new XsensDot()
export { XsensDotSensor };