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


function ServersTable() {
    const [isFetching, setIsFetching] = useState(false)
    const [serversData, setServersData] = useState([]); 
    const [search, setSearch] =useState('');
    const [page, setPage] =useState(1);
    const [pageSize, setPageSize] =useState(7);
    const [totalPg, setTotalPg] = useState();
    const [serversCount, setServersCount] = useState();

    const {user} = useAuthContext()
    const navigate = useNavigate()
    const [serachValue]=useDebounce(search, 500) 

    const deleteServer = async(server, index)=>{
        const myheaders = new Headers();

        myheaders.append('Content-Type', 'application/json');
        myheaders.append('Authorization', `Bearer ${JSON.parse(user).token}`);
    
        const serverId = server._id;
    
        const toastId = toast.loading(`Deleting Server : (${server.title})`);
        try {
            const res = await fetch(`/api/server/${serverId}`, {
                method:"DELETE",
                headers:myheaders,
            })
            const response = await res.json();
            if(res.ok){
                const updatedState = [...serversData];
                updatedState.splice(index, 1)
                setServersData(updatedState);
                toast.update(toastId, {render: "Server deleted Succefully", type: "success", isLoading: false, autoClose:4000});
            }
            else{
                toast.update(toastId, {render: `${response.message}`, type: "error", isLoading: false, autoClose:4000});        
            }
            return res
        } catch (error) {
          console.log(error);
        }
    }

    const handleDeleteClick = async(server, index)=>{
        confirmAlert(
          {
            title: 'Delete Server',
            message: `Are you sure you wanna delete this Server : (${server.title})`,
            buttons: [
              {
                label: 'Confirm',
                onClick: async() => 
                {
                    await deleteServer(server , index)
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

    const getServers = async()=>{
        try{
            setIsFetching(true)
            setPage(1)
            const res = await fetch(`/api/server?page=${page}&pageSize=${pageSize}&search=${search}`,{
                headers: {
                    Authorization: `Bearer ${JSON.parse(user).token}`,
                },
            })
            const response = await res.json();
            if(res.ok){
              const {products, totalPages , totalProducts} = response;
              setServersData(products);
              setTotalPg(totalPages);
              setServersCount(totalProducts);
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
        getServers()
    },[page, serachValue])

    return (
        <div className="table-wrapper1">
            <div className="table1-filter">
                <div className="right-side">
                    <form className="search-filter" onSubmit={(e)=>{e.preventDefault()}}>
                        <input className='search-field' type="text" placeholder='Search By Title' onChange={(e)=>setSearch(e.target.value)}/>
                        <button type="submit" className='search-btn btn'>
                            <SearchIcon />
                        </button>
                    </form>
                    <button type='button' className="link-button" onClick={()=>navigate('./add')}>
                        <AddIcon className='icon' />
                        <p>Server</p>  
                    </button>
                </div>
            </div>
            <table className='table1'>
                <thead>
                    <tr>
                        <th> <p></p> </th>
                        <th> <p>title</p></th>
                        <th> <p>price</p></th>
                        <th> <p>period</p></th>
                        <th> <p>orders</p></th>
                        <th> <p>Available codes</p> </th>
                        <th> <p>Actions</p> </th>
                    </tr>
                </thead>
                <tbody>
                    {
                        isFetching ?
                        <TableSkeleton lines={3} columns={7} />
                        :
                        (serversData && serversData.length > 0) ?
                            serversData.map((server, index)=>{
                            return(
                                <tr key={index}>
                                    <td data-cell="image" className='no-phone'> {server.image.url? <img className='table-thmbnail' src={server.image.url? `${server.image.url}`:''} alt="" />:null} </td>
                                    <td data-cell="title">{`${server.title}`} </td>
                                    <td data-cell="price">{server.price} </td>
                                    <td data-cell="period">{server.period} </td>
                                    <td data-cell="orders">{server.orders?.length} </td>
                                    <td data-cell="codes">{server.codes?.length} </td>
                                    <td data-cell="actions" className='actions-column'>
                                        <div className="actions-cell">
                                        <button className='action btn-round' type="button" onClick={()=>navigate(`./${server._id}/details`)} >
                                            <RemoveRedEyeOutlinedIcon className='icon' />
                                        </button>
                                        <button className='action btn-round' type="button" onClick={()=>navigate(`./${server._id}/edit`)} >
                                            <ModeEditOutlineOutlinedIcon className='icon' />
                                        </button>
                                        <button className='action btn-round' type="button" onClick={()=>{handleDeleteClick(server, index)}} >
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
                        <td colSpan={7}>
                            <div className={(totalPg > 1) ? "table1-footer":""}>
                            {(serversData.length <= 0 )?
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

export default ServersTable