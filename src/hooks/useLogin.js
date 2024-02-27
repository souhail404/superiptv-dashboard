import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const useLogin = () => {
    const [isLoading , setIsLoading] = useState(false);
    const [error , setError] = useState(null);
    const [message , setMessage] = useState(null)
    const {dispatch}= useAuthContext()
    const navigate = useNavigate()

    const login = async (userName, password) =>{
        const toastId = toast.loading("login...");
        setIsLoading(true)
        setError(null)
        setMessage(null)

        const response = await fetch('/api/user/admin-login', {
            method: 'POST',
            headers:{'Content-type':'application/json'},
            body:JSON.stringify({userName, password})
        })
 
        const json = await response.json()

        if(response.ok){
            localStorage.setItem('user', JSON.stringify(json))
            
            dispatch({type: 'LOGIN', payload: json})
            toast.update(toastId, {render: "logged in Succesfully", type: "success", isLoading: false, autoClose:6000});
            setIsLoading(false)
            navigate('/')
            window.location.reload()
        }
        else{
            toast.update(toastId, {render: `${json.message}`, type: "error", isLoading: false, autoClose:6000});
        }
    }

    return { login , isLoading , error }
}