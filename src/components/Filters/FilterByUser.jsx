import React, { useEffect, useState } from 'react'
import { useAuthContext } from '../../hooks/useAuthContext';
import { toast } from 'react-toastify';
import { Select } from '@mui/material';

const FilterByUser  = ({setFilterUser, placeholder})=>{
    const [isFetching, setIsFetching] = useState(false);
    const [users , setUsers] = useState();
    const [options, setOptions] = useState([]);
    const {user} = useAuthContext()

    const getUsers = async()=>{
        try{
            setIsFetching(true)
            const res = await fetch(`/api/user?type=client`,{
                headers: {
                    Authorization: `Bearer ${JSON.parse(user).token}`,
                },
            })
            const response = await res.json();
            if(res.ok){
              const {users} = response;
                setUsers(users);
            }
            else{
              toast.error(`${response.message}`)
            }
            setIsFetching(false)
        }catch(err){
            console.log(err);
            setIsFetching(false)
            toast.error(`Can't get Users`)
        } 
    }

    useEffect(()=>{
        getUsers()
    },[])

    useEffect(()=>{
        if (users) {
            const arr= [{value:'', label:'None'}];
            users.forEach(user => {
                arr.push({ value: user._id, label: user.userName })
            });
            setOptions(arr)
        }
    },[users])

    return (
        <Select
            className="basic-single-select"
            classNamePrefix="select User"
            isLoading={isFetching}
            name="users"
            options={options}
            placeholder={placeholder}
            onChange={(e)=>setFilterUser(e.value)}
        />    
    )
}


export default FilterByUser