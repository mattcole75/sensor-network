import React, { useMemo } from 'react';
import { GoogleMap, useLoadScript, Marker } from'@react-google-maps/api';
import { map_api_key } from '../../../../configuration/config';

const Map = ({ location, zoomLevel }) => {

    const { lat, lng } = location;

    const { isLoaded } = useLoadScript({ googleMapsApiKey: map_api_key})

    const centre = useMemo(() => ({
            lat: parseFloat(lat),
            lng: parseFloat(lng)
    }), [lat, lng]);

   
    if(!isLoaded)
        return <div>Loading</div>

    return ( 
        <GoogleMap 
            zoom={zoomLevel}
            center={centre}
            mapContainerClassName='map-container'>
            <Marker position={centre} />
        </GoogleMap>
    );
}

export default Map;