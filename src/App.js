import React, { Component } from 'react';
import './App.css';
import { Route, Switch, NavLink } from 'react-router-dom';
import Signup from './components/user/Signup.js';
import Login from './components/user/Login.js';
import Navbar from './components/Navbar.js'
import GymDetails from './components/gyms/DetailsComponent.js';
import GymIndex from './components/gyms/GymIndex.js';
import AuthService from './services/AuthService.js';
// import PlacesAutocomplete from 'react-places-autocomplete';
import LocationSearchInput from './components/PlacesAutocomplete';
import 'lodash.debounce'

import Geocode from "react-geocode";
import DetailsComponent from './components/gyms/DetailsComponent';

import axios from 'axios';
import GymMap from './components/googleMap';
import UserProfile from './components/user/UserProfile';

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
      isOpen: false,
      details: {},
      photo: ""
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

        setTimeout(() => {
          this.setState({ mapReady: true })
        }, 1500)
        this.setGeoLocations();
      });
  }

  setGeoLocations = () => {

    console.log("GEO LOCATIONs");

    this.state.listOfGyms.map(gym => {
      return Geocode.fromAddress(gym.address).then(
        response => {
          const { lat, lng } = response.results[0].geometry.location;

          this.setState({ geoLocations: [...this.state.geoLocations, { lat: lat, lng: lng, info: gym }] });
        },
        error => {
          console.error(error);
        }
      );
    });
  }

  onToggleOpenInfoWindow = (number, gymInfo) => {
    if (gymInfo) {
      axios.get(`http://localhost:5000/gyms/getPlacesDetails/` + gymInfo.info.place_id)
        .then(responseFromApi => {
          const data = responseFromApi.data.result;

          console.log('DATA DETAILS');
          console.log(data);

          this.setState({ isOpen: number, details: data });
        });

        console.log(gymInfo.info.place_id);

      axios.get(`http://localhost:5000/gyms/getPlacesPhotos/` + gymInfo.info.place_id)
        .then(responseFromApi => {
            console.log("API RESPONSE");
            console.log(responseFromApi.data);
            this.setState({
                photo: responseFromApi.data.photos[0]
            });

            console.log("PHOTO: ");
            console.log(this.state.photo);
        });
    }
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
    if (this.state.mapReady)
      return (
        <div>
          <div class="top-navigation">
          <h1>Jiu-Jitsu Locator
          <img src="https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678111-map-marker-512.png" style={{ height: `30px` }}/></h1>
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
        <NavLink to = "/profile/:id">Profile</NavLink>
          <LocationSearchInput />


          </div>
            <div class="mapDetailsComponent">  
          <GymMap geoLocations={this.state.geoLocations} onToggleOpenInfowindow={this.onToggleOpenInfoWindow} isOpen={this.state.isOpen} />
          <DetailsComponent info={this.state.details} photo={this.state.photo}/>
              </div>
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

           <Route exact path="/profile/:id" render={(props) => <UserProfile
              {...props}
              
            />} />


           

          </Switch>
          {this.state.listOfGyms.map((gym, i) => {
            return (
              <div key={i}>
                {/* <h1>{gym.name}</h1> */}
                {/* <h2>{gym.address}</h2> */}

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
