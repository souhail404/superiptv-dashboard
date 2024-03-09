import React from 'react'
import InPageLocation from '../../components/InPageLocation'
import EditClientForm from '../../components/forms/EditClientForm'
import { useParams } from 'react-router-dom'

const EditClient = () => {
  
  const {clientId} = useParams()
  return (
    <>
      <InPageLocation locations={['clients', 'edit client']}  links={['/client' , '/client/edit']} />
      
      <EditClientForm clientId={clientId} type={`client`}/>
    </>
  )
}

export default EditClient