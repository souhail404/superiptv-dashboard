import React from 'react'
import InPageLocation from '../../components/InPageLocation'
import AddPanelForm from '../../components/forms/AddPanelForm'

const AddPanel = () => {
  
  return (
    <>
      <InPageLocation locations={['panels', 'add panel']}  links={['/panels' , '/panels/add']} />
      
      <AddPanelForm />
    </>
  )
}

export default AddPanel