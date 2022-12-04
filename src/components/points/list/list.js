import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import * as action from '../../../store/actions/index';

import Filter from '../filter/filter';
import ListItem from './listItem/listItem';

import Backdrop from '../../ui/backdrop/backdrop';
import Spinner from '../../ui/spinner/spinner';
import Modal from '../../ui/modal/modal';
import DeletePoint from '../modal/deletePoint';

const List = () => {

    const dispatch = useDispatch();

    const loading = useSelector(state => state.point.loading);
    const error = useSelector(state => state.point.error);
    const points = useSelector(state => state.point.points);

    const onPatchPoint = useCallback((uid, data, identifier) => dispatch(action.patchPoint(uid, data, identifier)), [dispatch]);


    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteItem, setDeleteItem] = useState(null);

    const toggleShowDeleteModal = () => {
        setShowDeleteModal(prevState => !prevState);
    }

    const onDeletePoint = useCallback((uid) => {
        onPatchPoint(uid, { inuse: false, updated: moment().format() }, 'DELETE_POINT');
    }, [onPatchPoint]);

    let modal = null;
    if(showDeleteModal) {
        modal = <Modal 
                    show={ showDeleteModal } 
                    modalClosed={ toggleShowDeleteModal } 
                    content={ <DeletePoint 
                        deleteItem={deleteItem} 
                        toggle={toggleShowDeleteModal}
                        onDeletePoint={onDeletePoint} />
                    }
            />
    }

    let spinner = null;
    if(loading)
        spinner = <Spinner />;

    return (
        <div>
            {modal}
            <Filter />
            <Backdrop show={loading} />
                {spinner}
            
            {error &&
                <div className='alert alert-danger text-wrap text-break' role='alert'>
                    {error.message}
                </div>
            }
            <table className='w-100 table table-hover table-borderless table-sm align-middle bg-light border-start border-end shadow-sm fs-7'>
                <thead className='border-bottom'>
                    <tr>
                        <th className='ps-3 pe-3 table-item_hide'><div className='table-item_col'>UID</div></th>
                        <th className='ps-3 pe-3 table-verticle_center'><div className='table-item_col'>Name</div></th>
                        <th className='ps-3 pe-3 table-verticle_center'><div className='table-item_col'>Site</div></th>
                        <th className='ps-3 pe-3 table-item_hide'>Direction</th>
                        <th className='ps-3 pe-3'>Status</th>
                        <th className='ps-3 pe-3'></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        points.map((item, index) => {
                            return <ListItem key={index} item={item} toggleShowDeleteModal={toggleShowDeleteModal} setDeleteItem={setDeleteItem} />
                        })
                    }
                </tbody>
            </table>
        </div>
    );
}

export default List;