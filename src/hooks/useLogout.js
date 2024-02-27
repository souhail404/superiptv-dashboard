import { useAuthContext } from "./useAuthContext";
import { toast } from "react-toastify";

export const useLogout = () => {
    const {dispatch}= useAuthContext()

    const logout = ()=> {
        const toastId = toast.loading("logout...");
        localStorage.removeItem('user')
        dispatch({type: 'LOGOUT'})

        toast.update(toastId, {render: "logged out Succesfully", type: "success", isLoading: false, autoClose:6000});
    }

    return {logout}
}