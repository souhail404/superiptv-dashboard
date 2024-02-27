import React, { useEffect } from 'react'
import { useState } from 'react'
import { useAuthContext } from '../../hooks/useAuthContext'
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import { useDebounce } from 'use-debounce'
import { confirmAlert } from 'react-confirm-alert'

// components 
import TableSkeleton from '../TableSkeleton'
import EmptyFetchRes from '../EmptyFetchRes';
import Pagination from '../Pagination';
// icons
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';


function ServersTable() {
    const [isFetching, setIsFetching] = useState(false)
    const [linksData, setLinksData] = useState([]); 
    const [search, setSearch] =useState('');
    const [category, setCategory] =useState('');
    const [page, setPage] =useState(1);
    const [pageSize, setPageSize] =useState(7);
    const [totalPg, setTotalPg] = useState();
    const [linksCount, setLinksCount] = useState();

    const {user} = useAuthContext()
    const navigate = useNavigate()
    const [serachValue]=useDebounce(search, 500) 

    const deleteLink = async(link, index)=>{
        const myheaders = new Headers();

        myheaders.append('Content-Type', 'application/json');
        myheaders.append('Authorization', `Bearer ${JSON.parse(user).token}`);
    
        const linkId = link._id;
        console.log(linkId);
    
        const toastId = toast.loading(`Deleting Link : (${link.name})`);
        try {
            const res = await fetch(`/api/link/${linkId}`, {
                method:"DELETE",
                headers:myheaders,
            })
            const response = await res.json();
            if(res.ok){
                const updatedState = [...linksData];
                updatedState.splice(index, 1)
                setLinksData(updatedState);
                toast.update(toastId, {render: "Link deleted Succefully", type: "success", isLoading: false, autoClose:4000});
            }
            else{
                toast.update(toastId, {render: `${response.message}`, type: "error", isLoading: false, autoClose:4000});        
            }
            return res
        } catch (error) {
          console.log(error);
        }
    }

    const handleDeleteClick = async(link, index)=>{
        confirmAlert(
          {
            title: 'Delete Link',
            message: `Are you sure you wanna delete this link : (${link.name})`,
            buttons: [
              {
                label: 'Confirm',
                onClick: async() => 
                {
                    await deleteLink(link , index)
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

    const getLinks = async()=>{
        try{
            setIsFetching(true)

            setPage(1)
            const res = await fetch(`/api/link?page=${page}&pageSize=${pageSize}&search=${search}&category=${category}`,{
                headers: {
                    Authorization: `Bearer ${JSON.parse(user).token}`,
                },
            })
            const response = await res.json();
            if(res.ok){
              const {links, totalPages , totalLinks} = response;
              setLinksData(links);
              setTotalPg(totalPages);
              setLinksCount(totalLinks);
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
        getLinks()
    },[page, serachValue, category])

    return (
        <div className="table-wrapper1">
            <div className="table1-filter">
                <div className="right-side">
                    <form className="search-filter" onSubmit={(e)=>{e.preventDefault()}}>
                        <input className='search-field' type="text" placeholder='Search By Name' onChange={(e)=>setSearch(e.target.value)}/>
                        <button type="submit" className='search-btn btn'>
                            <SearchIcon />
                        </button>
                    </form>
                    <form className="select-filter" onSubmit={(e)=>{e.preventDefault()}}>
                        <select name="" id="" value={category} onChange={(e)=>setCategory(e.target.value)}>
                            <option value="">--category--</option>
                            <option value={'playlist'}>playlist</option>
                            <option value={'application'}>application</option>
                            <option value={'panel'}>panel</option>
                        </select>
                    </form>
                    <button type='button' className="link-button" onClick={()=>navigate('./add')}>
                        <AddIcon className='icon' />
                        <p>Link</p>  
                    </button>
                </div>
            </div>
            <table className='table1'>
                <thead>
                    <tr>
                        <th> <p>#</p> </th>
                        <th> <p>name</p></th>
                        <th> <p>category</p></th>
                        <th> <p>link</p></th>
                        <th> <p>Actions</p> </th>
                    </tr>
                </thead>
                <tbody>
                    {
                        isFetching ?
                        <TableSkeleton lines={3} columns={5} />
                        :
                        (linksData && linksData.length > 0) ?
                            linksData.map((link, index)=>{
                            return(
                                <tr key={index}>
                                    <td data-cell="image" className='no-phone'> {link.image.url? <img className='table-thmbnail' src={link.image.url? `${link.image.url}`:''} alt="" />:null} </td>
                                    <td data-cell="name">{`${link.name}`} </td>
                                    <td data-cell="category">{link.category} </td>
                                    <td data-cell="link">
                                        <Link to={link.link} target='_blank' className='in-table-link'> <p className="p">{link.link}</p> </Link> 
                                    </td>
                                    <td data-cell="actions" className='actions-column'>
                                        <div className="actions-cell">
                                        <button className='action btn-round' type="button" onClick={()=>navigate(`./${link._id}/edit`)} >
                                            <ModeEditOutlineOutlinedIcon className='icon' />
                                        </button>
                                        <button className='action btn-round' type="button" onClick={()=>{handleDeleteClick(link, index)}} >
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
                        <td colSpan={5}>
                            <div className={(totalPg > 1) ? "table1-footer":""}>
                            {(linksData.length <= 0 )?
                                <EmptyFetchRes text='No Link Found' />
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