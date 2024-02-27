import React, { useEffect, useState } from 'react'
import InPageLocation from '../../components/InPageLocation'
import { useParams } from 'react-router-dom'
import { useAuthContext } from '../../hooks/useAuthContext'
import { toast } from 'react-toastify'
import PreviewBox from '../../components/PreviewBox'
import SellOutlinedIcon from '@mui/icons-material/SellOutlined';
import MoveToInboxOutlinedIcon from '@mui/icons-material/MoveToInboxOutlined';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import CodeOutlinedIcon from '@mui/icons-material/CodeOutlined';
import CodesOrdersTable from '../../components/tables/CodesOrdersTable'

const CodeDetails = () => {

  const [isFetchingGeneralInfos, setIsFetchingGeneralInfos]= useState(false)
  const [serverData, setServerData]= useState(null)

  const {productId} = useParams()
  const {user} = useAuthContext()

  const fetchProduct = async()=>{
    try{ 
        setIsFetchingGeneralInfos(true)
        const res = await fetch(`/api/code/${productId}`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(user).token}`,
            },
        })
        const response = await res.json();
        const {product} = response
        if(res.ok){
          setServerData(product);
        }
        else{
          toast.error(`${response.message}`)
        }
        setIsFetchingGeneralInfos(false)
    }catch(err){
        console.log(err);
        setIsFetchingGeneralInfos(false)
    } 
  }

  useEffect(()=>{
    fetchProduct()
  },[])

  return (
    <>
      <InPageLocation locations={['codes', `${isFetchingGeneralInfos ?'': `${serverData?.title} details`}`]}  links={['/codes' , `${isFetchingGeneralInfos ?'': `/codes/${serverData?._id}/details`}`]} />

      <div className="general-preview-container">
        <PreviewBox 
            heading={'price'}
            subHeading={'Current'} 
            content={serverData?.price} 
            index={'Dhs'} 
            icon={<SellOutlinedIcon/>} 
            isFetching={isFetchingGeneralInfos} bgColor={`#86bbd8`}/>        
        <PreviewBox 
             heading={'orders'}
             subHeading={'Total'}
             content={serverData?.ordered}
             index={'orders'}
             icon={<MoveToInboxOutlinedIcon/>}
             isFetching={isFetchingGeneralInfos} bgColor={`#86bbd8`}/>        
        <PreviewBox 
             heading={'volume'}
             subHeading={'Total'}
             content={(serverData?.volume)}
             index={'Dhs'}
             icon={<AttachMoneyOutlinedIcon/>}
             isFetching={isFetchingGeneralInfos} bgColor={`#86bbd8`}/>        
        <PreviewBox 
            heading={'codes'}
            subHeading={'available'} 
            content={serverData?.codes?.length || 0} 
            index={'codes'} 
            icon={<CodeOutlinedIcon/>} 
            isFetching={isFetchingGeneralInfos} bgColor={`#86bbd8`}/>        
      </div>

      {/* <ProductOrdersTable product='code' exFetching={serverData ? true : false} productId={serverData?._id}/> */}

      {serverData ? <CodesOrdersTable
          exFetching={serverData ? true : false} 
          productId={serverData?._id} 
          userId={''}  
          userFilter={true}
      /> : null}

    </>
  )
}

export default CodeDetails 