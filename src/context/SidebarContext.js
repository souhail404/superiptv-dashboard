import {createContext, useReducer} from "react"

export const SidebarContext = createContext()

export const sidebarReducer = (state, action) =>{
    switch (action.type){
        case 'TOGGLE':
            return { isSidebarOpen: action.payload }
        default:
            return state
    }
}

export const SidebarContextProvider = ({children})=>{
    const [state, dispatch]= useReducer(sidebarReducer, {
        isSidebarOpen: false
    })

    return (
        <SidebarContext.Provider value={{...state , dispatch}}>
            {children}
        </SidebarContext.Provider>
    )
}