import React, { useEffect, useState } from 'react'
import { useAuthContext } from '../../hooks/useAuthContext';
import { toast } from 'react-toastify';
import { Select } from '@mui/material';

const FilterByProduct  = ({type, setFilterUser, placeholder})=>{
    const [isFetching, setIsFetching] = useState(false);
    const [products , setProducts] = useState();
    const [options, setOptions] = useState([]);
    const {user} = useAuthContext()

    const getProducts = async()=>{
        try{
            setIsFetching(true)
            const res = await fetch(`/api/${type}?`,{
                headers: {
                    Authorization: `Bearer ${JSON.parse(user).token}`,
                },
            })
            const response = await res.json();
            if(res.ok){
              const {products} = response;
                setProducts(products);
            }
            else{
              toast.error(`${response.message}`)
            }
            setIsFetching(false)
        }catch(err){
            console.log(err);
            setIsFetching(false)
            toast.error(`Can't get Products`)
        } 
    }

    useEffect(()=>{
        getProducts()
    },[])

    useEffect(()=>{
        if (products) {
            const arr= [{value:'', label:'None'}];
            products.forEach(product => {
                arr.push({ value: product._id, label: product.title })
            });
            setOptions(arr)
        }
    },[products])

    return (
            <Select
                className="basic-single-select"
                classNamePrefix="select Product"
                isLoading={isFetching}
                name="products"
                options={options}
                placeholder={placeholder}
                onChange={(e)=>setFilterUser(e.value)}
            /> 
    )
}


export default FilterByProduct