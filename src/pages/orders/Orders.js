import React from 'react'
import InPageLocation from '../../components/InPageLocation'

const Orders = () => {
  return (
    <>
      <InPageLocation locations={['orders']}  links={['/orders' ]} />
    </>
  )
}

export default Orders