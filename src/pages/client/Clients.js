import React from 'react'
import InPageLocation from '../../components/InPageLocation'
import ClientsTable from '../../components/tables/ClientsTable'

const Clients = () => {
  return (
    <>
      <InPageLocation locations={['clients']}  links={['/client' ]} />

      <ClientsTable />
    </>
  )
}

export default Clients