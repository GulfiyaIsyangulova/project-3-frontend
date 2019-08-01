import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {Route, Link, Switch} from 'react-router-dom';
import Signup from './components/user/Signup.js';
import Login from './components/user/Login.js';
import Navbar from './components/Navbar.js'
import GoogleMap from './components/GoogleMap.js';

import AuthService from './services/AuthService.js';

import axios from 'axios';

class App extends Component {
  constructor(props){
    super(props)
    this.state = { loggedInUser: null };
  }
render(){
  return (
    <div>
     

<GoogleMap />
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
      Jiu-Jitsu app
    </div>
  );
}
}
export default App;
