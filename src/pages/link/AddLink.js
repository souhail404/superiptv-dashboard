import React from 'react'
import InPageLocation from '../../components/InPageLocation'
import AddLinkForm from '../../components/forms/AddLinkForm'

const AddLink = () => {
  return (
    <>
      <InPageLocation locations={['Links', 'add Link']}  links={['/Link' , '/Link/add']} />
      
      <AddLinkForm />
    </>
  )
}

export default AddLink