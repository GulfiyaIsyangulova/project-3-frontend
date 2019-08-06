import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Geocode from "react-geocode";


export default class GymIndex extends Component{
    constructor(props){
        super(props)
        this.state = {
            editing: false,
        }
    }
    showGyms = () =>{
        const myGyms= this.props.allTheGyms;
        return myGyms.map((gym, i) => {
           
            return (
                <div key={i} gym = {gym._id}>
           
              <h3>{gym.name}</h3>
           
            <p style={{maxWidth: '400px'}} >{gym.address} </p>

           </div>
         
         
         )
    })
}
render(){

    //if(this.props.ready)

    Geocode.fromAddress('{this.props.gym.address}').then(
        response => {
          const { lat, lng } = response.results[0].geometry.location;
          console.log(lat, lng);
        },
        error => {
          console.error(error);
        }
      );
    return (
        <div>

            <h2>I am a GymsIndex component!!</h2>
        {this.showGyms}
        </div>
    )
}

}