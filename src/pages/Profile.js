import React, { useEffect, useState } from 'react'
import InPageLocation from '../components/InPageLocation'
import { useAuthContext } from '../hooks/useAuthContext'
// import { toast } from 'react-toastify'
import EditClientForm from '../components/forms/EditClientForm'

const Profile = () => {
  const [userId, setUserId] = useState()

  const {user} = useAuthContext()


  useEffect(()=>{
    const u = JSON.parse(user)
    if (u) {
      setUserId(u.id)
    }
  },[user])

  return (
    <>
      <InPageLocation locations={['my profile']}  links={['/my-profile' ]} />
    {
      userId ? 
        <EditClientForm clientId={userId} />
      : null
    }
    </>
  )
}

export default Profile