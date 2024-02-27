import React from 'react'
import InPageLocation from '../../components/InPageLocation'
import CodesOrdersTable from '../../components/tables/CodesOrdersTable'

const CodesOrders = () => {
  return (
    <>
      <InPageLocation locations={['orders', 'Codes orders']}  links={['/orders/codes' , '/orders/codes' ]} />

      <CodesOrdersTable exFetching={true} userFilter={true} productFilter={true} userId={''} productId={''}/>
    </>
  )
}

export default CodesOrders