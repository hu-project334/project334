// DIFFERENT XSENS DOT SERVICES AND UUID's
export let prefix = "1517";
export let suffix = "-4947-11e9-8646-d663bd873d93";
export const serviceEnum = Object.freeze({
  // Configuration service
  configuration_service: 1000,
  device_info: 1001,
  device_control: 1002,
  device_report: 1004,
  // Measurement service
  measurement_service: 2000,
  control: 2001,
  long_payload_length: 2002,
  medium_payload_length: 2003,
  short_payload_length: 2004,
  magnetic_field_mapper: 2005,
  orientation_reset_control: 2006,
  orientation_reset_status: 2007,
  orientation_reset_data: 2008,
  // Battery service
  battery_service: 3000,
  battery_level: 3001,
  // Message service
  message_service: 7000,
  message_control: 7001,
  message_acknowledge: 7002,
  message_notification: 7003,
});

// ========================================================================
// ALL MESSAGES CAN FOUND IN 5.4 OF THE XSENS DOT BLE SERVICE SPECIFICATION
// ========================================================================

// Recording messages
// eslint-disable-next-line no-unused-vars
export const recMsgEnum = Object.freeze({
  // ReID || Hex value
  getState: 0x02, // Request sensor recording state
  eraseFlash: 0x30, // Clear all recording data space
  startRecording: 0x40, // Start recording message
  stopRecording: 0x41, // Stop recording
  requestRecordingTime: 0x42, // Request recording time since recording started
  requestFlashInfo: 0x50, // Request recording flash information
  requestFileInfo: 0x60, // Request recording file information by index
  requestFileData: 0x70, // Request recording file data information by index
  stopExportData: 0x73, // Stop data export
  selectExportData: 0x74, // Configure export data options
  retransmission: 0x75, // Retransmit all the data from retransDataNumber packet
});

// Recording message types
// eslint-disable-next-line no-unused-vars
export const recMsgTypeEnum = Object.freeze({
  // MID || Hex value
  recording_message: 0x01,
  sync_message: 0x02,
});

// Recording acknowledgements messages
// eslint-disable-next-line no-unused-vars
export const msgAckEnum = Object.freeze({
  // ReID res || Hex value
  success: 0x00, // Control message write success
  invalidCmd: 0x02, // Invalid command
  flashProcessBusy: 0x03, // Flash is occupied by other process
  synced: 0x04, // Device is synced
  NotEnoughSample: 0x05, // Sync failed for not enough data samples
  SkewTooLarge: 0x07, // Sync failed for estimated skew too large
  StartingTimingError: 0x08, // Sync failed for start time error
  "un-synced": 0x09, // Sync is not started
  idleState: 0x06, // Idle state
  onErasing: 0x30, // Erasing internal storage
  onRecording: 0x40, // In recording state
  onExportFlashInfo: 0x50, // Exporting flash information
  onExportRecordingFileInfo: 0x60, // Exporting flash information
  onExportRecordingFileData: 0x70, // Exporting recording data
});

// Recording notification messages
// eslint-disable-next-line no-unused-vars
export const notificationEnum = Object.freeze({
  // ReID || Hex value
  flashProcessBusy: 0x03, // Flash is occupied by other process
  storeFlashInfoDone1: 0x33, // Recording flash erase is completed
  storeFlashInfoDone2: 0x31, // Recording flash erase is completed
  flashFull: 0x34, // Recording flash space is full
  invalidFlashFormat: 0x35, // Recording flash format is invalid (erase flash!)
  recordingStopped: 0x41, // Recording stopped
  recordingTime: 0x43, // StartUTC 4 bytes TotRecTime 2 bytes RemRecTie 2 bytes
  stopSyncResult: 0x50, // The result of the stop sync command 0x00 = success 0x01 = fail
  syncStatus: 0x51, // The sync status of the sensor. 0x04 = synced, 0x09 = un-synced
  exportFlashInfo: 0x51, // Recording file system info
  exportFlashInfoDone: 0x52, // Recording flash information export completed
  exportFileInfo: 0x61, // File structure header
  exportFileInfoDone: 0x62, // Recording file information export is completed
  noRecordingFile: 0x63, // Recording file information export is completed
  exportFileData: 0x71, // Export file data based on fileIndex and selectedData
  exportFileDataDone: 0x72, // Recording data export is completed
  exportDataStopped: 0x73, // Export data has been stopped
  exportFileDataInvalid: 0x76, // Invalid data packet due to internal data checksum fail
});

// Synchronization control messages
// eslint-disable-next-line no-unused-vars
export const syncMsgEnum = Object.freeze({
  // SyID || Hex value
  startSync: 0x01, // Start the synchronization
  stopSync: 0x02, // Stop the synchronization (stopSyncResult notification will be sent)
  getSyncStatus: 0x08, // Check if the sensor is already synced (syncStatus notification will be sent)
});

// Payload mode ID's
// eslint-disable-next-line no-unused-vars
export const payloadIDsEnum = Object.freeze({
  highFidelityMag: 0x01, // Medium Payload which can only be parsed by Xsens SDK
  extendedQuaternion: 0x02, // Medium Payload containing timestamp, quaternion, free acceleration, status, clipCountAcc, clipCountGyr
  completeQuaternion: 0x03, // Medium Payload containing timestamp, quaterion, free acceleration
  orientationEuler: 0x04, // Short Payload containing timestamp, euler
  orientationQuaternion: 0x05, // Short Payload containing timestamp, quaternion
  freeAcceleration: 0x06, // Short Payload containing timestamp, free acceleration
  extendedEuler: 0x07, // Medium Payload containing timestamp, euler, free acceleration, status, clipCountAcc, clipCountGyr
  completeEuler: 0x10, // Medium Payload containing timestamp, euler, free acceleration
  highFidelity: 0x11, // Medium Payload which can only be parsed by Xsens SDK
  deltaQuantitiesMag: 0x12, // Medium Payload containing timestamp, dq, dv, magnetic field
  deltaQuantities: 0x13, // Medium Payload containing timestamp, dq, dv
  rateQuantitiesMag: 0x14, // Medium Payload containing timestamp, acceleration, angular velocity, magnetic field
  rateQuantities: 0x15, // Medium Payload containing timestamp, acceleration, angular velocity
})

/**
 * getKeyByValue function takes an Enum object where it searches for
 * the given value and returns the found key name
 * @param {*} object Enum object to search for the key
 * @param {*} value Value which is held by the key
 * @returns key which matches the given value in the given enum
 */
export function getKeyByValue(object, value) {
  return Object.keys(object).find((key) => object[key] === value);
}
