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


function PanelsTable() {
    const [isFetching, setIsFetching] = useState(false)
    const [panelsData, setPanelsData] = useState([]); 
    const [search, setSearch] =useState('');
    const [page, setPage] =useState(1);
    const [pageSize, setPageSize] =useState(9);
    const [totalPg, setTotalPg] = useState();
    const [panelsCount, setPanelsCount] = useState();

    const {user} = useAuthContext()
    const navigate = useNavigate()
    const [searchValue]=useDebounce(search, 500) 

    const deletePanel = async(panel, index)=>{
        const myheaders = new Headers();

        myheaders.append('Content-Type', 'application/json');
        myheaders.append('Authorization', `Bearer ${JSON.parse(user).token}`);
    
        const panelId = panel._id;
    
        const toastId = toast.loading(`Deleting panel : (${panel.title})`);
        try {
            const res = await fetch(`/api/panel/${panelId}`, {
                method:"DELETE",
                headers:myheaders,
            })
            const response = await res.json();
            if(res.ok){
                const updatedState = [...panelsData];
                updatedState.splice(index, 1)
                setPanelsData(updatedState);
                toast.update(toastId, {render: "Panel deleted Succefully", type: "success", isLoading: false, autoClose:4000});
            }
            else{
                toast.update(toastId, {render: `${response.message}`, type: "error", isLoading: false, autoClose:4000});        
            }
            return res
        } catch (error) {
          console.log(error);
        }
    }

    const handleDeleteClick = async(panel, index)=>{
        confirmAlert(
          {
            title: 'Delete panel',
            message: `Are you sure you wanna delete this panel : (${panel.title})`,
            buttons: [
              {
                label: 'Confirm',
                onClick: async() => 
                {
                    await deletePanel(panel , index)
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

    const getPanels = async()=>{
        try{
            setIsFetching(true)
            const res = await fetch(`/api/panel?page=${page}&pageSize=${pageSize}&search=${search}`,{
                headers: {
                    Authorization: `Bearer ${JSON.parse(user).token}`,
                },
            })
            const response = await res.json();
            if(res.ok){
              const {products, totalPages , totalProducts} = response;
              setPanelsData(products);
              setTotalPg(totalPages);
              setPanelsCount(totalProducts);
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
        getPanels()
    },[page, searchValue])

    useEffect(() => {
        setPage(1);
    }, [searchValue]);

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
                        <p>panel</p>  
                    </button>
                </div>
            </div>
            <table className='table1'>
                <thead>
                    <tr>
                        <th> <p></p> </th>
                        <th> <p>title</p></th>
                        <th> <p>normal price</p></th>
                        <th> <p>special price</p></th>
                        <th> <p>codes quantity</p></th>
                        <th> <p>orders</p></th>
                        <th> <p>Actions</p> </th>
                    </tr>
                </thead>
                <tbody>
                    {
                        isFetching ?
                        <TableSkeleton lines={3} columns={7} />
                        :
                        (panelsData && panelsData.length > 0) ?
                            panelsData.map((panel, index)=>{
                            return(
                                <tr key={index}>
                                    <td data-cell="image" className='no-phone'> {panel.image.url? <img className='table-thmbnail' src={panel.image.url? `${panel.image.url}`:''} alt="" />:null} </td>
                                    <td data-cell="title">{`${panel.title}`} </td>
                                    <td data-cell="normal price">{panel.price} </td>
                                    <td data-cell="special price">{panel.specialPrice} </td>
                                    <td data-cell="codes quantity">{panel.quantity} </td>
                                    <td data-cell="orders">{panel.ordered} </td>
                                    <td data-cell="actions" className='actions-column'>
                                        <div className="actions-cell">
                                        <button className='action btn-round' type="button" onClick={()=>navigate(`./${panel._id}/details`)} >
                                            <RemoveRedEyeOutlinedIcon className='icon' />
                                        </button>
                                        <button className='action btn-round' type="button" onClick={()=>navigate(`./${panel._id}/edit`)} >
                                            <ModeEditOutlineOutlinedIcon className='icon' />
                                        </button>
                                        <button className='action btn-round' type="button" onClick={()=>{handleDeleteClick(panel, index)}} >
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
                            {(panelsData.length <= 0 )?
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

export default PanelsTable