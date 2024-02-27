import React from 'react'
import InPageLocation from '../../components/InPageLocation'
import AddCodeForm from '../../components/forms/AddCodeForm'

const AddCode = () => {
  
  return (
    <>
      <InPageLocation locations={['codes', 'add']}  links={['/codes' , '/codes/add']} />
      
      <AddCodeForm />
    </>
  )
}

export default AddCode