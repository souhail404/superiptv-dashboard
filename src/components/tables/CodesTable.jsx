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
    const [codesData, setCodesData] = useState([]); 
    const [search, setSearch] =useState('');
    const [page, setPage] =useState(1);
    const [pageSize, setPageSize] =useState(7);
    const [totalPg, setTotalPg] = useState();
    const [codesCount, setCodesCount] = useState();

    const {user} = useAuthContext()
    const navigate = useNavigate()
    const [serachValue]=useDebounce(search, 500) 

    const deleteCode = async(code, index)=>{
        const myheaders = new Headers();

        myheaders.append('Content-Type', 'application/json');
        myheaders.append('Authorization', `Bearer ${JSON.parse(user).token}`);
    
        const codeId = code._id;
    
        const toastId = toast.loading(`Deleting Code : (${code.title})`);
        try {
            const res = await fetch(`/api/code/${codeId}`, {
                method:"DELETE",
                headers:myheaders,
            })
            const response = await res.json();
            if(res.ok){
                const updatedState = [...codesData];
                updatedState.splice(index, 1)
                setCodesData(updatedState);
                toast.update(toastId, {render: "Code deleted Succefully", type: "success", isLoading: false, autoClose:4000});
            }
            else{
                toast.update(toastId, {render: `${response.message}`, type: "error", isLoading: false, autoClose:4000});        
            }
            return res
        } catch (error) {
          console.log(error);
        }
    }

    const handleDeleteClick = async(code, index)=>{
        confirmAlert(
          {
            title: 'Delete Code',
            message: `Are you sure you wanna delete this Code : (${code.title})`,
            buttons: [
              {
                label: 'Confirm',
                onClick: async() => 
                {
                    await deleteCode(code , index)
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

    const getCodes = async()=>{
        try{
            setIsFetching(true)
            setPage(1)
            const res = await fetch(`/api/code?page=${page}&pageSize=${pageSize}&search=${search}`,{
                headers: {
                    Authorization: `Bearer ${JSON.parse(user).token}`,
                },
            })
            const response = await res.json();
            if(res.ok){
              const {products, totalPages , totalProducts} = response;
              setCodesData(products);
              setTotalPg(totalPages);
              setCodesCount(totalProducts);
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


    useEffect(()=>{
        getCodes()
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
                        <p>Code</p>  
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
                        (codesData && codesData.length > 0) ?
                            codesData.map((code, index)=>{
                            return(
                                <tr key={index}>
                                    <td data-cell="image" className='no-phone'> {code.image.url? <img className='table-thmbnail' src={code.image.url? `${code.image.url}`:''} alt="" />:null} </td>
                                    <td data-cell="title">{`${code.title}`} </td>
                                    <td data-cell="price">{code.price} </td>
                                    <td data-cell="period">{code.specialPrice} </td>
                                    <td data-cell="orders">{code.orders?.length} </td>
                                    <td data-cell="codes">{code.codes?.length} </td>
                                    <td data-cell="actions" className='actions-column'>
                                        <div className="actions-cell">
                                        <button className='action btn-round' type="button" onClick={()=>navigate(`./${code._id}/details`)} >
                                            <RemoveRedEyeOutlinedIcon className='icon' />
                                        </button>
                                        <button className='action btn-round' type="button" onClick={()=>navigate(`./${code._id}/edit`)} >
                                            <ModeEditOutlineOutlinedIcon className='icon' />
                                        </button>
                                        <button className='action btn-round' type="button" onClick={()=>{handleDeleteClick(code, index)}} >
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
                            {(codesData.length <= 0 )?
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