import React from 'react'
import {Link} from 'react-router-dom';

const InPageLocation = (props) => {
    const locations = props.locations;
    const links = props.links;

    return (
        <div className='in-page-location-wrapper'>
            <div className='container'>
                <div className="locations">
                    {
                        locations.map((location, index)=>{
                            return(
                                <Link key={index} to={links[index]} className='location'> <p>{location}</p>   &nbsp;
                                    <span>/</span>
                                </Link>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export default InPageLocation