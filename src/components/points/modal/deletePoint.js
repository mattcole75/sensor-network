import React from 'react';

const DeletePoint = (props) => {

    const { deleteItem, toggle, onDeletePoint } = props;

    const { site, system, type } = deleteItem[Object.keys(deleteItem)];

    const deleteSensor = () => {
        onDeletePoint(Object.keys(deleteItem)[0]);
        toggle();
    }

    return(
        <div className="rounded-3 shadow">
            <div className="modal-body p-4">
                

                <ul className='list-group mb-3'>
                    <li className='list-group-item d-flex justify-content-between lh-sm text-center'>
                        <h5 className="mb-2">Are you sure you want to delete this set of Points?</h5>
                    </li>
                    <li className='list-group-item d-flex justify-content-between lh-sm'>
                        <p><strong>UID: </strong>{Object.keys(deleteItem)}</p>
                    </li>
                    <li className='list-group-item d-flex justify-content-between lh-sm'>
                        <p><strong>Site: </strong>{site}</p>
                    </li>
                    <li className='list-group-item d-flex justify-content-between lh-sm'>
                        <p><strong>System: </strong>{system}</p>
                    </li>
                    <li className='list-group-item d-flex justify-content-between lh-sm'>
                        <p><strong>Type: </strong>{type}</p>
                    </li>
                </ul>

            </div>
            <div className="modal-footer flex-nowrap p-0">
                <button type="button" className="btn btn-lg btn-danger fs-6 text-decoration-none col-6 m-0 rounded-0 border-end" onClick={deleteSensor}><strong>Yes, delete</strong></button>
                <button type="button" className="btn btn-lg btn-primary fs-6 text-decoration-none col-6 m-0 rounded-0" data-bs-dismiss="modal" onClick={toggle}>No, don't</button>
            </div>
        </div>
    );
}

export default DeletePoint;