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

            Hey, {props.theUser.username}!
        <button onClick = {doTheLogout} style={{ textDecoration: `100%`}} >Log out </button>


        </span>
        }

    



        </nav>
    )








}

export default Navbar;