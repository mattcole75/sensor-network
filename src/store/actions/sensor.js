import { db } from '../../shared/firebase';
import { collection, addDoc, getDoc, updateDoc, doc, getDocs, query, where, orderBy } from 'firebase/firestore';
import axios from '../../shared/axios';
import * as type from './types';
import { spark_api_key } from '../../configuration/config';

const sensorStart = () => {
    return { type: type.SENSOR_START };
}

const sensorPostSuccess = (id, sensor, identifier) => {
    return {
        type: type.SENSOR_POST_SUCCESS,
        id: id,
        sensor: sensor,
        identifier: identifier
    };
}

const sensorsGetSuccess = (sensors, identifier) => {
    return {
        type: type.SENSORS_GET_SUCCESS,
        sensors: sensors,
        identifier: identifier
    };
}

const sensorGetSuccess = (sensor, identifier) => {
    return {
        type: type.SENSOR_GET_SUCCESS,
        sensor: sensor,
        identifier: identifier
    };
}

const sensorPatchSuccess = (uid, sensor, identifier) => {
    return {
        type: type.SENSOR_PATCH_SUCCESS,
        uid: uid,
        sensor: sensor,
        identifier: identifier
    };
}

const sensorGetDataSuccess = (data, identifier) => {
    return {
        type: type.SENSOR_GET_DATA_SUCCESS,
        data: data,
        identifier: identifier
    };
}

const sensorFinish = () => {
    return { type: type.SENSOR_FINISH };
}

const sensorFail = (error) => {
    return {
        type: type.SENSOR_FAIL,
        error: error
    };
}

// exported functions
export const postSensor = (data, identifier) => {

    return async dispatch => {
        try {

            dispatch(sensorStart());

            await addDoc(collection(db, 'sensors'), data)
                .then(res => {
                    const { id } = res
                    dispatch(sensorPostSuccess(id, data, identifier));
                })
                .then(() => {
                    dispatch(sensorFinish());
                });

        } catch (err) {
            dispatch(sensorFail(err));
        };
    }
}

export const getSensors = (identifier) => {

    return  async dispatch => {
        try {
            dispatch(sensorStart());

            let result = [];

            const q = query(collection(db, 'sensors'), where('inuse', '==', true), orderBy('installed', 'desc'));

            await getDocs(q)
                .then(res => {
                    // eslint-disable-next-line array-callback-return
                    res.docs.map(doc => {
                        result.push({ [doc.id]: doc.data() });
                    })
                    dispatch(sensorsGetSuccess(result, identifier));
                })
                .then(() => {
                    dispatch(sensorFinish());
                });
    
        } catch (err) {
            dispatch(sensorFail(err));
        }
    };
}

export const getSensor = (uid, identifier) => {

    return async dispatch => {
        try {
            dispatch(sensorStart());

            const ref = doc(db, "sensors", uid);

            await getDoc(ref)
                .then(doc => {
                    dispatch(sensorGetSuccess({ [doc.id]: doc.data() }, identifier));
                })
                .then (() => {
                    dispatch(sensorFinish());
                });

        } catch (err) {
            dispatch(sensorFail(err));
        }
    };
}

export const patchSensor = (uid, data, identifier) => {

    return async dispatch => {

        try {
            dispatch(sensorStart());

            const ref = doc(db, "sensors", uid);

            await updateDoc(ref, data)
                .then(() => {
                    dispatch(sensorPatchSuccess(uid, { [uid]: data }, identifier));
                })
                .then(() => {
                    dispatch(sensorFinish());
                })

        } catch (err) {
            
            dispatch(sensorFail(err));
        }

    };
}

export const getSensorData = (uid, identifier) => {

    return dispatch => {
        axios.get('/sensordata', {
            headers: {
                'Content-Type': 'application/json',
                idToken: spark_api_key,
                param: uid
            }
        })
        .then(res => {
            dispatch(sensorGetDataSuccess(res.data.data, identifier));
            dispatch(sensorFinish());
        })
        .catch(err => {
            dispatch(sensorFail(err));
        })
    };
}