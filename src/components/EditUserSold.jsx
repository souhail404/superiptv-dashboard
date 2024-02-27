import React, { useState } from 'react'
import { useAuthContext } from '../hooks/useAuthContext';
import { toast } from 'react-toastify';

const EditUserSold = ({onClose, customer, user, index, customersData, setCustomersData}) => {

    const [amount , setAmount] = useState(0);
    const [isAdd , setIsAdd] = useState(true);

    const editClientSold = async(customer, amount, isAdd) =>{
        const myheaders = new Headers();

        myheaders.append('Content-Type', 'application/json');
        myheaders.append('Authorization', `Bearer ${JSON.parse(user).token}`);
    
        const customerId = customer._id;
        const data = JSON.stringify({amount , isAdd});
    
        const toastId = toast.loading(`Updating ${customer.userName} Sold`);
        try {
            const res = await fetch(`/api/user/update-sold/${customerId}`, {
                method:"PUT",
                headers:myheaders,
                body:data
            })
            const response = await res.json();
            if(res.ok){
                const updateState = customersData;
                if (JSON.parse(isAdd)) {
                    updateState[index].sold += Number(amount) 
                }
                if (!JSON.parse(isAdd)) {
                    updateState[index].sold -= Number(amount) 
                }
                setCustomersData([...updateState])
                toast.update(toastId, {render: "Client Sold Updated Succefully", type: "success", isLoading: false, autoClose:4000});
            }
            else{
                toast.update(toastId, {render: `${response.message}`, type: "error", isLoading: false, autoClose:4000});        
            }
            return res
        } catch (error) {
          console.log(error);
        }
    }

    return (
        <div className='confirm-alert1'>
            <h1 className='heading'>{`Edit ${customer.userName}'s Sold`}</h1>
            <p className='sub-heading'>Provide the amount you wanna add or subtract to this client.</p>
            <div className="input-wrapper">
                <select name="" id="" defaultValue={isAdd} value={isAdd} onChange={(e)=>setIsAdd(e.target.value)}>
                    <option value={true}>(+) Add</option>
                    <option value={false}>(-) Subtract</option>
                </select>
                <input  type="number" 
                        className='input1' 
                        name='server-name' 
                        id='server-name' 
                        min={0}
                        defaultValue={amount}
                        value={amount}
                        onChange={(e)=>setAmount(e.target.value)}
                        required
                />
            </div>  
            <div className="cta">
                <button onClick={()=>{onClose()}}>Cancel</button>
                <button
                    onClick={async() => {
                        onClose();
                        await editClientSold(customer, amount, isAdd);                        
                    }}
                >
                    Confirm
                </button>
            </div>     
        </div>
    )
}

export default EditUserSold