import React from 'react';
import {Link} from 'react-router-dom';
 
const DetailsComponent = (props) => {
    return(
        <div style={{ height: '300px', borderRadius: '4px', width: '30%', float: 'left', margin: '10px', padding: '10px'}}>
           
            {props.info.name && <h2>{props.info.name}</h2>}
            {props.info.formatted_phone_number && <h6>{props.info.formatted_phone_number}</h6>}
            {props.info.photos && <img src={props.photo} alt=""/>}
            {props.info.rating && <div style={{ fontSize: `40px` }}>Rating<img src="https://icon-library.net/images/star-rating-icon/star-rating-icon-20.jpg"></img>{props.info.rating}</div>}
           
            {/* <Link to ={"/details/"+props.beer._id}> See Details </Link> */}
        </div>
    )
}

export default DetailsComponent;
