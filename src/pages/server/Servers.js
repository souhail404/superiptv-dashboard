import React from 'react'
import InPageLocation from '../../components/InPageLocation'
import ServersTable from '../../components/tables/ServersTable'

const Servers = () => {
  return (
    <>
      <InPageLocation locations={['servers']}  links={['/servers']} />

      <ServersTable />
    </>
  )
}

export default Servers