import React from 'react'
import InPageLocation from '../../components/InPageLocation'
import EditClientForm from '../../components/forms/EditClientForm'

const EditClient = () => {
  return (
    <>
      <InPageLocation locations={['clients', 'edit client']}  links={['/client' , '/client/edit']} />
      
      <EditClientForm />
    </>
  )
}

export default EditClient