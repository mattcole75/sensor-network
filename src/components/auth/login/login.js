import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Navigate, NavLink } from 'react-router-dom';
import * as action from '../../../store/actions/index';

import Backdrop from '../../ui/backdrop/backdrop';
import Spinner from '../../ui/spinner/spinner';

const Login = () => {

    const dispatch = useDispatch();

    const loading = useSelector(state => state.auth.loading);
    const error = useSelector(state => state.auth.error);
    const isAuthenticated = useSelector(state => state.auth.idToken !== null);
    const authRedirectPath = useSelector(state => state.auth.authRedirectPath);

    const onLogin = useCallback((authData, identifier) => dispatch(action.login(authData, identifier)), [dispatch]);

    const { register, handleSubmit, formState } = useForm({ mode: 'onChange' });

    const loginHandler = useCallback((data) => {
        onLogin({...data, returnSecureToken: true}, 'LOGIN');
    }, [onLogin]);

    let spinner = null;
    if(loading){
        spinner = <Spinner />;
    }

    return (
        <div className='form-auth my-5'>
            {isAuthenticated && <Navigate to={authRedirectPath} />}
            <Backdrop show={loading} />
                {spinner}
            {error &&
                <div className='alert alert-danger' role='alert'>
                    {error.message}
                </div>
            }
            <form className='was-validated' onSubmit={handleSubmit(loginHandler)}>
                
                <i className='bi-person-check form-auth-icon'></i>
                <h1 className='h3 mb-3 fw-normal'>Login</h1>
                <div className='form-floating mb-3'>
                    <input
                        type='email'
                        className='form-control'
                        id='email' placeholder='name@example.com'
                        required
                        autoComplete='off'
                        {...register('email', { required: true, pattern: /^\S+@\S+$/i })} />
                    <label htmlFor='email' className='form-label'>Email Address</label>
                </div>
                <div className='form-floating mb-3'>
                    <input
                        type='password'
                        className='form-control'
                        id='password' placeholder='Password'
                        required
                        autoComplete='off'
                        minLength={6}
                        maxLength={255}
                        {...register('password', { required: true, minLength: 6, maxLength: 255 })} />
                    <label htmlFor='password' className='form-label'>Password</label>
                </div>
                <button className='w-100 btn btn-lg btn-primary' type='submit' disabled={!formState.isValid}>Login</button>
                
                <hr />
                <div className='text-center'>
                    <NavLink 
                        to='/recoverPassword'
                        className='nav-link'>
                        Recover Password
                    </NavLink>
                </div>

            </form>
        </div>
    );
};

export default Login;