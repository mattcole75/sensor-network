
import { auth } from '../../shared/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import * as type from './types';

const authStart = () => {
    return { type: type.AUTH_START };
}

const authSuccess = (idToken, localId, displayName, email, identifier) => {
    return {
        type: type.AUTH_SUCCESS,
        idToken: idToken,
        localId: localId,
        displayName: displayName,
        email: email,
        identifier: identifier
    };
}

const authFinish = () => {
    return { type: type.AUTH_FINISH };
}

const authFail = (error) => {
    return {
        type: type.AUTH_FAIL,
        error: error
    };
}

const authStateReset = () => {
    return {
        type: type.AUTH_STATE_RESET
    };
}

const setLocalStorage = (idToken, localId, displayName, email, expiresIn) => {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    localStorage.setItem('idToken', idToken);
    localStorage.setItem('localId', localId);
    localStorage.setItem('displayName', displayName);
    localStorage.setItem('email', email);
    localStorage.setItem('expirationDate', expirationDate);
}

const deleteLocalStorage = () => {
    localStorage.removeItem('idToken');
    localStorage.removeItem('localId');
    localStorage.removeItem('displayName');
    localStorage.removeItem('email');
    localStorage.removeItem('expirationDate');
}

// exported functions

export const login = (authData, identifier) => {

    const { email, password } = authData;


    return dispatch => {
        dispatch(authStart());

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const { idToken, localId, displayName, email, expiresIn } = userCredential._tokenResponse;     
                setLocalStorage(idToken, localId, displayName, email, expiresIn);
                dispatch(authSuccess(idToken, localId, displayName, email, identifier));
                dispatch(checkAuthTimeout(expiresIn));
            })
            .then(() => {
                dispatch(authFinish())
            })
            .catch((err) => {

                dispatch(authFail(err.message));
                // const errorCode = error.code;
                // const errorMessage = error.message;
            });
    };
}

export const logout = () => {
    return dispatch => {
        dispatch(authStart());
        deleteLocalStorage();
        dispatch(authStateReset());
        dispatch(authFinish());
    };
}

export const checkAuthTimeout = (expirationTime) => {
    return dispatch => {
        setTimeout(() => {
            dispatch(logout());
        }, expirationTime * 1000);
    };
}

export const authCheckState = () => {
    return dispatch => {
        const idToken = localStorage.getItem('idToken');
        const localId = localStorage.getItem('localId');
        const displayName = localStorage.getItem('displayName');
        const email = localStorage.getItem('email');
        
        if (!idToken) {
            dispatch(logout());
        } else {
            const expirationDate = new Date(localStorage.getItem('expirationDate'));
            if (expirationDate <= new Date()){
                dispatch(logout());
                dispatch(authStateReset());
            } else {
                dispatch(authSuccess(idToken, localId, displayName, email, 'AUTH_CHECK_STATE'));
                dispatch(checkAuthTimeout((expirationDate.getTime() - new Date().getTime()) / 1000 ));
            } 
        }
    };
}