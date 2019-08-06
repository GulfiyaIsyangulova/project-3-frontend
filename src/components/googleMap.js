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
// function geocodeLatLng(geocoder, map, infowindow) {
//     var input = document.getElementById('latlng').value;
//     var latlngStr = input.split(',', 2);
//     var latlng = {lat: parseFloat(latlngStr[0]), lng: parseFloat(latlngStr[1])};
//     geocoder.geocode({'location': latlng}, function(results, status) {
//       if (status === 'OK') {
//         if (results[0]) {
//           map.setZoom(11);
//           var marker = new google.maps.Marker({
//             position: latlng,
//             map: map
//           });
//           infowindow.setContent(results[0].formatted_address);
//           infowindow.open(map, marker);
//         } else {
//           window.alert('No results found');
//         }
//       } else {
//         window.alert('Geocoder failed due to: ' + status);
//       }
//     });
//   }

const GymMap = compose(
    withProps({
      googleMapURL: "https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyCpGcRTL6DiWCcICDtehgpbBfr4DYVN__Q",
      loadingElement: <div style={{ height: `100%` }} />,
      containerElement: <div style={{ height: `400px` }} />,
      mapElement: <div style={{ height: `100%` }} />,
    }),
    // withScriptjs,
    withGoogleMap
  )((props) =>


    <GoogleMap
      defaultZoom={8}
      defaultCenter={location}
    >
      {props.geoLocations.map((marker, index) => <Marker key={index} position={{lat: marker.lat, lng: marker.lng}} onClick={()=> props.onToggleOpenInfoWindow(index)}>
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