import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {Route, Link, Switch} from 'react-router-dom';
import Signup from './components/user/Signup.js';
import Login from './components/user/Login.js';
import Navbar from './components/Navbar.js'
import UserProfile from './components/user/UserProfile.js';
import GymDetails from './components/gyms/GymDetails.js';
import GymIndex from './components/gyms/GymIndex.js';
import AuthService from './services/AuthService.js';
import { GoogleMap, Marker, withGoogleMap, withScriptjs } from "react-google-maps"
// import PlacesAutocomplete from 'react-places-autocomplete';
import LocationSearchInput from './components/PlacesAutocomplete';
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';
import PropTypes from 'prop-types'; // ES6
import'lodash.debounce'




import axios from 'axios';

class App extends Component {
  constructor(props){
    super(props)
    this.state = { 
      // listOfs: [],
      currentlyLoggedIn: null,
      ready: false,
      signupShowing: false,
      loginShowing: false,
   };

   this.service = new AuthService();
  
  }

  // getAllGyms = () => {
  //   axios.get(`http://localhost:5000/api/gyms`, {withCredentials: true})
  //   .then(responseFromApi => {
  //     this.setState({
  //       listOfGyms: responseFromApi.data, ready: true
  //     })
  //   })
  // }


  getCurrentlyLoggedInUser = () =>{
    this.service.currentUser()
    .then((theUser)=>{
      this.setState({currentlyLoggedIn: theUser})
    })
    .catch(()=>{
      this.setState({currentlyLoggedIn: null})
    })
  }


  toggleForm = (whichForm) =>{

    let theForm;
  
    if(whichForm === "signup"){
      theForm = 'signupShowing'
    } else {
      theForm = 'loginShowing'
    }
  
    this.setState({[theForm]: !this.state[theForm]})
   
  
  }
  componentDidMount() {
    // this.getAllGyms();
    this.getCurrentlyLoggedInUser();

}



render(){
  const MyMapComponent = withScriptjs(withGoogleMap((props) =>
  <GoogleMap
    defaultZoom={8}
    defaultCenter={{ lat: 25.397, lng: -80.644 }}
  >
    {props.isMarkerShown && <Marker position={{ lat: 25.397, lng: -80 }} />}
  </GoogleMap>
))
  return (
    <div>
      <h1>Jiu-Jitsu app</h1>




  <MyMapComponent
  isMarkerShown
  googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyCpGcRTL6DiWCcICDtehgpbBfr4DYVN__Q"
  loadingElement={<div style={{ height: `100%` }} />}
  containerElement={<div style={{ height: `400px` }} />}
  mapElement={<div style={{ height: `100%` }} />}
/>


<Navbar 
theUser = {this.state.currentlyLoggedIn} 
pleaseLogOut = {()=> this.service.logout()}
toggleForm = {this.toggleForm}
getUser = {this.getCurrentlyLoggedInUser}

/>

{this.state.signupShowing && 
  <Signup getUser = {this.getCurrentlyLoggedInUser}
  toggleForm = {this.toggleForm}
   />
}

{this.state.loginShowing && 
  <Login getUser = {this.getCurrentlyLoggedInUser}
  toggleForm = {this.toggleForm}
  />
}
<LocationSearchInput />

<Switch>
          <Route exact path="/gyms" render ={(props)=> <GymIndex
           {...props} 
           theUser = {this.state.currentlyLoggedIn} 
           allTheGyms ={this.state.listOfGyms}
           getData = {this.getAllGyms}
           ready = {this.state.ready}
           theUser = {this.state.currentlyLoggedIn}
           />} />

          <Route exact path="/gyms/:theID" render ={(props)=> <GymDetails
           {...props} 
           allTheGymss ={this.state.listOfGyms}
           ready = {this.state.ready}
           getData = {this.getAllGyms}
           theUser = {this.state.currentlyLoggedIn}
           />} />



        </Switch>

    </div>
  );
}
}
export default App;
