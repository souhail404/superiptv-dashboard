import React from 'react'
import AnnouncementIcon from '@mui/icons-material/Announcement';

const EmptyFetchRes = ({text}) => {
  return (
    <div className='empty-fetch-result'>
        <div className="icon"><AnnouncementIcon /></div>
        <p>{text}</p>
    </div>
  )
}

export default EmptyFetchRes