import React, { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import * as action from '../../../store/actions/index';
import { useForm } from 'react-hook-form';
import Spinner from '../../ui/spinner/spinner';
import Backdrop from '../../ui/backdrop/backdrop';

// import Details from './details/details';
// import Map from './map/map';
// import sensors from '../../../configuration/sensors';
import Chart from './chart/chart';
import moment from 'moment';
// import { format } from 'd3-format';

const View = () => {

    // const sensor = sensors[0];

    const { uid } = useParams();
    
    const startDate = useMemo(() => moment().startOf('day').add(-14, 'days'), []);
    const endDate = useMemo(() => moment().endOf('day'), []);

    const { register, getValues } = useForm({
        mode: 'onChange',
        defaultValues: {
            startDate: startDate.format('YYYY-MM-DD'),
            startTime: startDate.format('HH:mm'),
            endDate: endDate.format('YYYY-MM-DD'),
            endTime: endDate.format('HH:mm')
        }
    });
    
    const loading = useSelector(state => state.point.loading);
    const error = useSelector(state => state.point.error);
    const point = useSelector(state => state.point.point);
    const data = useSelector(state => state.point.data);
    
    const dispatch = useDispatch();

    const onGetPoint = useCallback((uid, identifier) => dispatch(action.getPoint(uid, identifier)), [dispatch]);
    const onGetPointSparkData = useCallback((uid, startDate, endDate, identifier) => dispatch(action.getPointSparkData(uid, startDate, endDate, identifier)), [dispatch]);
    
    // const [lastSensorMessage, setLastSensorMessage] = useState({ timestamp: moment().format(), value: 0 });
    // const [lastSensorMessage, setLastSensorMessage] = useState({ timestamp: moment().format(), value: 0 });

    useEffect(() => {
        onGetPoint(uid, 'GET_SENSOR');
        onGetPointSparkData(
            uid,
            startDate,
            endDate,
            'GET_SENSOR_DATA'
        );
    }, [uid, onGetPoint, onGetPointSparkData, startDate, endDate]);

    // useEffect(() => {
    //     if(data && data.length > 0) {
    //         setLastSensorMessage(data.at(-1));
    //     }
    // }, [data]);
    
    let pointDetails = null;
    if(point)
        pointDetails = point[Object.keys(point)];

    const onFilterSet = useCallback(() => {

        // setSeries(null);

        const dates = getValues();

        onGetPointSparkData(
            uid,
            moment(dates.startDate + ' ' + dates.startTime).format('YYYY-MM-DD HH:mm'),
            moment(dates.endDate + ' ' + dates.endTime).format('YYYY-MM-DD HH:mm'),
            'GET_SENSOR_DATA'
        );  
    }, [getValues, onGetPointSparkData, uid]);

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

                {/* Filter Dates */}
            <div className='mb-3'>
                <div className='text-start'>
                    <h4 className='h5 fw-normal'>Filter</h4>
                </div>
                <div className='row g-2'>
                    <div className='form-floating col-sm-3'>
                        <input type='date' className='form-control' id='startDate' autoComplete='off'
                            { ...register('startDate', { onChange: onFilterSet }) } />
                        <label htmlFor='startDate' className='form-label'>Start Date</label>
                    </div>

                    <div className='form-floating col-sm-3'>
                        <input type='time' className='form-control' id='startTime' autoComplete='off'
                            { ...register('startTime', { onChange: onFilterSet }) } />
                        <label htmlFor='startTime' className='form-label'>Start Time</label>
                    </div>

                    <div className='form-floating col-sm-3'>
                        <input type='date' className='form-control' id='endDate' autoComplete='off'
                            { ...register('endDate', { onChange: onFilterSet }) } />
                        <label htmlFor='endDate' className='form-label'>End Date</label>
                    </div>

                    <div className='form-floating col-sm-3'>
                        <input type='time' className='form-control' id='endTime' autoComplete='off'
                            { ...register('endTime', { onChange: onFilterSet }) } />
                        <label htmlFor='endTime' className='form-label'>End Time</label>
                    </div>
                </div>
            </div>

                <div className='form-floating'>
                    {(pointDetails && data && data.length > 0)
                        ?   <Chart
                                uid={uid}
                                data={data}
                                name={pointDetails.name}
                                onGetPointSparkData={onGetPointSparkData}
                                startDate={startDate}
                                endDate={endDate}
                                sracLimit={parseInt(pointDetails.sracLimit)}
                                swingLowerLimit={parseInt(pointDetails.swingLowerLimit)}
                                swingUpperLimit={parseInt(pointDetails.swingUpperLimit)}
                            />
                        :   null
                    }
                </div>

                {/* <div className='form-floating col-sm-6'>
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
                </div> */}
            </div>
        </div>
    );
}

export default View;