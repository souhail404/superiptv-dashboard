import React, { useEffect, useState } from 'react'
import EmptyFetchRes from '../EmptyFetchRes'
import { useAuthContext } from '../../hooks/useAuthContext';
import { toast } from 'react-toastify';
import TableSkeleton from '../TableSkeleton';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import CopyText from '../CopyText';
import formatDate from '../../services/formatDate';
import Pagination from '../Pagination';


const ProductOrdersTable = ({product, productId, userId, exFetching, heading}) => {
    const [ordersdata, setOrdersData] = useState();
    const [isFetching, setIsFetching] = useState(false)
    const [page, setPage] =useState(1);
    const [pageSize, setPageSize] =useState(7);
    const [totalPg, setTotalPg] = useState();
    const [ordersCount, setOrdersCount] = useState();

    
    const {user} = useAuthContext()

    const getOrders = async()=>{
        try{
            setIsFetching(true)
            const res = await fetch(`/api/order-${product}?page=${page}&pageSize=${pageSize}&productId=${productId?productId:''}&userId=${userId?userId:''}`,{
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

    const makeOrderSeen = async(c)=>{
        try{
            const res = await fetch(`/api/order-${product}/seen/${c._id}`,{
                method:'PUT',
                headers: {
                    Authorization: `Bearer ${JSON.parse(user).token}`,
                },
            })
            const response = await res.json();
            if(res.ok){
              
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
        if (exFetching===true) {
            getOrders()
        }
    },[page, product, productId, userId, exFetching])

    useEffect(() => {
        setPage(1);
    }, [product, productId, userId, exFetching]);

    return (
        <div className="product-orders-container">
            <div className="table-wrapper1">
                <div className='table1-filter'>
                <h3 className='heading'>{heading ? heading : 'orders'} {isFetching ? '' :`(${ordersCount})`}</h3>
                </div>
                <table className='table1'>
                <thead>
                    <tr>
                        <th> <p>user</p></th>
                        <th> <p>price</p></th>
                        <th> <p>{product==='panel' ? 'panel username': 'code'}</p></th>
                        <th> <p>time</p></th>
                        <th> <p></p> </th>
                    </tr>
                </thead>
                <tbody>
                    {
                        isFetching ?
                        <TableSkeleton lines={3} columns={5} />
                        :
                        (ordersdata && ordersdata?.length > 0) ?
                            ordersdata?.map((c, index)=>{
                            return(
                                <tr key={index}>
                                    <td data-cell="user">{`${c.userName}`} </td>
                                    <td data-cell="price">{`${c.itemPrice}`} </td>
                                    {product==='panel' ? 
                                        <td data-cell="panel username"> {`${c.panelUserName}`} </td>
                                        :  
                                        <td data-cell="code"> <CopyText text={c.code} content={c.code} maxWidth={`22ch`} /> </td>
                                    }
                                    <td data-cell="time">{`${formatDate(c.createdAt)}`} </td>
                                    <td data-cell="actions" className='actions-column'>
                                        <div className="actions-cell">
                                        <button className='action btn-round' type="button" onClick={()=>makeOrderSeen(c)} >
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
                        <td colSpan={5}>
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

export default ProductOrdersTable