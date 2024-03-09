import { Skeleton } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';

import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';


const NotificationsMenu = ({page, setPage, totalPages, open, notificationsData, isFetching}) => {

    const ref = useRef();
    const navigate = useNavigate()

    const [scrollY, setScrollY]=useState()
    
    const handleScroll = async () => {
        const notifWrapper = ref.current;
        if (notifWrapper.scrollTop + notifWrapper.clientHeight >= notifWrapper.scrollHeight - 5) {
            if (page < totalPages) {
                setPage(prevPage => prevPage + 1);
            }
        }
    };

    useEffect(() => {
        if (open && !isFetching) { 
            if (ref && ref.current) {
                ref.current.addEventListener("scroll", handleScroll, false);
                return function cleanup() {
                    ref.current.removeEventListener("scroll", handleScroll, false);
                };
            }
        }
    }, [open, ref.current, page]);

    return (
        <div ref={ref} className="notifications">
            {
                notificationsData ? 
                notificationsData.map((notif, index)=>{
                    return(
                    <div key={index} onClick={()=>{navigate(notif.link)}} className={`notification-wrapper ${notif.isSeen ? 'isSeen' :''}`}>
                        <div className="header">
                            <p>{notif.createdAt}</p>
                            <div className="actions">
                                {/* <button type="button" >
                                    <RemoveRedEyeOutlinedIcon className='icon' fontSize='small' />
                                </button> */}
                                <button type="button" > 
                                    <DeleteOutlineOutlinedIcon className='icon' fontSize='small' />
                                </button>
                            </div>
                        </div>
                        <div className="content">
                        <p>{notif.content} </p>
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
      </>
    )

}