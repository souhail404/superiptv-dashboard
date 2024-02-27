import React from 'react'
import InPageLocation from '../../components/InPageLocation'
import ServersTable from '../../components/tables/ServersTable'
import PanelsTable from '../../components/tables/PanelsTable'

const Panels = () => {
  return (
    <>
      <InPageLocation locations={['servers']}  links={['/servers']} />

      <PanelsTable />
    </>
  )
}

export default Panels