function Pagination({ pageInfo, handlePageChange }) {
  const handleClick = (e, page) => {
    e.preventDefault();
    handlePageChange(page);
  };

  return (
    <div className="d-flex justify-content-center">
      <nav>
        <ul className="pagination my-custom-pagination">
          <li className={`page-item ${!pageInfo.has_pre && "disabled"}`}>
            <a
              onClick={(e) => handleClick(e, pageInfo.current_page - 1)}
              className="page-link"
              href="#"
            >
              上一頁
            </a>
          </li>

          {Array.from({ length: pageInfo.total_pages }).map((_, index) => {
            const pageNumber = index + 1;
            return (
              <li
                key={index}
                className={`page-item ${
                  pageInfo.current_page === pageNumber ? "active" : ""
                }`}
              >
                <a
                  onClick={(e) => handleClick(e, pageNumber)}
                  className="page-link"
                  href="#"
                >
                  {pageNumber}
                </a>
              </li>
            );
          })}

          <li className={`page-item ${!pageInfo.has_next && "disabled"}`}>
            <a
              onClick={(e) => handleClick(e, pageInfo.current_page + 1)}
              className="page-link"
              href="#"
            >
              下一頁
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Pagination;
