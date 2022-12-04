import { db } from '../../shared/firebase';
import { collection, addDoc, getDoc, updateDoc, doc, getDocs, query, where, orderBy } from 'firebase/firestore';
import axios from '../../shared/axios';
import * as type from './types';
import { spark_api_key } from '../../configuration/config';

const pointStart = () => {
    return { type: type.POINT_START };
}

const pointPostSuccess = (id, point, identifier) => {
    return {
        type: type.POINT_POST_SUCCESS,
        id: id,
        point: point,
        identifier: identifier
    };
}

const pointsGetSuccess = (points, identifier) => {
    return {
        type: type.POINTS_GET_SUCCESS,
        points: points,
        identifier: identifier
    };
}

const pointGetSuccess = (point, identifier) => {
    return {
        type: type.POINT_GET_SUCCESS,
        point: point,
        identifier: identifier
    };
}

const pointPatchSuccess = (uid, point, identifier) => {
    return {
        type: type.POINT_PATCH_SUCCESS,
        uid: uid,
        point: point,
        identifier: identifier
    };
}

const pointGetSparkDataSuccess = (data, identifier) => {
    return {
        type: type.POINT_GET_SPARK_DATA_SUCCESS,
        data: data,
        identifier: identifier
    };
}

const pointFinish = () => {
    return { type: type.POINT_FINISH };
}

const pointFail = (error) => {
    return {
        type: type.POINT_FAIL,
        error: error
    };
}

// exported functions
export const postPoint = (data, identifier) => {
    return async dispatch => {
        dispatch(pointStart());

        await addDoc(collection(db, 'points'), data)
            .then(res => {
                const { id } = res
                dispatch(pointPostSuccess(id, data, identifier));
            })
            .then(() => {
                dispatch(pointFinish());
            })
            .catch(err => {
                dispatch(pointFail(err));
            });
    };
}

export const getPoints = (site, status, identifier) => {

    return  async dispatch => {

        dispatch(pointStart());

        let result = [];
        let queryFilter = null;

        if(site !== '' && status !== '') {
            queryFilter = query(collection(db, 'points'),
                where('inuse', '==', true),
                where('site', '==', site),
                where('status', '==', status),
                orderBy('name', 'desc'));
        } else if(site !== ''){
            queryFilter = query(collection(db, 'points'),
                where('inuse', '==', true),
                where('site', '==', site),
                orderBy('name', 'desc'));
        }
        else if (status !== '') {
            queryFilter = query(collection(db, 'points'),
                where('inuse', '==', true),
                where('status', '==', status),
                orderBy('name', 'desc'));
        } else {
            queryFilter = query(collection(db, 'points'),
                where('inuse', '==', true),
                orderBy('name', 'desc'));
        }
        
        await getDocs(queryFilter)
            .then(res => {
                // eslint-disable-next-line array-callback-return
                res.docs.map(doc => {
                    result.push({ [doc.id]: doc.data() });
                })
                dispatch(pointsGetSuccess(result, identifier));
            })
            .then(() => {
                dispatch(pointFinish());
            })
            .catch(err => {
                dispatch(pointFail(err));
            });
    };
}

export const getPoint = (uid, identifier) => {

    return async dispatch => {

        dispatch(pointStart());

        const ref = doc(db, 'points', uid);

        await getDoc(ref)
            .then(doc => {
                dispatch(pointGetSuccess({ [doc.id]: doc.data() }, identifier));
            })
            .then (() => {
                dispatch(pointFinish());
            })
            .catch(err => {
                dispatch(pointFail(err));
            });
    };
}

export const patchPoint = (uid, data, identifier) => {

    return async dispatch => {

        dispatch(pointStart());

        const ref = doc(db, "points", uid);

        await updateDoc(ref, data)
            .then(() => {
                dispatch(pointPatchSuccess(uid, { [uid]: data }, identifier));
            })
            .then(() => {
                dispatch(pointFinish());
            })
            .catch(err => {
                dispatch(pointFail(err));
            });
    };
}

export const getPointSparkData = (uid, startDate, endDate, identifier) => {

    return dispatch => {
        dispatch(pointStart());

        axios.get('/sensordata', {
            headers: {
                'Content-Type': 'application/json',
                idToken: spark_api_key,
                startDate: startDate,
                endDate: endDate,
                param: uid
            }
        })
        .then(res => {
            dispatch(pointGetSparkDataSuccess(res.data.data, identifier));
        })
        .then(() => {
            dispatch(pointFinish());
        })
        .catch(err => {
            dispatch(pointFail(err));
        });
    };
}