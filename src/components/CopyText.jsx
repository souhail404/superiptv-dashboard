import React from 'react'
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import { toast } from 'react-toastify';

const CopyText = ({text, content, maxWidth}) => {
  return (
    <CopyToClipboard  text={text}  type="button" onCopy={() => {toast.success('Copied' , {autoClose:1500})}} >
        <div className='copy-text-container'> 
            <div className='p' >{content}</div>
            <ContentCopyIcon className='icon' fontSize='small' />
        </div>
    </CopyToClipboard >
  )
}

export default CopyText