import React, { useEffect, useState } from 'react'
import InPageLocation from '../components/InPageLocation'
import { useAuthContext } from '../hooks/useAuthContext'
import { toast } from 'react-toastify'

const Profile = () => {
  const [isFetchingGeneralInfos, setIsFetchingGeneralInfos]= useState(false)
  const [profileData, setProfileData]= useState(null)

  const {user} = useAuthContext()
  const clientId = user._id;

  const fetchClient = async()=>{
    try{ 
        setIsFetchingGeneralInfos(true)
        const res = await fetch(`/api/user/id/${clientId}`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(user).token}`,
            },
        })
        const response = await res.json();
        if(res.ok){
          const {user} = response;
          setProfileData(user);
        }
        else{
          toast.error(`${response.message}`)
        }
        setIsFetchingGeneralInfos(false)
    }catch(err){
        console.log(err);
        setIsFetchingGeneralInfos(false)
    } 
  }

  useEffect(()=>{
    fetchClient()
  },[])

  return (
    <>
      <InPageLocation locations={['my profile']}  links={['/my-profile' ]} />


    </>
  )
}

export default Profile