import React, { useEffect } from 'react'
import { useState } from 'react'
import { useAuthContext } from '../../hooks/useAuthContext'
import { toast } from 'react-toastify';

// components 
import TableSkeleton from '../TableSkeleton'
import EmptyFetchRes from '../EmptyFetchRes';
import Pagination from '../Pagination';
import formatDate from '../../services/formatDate';


function SoldHistoryTable({userId ,exFetching}) {
    const [isFetching, setIsFetching] = useState(false)
    const [historyData, setHistoryData] = useState([]); 
    const [actionType, setActionType] = useState(''); 
    const [isPaid, setIsPaid] = useState(2); 
    const [page, setPage] =useState(1);
    const [pageSize, setPageSize] =useState(7);
    const [totalPg, setTotalPg] = useState();
    const [historyCount, setHistoryCount] = useState();

    const {user} = useAuthContext()

    const updateState = async(logId, paid, index)=>{
        
        const data = JSON.stringify({paid});

        try{
            const toastId = toast.loading(`Updating State`);
            const res = await fetch(`/api/sold-history/state/${logId}`,{
                method:"PUT",
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${JSON.parse(user).token}`
                },
                body: data
            })
            const response = await res.json();
            if(res.ok){
                const updatedState = [...historyData];
                updatedState[index]={...historyData[index], paid}
                setHistoryData(updatedState);
                toast.update(toastId, {render: "State Updated Succefully", type: "success", isLoading: false, autoClose:4000});
            }
            else{
                toast.update(toastId, {render: `${response.message}`, type: "error", isLoading: false, autoClose:4000}); 
            }
            setIsFetching(false)
        }catch(err){
            console.log(err);
        }
    }

    const getSoldHistory = async()=>{
        try{
            setIsFetching(true)
            const res = await fetch(`/api/sold-history?page=${page}&pageSize=${pageSize}&userId=${userId}&paid=${isPaid}&type=${actionType}`,{
                headers: {
                    Authorization: `Bearer ${JSON.parse(user).token}`,
                },
            })
            const response = await res.json();
            if(res.ok){
              const {logs, totalPages , totalLogs} = response;
              setHistoryData(logs);
              setTotalPg(totalPages);
              setHistoryCount(totalLogs);
            }
            else{
              toast.error(`${response.message}`)
            }
            setIsFetching(false)
        }catch(err){
            console.log(err);
        } 
    }


    useEffect(()=>{
        if (exFetching===true) {
            getSoldHistory()
        }
        
    },[page, actionType, exFetching, isPaid])

    useEffect(() => {
        setPage(1);
    }, [actionType, exFetching, isPaid]);

    return (
        <div className="table-wrapper1">
            <div className="table1-filter">
                <div className="right-side">
                    <form className="select-filter" onSubmit={(e)=>{e.preventDefault()}}>
                        <select name="" id="" value={actionType} onChange={(e)=>setActionType(e.target.value)}>
                            <option value="">--type--</option>
                            <option value="add">Addition</option> 
                            <option value="subtract">Substraction</option>
                        </select>
                        <select name="" id="" value={isPaid} onChange={(e)=>setIsPaid(e.target.value)}>
                            <option value={2}>--state--</option>
                            <option value={true}>paid</option> 
                            <option value={false}>unpaid</option>
                        </select>
                    </form>
                </div>
            </div>
            <table className='table1'>
                <thead>
                    <tr>
                        <th> <p>content</p></th>
                        <th> <p>type</p></th>
                        <th> <p>amount</p></th>
                        <th> <p>state</p></th>
                        <th> <p>time</p></th>
                        <th> <p>change state</p></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        isFetching ?
                        <TableSkeleton lines={3} columns={6} />
                        :
                        (historyData && historyData.length > 0) ?
                            historyData.map((action, index)=>{
                            return(
                                <tr key={index}>
                                    <td data-cell="content">
                                        {action.type === 'add' ? `Added ${action.amount} Dhs To Client Sold` : null}
                                        {action.type === 'subtract' ? `Subtracted ${action.amount} Dhs From Client Sold` : null}
                                    </td>
                                    <td data-cell="type">
                                        {action.type === 'add' ? <div className="box-intable412" style={{backgroundColor:'#21c45d56'}}><p>+</p> <p>Addition</p> </div> : null}
                                        {action.type === 'subtract' ?  <div className="box-intable412" style={{backgroundColor:'#dc262656'}}><p>-</p> <p>Subtraction</p> </div> : null}
                                    </td>
                                    <td data-cell="amount">{action.amount} </td>
                                    <td data-cell="state">
                                        {
                                            action.paid ? 
                                            <div className="box-intable412" style={{backgroundColor:'#21c45d56'}}><p>paid</p> </div>
                                            :
                                            <div className="box-intable412" style={{backgroundColor:'#cacaca56'}}><p>unpaid</p> </div>
                                        }
                                    </td>
                                    <td data-cell="time">{formatDate(action.createdAt)}</td>
                                    <td data-cell="change state">
                                        <label htmlFor={`action-ispaid${index}`}  className={`checkbox-label ${action.paid ? 'on':'off'}`}>
                                            <div>
                                                <span></span>
                                            </div>
                                        </label>
                                        <input  type="checkbox" 
                                                className='input1 input-checkbox' 
                                                name={`action-ispaid${index}`}  
                                                id={`action-ispaid${index}`}  
                                                checked={action.paid}
                                                onChange={()=>{updateState(action._id, !action.paid, index)}} />
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
                            {(historyData.length <= 0 )?
                                <EmptyFetchRes text='No Sold History Found' />
                            : (totalPg > 1) ? <Pagination totalPages={totalPg} setPage={setPage} page={page} /> : null }
                            </div>
                        </td>
                    </tr>
                </tfoot> : null}
            </table>
        </div>
    )
}

export default SoldHistoryTable