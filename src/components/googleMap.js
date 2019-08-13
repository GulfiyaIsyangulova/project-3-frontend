import React from 'react';
import { compose, withProps } from "recompose"
import { GoogleMap, Marker, withGoogleMap, withScriptjs, InfoWindow } from "react-google-maps"
import axios from 'axios';

let location;

console.log("what is navigator >>>>>>>>>>>> ", this);
let showComments = (gymId) => {
  axios.get(`${process.env.REACT_APP_API_URL}reviews/gymComments/${gymId}`)
  .then(gymComments => {
    return gymComments.data.map((oneComment, i) => {
      console.log("the gym comments >>>>><<<<<<<<>>>>>>>><<<<<<<<<>>>>>> ", oneComment);
      return (
        <div key={i}>
          <div>
            <h3>{oneComment.owner.username}</h3>
            <h4>{oneComment.rating}</h4>
          </div>
          <div>
            <h3>{oneComment.title}</h3>
            <p>{oneComment.content}</p>
          </div>
        </div>
      )
    })
  }).catch(err => console.log(err))
}

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(function (position) {
    location = { lat: position.coords.latitude, lng: position.coords.longitude }
  })
} else {
  location = { lat: 20, lng: -80 }

}

const GymMap = compose(
  withProps({
    googleMapURL: "https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyAU9nQ_E20F7o9usfZFFEv8lLeDkLjlCxk",
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
          <div>
            {/* {showComments(marker.info._id)} */}
          </div>
         </div>
        </InfoWindow>}
        {/* {console.log("the info from props in maps component ----------------------- ", marker.info._id)} */}
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


