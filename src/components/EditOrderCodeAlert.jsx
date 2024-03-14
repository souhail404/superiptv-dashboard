import React, { useState } from 'react'
import { toast } from 'react-toastify';


const EditOrderCodeAlert = ({onClose, order, user, product, ordersData, index, setOrdersData}) => {

    const [newCode, setNewCode] = useState('')

    const editCode = async()=>{
        try{
            if (!newCode || newCode?.length < 3) {
                return toast.error(`The Code is required and must be above 3 chars`)
            }
            const res = await fetch(`/api/order-${product}/code/${order._id}`,{
                method:'PUT',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${JSON.parse(user).token}`
                },
                body:JSON.stringify({code:newCode})
            })
            const response = await res.json();
            if(res.ok){
                const updatedData= ordersData;
                updatedData[index].code = newCode;
                setOrdersData([...updatedData])
                toast.success(`Order Updated Successfully`)
            }
            else{
              toast.error(`${response.message}`)
            }
        }catch(err){
            console.log(err);
            toast.error(`Error Updating`)
        } 
    }

    return (
        <div className='confirm-alert1'>
            <h1 className='heading'>{`Edit Order Code`}</h1>
            <p className='sub-heading'>Provide the new code.</p>
            <div className="input-wrapper onefr">
                <input  type="text" 
                        className='input1' 
                        name='newc-code' 
                        id='new-code' 
                        min={0}
                        value={newCode}
                        onChange={(e)=>setNewCode(e.target.value)}
                        required
                />
            </div>  
            <div className="cta">
                <button onClick={()=>{onClose()}}>Cancel</button>
                <button
                    onClick={async() => {
                        await editCode();  
                        onClose();                      
                    }}
                >
                    Confirm
                </button>
            </div>     
        </div>
    )
}

export default EditOrderCodeAlert