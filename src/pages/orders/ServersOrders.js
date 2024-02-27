import React from 'react'
import InPageLocation from '../../components/InPageLocation'
import ProductOrdersTable from '../../components/tables/ProductOrdersTable'
import ServersOrdersTable from '../../components/tables/ServersOrdersTable'

const ServersOrders = () => {
  return (
    <>
      <InPageLocation locations={['orders', 'servers orders']}  links={['/orders/servers' , '/orders/servers' ]} />

      <ServersOrdersTable exFetching={true} userFilter={true} productFilter={true} userId={''} productId={''}/>
    </>
  )
}

export default ServersOrders