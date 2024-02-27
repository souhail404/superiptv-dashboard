import React from 'react'
import InPageLocation from '../../components/InPageLocation'
import CodesTable from '../../components/tables/CodesTable'

const Codes = () => {
  return (
    <>
      <InPageLocation locations={['codes']}  links={['/codes']} />

      <CodesTable />

    </>
  )
}

export default Codes