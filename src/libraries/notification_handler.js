/* eslint-disable */
import { notificationEnum, getKeyByValue } from './bluetooth_enums.js'


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

export { notification_handler };