import React from 'react'
import InPageLocation from '../../components/InPageLocation'
import EditLinkForm from '../../components/forms/EditLinkForm'

const EditLink = () => {
  return (
    <>
      <InPageLocation locations={['links', 'edit link']}  links={['/link' , '/link/edit']} />
    
      <EditLinkForm />
    </>
  )
}

export default EditLink