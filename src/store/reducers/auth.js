import * as type from '../actions/types';

const initialState = {
    loading: false,
    error: null,
    idToken: null,
    displayName: null,
    email: null,
    identifier: null,
    authRedirectPath: '/'
}

const authStart = (state) => {
    return { ...state,
        error: null,
        loading: true
    };
}

const authSuccess = (state, action) => {
    return { ...state,
        idToken: action.idToken,
        localId: action.localId,
        displayName: action.displayName,
        email: action.email,
        identifier: action.identifier
    };
}

const authFinish = (state) => {
    return { ...state,
        loading: false,
        identifier: null
    };
}

const authFail = (state, action) => {
    return { ...state,
        loading: false,
        error: action.error
    };
}

const authStateReset = () => {
    return initialState;
}

const reducer = (state = initialState, action) => {

    switch(action.type) {
        case type.AUTH_START: return authStart(state);
        case type.AUTH_SUCCESS: return authSuccess(state, action);
        case type.AUTH_FINISH: return authFinish(state);
        case type.AUTH_FAIL: return authFail(state, action);
        case type.AUTH_STATE_RESET: return authStateReset();
        default: return state;
    }
};

export default reducer;