// import React, { Component } from 'react';


// export default class MyMap extends Component{

//     constructor(props){
//       super(props);
//       this.googleChecker = this.googleChecker.bind(this);
//       this.renderMap = this.renderMap.bind(this);
//     }
  
//     googleChecker() {
//       // check for maps in case you're using other google api
//       if(!window.google.maps) {
//         setTimeout(googleChecker, 100);
//         console.log("not there yet");
//       } else {
//         console.log("we're good to go!!");
//         // the google maps api is ready to use, render the map
//         this.renderMap();
//       }
//     }
  
//     renderMap(){
//       const coords = { lat: 41.375885, lng: 2.177813 };
//       // create map instance
//       new google.maps.Map(this.refs.mapContainer, {
//         zoom: 16,
//         center: {
//           lat: coords.lat,
//           lng: coords.lng
//         }
//       });
//     }
  
//     componentDidMount(){
//       this.googleChecker();
//     }
  
//     render(){
//       return(
//         <div className="card map-holder">
//           <div className="card-block" ref="mapContainer" />
//         </div>
//       );
//     }
//   }