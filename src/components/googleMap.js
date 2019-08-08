import React from 'react';
import { compose, withProps } from "recompose"
import { GoogleMap, Marker, withGoogleMap, withScriptjs, InfoWindow } from "react-google-maps"

let location;

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(function (position) {
    location = { lat: position.coords.latitude, lng: position.coords.longitude }
  })
} else {
  location = { lat: 20, lng: -80 }
}

const GymMap = compose(
    withProps({
      googleMapURL: "https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyCpGcRTL6DiWCcICDtehgpbBfr4DYVN__Q",
      loadingElement: <div style={{ height: `100%` }} />,
      containerElement: <div style={{ height: `600px`, width:`1000px`, marginLeft: `30px`}} />,
      mapElement: <div style={{ height: `100%`}} />,
    }),
    // withScriptjs,
    withGoogleMap
  )((props) =>


    <GoogleMap
      defaultZoom={8}
      defaultCenter={location}
    >
      {props.geoLocations.map((marker, index) => <Marker key={index} position={{lat: marker.lat, lng: marker.lng}} onClick={()=> props.onToggleOpenInfoWindow(index, marker)}>
        {props.isOpen === index && <InfoWindow onCloseClick={props.onToggleOpenInfoWindow} >
         <div>
          <h1>{marker.info.name}</h1>
          <h2>{marker.info.address}</h2>
         </div>
        </InfoWindow>}
      </Marker>)}
      {props.isMarkerShown &&
        <Marker position={location} onClick={props.onToggleOpenInfoWindow}>
          {props.isOpen && <InfoWindow onCloseClick={props.onToggleOpenInfoWindow}>
            <h1>test</h1>
          </InfoWindow>}
        </Marker>}
    </GoogleMap>
  );

export default GymMap;


