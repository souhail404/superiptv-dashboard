import React from 'react'
import InPageLocation from '../../components/InPageLocation'
import EditServerForm from '../../components/forms/EditServerForm'

const EditServer = () => {
  return (
    <>
      <InPageLocation locations={['servers', 'edit server']}  links={['/servers' , '/servers/edit']} />

      <EditServerForm />
    </>
  )
}

export default EditServer