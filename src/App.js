import React, { useEffect, useCallback, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Layout from './layout/layout';
import * as action from './store/actions/index'

const App = () => {

    const dispatch = useDispatch();
    const isAuthenticated = useSelector(state => state.auth.idToken !== null);
    const onTryAutoLogin = useCallback(() => dispatch(action.authCheckState()),[dispatch]);

    // check if there is persistent auth data stored on refresh, load into redux if it exists
	useEffect(() => { 
        onTryAutoLogin();
	},[onTryAutoLogin]);

    const Index = React.lazy(() => {
        return import('./pages/index');
    });
    const Login = React.lazy(() => {
        return import('./pages/auth/login');
    });
    const Logout = React.lazy(() => {
        return import('./pages/auth/logout');
    });
    const Sensors = React.lazy(() => {
        return import('./pages/sensors');
    });
    const SensorForm = React.lazy(() => {
        return import('./pages/sensorEdit');
    });
    const SensorView = React.lazy(() => {
        return import('./pages/sensorView');
    });
    const Points = React.lazy(() => {
        return import('./pages/points/points');
    });
    const PointForm = React.lazy(() => {
        return import('./pages/points/pointEdit');
    });
    const PointView = React.lazy(() => {
        return import('./pages/points/pointView');
    });

    const routes = (
		<Routes>
			<Route path='/' element={ <Index /> } />
			<Route path='/login' element={ <Login /> } />
            { isAuthenticated && <Route path='/logout' element={ <Logout /> } /> }
            { isAuthenticated && <Route path='/sensors' element={ <Sensors /> } /> }
            { isAuthenticated && <Route path='/sensoredit/:uid' element={ <SensorForm /> } /> }
            { isAuthenticated && <Route path='/sensorview/:uid' element={ <SensorView /> } /> }
            { isAuthenticated && <Route path='/points' element={ <Points /> } /> }
            { isAuthenticated && <Route path='/pointedit/:uid' element={ <PointForm /> } /> }
            { isAuthenticated && <Route path='/pointview/:uid' element={ <PointView /> } /> }
			<Route path='*' element={ <Index /> } />
		</Routes>
	);

    return (
        <div>
            <Layout>
                <Suspense fallback={<p>Loading...</p>}>{routes}</Suspense>
            </Layout>
        </div>
	);
}

export default App;
