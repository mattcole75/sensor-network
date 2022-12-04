import React from 'react';
import { Link } from 'react-router-dom';

const ListItem = (props) => {

    const { item, toggleShowDeleteModal, setDeleteItem } = props;
    const sensor  = item[Object.keys(item)];
    const { name, site, status, direction } = sensor;

    const deletePoint = () => {
        setDeleteItem(item);
        toggleShowDeleteModal();
    }
    
    return (

            <tr className='border-bottom'>
                <td className='ps-3 pe-3 table-item_hide'><div className='table-item_col'>{Object.keys(item)}</div></td>
                <td className='ps-3 pe-3 table-verticle_center'><div className='table-item_col'>{name}</div></td>
                <td className='ps-3 pe-3 table-verticle_center'><div className='table-item_col'>{site}</div></td>
                <td className='ps-3 pe-3 table-verticle_center'><div className='table-item_col'>{direction}</div></td>
                <td className='ps-3 pe-3 table-verticle_center'><div className='table-item_col'>{status}</div></td>
                <td className='ps-3 pe-3'>
                    <div className='dropdown'>
                        <div className='btn' role='button' data-bs-toggle='dropdown' aria-expanded='false'>
                            <span className='bi-three-dots-vertical fs-7' />
                        </div>
                        <ul className='dropdown-menu fs-7'>
                            <li><Link className='dropdown-item' to={`/pointview/${Object.keys(item)}`}>View</Link></li>
                            <li><Link className='dropdown-item' to={`/pointedit/${Object.keys(item)}`}>Edit</Link></li>
                            <li><button type='button' className='dropdown-item' onClick={deletePoint}>Delete</button></li>
                        </ul>
                    </div>
                </td>
            </tr>
    );
}

export default ListItem;