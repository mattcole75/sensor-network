import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Navigate, NavLink, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import * as action from '../../../store/actions/index';

import Spinner from '../../ui/spinner/spinner';
import Backdrop from '../../ui/backdrop/backdrop';

import sites from '../../../configuration/sites';
import organisations from '../../../configuration/organisations';
import departments from '../../../configuration/departments';
import status from '../../../configuration/status';

const PointForm = () => {

    const { uid } = useParams();

    const loading = useSelector(state => state.point.loading);
    const error = useSelector(state => state.point.error);
    const identifier = useSelector(state => state.point.identifier);
    const redirectPath = useSelector(state => state.point.pointRedirectPath);
    const point = useSelector(state => state.point.point);

    const dispatch = useDispatch();

    const [redirect, setRedirect] = useState(null);

    const onPostPoint = useCallback((data, identifier) => dispatch(action.postPoint(data, identifier)), [dispatch]);
    const onGetPoint = useCallback((uid, identifier) => dispatch(action.getPoint(uid, identifier)), [dispatch]);
    const onPatchPoint = useCallback((uid, data, identifier) => dispatch(action.patchPoint(uid, data, identifier)), [dispatch]);

    const { register, handleSubmit, reset } = useForm({
        mode: 'onChange'
    });

    const onSubmit = useCallback((data) => {

        if(point){
            onPatchPoint(uid, {
                ...data,
                updated: moment().format()
            }, 'PATCH_POINT');
        } else {
            onPostPoint({
                ...data,
                inuse: true,
                created: moment().format(),
                updated: moment().format(),
            }, 'POST_POINT');   
        }
        
    }, [point, onPatchPoint, uid, onPostPoint]);

    useEffect(() => {
        if(point) {
            reset(point[Object.keys(point)]);
        }
    }, [reset, point]);

    useEffect (() => {
        if(uid !== 'new') {
            // get point from db
            onGetPoint(uid, 'GET_POINT');
        }
    }, [uid, onGetPoint]);

    useEffect(() => {
        if(loading === false && identifier === 'POST_POINT') {
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
                    <i className='bi-alt form-title_icon'></i>
                    <h1 className='h3 mb-3 fw-normal'>Points Details</h1>
                </div>

                {/* UID */}
                <div className='mb-3'>
                    <div className='text-start'>
                        <h4 className='h4 fw-normal'>Identifier</h4>
                    </div>
                    
                    <div className='row g-2'>
                        {point
                            ?   <div className='form-floating  col-sm-6'>
                                    <input type='text' className='form-control' id='uid' value={Object.keys(point)} placeholder='uid' disabled />
                                    <label htmlFor='uid' className='form-label'>UID</label>
                                </div>
                            : null
                        }
                        <div className='form-floating  col-sm-6'>
                            <input type='text' className='form-control' id='name' autoComplete='off' placeholder='id' required
                                {...register('name', { required: true })} />
                            <label htmlFor='name' className='form-label'>Name</label>
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
                            <textarea className='form-control' id='purpose' autoComplete='off' rows='2' style={{height:'auto'}}
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

                        <div className='form-floating col-sm-6'>
                            <select className='form-select form-select_truncate mb-2' id='site' required
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

                        <div className='form-floating col-sm-6'>
                            <select className='form-select form-select_truncate mb-2' id='direction' required
                                {...register('direction', { required: true })}>
                                <option value=''>Choose...</option>
                                <option value='Inbound'>Inbound</option>
                                <option value='Outbound'>Outbound</option>
                                <option value='Both'>Both</option>
                               
                            </select>
                            <label htmlFor='direction'>Direction</label>
                        </div>


                    </div>

                    <div className='row g-2'>
                        <div className='form-floating  col-sm-6 mb-1'>
                            <input type='text' className='form-control' id='latitude' autoComplete='off' placeholder='Date' required
                                pattern='^(\+|-)?(?:90(?:(?:\.0{1,6})?)|(?:[0-9]|[1-8][0-9])(?:(?:\.[0-9]{1,6})?))$'
                                {...register('latitude', { required: true })} />
                            <label htmlFor='latitude' className='form-label'>Latitude</label>
                        </div>
                        <div className='form-floating col-sm-6 mb-1'>
                            <input type='text' className='form-control' id='longitude' autoComplete='off' placeholder='Date' required
                                pattern='^(\+|-)?(?:180(?:(?:\.0{1,6})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\.[0-9]{1,6})?))$'
                                {...register('longitude', { required: true })} />
                            <label htmlFor='longitude' className='form-label'>Longitude</label>
                        </div>
                        <div className='form-floating mb-1 mt-1'>
                            <textarea className='form-control' id='description' autoComplete='off' rows='2' style={{height:'auto'}}
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
                        <div className='form-floating  col-sm-4'>
                            <input type='number' className='form-control' id='swingUpper' autoComplete='off' placeholder='Swing Upper Limit' required
                                {...register('swingUpperLimit', { required: true })} />
                            <label htmlFor='swingUpperLimit' className='form-label'>Swing Upper Limit</label>
                        </div>

                        <div className='form-floating col-sm-4 mb-1'>
                            <input type='number' className='form-control' id='swingLowerLimit' autoComplete='off' placeholder='Swing Lower Threshold' required
                                {...register('swingLowerLimit', { required: true })} />
                            <label htmlFor='swingLowerLimit' className='form-label'>Swing Lower Limit</label>
                        </div>

                        <div className='form-floating col-sm-4 mb-1'>
                            <input type='number' className='form-control' id='sracLimit' autoComplete='off' placeholder='Swing Lower Threshold' required
                                {...register('sracLimit', { required: true })} />
                            <label htmlFor='sracLimit' className='form-label'>SRAC Limit</label>
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

export default PointForm;