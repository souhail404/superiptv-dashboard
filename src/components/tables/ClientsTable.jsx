import React, { useEffect } from 'react'
import { useState } from 'react'
import { useAuthContext } from '../../hooks/useAuthContext'
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from 'use-debounce'
import { confirmAlert } from 'react-confirm-alert'

// components 
import TableSkeleton from '../TableSkeleton'
import EmptyFetchRes from '../EmptyFetchRes';
import Pagination from '../Pagination';
// icons
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import EditUserSold from '../EditUserSold';

// css
// import 'react-confirm-alert/src/react-confirm-alert.css';

function ClientsTable() {
    const [isFetching, setIsFetching] = useState(false)
    const [customersData, setCustomersData] = useState([]); 
    const [search, setSearch] =useState('');
    const [page, setPage] =useState(1);
    const [pageSize, setPageSize] =useState(9);
    const [totalPg, setTotalPg] = useState();
    const [customersCount, setCustomersCount] = useState();

    const {user} = useAuthContext()
    const navigate = useNavigate()
    const [searchValue]=useDebounce(search, 500) 

    const deleteCustomer = async(customer, index)=>{
        const myheaders = new Headers();

        myheaders.append('Content-Type', 'application/json');
        myheaders.append('Authorization', `Bearer ${JSON.parse(user).token}`);
    
        const customerId = customer._id;
    
        const toastId = toast.loading(`Deleting Client : (${customer.userName})`);
        try {
            const res = await fetch(`/api/user/${customerId}`, {
                method:"DELETE",
                headers:myheaders,
            })
            const response = await res.json();
            if(res.ok){
                const updatedState = [...customersData];
                updatedState.splice(index, 1)
                setCustomersData(updatedState);
                toast.update(toastId, {render: "Client deleted Succefully", type: "success", isLoading: false, autoClose:4000});
            }
            else{
                toast.update(toastId, {render: `${response.message}`, type: "error", isLoading: false, autoClose:4000});        
            }
            return res
        } catch (error) {
          console.log(error);
        }
    }

    const handleDeleteClick = async(customer, index)=>{
        confirmAlert(
          {
            title: 'Delete Client',
            message: `Are you sure you wanna delete this Client (${customer.userName})`,
            buttons: [
              {
                label: 'Confirm',
                onClick: async() => 
                {
                    await deleteCustomer(customer , index)
                }
              },
              {
                label: 'Cancel',
                onClick: () => {return}
              }
            ]
          }
        )
    };

    const handleEditSoldClick = async(customer, index)=>{   
        confirmAlert({
            customUI: ({ onClose }) => {
              return (
                <EditUserSold 
                    onClose={onClose} 
                    customer={customer} 
                    user={user} 
                    index={index}
                    customersData={customersData}
                    setCustomersData={setCustomersData}/>
              );
            }
        });
       
    };


    const getCustomers = async()=>{
        try{
            setIsFetching(true)
            const res = await fetch(`/api/user?page=${page}&pageSize=${pageSize}&search=${search}&type=client`,{
                headers: {
                    Authorization: `Bearer ${JSON.parse(user).token}`,
                },
            })
            const response = await res.json();
            if(res.ok){
              const {users, totalPages , totalUsers} = response;
              setCustomersData(users);
              setTotalPg(totalPages);
              setCustomersCount(totalUsers);
            }
            else{
              toast.error(`${response.message}`)
            }
            setIsFetching(false)
        }catch(err){
            console.log(err);
        } 
    }

    const updateCustomer = async(customerId, userName, isActive, isLoyal, index)=>{
        
        const data = JSON.stringify({userName, isActive, isLoyal});

        try{
            const toastId = toast.loading(`Updating Client : (${userName})`);
            const res = await fetch(`/api/user/update/${customerId}`,{
                method:"PUT",
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${JSON.parse(user).token}`
                },
                body: data
            })
            const response = await res.json();
            if(res.ok){
                const updatedState = [...customersData];
                updatedState[index]={...customersData[index], isActive, isLoyal}
                console.log(updatedState[index]);
                setCustomersData(updatedState);
                toast.update(toastId, {render: "Client Updated Succefully", type: "success", isLoading: false, autoClose:4000});
            }
            else{
                toast.update(toastId, {render: `${response.message}`, type: "error", isLoading: false, autoClose:4000}); 
            }
            setIsFetching(false)
        }catch(err){
            console.log(err);
        }
    }

    useEffect(()=>{
        getCustomers()
    },[page, searchValue])

    useEffect(() => {
        setPage(1);
    }, [searchValue]);

    return (
        <div className="table-wrapper1">
            <div className="table1-filter">
                <div className="right-side">
                    <form className="search-filter" onSubmit={(e)=>{e.preventDefault()}}>
                        <input className='search-field' type="text" placeholder='Search By Username' onChange={(e)=>setSearch(e.target.value)}/>
                        <button type="submit" className='search-btn btn'>
                            <SearchIcon />
                        </button>
                    </form>
                    <button type='button' className="link-button" onClick={()=>navigate('./add')}>
                        <AddIcon className='icon' />
                        <p>Client</p>  
                    </button>
                </div>
            </div>
            <table className='table1'>
                <thead>
                    <tr>
                        <th> <p>username</p> </th>
                        <th> <p>sold</p></th>
                        <th> <p>orders</p></th>
                        <th> <p>Active</p></th>
                        <th> <p>Loyal</p></th>
                        <th> <p>actions</p> </th>
                    </tr>
                </thead>
                <tbody>
                    {
                        isFetching ?
                        <TableSkeleton lines={3} columns={6} />
                        :
                        (customersData && customersData.length > 0) ?
                            customersData.map((customer, index)=>{
                            return(
                                <tr key={index}>
                                    <td data-cell="username">{customer.userName} </td>
                                    <td data-cell="sold">{`${customer.sold}`} </td>
                                    <td data-cell="orders">{customer.ordered} </td>
                                    <td data-cell="active">
                                        <label htmlFor={`client-isactive${index}`}  className={`checkbox-label ${customer.isActive ? 'on':'off'}`}>
                                            <div>
                                                <span></span>
                                            </div>
                                        </label>
                                        <input  type="checkbox" 
                                                className='input1 input-checkbox' 
                                                name={`client-isactive${index}`} 
                                                id={`client-isactive${index}`} 
                                                min={0}
                                                checked={customer.isActive}
                                                onChange={()=>{updateCustomer(customer._id,customer.userName, !customer.isActive, customer.isLoyal, index)}} />
                                    </td>
                                    <td data-cell="loyal">
                                        <label htmlFor={`client-isloyal${index}`}  className={`checkbox-label ${customer.isLoyal ? 'on':'off'}`}>
                                            <div>
                                                <span></span>
                                            </div>
                                        </label>
                                        <input  type="checkbox" 
                                                className='input1 input-checkbox' 
                                                name={`client-isloyal${index}`}  
                                                id={`client-isloyal${index}`}  
                                                min={0}
                                                checked={customer.isLoyal}
                                                onChange={()=>{updateCustomer(customer._id,customer.userName, customer.isActive, !customer.isLoyal, index)}} />
                                    </td>
                                    <td data-cell="actions" className='actions-column'>
                                        <div className="actions-cell">
                                        <button className='action btn-round' type="button" onClick={()=>navigate(`./${customer._id}/details`)} >
                                            <RemoveRedEyeOutlinedIcon className='icon' />
                                        </button>
                                        <button className='action btn-round' type="button" onClick={()=>navigate(`./${customer._id}/edit`)} >
                                            <ModeEditOutlineOutlinedIcon className='icon' />
                                        </button>
                                        <button className='action btn-round' type="button" onClick={()=>{handleEditSoldClick(customer, index)}} >
                                            <AttachMoneyOutlinedIcon className='icon' />
                                        </button>
                                        <button className='action btn-round' type="button" onClick={()=>{handleDeleteClick(customer, index)}} >
                                            <DeleteOutlineOutlinedIcon className='icon' />
                                        </button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })
                        :null   
                    }
                </tbody>
                {!isFetching ? <tfoot>
                    <tr>
                        <td colSpan={6}>
                            <div className={(totalPg > 1) ? "table1-footer":""}>
                            {(customersData.length <= 0 )?
                                <EmptyFetchRes text='No Client Found' />
                            : (totalPg > 1) ? <Pagination totalPages={totalPg} setPage={setPage} page={page} /> : null }
                            </div>
                        </td>
                    </tr>
                </tfoot> : null}
            </table>
        </div>
    )
}

export default ClientsTable