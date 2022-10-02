import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Navigate, NavLink, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import * as action from '../../../store/actions/index';

import Spinner from '../../ui/spinner/spinner';
import Backdrop from '../../ui/backdrop/backdrop';

import sites from '../../../configuration/sites';
import systems from '../../../configuration/systems';
import types from '../../../configuration/types';
import organisations from '../../../configuration/organisations';
import departments from '../../../configuration/departments';
import status from '../../../configuration/status';

const SensorForm = () => {

    const { uid } = useParams();

    const loading = useSelector(state => state.sensor.loading);
    const error = useSelector(state => state.sensor.error);
    const identifier = useSelector(state => state.sensor.identifier);
    const redirectPath = useSelector(state => state.sensor.sensorRedirectPath);
    const sensor = useSelector(state => state.sensor.sensor);

    const dispatch = useDispatch();

    const [redirect, setRedirect] = useState(null);

    const onPostSensor = useCallback((data, identifier) => dispatch(action.postSensor(data, identifier)), [dispatch]);
    const onGetSensor = useCallback((uid, identifier) => dispatch(action.getSensor(uid, identifier)), [dispatch]);
    const onPatchSensor = useCallback((uid, data, identifier) => dispatch(action.patchSensor(uid, data, identifier)), [dispatch]);

    const { register, handleSubmit, reset } = useForm({
        mode: 'onChange'
    });

    const onSubmit = useCallback((data) => {

        if(sensor){
            onPatchSensor(uid, {
                ...data,
                updated: moment().format()
            }, 'PATCH_SENSOR');
            setRedirect(<Navigate to={redirectPath} />);
        } else {
            onPostSensor({
                ...data,
                inuse: true,
                created: moment().format(),
                updated: moment().format(),
            }, 'POST_SENSOR');   
            setRedirect(<Navigate to={redirectPath} />);
        }
        
    }, [sensor, onPatchSensor, uid, redirectPath, onPostSensor]);

    useEffect(() => {
        if(sensor) {
            reset(sensor[Object.keys(sensor)]);
        }
    }, [sensor, reset]);

    useEffect (() => {
        if(uid !== 'new') {
            // get sensor from db
            onGetSensor(uid, 'GET_SENSOR');
        }
    }, [uid, onGetSensor]);

    useEffect(() => {
        if(loading === false && identifier === 'POST_SENSOR') {
            setRedirect(<Navigate to={redirectPath} />);
        }
    }, [identifier, loading, redirectPath, uid]);

    let spinner = null;
    if(loading)
        spinner = <Spinner />;

    return (

        <div className='form my-5 shadow'>
            {redirect}
            <Backdrop show={loading} />
                {spinner}
            
            {error &&
                <div className='alert alert-danger text-wrap text-break' role='alert'>
                    {error.message}
                </div>
            }

            <form className='needs-validation' onSubmit={handleSubmit(onSubmit)}>

                {/* Form heading */}
                <div className='text-center border-bottom mb-3'>
                    <i className='bi-robot form-title_icon'></i>
                    <h1 className='h3 mb-3 fw-normal'>Sensor Details</h1>
                </div>

                {/* ID */}
                { sensor
                    ?   <div className='mb-3'>
                            <div className='text-start'>
                                <h4 className='h4 fw-normal'>Identifier</h4>
                            </div>
                            <div className='form-floating'>
                                <input type='text' className='form-control' id='uid' value={Object.keys(sensor)} placeholder='Date' disabled />
                                <label htmlFor='uid' className='form-label'>UID</label>
                            </div>

                        </div>
                    : null
                }

                {/* Taxonomy */}
                <div className='mb-3'>
                    <div className='text-start'>
                        <h4 className='h4 fw-normal'>Taxonomy</h4>
                    </div>
                    <div className='row g-2'>
                        <div className='form-floating  col-sm-4'>
                            <select className='form-select form-select_truncate' id='site' required
                                {...register('site', { required: true })}>
                                <option value=''>Choose...</option>
                                {
                                    sites.map((item, index) => (
                                        <option key={index} value={item.site}>{item.site}</option>
                                    ))
                                }
                            </select>
                            <label htmlFor='site'>Site</label>
                        </div>

                        <div className='form-floating  col-sm-4'>
                            <select className='form-select form-select_truncate' id='system' required
                                {...register('system', { required: true })}>
                                <option value=''>Choose...</option>
                                {
                                    systems.map((item, index) => (
                                        <option key={index} value={item.system}>{item.system}</option>
                                    ))
                                }
                            </select>
                            <label htmlFor='system'>System</label>
                        </div>

                        <div className='form-floating col-sm-4 mb-1'>
                            <select className='form-select form-select_truncate' id='type' required
                                {...register('type', { required: true })}>
                                <option value=''>Choose...</option>
                                {
                                    types.map((item, index) => (
                                        <option key={index} value={item.type}>{item.type}</option>
                                    ))
                                }
                            </select>
                            <label htmlFor='type'>Type</label>
                        </div>
                    </div>
                </div>

                {/* Purpose */}
                <div className='mb-3'>
                    <div className='text-start'>
                        <h4 className='h4 fw-normal'>Purpose</h4>
                    </div>
                    <div className='row g-2'>
                        <div className='form-floating  col-sm-6'>
                                <select className='form-select form-select_truncate' id='organisation' required
                                    {...register('organisation', { required: true })}>
                                    <option value=''>Choose...</option>
                                    {
                                        organisations.map((item, index) => (
                                            <option key={index} value={item.organisation}>{item.organisation}</option>
                                        ))
                                    }
                                </select>
                                <label htmlFor='organisation'>Organisation</label>
                            </div>

                            <div className='form-floating  col-sm-6'>
                                <select className='form-select form-select_truncate' id='department' required
                                    {...register('department', { required: true })}>
                                    <option value=''>Choose...</option>
                                    {
                                        departments.map((item, index) => (
                                            <option key={index} value={item.department}>{item.department}</option>
                                        ))
                                    }
                                </select>
                                <label htmlFor='department'>Department</label>
                            </div>
                            <div className='form-floating'>
                                <textarea className='form-control' id='purpose'  rows='2' style={{height:'auto'}}
                                    placeholder='Location Description' required
                                    {...register('purpose', { minLength: 10})}
                                />
                                <label htmlFor='purpose' className='form-label'>Purpose</label>
                            </div>
                    </div>
                </div>
                
                {/* Location */}
                <div className='mb-3'>
                    <div className='text-start'>
                        <h4 className='h4 fw-normal'>Location</h4>
                    </div>
                    <div className='row g-2'>
                        <div className='form-floating  col-sm-6'>
                            <input type='text' className='form-control' id='latitude' placeholder='Date' required
                                pattern='^(\+|-)?(?:90(?:(?:\.0{1,6})?)|(?:[0-9]|[1-8][0-9])(?:(?:\.[0-9]{1,6})?))$'
                                {...register('latitude', { required: true })} />
                            <label htmlFor='latitude' className='form-label'>Latitude</label>
                        </div>
                        <div className='form-floating col-sm-6 mb-1'>
                            <input type='text' className='form-control' id='longitude' placeholder='Date' required
                                pattern='^(\+|-)?(?:180(?:(?:\.0{1,6})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\.[0-9]{1,6})?))$'
                                {...register('longitude', { required: true })} />
                            <label htmlFor='longitude' className='form-label'>Longitude</label>
                        </div>
                        <div className='form-floating mt-1'>
                            <textarea className='form-control' id='description'  rows='2' style={{height:'auto'}}
                                placeholder='Location Description' required
                                {...register('description', { minLength: 10})}
                            />
                            <label htmlFor='description' className='form-label'>Location Description</label>
                        </div>
                    </div>
                </div>

                {/* Thresholds */}
                <div className='mb-3'>
                    <div className='text-start'>
                        <h4 className='h4 fw-normal'>Thresholds</h4>
                    </div>
                    <div className='row g-2'>
                        <div className='form-floating  col-sm-6'>
                            <input type='number' className='form-control' id='upper' placeholder='Upper Threshold' required
                                {...register('upper', { required: true })} />
                            <label htmlFor='upper' className='form-label'>Upper</label>
                        </div>
                        <div className='form-floating col-sm-6 mb-1'>
                            <input type='number' className='form-control' id='lower' placeholder='Lower Threshold' required
                                {...register('lower', { required: true })} />
                            <label htmlFor='lower' className='form-label'>Lower</label>
                        </div>
                    </div>
                </div>

                {/* Calibration */}
                <div className='mb-3'>
                    <div className='text-start'>
                        <h4 className='h4 fw-normal'>Calibration</h4>
                    </div>
                    <div className='row g-2'>
                        <div className='form-floating  col-sm-6'>
                            <input type='date' className='form-control' id='calibrated' placeholder='Date' required
                                {...register('calibrated', { required: true })} />
                            <label htmlFor='calibrated' className='form-label'>Calibration Date</label>
                        </div>

                        <div className='form-floating  col-sm-6'>
                            <input type='number' className='form-control' id='validForWeeks' placeholder='No. Weeks Calibration Valid' required
                                {...register('validForWeeks', { required: true })} />
                            <label htmlFor='validForWeeks' className='form-label'>Valid for (weeks)</label>
                        </div>

                        <div className='form-floating'>
                            <input type='url' className='form-control' id='url' placeholder='Location of Certificate' required
                                {...register('url', { required: true })} />
                            <label htmlFor='url' className='form-label'>Location of Certificate (URL)</label>
                        </div>
                    </div>
                </div>

                {/* Build Dates */}
                <div className='mb-3'>
                    <div className='text-start'>
                        <h4 className='h4 fw-normal'>Build Dated</h4>
                    </div>
                    <div className='row g-2'>
                        <div className='form-floating  col-sm-4'>
                            <input type='date' className='form-control' id='installed' placeholder='Date Installed' required
                                {...register('installed', { required: true })} />
                            <label htmlFor='installed' className='form-label'>Installed Date</label>
                        </div>

                        <div className='form-floating  col-sm-4'>
                            <input type='date' className='form-control' id='commissioned' placeholder='Date Commissioned' required
                                {...register('commissioned', { required: true })} />
                            <label htmlFor='commissioned' className='form-label'>Commissioned Date</label>
                        </div>

                        <div className='form-floating  col-sm-4'>
                            <input type='date' className='form-control' id='Decommissioned' placeholder='Date Decommissioned'
                                {...register('Decommissioned', { required: false })} />
                            <label htmlFor='Decommissioned' className='form-label'>Decommissioned Date</label>
                        </div>
                    </div>
                </div>

                {/* Status */}
                <div className='mb-3'>
                    <div className='text-start'>
                        <h4 className='h4 fw-normal'>Status</h4>
                    </div>
                    <div className='row g-2'>
                        <div className='form-floating  col-sm-6'>
                            <select className='form-select form-select_truncate' id='status' required
                                {...register('status', { required: true })}>
                                <option value=''>Choose...</option>
                                {
                                    status.map((item, index) => (
                                        <option key={index} value={item.status}>{item.status}</option>
                                    ))
                                }
                            </select>
                            <label htmlFor='status'>Status</label>
                        </div>
                    </div>
                </div>

                {/* Form Control */}
                <div className='border-top pt-3'>
                    <button className='w-100 btn btn-lg btn-primary mb-3' type='submit'>
                        Save
                    </button>

                    <NavLink to={redirectPath} className='w-100 btn btn-lg btn-danger mb-3'>
                        Cancel
                    </NavLink>
                </div>
            </form>
        </div>
    );
}

export default SensorForm;