import React from 'react'
import InPageLocation from '../../components/InPageLocation'
import PanelsOrdersTable from '../../components/tables/PanelsOrdersTable'

const PanelsOrders = () => {
  return (
    <>
      <InPageLocation locations={['orders', 'Panels orders']}  links={['/orders/panels' , '/orders/panels' ]} />

      <PanelsOrdersTable exFetching={true} userFilter={true} productFilter={true} userId={''} productId={''}/>
    </>
  )
}

export default PanelsOrders