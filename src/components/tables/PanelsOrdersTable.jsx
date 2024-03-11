import React, { useEffect, useState } from 'react'
import EmptyFetchRes from '../EmptyFetchRes'
import { useAuthContext } from '../../hooks/useAuthContext';
import { toast } from 'react-toastify';
import TableSkeleton from '../TableSkeleton';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import formatDate from '../../services/formatDate';
import Pagination from '../Pagination';
import Select from 'react-select';
import { confirmAlert } from 'react-confirm-alert';
import ViewPanelOrderDetailsAlert from '../ViewPanelOrderDetailsAlert';


const OrderStateSelect  = ({c})=>{
    const [orderState , setOrderState] = useState(c.state || 'processing');
    const [bgColor , setBgColor] = useState();
    const {user} = useAuthContext()

    const changeOrderState = async(value)=>{ 
        const data = JSON.stringify({state:value})
        try{
            const res = await fetch(`/api/order-panel/state/${c._id}`,{
                method:'PUT',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${JSON.parse(user).token}`
                },
                body:data
            })
            const response = await res.json();
            if(res.ok){
              setOrderState(value)
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
        if(orderState==='processing'){
            setBgColor('#ffd50066')
        }
        else if(orderState==='payed'){
            setBgColor('#00ff4866')
        }
        else if(orderState==='canceled'){
            setBgColor('#ff000066')
        }
    },[orderState])

    return (
        <div className="select-wrapper">
          <select style={{backgroundColor:bgColor}} value={orderState} onChange={(e)=>changeOrderState(e.target.value)}>
            <option value="processing">processing</option>
            <option value="payed">payed</option>
            <option value="canceled">canceled</option>
          </select>  
        </div>
        
    )
}

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


const PanelsOrdersTable = ({productId, userId, exFetching, heading, userFilter, productFilter}) => {
    const [ordersdata, setOrdersData] = useState();
    const [isFetching, setIsFetching] = useState(false)
    const [filterUser, setFilterUser] = useState(userId)
    const [filterProduct, setFilterProduct] = useState(productId)
    const [stateFilter, setStateFilter] = useState('')
    const [page, setPage] =useState(1);
    const [pageSize, setPageSize] =useState(9);
    const [totalPg, setTotalPg] = useState();
    const [ordersCount, setOrdersCount] = useState();

    
    const {user} = useAuthContext()


    const getOrders = async()=>{
        try{    
            setIsFetching(true)
            const res = await fetch(`/api/order-panel?page=${page}&pageSize=${pageSize}&productId=${filterProduct}&userId=${filterUser}&state=${stateFilter}`,{
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

    const handleViewDetailsClick = async(order, index)=>{   
        confirmAlert({
            customUI: ({ onClose }) => {
              return (
                <ViewPanelOrderDetailsAlert 
                    onClose={onClose} 
                    order={order} 
                    index={index}
                    user={user}
                    />
              );
            }
        });
       
    };


    useEffect(()=>{
        if (exFetching===true) {
            getOrders()
        }
    },[page, filterProduct, filterUser, exFetching, stateFilter])

    useEffect(() => {
        setPage(1);
    }, [filterProduct, filterUser, exFetching, stateFilter]);
    
    return (
        <div className="product-orders-container">
            <div className="table-wrapper1">
                <div className='table1-filter'>
                    <h3 className='heading'>{heading ? heading : 'orders'} {isFetching ? '' :`(${ordersCount})`}</h3>
                    <div className="right-side">
                        <form className="select-filter" onSubmit={(e)=>{e.preventDefault()}}>
                            {userFilter ? <FilterByUser placeholder={'Filter by user'} setFilterUser={setFilterUser}  /> : null}
                            {productFilter ? <FilterByProduct type='panel' placeholder={'Filter by panel'} setFilterUser={setFilterProduct}/> : null}
                            <select name="" id="" value={stateFilter} onChange={(e)=>setStateFilter(e.target.value)}>
                                <option value="">Filter By State</option>
                                <option value="processing">processing</option>
                                <option value="payed">payed</option>
                                <option value="canceled">canceled</option>
                            </select>
                        </form>
                    </div>
                </div>
                <table className='table1'>
                <thead>
                    <tr>
                        <th> <p>user</p></th>
                        <th> <p>panel</p></th>
                        <th> <p>price</p></th>
                        <th> <p>panel username</p></th>
                        <th> <p>time</p></th>
                        <th> <p>state</p></th>
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
                                    <td data-cell="panel">{`${c.itemName}`}</td>
                                    <td data-cell="price">{`${c.itemPrice}`} </td>
                                    <td data-cell="panel username"> {`${c.panelUserName}`} </td>
                                    <td data-cell="time">{`${formatDate(c.createdAt)}`} </td>
                                    <td data-cell="state" value={c.state}>
                                        <OrderStateSelect c={c} /> 
                                    </td>
                                    <td data-cell="actions" className='actions-column'>
                                        <div className="actions-cell">
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

export default PanelsOrdersTable