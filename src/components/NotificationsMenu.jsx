import { Skeleton } from '@mui/material'
import React, { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import formatDateAgo from '../services/formatDateAgo';

import PriorityHighOutlinedIcon from '@mui/icons-material/PriorityHighOutlined';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import { useAuthContext } from '../hooks/useAuthContext';
import { toast } from 'react-toastify';

const NotificationsMenu = ({
        page, 
        setPage, 
        totalPages, 
        open, 
        notificationsData, 
        isFetching, 
        setNotificationsData, 
        handleClose,
        setUnseenNotifsCount,
        unseenNotifsCount
    }) => {

    const ref = useRef();
    const navigate = useNavigate()
    const {user} = useAuthContext()
    
    const handleScroll = async () => {
        const notifWrapper = ref.current;
                
        if (notifWrapper.scrollTop + notifWrapper.clientHeight >= notifWrapper.scrollHeight - 2) {
            if (page < totalPages) {
                setPage(prevPage => prevPage + 1);
                notifWrapper.scrollTop = notifWrapper.scrollTop - 20;
            }
        }
    };


    const handleSeeClick = async(notif , index)=>{
        navigate(notif.link);
        handleClose();
        if(notif.isSeen === false){
            try{
                const res = await fetch(`/api/admin-notification/seen/${notif._id}`,{
                    method:'PUT',
                    headers: {
                        Authorization: `Bearer ${JSON.parse(user).token}`,
                    },
                })
                const response = await res.json();
                if(res.ok){
                    const updatedData = [...notificationsData];
                    updatedData[index].isSeen = true;
                    
                    // setUnseenNotifsCount(unseenNotifsCount - 1)
                    setNotificationsData([...updatedData])
                }
                else{
                toast.error(`${response.message}`)
                }
            }catch(err){
                console.log(err);
                toast.error(`Error Updating Notification State`)
            }  
        }
    }

    const handleDelClick = async(notif , index)=>{
        try{
            const res = await fetch(`/api/admin-notification/${notif._id}`,{
                method:'DELETE',
                headers: {
                    Authorization: `Bearer ${JSON.parse(user).token}`,
                },
            })
            const response = await res.json();
            if(res.ok){
                const updatedData =[...notificationsData];
                updatedData.splice(index, 1)
                setNotificationsData(updatedData)
            }
            else{
              toast.error(`${response.message}`)
            }
        }catch(err){
            console.log(err);
            toast.error(`Error Deleting Notification`)
        } 
    }

    useEffect(() => {
        if (open && !isFetching) { 
            console.log(page);
            if (ref && ref.current) {
                ref.current.addEventListener("scroll", handleScroll, false);
                return function cleanup() {
                    ref.current.removeEventListener("scroll", handleScroll, false);
                };
            }
        }
    }, [open, page]);

    return (
        <div ref={ref} className="notifications">
            {
                notificationsData ? 
                notificationsData.map((notif, index)=>{
                    return(
                    <div key={index}  className={`notification-wrapper ${notif.isSeen ? 'isSeen' :''}`}>
                        <div className='col icon'>
                            <div className={`notif-icon ${notif.type}`}>
                                {notif && notif.type==="order" ? <AttachMoneyOutlinedIcon fontSize='small'/> : null}
                                {notif && notif.type==="stock" ? <PriorityHighOutlinedIcon fontSize='small'/> : null}
                            </div>
                        </div>
                        <div className='col data'>
                            <div className="content">
                                <p>{notif.content} </p>
                            </div>
                            <div className="date-act">
                                <p>{ formatDateAgo(notif.createdAt) }</p>

                                <div className='actions'>   
                                    <button type="button" className='see' onClick={()=>{handleSeeClick(notif, index)}}>
                                        <p>View</p>
                                    </button>
                                    <button type="button" className='delete' onClick={()=>{handleDelClick(notif, index)}}> 
                                        <p>delete</p>
                                    </button>
                                </div>
                            </div>
                        </div>            
                    </div>
                    )
                })
                :
                <></>
            }
            {
                isFetching ? 
                    <NotificationsSkeleton />
                :null
            }
        </div>
    )
}

export default NotificationsMenu


const NotificationsSkeleton = ()=>{
    return(
      <>
        <div className={`notification-wrapper`}>
            <div className="header"><Skeleton animation="wave" height={20} width={'40%'} /></div>
            <div className="content">
              <p><Skeleton animation="wave" height={40} width={'100%'} /> </p>
            </div>
        </div>
        <div className={`notification-wrapper`}>
            <div className="header"><Skeleton animation="wave" height={20} width={'40%'} /></div>
            <div className="content">
              <p><Skeleton animation="wave" height={40} width={'100%'} /> </p>
            </div>
        </div>
      </>
    )

}