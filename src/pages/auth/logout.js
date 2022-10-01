import React, { useEffect, useCallback } from 'react';
import {useDispatch} from 'react-redux';
import { Navigate } from 'react-router-dom';
import * as action from '../../store/actions/index';

const Logout = () => {

    const dispatch = useDispatch();
    const onLogout = useCallback(() => dispatch(action.logout()), [dispatch]);

    useEffect(() => {
		onLogout();
	});

    return (
        <Navigate to="/" />
    )
};

export default Logout;