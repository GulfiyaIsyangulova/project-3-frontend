import React from 'react';
import {Link, NavLink} from 'react-router-dom';
import './navbar.css'



function Navbar(props){

    const doTheLogout = () =>{
        props.pleaseLogOut()
        .then(()=>{
            props.getUser();
        })

    }

    return(



        <nav>
           

            
          
        {!props.theUser && 
        <span>
        <button onClick = {()=> props.toggleForm('login')} > Login </button>
        <button onClick = {()=> props.toggleForm('signup')}>Sign Up</button>
        </span>
        }

        {props.theUser && 
        <span>

        <button onClick = {doTheLogout} >Log Out </button>

            <h1>Hey, lets find a gym and train {props.theUser.username}!</h1>
        </span>
        }

    



        </nav>
    )








}

export default Navbar;