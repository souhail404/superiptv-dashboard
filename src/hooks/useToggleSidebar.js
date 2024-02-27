import { useSidebarContext } from "./useSidebarContext";

export const useToggleSidebar = () => {
    const {isSidebarOpen ,dispatch}= useSidebarContext()

    const toggleSidebar = ()=> {
        dispatch({type: 'TOGGLE' , payload:!isSidebarOpen})
    }

    return {toggleSidebar}
}