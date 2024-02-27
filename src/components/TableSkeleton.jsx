import React from 'react'
import { Skeleton } from "@mui/material"; 

const TableSkeleton = ({lines, columns}) => {
    const linesArr = Array.from(Array(lines).keys())  
    const columnsArr = Array.from(Array(columns).keys())  
    return (
        <>
        {
            linesArr.map((line)=>{
                return(
                    <tr key={line}>
                        {
                            columnsArr.map((row)=>{
                                return (<td key={row}><Skeleton animation='wave' /></td>)
                            })
                        }
                    </tr>
                )
            })
        }
        </>
    )
}

export default TableSkeleton