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
      photo: "",
      gymComments: [],
      theGymId: ''
    };

    this.service = new AuthService();
    Geocode.setApiKey("AIzaSyAU9nQ_E20F7o9usfZFFEv8lLeDkLjlCxk");

  }

  componentDidMount() {
    this.getAllGyms();
    this.getCurrentlyLoggedInUser();
  }


  getAllGyms = () => {
    axios.get(`${process.env.REACT_APP_API_URL}gyms`)
      .then(responseFromApi => {
        const data = responseFromApi.data;

        this.setState({
          listOfGyms: data, ready: true
        });

        setTimeout(() => {
          this.setState({ mapReady: true })
        }, 2500)
        // this.setGeoLocations();
      });
  }

  setGeoLocations = () => {

    console.log("GEO LOCATIONs");

    this.state.listOfGyms.map(gym => {
      return Geocode.fromAddress(gym.address).then(
        response => {
          const { lat, lng } = response.results[0].geometry.location;

          this.setState({ geoLocations: [...this.state.geoLocations, { lat: lat, lng: lng, info: gym }] });
          console.log("STATEEE");
          console.log(this.state.geoLocations);
        },
        error => {
          console.error(error);
        }
      );
    });
  }


  getGymComments = (gymid) => {

    axios.get(`${process.env.REACT_APP_API_URL}reviews/gymComments/${gymid}`)
      .then(gymCommentsFromApi => {
        console.log('DATA DETAILS');




        this.setState({ gymComments: gymCommentsFromApi.data });

      }).catch(err => console.log(err))



  }

  onToggleOpenInfoWindow = (number, gymInfo) => {
    console.log('Opening INFO WINDOW!!!!!');
    if (gymInfo) {
      axios.get(`${process.env.REACT_APP_API_URL}gyms/getPlacesDetails/` + gymInfo.info.place_id)
        .then(responseFromApi => {
          const data = responseFromApi.data.result;

          axios.get(`${process.env.REACT_APP_API_URL}reviews/gymComments/${gymInfo.info._id}`)
            .then(gymCommentsFromApi => {
              console.log('DATA DETAILS');
              console.log(data);
              console.log("the gym info -------- ", gymInfo);


              this.setState({ isOpen: number, details: data, gymComments: gymCommentsFromApi.data, theGymId: gymInfo.info._id });

            }).catch(err => console.log(err))

        });

      console.log("GYMINFO PLACE ID");
      console.log(gymInfo.info.place_id);

      axios.get(`${process.env.REACT_APP_API_URL}gyms/getPlacesPhotos/${gymInfo.info.place_id}`)
        // axios.get(`https://jiu-jitsu-locator.herokuapp.com/gyms/getPlacesPhotos/` + gymInfo.info.place_id)
        .then(responseFromApi => {
          console.log("API RESPONSE");
          console.log(responseFromApi);
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
          <div class="allIncludedNavbar">
            <h1>Jiu-Jitsu Locator
          <img src="https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678111-map-marker-512.png" style={{ height: `30px` }} /></h1>
            {/* <div class="top-navigation"> */}
              <Navbar
                theUser={this.state.currentlyLoggedIn}
                pleaseLogOut={() => this.service.logout()}
                toggleForm={this.toggleForm}
                getUser={this.getCurrentlyLoggedInUser}


              />

              <div className="searchThing">
                <img src="https://cdn.pixabay.com/photo/2017/01/13/01/22/magnifying-glass-1976105_960_720.png" style={{ height: `30px`, margin:`20px`}}></img>
                <LocationSearchInput />
              </div>
              <div className="signup">
                {this.state.signupShowing &&
                  <Signup getUser={this.getCurrentlyLoggedInUser}
                    toggleForm={this.toggleForm}
                  />
                }
              </div>
              <div className="login">
                {this.state.loginShowing &&
                  <Login getUser={this.getCurrentlyLoggedInUser}
                    toggleForm={this.toggleForm}
                  />
                }
              </div>
            {/* </div> */}
          </div>

          <div class="mapDetailsComponent">
            <GymMap geoLocations={this.state.listOfGyms} onToggleOpenInfoWindow={this.onToggleOpenInfoWindow} isOpen={this.state.isOpen} />
            {console.log("the state in app js =============== ", this.state)}


            <DetailsComponent {...this.props} info={this.state.details}
              photo={this.state.photo}
              gymComments={this.state.gymComments}
              theGymId={this.state.theGymId}
              getComments={this.getGymComments}

            />
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
