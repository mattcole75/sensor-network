import * as type from '../actions/types';

const initialState = {
    loading: false,
    error: null,
    points: [],
    point: null,
    data: null,
    identifier: null,
    pointRedirectPath: '/points'
}

const pointStart = (state) => {
    return { ...state, 
        error: null,
        loading: true
    };
};

const pointPostSuccess = (state, action) => {
    const newPoint = { [action.id]: action.point };
    return {
        ...state,
        loading: false,
        error: null,
        points: state.points.concat(newPoint),
        point: newPoint,
        identifier: action.identifier
    };
}

const pointsGetSuccess = (state, action) => {
    return {
        ...state,
        loading: false,
        error: null,
        points: action.points,
        point: null,
        identifier: action.identifier
    }
}

const pointGetSuccess = (state, action) => {
    return {
        ...state,
        loading: false,
        error: null,
        point: action.point,
        identifier: action.identifier
    };
}

const pointGetSparkDataSuccess = (state, action) => {
    return {
        ...state,
        loading: false,
        error: null,
        data: action.data,
        identifier: action.identifier
    };
}

const pointPatchSuccess = (state, action) => {

    const index = state.points.findIndex(pnt => pnt.hasOwnProperty(action.uid));
    const updatedPoints = [ ...state.points ];

    if(action.identifier === 'DELETE_POINT'){
        updatedPoints.splice(index, 1)
    } else {
        updatedPoints[index] = action.point;
    }

    return {
        ...state,
        loading: false,
        error: null,
        points: updatedPoints,
        point: action.point,
        identifier: action.identifier
    }
}

const pointFinish = (state) => {
    return { ...state,
        identifier: null
    };
};

const pointFail = (state, action) => {
    return { ...state,
        loading: false,
        error: action.error
    };
}

const reducer = (state = initialState, action) => {

    switch(action.type) {
        case type.POINT_START: return pointStart(state);
        case type.POINT_POST_SUCCESS: return pointPostSuccess(state, action);
        case type.POINTS_GET_SUCCESS: return pointsGetSuccess(state, action);
        case type.POINT_GET_SUCCESS: return pointGetSuccess(state, action);
        case type.POINT_GET_SPARK_DATA_SUCCESS: return pointGetSparkDataSuccess(state, action);
        case type.POINT_PATCH_SUCCESS: return pointPatchSuccess(state, action);
        case type.POINT_FINISH: return pointFinish(state);
        case type.POINT_FAIL: return pointFail(state, action);
        default: return state;
    };
}

export default reducer;