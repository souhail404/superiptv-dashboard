import { Skeleton } from '@mui/material'
import React, { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import formatDateAgo from '../services/formatDateAgo';

import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import PriorityHighOutlinedIcon from '@mui/icons-material/PriorityHighOutlined';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';

const NotificationsMenu = ({page, setPage, totalPages, open, notificationsData, isFetching}) => {

    const ref = useRef();
    const navigate = useNavigate()
    
    const handleScroll = async () => {
        const notifWrapper = ref.current;
                
        if (notifWrapper.scrollTop + notifWrapper.clientHeight >= notifWrapper.scrollHeight - 2) {
            if (page < totalPages) {
                setPage(prevPage => prevPage + 1);
                notifWrapper.scrollTop = notifWrapper.scrollTop - 20;
            }
        }
    };

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
                                    <button type="button" className='see' onClick={()=>{navigate(notif.link)}}>
                                        <p>View</p>
                                    </button>
                                    <button type="button" className='delete' > 
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