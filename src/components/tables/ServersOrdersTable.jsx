import React, { useEffect, useState } from 'react'
import EmptyFetchRes from '../EmptyFetchRes'
import { useAuthContext } from '../../hooks/useAuthContext';
import { toast } from 'react-toastify';
import TableSkeleton from '../TableSkeleton';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import formatDate from '../../services/formatDate';
import Pagination from '../Pagination';
import Select from 'react-select';
import { useDebounce } from 'use-debounce';
import SearchIcon from '@mui/icons-material/Search';
import CopyText from '../CopyText';
import { confirmAlert } from 'react-confirm-alert';
import ViewOrderDetailsAlert from '../ViewOrderDetailsAlert';
import DataObjectIcon from '@mui/icons-material/DataObject';
import EditOrderCodeAlert from '../EditOrderCodeAlert';


const FilterByUser  = ({setFilterUser, placeholder})=>{ 
    const [isFetching, setIsFetching] = useState(false);
    const [users , setUsers] = useState();
    const [options, setOptions] = useState([]);
    const {user} = useAuthContext()

    const getUsers = async()=>{
        try{
            setIsFetching(true)
            const res = await fetch(`/api/user?type=client`,{
                headers: {
                    Authorization: `Bearer ${JSON.parse(user).token}`,
                },
            })
            const response = await res.json();
            if(res.ok){
              const {users} = response;
                setUsers(users);
            }
            else{
              toast.error(`${response.message}`)
            }
            setIsFetching(false)
        }catch(err){
            console.log(err);
            setIsFetching(false)
            toast.error(`Can't get Users`)
        } 
    }

    useEffect(()=>{
        getUsers()
    },[])

    useEffect(()=>{
        if (users) {
            const arr= [{value:'', label:'None'}];
            users.forEach(user => {
                arr.push({ value: user._id, label: user.userName })
            });
            setOptions(arr)
        }
    },[users])

    return (
        <Select
            className="basic-single-select"
            classNamePrefix="select User"
            isLoading={isFetching}
            name="users"
            options={options}
            placeholder={placeholder}
            onChange={(e)=>setFilterUser(e.value)}
        />    
    )
}

const FilterByProduct  = ({type, setFilterUser, placeholder})=>{
    const [isFetching, setIsFetching] = useState(false);
    const [products , setProducts] = useState();
    const [options, setOptions] = useState([]);
    const {user} = useAuthContext()

    const getProducts = async()=>{
        try{
            setIsFetching(true)
            const res = await fetch(`/api/${type}?`,{
                headers: {
                    Authorization: `Bearer ${JSON.parse(user).token}`,
                },
            })
            const response = await res.json();
            if(res.ok){
              const {products} = response;
                setProducts(products);
            }
            else{
              toast.error(`${response.message}`)
            }
            setIsFetching(false)
        }catch(err){
            console.log(err);
            setIsFetching(false)
            toast.error(`Can't get Products`)
        } 
    }

    useEffect(()=>{
        getProducts()
    },[])

    useEffect(()=>{
        if (products) {
            const arr= [{value:'', label:'None'}];
            products.forEach(product => {
                arr.push({ value: product._id, label: product.title })
            });
            setOptions(arr)
        }
    },[products])

    return (
            <Select
                className="basic-single-select"
                classNamePrefix="select Product"
                isLoading={isFetching}
                name="products"
                options={options}
                placeholder={placeholder}
                onChange={(e)=>setFilterUser(e.value)}
            /> 
    )
}


