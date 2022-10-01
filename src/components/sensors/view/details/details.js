import React from 'react';
import moment from 'moment';

const Details = (props) => {

    const { sensor } = props;
    const { organisation, department, site, system, type, commissioned, upper, lower, calibrated, validForWeeks, status, created, updated, purpose } = sensor[Object.keys(sensor)];

    const { lastSensorMessage } = props;
    const { timestamp, value } = lastSensorMessage;

    return (
        <ul className="list-group list-group-flush">
            <li className='list-group-item'><strong>ID: </strong>{Object.keys(sensor)}</li>
            <li className='list-group-item'><strong>Org: </strong>{organisation}</li>
            <li className='list-group-item'><strong>Dept: </strong>{department}</li>
            <li className='list-group-item'><strong>Taxonomy:</strong></li>
                <ul className='list-group-flush'>
                    <li className='list-group-item'><strong>Site: </strong>{site}</li>
                    <li className='list-group-item'><strong>System: </strong>{system}</li>
                    <li className='list-group-item'><strong>Type: </strong>{type}</li>
                </ul>
            <li className='list-group-item border-top'><strong>Live: </strong>{moment(commissioned).startOf('day').fromNow()}</li>
            <li className='list-group-item'><strong>Data: </strong>{moment(timestamp).startOf('hour').fromNow()}</li>
            <li className='list-group-item'><strong>Value: </strong>{value} °C</li>
            <li className='list-group-item'><strong>Thresholds:</strong></li>
                <ul className='list-group-flush'>
                    <li className='list-group-item'><strong>Upper: </strong>{upper} °C</li>
                    <li className='list-group-item'><strong>Lower: </strong>{lower} °C</li>
                </ul>
            <li className='list-group-item border-top'><strong>Calibration: </strong>Expires {moment(calibrated).add(validForWeeks, 'weeks').fromNow()}</li>
            <li className='list-group-item'><strong>Status: </strong>{status}</li>
            <li className='list-group-item'><strong>Registered: </strong>{moment(created).format('DD/MM/YYYY')}</li>
            <li className='list-group-item'><strong>Updated: </strong>{moment(updated).format('DD/MM/YYYY')}</li>
            <li className='list-group-item'><strong>Purpose: </strong>{purpose}</li>
        </ul>
    );
}

export default Details;