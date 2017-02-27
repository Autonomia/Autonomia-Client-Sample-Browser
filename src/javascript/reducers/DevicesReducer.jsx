
const DevicesReducerMessages = {
    DEVICES_ADDED: "DEVICES_ADDED",
    DEVICE_UPDATED: "DEVICE_UPDATED"
}

const DevicesReducer = (
    state = {
        Devices: []
    },
    action
) => {
    switch (action.type) {
        case DevicesReducerMessages.DEVICES_ADDED:
            state = {
                ...state,
                Devices: state.Devices.concat(action.payload)
            };
            break;

        case DevicesReducerMessages.DEVICE_UPDATED:
            const devices = [...state.Devices];
            const index = devices.findIndex(device => device.serial === action.payload.serial);
            devices[index] = action.payload;
            state = {
                ...state,
                Devices: devices
            };
            break;
    }

    return state;
}

module.exports = { DevicesReducerMessages, DevicesReducer }
