import React from 'react'
import InPageLocation from '../../components/InPageLocation'
import EditCodeForm from '../../components/forms/EditCodeForm'

const EditCode = () => {
  return (
    <>
      <InPageLocation locations={['codes', 'edit ']}  links={['/codes' , '/codes/edit']} />

      <EditCodeForm />
    </>
  )
}

export default EditCode