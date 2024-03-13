import { useNavigate } from "react-router-dom";
import { useAuthContext } from "./useAuthContext";

export const useLogout = () => {
    const {dispatch}= useAuthContext()

    const logout = ()=> {
        // const toastId = toast.loading("logout...");
        localStorage.removeItem('user')
        dispatch({type: 'LOGOUT'})
    }

    return {logout}
}