const ServersOrdersTable = ({productId, userId, exFetching, heading, userFilter, productFilter}) => {
    const [ordersdata, setOrdersData] = useState();
    const [isFetching, setIsFetching] = useState(false)
    const [filterUser, setFilterUser] = useState(userId)
    const [filterProduct, setFilterProduct] = useState(productId)
    const [isValid, setIsValid] = useState('')
    const [search, setSearch] =useState('');
    const [page, setPage] =useState(1);
    const [pageSize, setPageSize] =useState(9);
    const [totalPg, setTotalPg] = useState(); 
    const [ordersCount, setOrdersCount] = useState();

    
    const {user} = useAuthContext()
    const [searchValue]=useDebounce(search, 500) 


    const getOrders = async()=>{
        try{    
            setIsFetching(true)
            
            const res = await fetch(`/api/order-server?page=${page}&pageSize=${pageSize}&productId=${filterProduct}&userId=${filterUser}&isValid=${isValid}&search=${search}`,{
                headers: {
                    Authorization: `Bearer ${JSON.parse(user).token}`,
                },
            })
            const response = await res.json();
            if(res.ok){
              const {orders, totalPages , totalOrders} = response;
              setOrdersData(orders);
              setTotalPg(totalPages);
              setOrdersCount(totalOrders);
            }
            else{
              toast.error(`${response.message}`)
            }
            setIsFetching(false)
        }catch(err){
            console.log(err);
            toast.error(`Internal server error`)
            setIsFetching(false)
        } 
    }


    const updateOrderValidation = async(orderId, value, index)=>{
        
        const data = JSON.stringify({isValid:value});

        try{
            const toastId = toast.loading(`Updating Order `);
            const res = await fetch(`/api/order-server/valid/${orderId}`,{
                method:"PUT",
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${JSON.parse(user).token}`
                },
                body: data
            })
            const response = await res.json();
            if(res.ok){
                const updatedState = [...ordersdata];
                updatedState[index]={...ordersdata[index], isValid:value}
                console.log(updatedState[index]);
                setOrdersData(updatedState);
                toast.update(toastId, {render: "Order Updated Succefully", type: "success", isLoading: false, autoClose:4000});
            }
            else{
                toast.update(toastId, {render: `${response.message}`, type: "error", isLoading: false, autoClose:4000}); 
            }
            setIsFetching(false)
        }catch(err){
            console.log(err);
        }
    }

    const handleViewDetailsClick = async(order, index)=>{   
        confirmAlert({
            customUI: ({ onClose }) => {
              return (
                <ViewOrderDetailsAlert 
                    onClose={onClose} 
                    order={order} 
                    index={index}
                    user={user}
                    product='server'
                    />
              );
            }
        });
       
    };

    const handleEditCodeClick = async(order, index)=>{   
        confirmAlert({
            customUI: ({ onClose }) => {
              return (
                <EditOrderCodeAlert 
                    onClose={onClose} 
                    order={order} 
                    index={index}
                    user={user}
                    product='server'
                    setOrdersData={setOrdersData}
                    ordersData={ordersdata}
                    />
              );
            }
        });
       
    };

    useEffect(()=>{
        if (exFetching===true) {
            getOrders()
        }
    },[page, filterProduct, filterUser, exFetching, isValid, searchValue])

    useEffect(() => {
        setPage(1);
    }, [filterProduct, filterUser, isValid, searchValue]);

    return (
        <div className="product-orders-container">
            <div className="table-wrapper1">
                <div className='table1-filter'>
                    <h3 className='heading'>{heading ? heading : 'orders'} {isFetching ? '' :`(${ordersCount})`}</h3>
                    <div className="right-side">
                        <form className="search-filter" onSubmit={(e)=>{e.preventDefault()}}>
                            <input className='search-field' type="text" placeholder='Search By Code' onChange={(e)=>setSearch(e.target.value)}/>
                            <button type="submit" className='search-btn btn'>
                                <SearchIcon />
                            </button>
                        </form>
                        <form className="select-filter" onSubmit={(e)=>{e.preventDefault()}}>
                            {userFilter ? <FilterByUser placeholder={'Filter by user'} setFilterUser={setFilterUser}  /> : null}
                            {productFilter ? <FilterByProduct type='server' placeholder={'Filter by server'} setFilterUser={setFilterProduct}/> : null}
                            <select name="" id="" value={isValid} onChange={(e)=>setIsValid(e.target.value)}>
                                <option value="">Valid State</option>
                                <option value={true}>Valid</option>
                                <option value={false}>Not Valid</option>
                            </select>
                        </form>
                    </div>
                </div>
                <table className='table1'>
                <thead>
                    <tr>
                        <th> <p>user</p></th>
                        <th> <p>server</p></th>
                        <th> <p>price</p></th>
                        <th> <p>code</p></th>
                        <th> <p>time</p></th>
                        <th> <p>valid state</p></th>                        
                        <th> <p></p> </th>
                    </tr>
                </thead>
                <tbody>
                    {
                        isFetching ?
                        <TableSkeleton lines={3} columns={7} />
                        :
                        (ordersdata && ordersdata?.length > 0) ?
                            ordersdata?.map((c, index)=>{
                            return(
                                <tr key={index}>
                                    <td data-cell="user">{`${c.userName}`} </td>
                                    <td data-cell="server">{`${c.itemName}`}</td>
                                    <td data-cell="price">{`${c.itemPrice}`} </td>
                                    <td data-cell="code"><CopyText text={c.code} content={c.code} maxWidth={`22ch`} /> </td>
                                    <td data-cell="time">{`${formatDate(c.createdAt)}`} </td>
                                    <td data-cell="valid state">
                                        <label htmlFor={`server-isvalid${index}`}  className={`checkbox-label ${c.isValid ? 'on':'off'}`}>
                                            <div>
                                                <span></span>
                                            </div>
                                        </label>
                                        <input  type="checkbox" 
                                                className='input1 input-checkbox' 
                                                name={`server-isvalid${index}`}  
                                                id={`server-isvalid${index}`}  
                                                min={0}
                                                checked={c.isValid}
                                                onChange={()=>{updateOrderValidation(c._id, !c.isValid, index)}} />
                                    </td>
                                    <td data-cell="actions" className='actions-column'>
                                        <div className="actions-cell">
                                        <button className='action btn-round' type="button" onClick={()=>handleEditCodeClick(c, index)} >
                                            <DataObjectIcon className='icon' />
                                        </button>
                                        <button className='action btn-round' type="button" onClick={()=>handleViewDetailsClick(c, index)} >
                                            <RemoveRedEyeOutlinedIcon className='icon' />
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
                        <td colSpan={7}>
                            <div className={(totalPg > 1) ? "table1-footer":""}>
                            {(ordersdata?.length <= 0 )?
                                <EmptyFetchRes text='No Order Found' />
                            : (totalPg > 1) ? <Pagination totalPages={totalPg} setPage={setPage} page={page} /> : null } 
                            
                            </div>
                        </td>
                    </tr>
                </tfoot> : null}
                </table>
            </div>
        </div>
    )
}

export default ServersOrdersTable