// react bootstrap libarary and inside it pagination
// import {Pagination} from 'react-bootstrap'
// function MyPagination() {
//   return (
//     <div style={{display:'flex',justifyContent:'center'}}>
//         <Pagination>
//             <Pagination.First />
//             <Pagination.Prev />
//             <Pagination.Item active>{1}</Pagination.Item>
//             <Pagination.Item>{2}</Pagination.Item>
//             {/* <Pagination.Ellipsis /> */}

//             {/* <Pagination.Item active>{12}</Pagination.Item> */}
//             {/* <Pagination.Item disabled>{14}</Pagination.Item> */}

//             <Pagination.Ellipsis />
//             <Pagination.Item>{20}</Pagination.Item>
//             <Pagination.Next />
//             <Pagination.Last />
//         </Pagination>
//     </div>
//   )
// }
// export default MyPagination
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
// another library will do the same but with more advanced and dynamic tools called react-paginate
import ReactPaginate from 'react-paginate'

interface MyPagProps {
  page: (pageNumber: number) => void, // function
  currentPage: number,
  totalPages: number,
}

function MyPagination({page, currentPage, totalPages }: MyPagProps) {
    const handlePageClick = (p: { selected: number }) => {
        const pageNumber = p.selected + 1;
        page(pageNumber);
    }
    let pageCount = totalPages;
    // i found out that the total pages is: 49015 but this number is fake or i cannot access more than that 
    if(pageCount > 500){
      pageCount = 500
    }
    return (
        <div className="pagination-wrapper">
          <ReactPaginate
            breakLabel="..."
            nextLabel="next >"
            onPageChange={handlePageClick}
            pageRangeDisplayed={1}
            pageCount={pageCount}
            previousLabel="< previous"

            containerClassName={'pagination justify-content-center p-3'}
            pageClassName={'page-item'}
            pageLinkClassName={'page-link'}
            previousClassName={'page-item'}
            previousLinkClassName={'page-link'}
            nextClassName={'page-item'}
            nextLinkClassName={'page-link'}
            breakClassName={'page-item'}
            breakLinkClassName={'page-link'}
            activeClassName={'active'}
            forcePage={currentPage}
          />          
        </div>
      );
}
export default MyPagination
