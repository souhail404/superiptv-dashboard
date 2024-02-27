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
import PanelsOrdersTable from '../../components/tables/PanelsOrdersTable'
import SoldHistoryTable from '../../components/tables/SoldHistoryTable'
import ServersOrdersTable from '../../components/tables/ServersOrdersTable'
import CodesOrdersTable from '../../components/tables/CodesOrdersTable'

const ClientDetails = () => {
  const [isFetchingGeneralInfos, setIsFetchingGeneralInfos]= useState(false)
  const [clientData, setClientData]= useState(null)

  const {clientId} = useParams()
  const {user} = useAuthContext()

  const fetchClient = async()=>{
    try{ 
        setIsFetchingGeneralInfos(true)
        const res = await fetch(`/api/user/id/${clientId}`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(user).token}`,
            },
        })
        const response = await res.json();
        if(res.ok){
          const {user} = response;
          setClientData(user);
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
    fetchClient()
  },[])

  return (
    <>
      <InPageLocation locations={['clients', `${isFetchingGeneralInfos ?'': `${clientData?.name} details`}`]}  links={['/client' , `${isFetchingGeneralInfos ?'': `/client/${clientData?._id}/details`}`]} />

      <div className="general-preview-container">
        <PreviewBox 
            heading={'sold'}
            subHeading={'Current'} 
            content={clientData?.sold} 
            index={'Dhs'} 
            icon={<SellOutlinedIcon/>} 
            isFetching={isFetchingGeneralInfos} bgColor={`#86bbd8`}/>        
        <PreviewBox 
             heading={'orders'}
             subHeading={'Total'}
             content={clientData?.ordered}
             index={'orders'}
             icon={<MoveToInboxOutlinedIcon/>}
             isFetching={isFetchingGeneralInfos} bgColor={`#86bbd8`}/>        
        <PreviewBox 
             heading={'volume'}
             subHeading={'Total'}
             content={clientData?.volume}
             index={'Dhs'}
             icon={<AttachMoneyOutlinedIcon/>}
             isFetching={isFetchingGeneralInfos} bgColor={`#86bbd8`}/>        
        <PreviewBox 
            heading={'type'}
            subHeading={'client'} 
            content={clientData?.isLoyal ? 'Loyal':'Normal'} 
            icon={<CodeOutlinedIcon/>} 
            isFetching={isFetchingGeneralInfos} bgColor={`#86bbd8`}/>        
      </div>

      <SoldHistoryTable exFetching={clientData ? true : false} userId={clientData?._id} />
      {/* <ProductOrdersTable product='server' heading='Servers Orders' exFetching={clientData ? true : false} userId={clientData?._id}/> */}
      {clientData ? <ServersOrdersTable 
          heading='Servers Orders' 
          exFetching={clientData ? true : false} 
          productFilter={true} 
          userId={clientData?._id} 
          productId={''} 
      />: null}

      {clientData ? <CodesOrdersTable
          heading='Codes Orders' 
          exFetching={clientData ? true : false} 
          productFilter={true} 
          userId={clientData?._id} 
          productId={''} 
      />: null}

      {/* <ProductOrdersTable product='code' heading='Codes Orders' exFetching={clientData ? true : false} userId={clientData?._id}/> */}
      {clientData ? <PanelsOrdersTable 
          heading='Panels Orders' 
          exFetching={clientData ? true : false} 
          userId={clientData?._id} 
          productId={''}  
          productFilter={true}
      /> : null}
    </>
  )
}

export default ClientDetails