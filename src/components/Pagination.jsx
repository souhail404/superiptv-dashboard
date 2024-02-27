import React from 'react';

const Pagination = ({page, setPage, totalPages }) => {
    const maxVisiblePages = 5;

    // Calculate the range of pages to display
    const start = (page - Math.floor(maxVisiblePages/2) < 2) ? 2 : (page -Math.floor(maxVisiblePages/2)) ;
    const endPage = ((start + maxVisiblePages - 1 ) < totalPages) ? (start + maxVisiblePages - 1 ): (totalPages - 1);
    const startPage= ((endPage - maxVisiblePages+1 ) > 2) ? (endPage - maxVisiblePages+1 ): 2;
    // Create an array containing the page numbers in the range
    const pages = Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index);

    return (
        <div className="pagination f-r-c-c">
            {/* <div className="title">
                <p>pages :</p>
            </div> */}
            <div className="page-btns">
                <button 
                    type="button"
                    onClick={()=>{setPage(1)}}
                    className={`page-btn ${page === 1 ? 'active' : ''}`}
                    >
                    1
                </button>
                {((startPage - 1) !== 1) ? <div className='separing'>...</div>: null}
                {pages.map((el) => (
                <button
                    key={el}
                    onClick={()=>{setPage(el)}}
                    className={`page-btn var ${page === el ? 'active' : ''}`}
                    >
                    {el}
                </button>
                ))}
                {((totalPages - endPage) !== 1) ? <div  className='separing'>...</div>: null}
                <button 
                    type="button"
                    onClick={()=>{setPage(totalPages)}}
                    className={`page-btn ${page === totalPages ? 'active' : ''}`}
                    >
                    {totalPages}
                </button>
            </div>
        </div> 
    );
};

export default Pagination;
