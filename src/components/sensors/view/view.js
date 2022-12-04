import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import * as action from '../../../store/actions/index';

import Spinner from '../../ui/spinner/spinner';
import Backdrop from '../../ui/backdrop/backdrop';

import Details from './details/details';
import Map from './map/map';
// import sensors from '../../../configuration/sensors';
import Chart from './chart/chart';
import moment from 'moment';

const View = () => {

    // const sensor = sensors[0];

    const { uid } = useParams();

    const loading = useSelector(state => state.sensor.loading);
    const error = useSelector(state => state.sensor.error);
    const sensor = useSelector(state => state.sensor.sensor);
    const data = useSelector(state => state.sensor.data);

    const dispatch = useDispatch();

    const onGetSensor = useCallback((uid, identifier) => dispatch(action.getSensor(uid, identifier)), [dispatch]);
    const onGetSensorData = useCallback((uid, identifier) => dispatch(action.getSensorData(uid, identifier)), [dispatch]);

    const [lastSensorMessage, setLastSensorMessage] = useState({ timestamp: moment().format(), value: 0 });

    useEffect(() => {
        onGetSensor(uid, 'GET_SENSOR');
        onGetSensorData(uid, 'GET_SENSOR_DATA');
    }, [onGetSensor, uid, onGetSensorData]);

    useEffect(() => {
        if(data && data.length > 0) {
            setLastSensorMessage(data.at(-1));
        }
    }, [data]);

    let spinner = null;
    if(loading)
        spinner = <Spinner />;
    

    return (
        <div className=' container my-5 shadow-sm'>
            <Backdrop show={loading} />
                {spinner}
            
            {error &&
                <div className='alert alert-danger' role='alert'>
                    {error.message}
                </div>
            }

            <div className='row g-2'>

                <div className='form-floating'>
                    {(data && data.length > 0)
                        ? <Chart data={data} />
                        : null
                    }
                </div>

                <div className='form-floating col-sm-6'>
                    {sensor
                        ? <Details sensor={sensor} lastSensorMessage={lastSensorMessage} />
                        : <div>Loading...</div>
                    }
                </div>
                
                <div className='form-floating p-2  col-sm-6'>
                    {sensor
                        ? <Map location={{
                            lat: sensor[Object.keys(sensor)].latitude, 
                            lng: sensor[Object.keys(sensor)].longitude
                        }} zoomLevel={14} />
                        : <div>Loading...</div>
                    }
                </div>
            </div>
        </div>
    );
}

export default View;