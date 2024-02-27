import { Skeleton } from '@mui/material'
import React from 'react'

const PreviewBox = ({heading, subHeading, content, index, icon, isFetching, bgColor}) => {
  return (
    <div className='preview-box1' style={{backgroundColor:`${bgColor}`}}>
        <div className="header">
            <div className="icon-wrapper">
                {icon}
            </div>
            <div className="heading-wrapper">
                <h4 className='sub-heading'>{subHeading}</h4>  
                <h3 className='heading'>{heading}</h3>
            </div>
        </div>
        <div className="content">
            {
                isFetching ?
                <Skeleton />
                :
                <>
                <p>{content}</p>
                <p className='index'>{index}</p>
                </>
            }
            
        </div>
    </div>
  )
}

export default PreviewBox