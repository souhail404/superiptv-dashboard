import React from 'react'
import InPageLocation from '../../components/InPageLocation'
import EditPanelForm from '../../components/forms/EditPanelForm'

const EditPanel = () => {
  return (
    <>
      <InPageLocation locations={['panels', 'edit panel']}  links={['/panels' , '/panels/edit']} />

      <EditPanelForm />
    </>
  )
}

export default EditPanel