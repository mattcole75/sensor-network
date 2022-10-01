import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import * as action from '../../../store/actions/index';

import Filter from '../filter/filter';
import ListItem from './listItem.js/listItem';

import Backdrop from '../../ui/backdrop/backdrop';
import Spinner from '../../ui/spinner/spinner';
import Modal from '../../ui/modal/modal';
import DeleteSensor from '../modal/deleteSensor';

// import sensors from '../../../configuration/sensors';

const List = () => {

    const dispatch = useDispatch();

    const loading = useSelector(state => state.sensor.loading);
    const error = useSelector(state => state.sensor.error);
    const sensors = useSelector(state => state.sensor.sensors);

    const onPatchSensor = useCallback((uid, data, identifier) => dispatch(action.patchSensor(uid, data, identifier)), [dispatch]);


    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteItem, setDeleteItem] = useState(null);

    const toggleShowDeleteModal = () => {
        setShowDeleteModal(prevState => !prevState);
    }

    const onDeleteSensor = useCallback((uid) => {
        onPatchSensor(uid, { inuse: false, updated: moment().format() }, 'DELETE_SENSOR');
    }, [onPatchSensor]);

    let modal = null;
    if(showDeleteModal) {
        modal = <Modal 
                    show={ showDeleteModal } 
                    modalClosed={ toggleShowDeleteModal } 
                    content={ <DeleteSensor 
                        deleteItem={deleteItem} 
                        toggle={toggleShowDeleteModal}
                        onDeleteSensor={onDeleteSensor} />
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
                <div className='alert alert-danger' role='alert'>
                    {error.message}
                </div>
            }
            <table className='w-100 table table-hover table-borderless table-sm align-middle bg-light border-start border-end shadow-sm fs-7'>
                <thead className='border-bottom'>
                    <tr>
                        <th className='ps-3 pe-3 table-verticle_center'><div className='table-item_col'>UID</div></th>
                        <th className='ps-3 pe-3 table-verticle_center'><div className='table-item_col'>Site</div></th>
                        <th className='ps-3 pe-3 table-verticle_center'><div className='table-item_col'>Type</div></th>
                        <th className='ps-3 pe-3'>Status</th>
                        <th className='ps-3 pe-3 table-item_date'>Commissioned</th>
                        <th className='ps-3 pe-3'></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        sensors.map((item, index) => {
                            return <ListItem key={index} item={item} toggleShowDeleteModal={toggleShowDeleteModal} setDeleteItem={setDeleteItem} />
                        })
                    }
                </tbody>
            </table>
        </div>
    );
}

export default List;