import React from 'react'
import InPageLocation from '../../components/InPageLocation'
import LinksTable from '../../components/tables/LinksTable'

const Links = () => {
  return (
    <>
      <InPageLocation locations={['links']}  links={['/link' ]} />

      <LinksTable /> 
    </>
  )
}

export default Links