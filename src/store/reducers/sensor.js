import * as type from '../actions/types';

const initialState = {
    loading: false,
    error: null,
    sensors: [],
    sensor: null,
    data: null,
    identifier: null,
    sensorRedirectPath: '/sensors'
}

const sensorStart = (state) => {
    return { ...state, 
        error: null,
        loading: true
    };
};

const sensorPostSuccess = (state, action) => {

    const newSensor = { [action.id]: action.sensor };

    return {
        ...state,
        loading: false,
        error: null,
        sensors: state.sensors.concat(newSensor),
        sensor: newSensor,
        identifier: action.identifier
    };
}

const sensorsGetSuccess = (state, action) => {
    return {
        ...state,
        loading: false,
        error: null,
        sensors: action.sensors,
        sensor: null,
        identifier: action.identifier
    }
}

const sensorGetSuccess = (state, action) => {
    return {
        ...state,
        loading: false,
        error: null,
        sensor: action.sensor,
        identifier: action.identifier
    };
}

const sensorGetDataSuccess = (state, action) => {
    return {
        ...state,
        loading: false,
        error: null,
        data: action.data,
        identifier: action.identifier
    };
}

const sensorPatchSuccess = (state, action) => {

    const index = state.sensors.findIndex(sen => sen.hasOwnProperty(action.uid));
    const updatedSensors = [ ...state.sensors ];

    if(action.identifier === 'DELETE_SENSOR') {
        updatedSensors.splice(index, 1)
    } else {
        updatedSensors[index] = action.sensor;
    }

    return {
        ...state,
        loading: false,
        error: null,
        sensors: updatedSensors,
        sensor: action.sensor,
        identifier: action.identifier
    }
}

const sensorFinish = (state) => {
    return { ...state, 
        identifier: null
    };
};

const sensorFail = (state, action) => {
    return { ...state,
        loading: false,
        error: action.error
    };
}

const reducer = (state = initialState, action) => {

    switch(action.type) {
        case type.SENSOR_START: return sensorStart(state);
        case type.SENSOR_POST_SUCCESS: return sensorPostSuccess(state, action);
        case type.SENSORS_GET_SUCCESS: return sensorsGetSuccess(state, action);
        case type.SENSOR_GET_SUCCESS: return sensorGetSuccess(state, action);
        case type.SENSOR_GET_DATA_SUCCESS: return sensorGetDataSuccess(state, action);
        case type.SENSOR_PATCH_SUCCESS: return sensorPatchSuccess(state, action);
        case type.SENSOR_FINISH: return sensorFinish(state);
        case type.SENSOR_FAIL: return sensorFail(state, action);
        default: return state;
    };
}

export default reducer;