import React, { useCallback, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import * as action from '../../../store/actions/index';

import sites from '../../../configuration/sites';
import status from '../../../configuration/status';

const Filter = () => {

    const dispatch = useDispatch();
    // const navigate = useNavigate();

    const onGetPoints = useCallback((site, status, identifier) => dispatch(action.getPoints(site, status, identifier)), [dispatch]);

    const [siteFilter, setSiteFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    useEffect(() => {
        onGetPoints(siteFilter, statusFilter, 'GET_POINTS');
    }, [onGetPoints, siteFilter, statusFilter]);

    return (
        <div className='border-top border-start border-end rounded-top-1 mt-4 bg-light shadow-sm'>
            <div className='container-fluid d-grid gap-3 align-items-center'>
                <div className='d-flex align-items-center p-2'>
                    <form className='flex-grow-1 me-3 form-control-sm' role='search'>
                        <div className='row g-2'>
                            <div className='form-floating  col-sm-6'>
                                <select className='form-select form-select_truncate' id='site' required
                                    onChange={event => setSiteFilter(event.target.value)} value={siteFilter}>
                                    <option value=''>Choose...</option>
                                    {
                                        sites.map((item, index) => (
                                            <option key={index} value={item.site}>{item.site}</option>
                                        ))
                                    }
                                </select>
                                <label htmlFor='site'>Site</label>
                            </div>

                            <div className='form-floating  col-sm-6'>
                                <select className='form-select form-select_truncate' id='status' required
                                    onChange={event => setStatusFilter(event.target.value)} value={statusFilter}>
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
                    </form>
                    <div>
                        <Link className='btn btn-primary rounded-5 me-3' to={`/pointedit/new`}>Add</Link>
                    </div>
                    <div>
                        <button type='button' className='btn btn-light rounded-5 p-0'onClick={() => onGetPoints(siteFilter, statusFilter, 'GET_POINTS')}><span className='bi-arrow-clockwise fs-3' /></button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Filter;