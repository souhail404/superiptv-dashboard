import React from 'react'
import InPageLocation from '../../components/InPageLocation'
import AddClientForm from '../../components/forms/AddClientForm'

const AddClient = () => {
  return (
    <>
      <InPageLocation locations={['clients', 'add client']}  links={['/client' , '/client/add']} />
      
      <AddClientForm />
    </>
  )
}

export default AddClient