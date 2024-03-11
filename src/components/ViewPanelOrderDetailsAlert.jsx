import React, { useEffect } from 'react'
import { toast } from 'react-toastify';
import CopyText from './CopyText';
import formatDate from '../services/formatDate';

const ViewPanelOrderDetailsAlert = ({onClose, order, user}) => {

    const makeOrderSeen = async(c)=>{
        try{
            const res = await fetch(`/api/order-panel/seen/${order._id}`,{
                method:'PUT',
                headers: {
                    Authorization: `Bearer ${JSON.parse(user).token}`,
                },
            })
            const response = await res.json();
            if(res.ok){
                // toast.success(`Order Updated Successfully`)
            }
            else{
              toast.error(`${response.message}`)
            }
        }catch(err){
            console.log(err);
            toast.error(`Error Updating`)
        } 
    }

    useEffect(()=>{
        if(order.isSeen === false){
            makeOrderSeen()
        }
    }, [])

    return (
        <div className='confirm-alert1'>
            <h1 className='heading'>{`Order Details`}</h1>
            <div className="details-wrapper">
                <div className="row">
                    <div className='details-elem'>
                        <h4>Server :</h4>
                        <p>{order.itemName}</p>
                    </div>
                    <div className='details-elem'>
                        <h4>price :</h4>
                        <p>{order.itemPrice} Dhs</p>
                    </div>
                </div>
                <div className="row">
                    <div className='details-elem'>
                        <h4>quantity :</h4>
                        <p>{order.itemQuantity}</p>
                    </div>
                    <div className='details-elem'>
                        <h4>state :</h4>
                        <p>{order.state}</p>
                    </div>
                </div>
                <div className="row">
                    <div className='details-elem'>
                        <h4>Ordered by:</h4>
                        <p>{order.userName}</p>
                    </div>
                    <div className='details-elem'>
                        <h4>Ordered at:</h4>
                        <p>{formatDate(order.createdAt)}</p>
                    </div>
                </div>
                <div className="row">
                    <div className='details-elem'>
                        <h4>panel username :</h4>
                        <p>{order.panelUserName}</p>
                    </div>
                    <div className='details-elem'>
                        <h4>tele :</h4>
                        <p>{order.phone}</p>
                    </div>
                </div>
                <div className='details-elem'>
                    <h4>Note :</h4>
                    <p>{order.note}</p>
                </div>
            </div>  
            <div className="cta">
                <button onClick={()=>{onClose()}}>Close</button>
            </div>     
        </div>
    )
}

export default ViewPanelOrderDetailsAlert