import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Route, Link, Switch } from 'react-router-dom';
import Signup from './components/user/Signup.js';
import Login from './components/user/Login.js';
import Navbar from './components/Navbar.js'
import UserProfile from './components/user/UserProfile.js';
import GymDetails from './components/gyms/GymDetails.js';
import GymIndex from './components/gyms/GymIndex.js';
import AuthService from './services/AuthService.js';
// import PlacesAutocomplete from 'react-places-autocomplete';
import LocationSearchInput from './components/PlacesAutocomplete';
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';
import PropTypes from 'prop-types'; // ES6
import 'lodash.debounce'

import { compose, withProps } from "recompose"
import { GoogleMap, Marker, withGoogleMap, withScriptjs, InfoWindow } from "react-google-maps"
import Geocode from "react-geocode";





import axios from 'axios';
import GymMap from './components/googleMap';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      listOfGyms: [],
      geoLocations: [],
      currentlyLoggedIn: null,
      ready: false,
      signupShowing: false,
      loginShowing: false,
      mapReady: false,
      isOpen: false
    };

    this.service = new AuthService();
    Geocode.setApiKey("AIzaSyCpGcRTL6DiWCcICDtehgpbBfr4DYVN__Q");

  }

  componentDidMount() {
    this.getAllGyms();
    this.getCurrentlyLoggedInUser();
  }

  getAllGyms = () => {
    axios.get(`http://localhost:5000/gyms`)
      .then(responseFromApi => {
        const data = responseFromApi.data;

        this.setState({
          listOfGyms: data, ready: true
        });

        console.log("GYMS INSIDE CALLBACK!");
        console.log(this.state.listOfGyms);
        setTimeout(() => {
          this.setState({ mapReady: true })
        }, 1500)
        this.setGeoLocations();
      });

    console.log("GYMS OUTSIDE CALLBACK!");
    console.log(this.state.listOfGyms);
  }

  setGeoLocations = () => {
   
    console.log("GEO LOCATIONs");

    this.state.listOfGyms.map(gym => {
      return Geocode.fromAddress(gym.address).then(
        response => {
          const { lat, lng } = response.results[0].geometry.location;
          console.log("LATITUDE!!")
          console.log(lat, lng);
          // this.state.geoLocations.push({ lat: lat, lng: lng });
          this.setState({ geoLocations: [...this.state.geoLocations, { lat: lat, lng: lng, info: gym}] });
          // console.log("GEO LOCATIONS");
          // console.log(this.state.geoLocations);
        },
        error => {
          console.error(error);
        }
      );
    });
  }
  

  onToggleOpenInfoWindow = (number) => {
    this.setState({ isOpen: number })
  }

  getCurrentlyLoggedInUser = () => {
    this.service.currentUser()
      .then((theUser) => {
        this.setState({ currentlyLoggedIn: theUser })
      })
      .catch(() => {
        this.setState({ currentlyLoggedIn: null })
      })
  }


  toggleForm = (whichForm) => {

    let theForm;

    if (whichForm === "signup") {
      theForm = 'signupShowing'
    } else {
      theForm = 'loginShowing'
    }

    this.setState({ [theForm]: !this.state[theForm] })


  }

 




  render() {


    // let location;

    // if (navigator.geolocation) {
    //   navigator.geolocation.getCurrentPosition(function (position) {
    //     location = { lat: position.coords.latitude, lng: position.coords.longitude }
    //   })
    // } else {
    //   location = { lat: 20, lng: -80 }
    // }

    // const MyMapComponent = compose(
    //   withProps({
    //     googleMapURL: "https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyCpGcRTL6DiWCcICDtehgpbBfr4DYVN__Q",
    //     loadingElement: <div style={{ height: `100%` }} />,
    //     containerElement: <div style={{ height: `400px` }} />,
    //     mapElement: <div style={{ height: `100%` }} />,
    //   }),
    //   withScriptjs,
    //   withGoogleMap
    // )((props) =>



    //   <GoogleMap
    //     defaultZoom={8}
    //     defaultCenter={location}
    //   >
    //     {this.state.geoLocations.map((marker, index) => <Marker key={index} position={marker} onClick={this.onToggleOpenInfoWindow}>
    //       {this.state.isOpen && <InfoWindow onCloseClick={this.onToggleOpenInfoWindow}>
    //         <h1>test</h1>
    //       </InfoWindow>}
    //     </Marker>)}
    //     {props.isMarkerShown &&
    //       <Marker position={location} onClick={this.onToggleOpenInfoWindow}>
    //         {this.state.isOpen && <InfoWindow onCloseClick={this.onToggleOpenInfoWindow}>
    //           <h1>test</h1>
    //         </InfoWindow>}
    //       </Marker>}
    //   </GoogleMap>
    // );

    if (this.state.mapReady)
      return (
        <div>
          <h1>Jiu-Jitsu app</h1>

          <GymMap geoLocations={this.state.geoLocations} onToggleOpenInfoWindow={this.onToggleOpenInfoWindow} isOpen={this.state.isOpen}  />

          <Navbar
            theUser={this.state.currentlyLoggedIn}
            pleaseLogOut={() => this.service.logout()}
            toggleForm={this.toggleForm}
            getUser={this.getCurrentlyLoggedInUser}

          />

          {this.state.signupShowing &&
            <Signup getUser={this.getCurrentlyLoggedInUser}
              toggleForm={this.toggleForm}
            />
          }

          {this.state.loginShowing &&
            <Login getUser={this.getCurrentlyLoggedInUser}
              toggleForm={this.toggleForm}
            />
          }
          <LocationSearchInput />

          <Switch>
            <Route exact path="/gyms" component={GymIndex} render={(props) => <GymIndex
              {...props}
              theUser={this.state.currentlyLoggedIn}
              allTheGyms={this.state.listOfGyms} />} />

            <Route exact path="/gyms/:theID" render={(props) => <GymDetails
              {...props}
              allTheGyms={this.state.listOfGyms}
              ready={this.state.ready}
              getData={this.getAllGyms}
              theUser={this.state.currentlyLoggedIn}
            />} />



          </Switch>
          {this.state.listOfGyms.map((gym, i) => {
            return (
              <div key={i}>
                <h1>{gym.name}</h1>
                <h2>{gym.address}</h2>

              </div>

            );
          })}


        </div>
      )
    else
      return (
        <div>

          <div className="overlay"></div>
        </div>
      );
  }
}
export default App;
