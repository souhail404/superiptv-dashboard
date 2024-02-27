import React, { useEffect, useState } from 'react'
import InPageLocation from '../../components/InPageLocation'
import { useParams } from 'react-router-dom'
import { useAuthContext } from '../../hooks/useAuthContext'
import { toast } from 'react-toastify'
import PreviewBox from '../../components/PreviewBox'
import SellOutlinedIcon from '@mui/icons-material/SellOutlined';
import MoveToInboxOutlinedIcon from '@mui/icons-material/MoveToInboxOutlined';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import PanelsOrdersTable from '../../components/tables/PanelsOrdersTable'

const PanelDetails = () => {

  const [isFetchingGeneralInfos, setIsFetchingGeneralInfos]= useState(false)
  const [panelsData, setPanelsData]= useState(null)

  const {productId} = useParams()
  const {user} = useAuthContext()

  const fetchProduct = async()=>{
    try{ 
        setIsFetchingGeneralInfos(true)
        const res = await fetch(`/api/panel/${productId}`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(user).token}`,
            },
        })
        const response = await res.json();
        if(res.ok){
          const {product} = response
          setPanelsData(product);
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
      <InPageLocation locations={['panel', `${isFetchingGeneralInfos ?'': `${panelsData?.title} details`}`]}  links={['/panels' , `${isFetchingGeneralInfos ?'': `/panels/${panelsData?._id}/details`}`]} />
      
      <div className="general-preview-container">
        <PreviewBox 
            heading={'price'}
            subHeading={'normal'} 
            content={panelsData?.price} 
            index={'Dhs'} 
            icon={<SellOutlinedIcon/>} 
            isFetching={isFetchingGeneralInfos} bgColor={`#86bbd8`}/>    
        <PreviewBox 
            heading={'price'}
            subHeading={'special'} 
            content={panelsData?.specialPrice} 
            index={'Dhs'} 
            icon={<SellOutlinedIcon/>} 
            isFetching={isFetchingGeneralInfos} bgColor={`#86bbd8`}/>        
        <PreviewBox 
             heading={'orders'}
             subHeading={'Total'}
             content={panelsData?.ordered}
             index={'orders'}
             icon={<MoveToInboxOutlinedIcon/>}
             isFetching={isFetchingGeneralInfos} bgColor={`#86bbd8`}/>        
        <PreviewBox 
             heading={'volume'}
             subHeading={'Total'}
             content={(panelsData?.volume)}
             index={'Dhs'}
             icon={<AttachMoneyOutlinedIcon/>}
             isFetching={isFetchingGeneralInfos} bgColor={`#86bbd8`}/>               
      </div>

      {panelsData ? <PanelsOrdersTable
          exFetching={panelsData ? true : false} 
          productId={panelsData?._id} 
          userId={''}  
          userFilter={true}
      /> : null}
    </>
  )
}

export default PanelDetails