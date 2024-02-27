import React from 'react'
import InPageLocation from '../../components/InPageLocation'
import AddServerForm from '../../components/forms/AddServerForm'

const AddServer = () => {
  
  return (
    <>
      <InPageLocation locations={['servers', 'add server']}  links={['/servers' , '/servers/add']} />
      
      <AddServerForm />
    </>
  )
}

export default AddServer