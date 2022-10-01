import React, { useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import * as action from '../../../store/actions/index';

const Filter = () => {

    const dispatch = useDispatch();
    // const navigate = useNavigate();

    const onGetSensors = useCallback((identifier) => dispatch(action.getSensors(identifier)), [dispatch]);

    useEffect(() => {
        onGetSensors('GET_SENSORS');
    }, [onGetSensors]);

    // const navigateToAdd = () => {
    //     navigate('/sensoredit');
    // }

    return (
        <div className='border-top border-start border-end rounded-top-1 mt-4 bg-light shadow-sm'>
            <div className='container-fluid d-grid gap-3 align-items-center'>
                <div className='d-flex align-items-center p-2'>
                    <form className='flex-grow-1 me-3' role='search'>
                        <input type='search' className='form-control rounded-5' placeholder='Search by site...' aria-label='Search' />
                    </form>
                    <div>
                        <Link className='btn btn-primary rounded-5 me-3' to={`/sensoredit/new`}>Add</Link>
                    </div>
                    <div>
                        <button type='button' className='btn btn-light rounded-5 p-0'onClick={() => onGetSensors('GET_SENSORS')}><span className='bi-arrow-clockwise fs-3' /></button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Filter;