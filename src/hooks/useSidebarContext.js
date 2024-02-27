import { SidebarContext } from "../context/SidebarContext";
import { useContext } from "react";

export const useSidebarContext = ()=>{
    const context =useContext(SidebarContext);

    if(!context){
        throw Error('useSidebarContext must be used inside an sidebarContextProvider')
    }

    return context
}