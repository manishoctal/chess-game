import React, { useContext, useEffect, useRef, useState } from "react";
import { apiGet } from "../../utils/apiFetch";
import apiPath from "../../utils/apiPath";
import Table from "./Table";
import AddEditFilters from "./AddEditFilters";
import Pagination from "../Pagination";
import AuthContext from "context/AuthContext";
import dayjs from "dayjs";
import ODateRangePicker from "components/shared/datePicker/ODateRangePicker";
import { useTranslation } from "react-i18next";

function Filters() {
  const { t } = useTranslation();
  const { logoutUser, user, updatePageName } = useContext(AuthContext);
  const MemoizedAddEditSound = React.memo(AddEditFilters);
  const [paginationObj, setPaginationObj] = useState({
    page: 1,
    pageCount: 1,
    pageRangeDisplayed: 10,
  });
  const [showModal, setShowModal] = useState(false);
  const [filterEditModal, setFilterEditModal] = useState(false);
  const [filter, setAllFilter] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [item, setItem] = useState("");
  const [isDelete, setIsDelete] = useState(false);
  const [filterData, setFilterData] = useState({
    used: "",
    category: "",
    searchkey: "",
    startDate: "",
    endDate: "",
    isReset: false,
    isFilter: false,
  });
  const [sort, setSort] = useState({
    sort_key: "createdAt",
    sort_type: "desc",
  });
  const searchRef = useRef(null);
  const [userSuggestion, setFilterSuggestion] = useState();
  const [searchTerm, setSearchTerm] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const manager = user?.permission?.find((e) => e.manager === "filters") ?? {};
  const getAllFilter = async (data) => {
    try {
      const { used, startDate, endDate, searchkey, isFilter } = filterData;
      if (data?.deletePage || (isFilter && used && data?.statusChange)) {
        if (!(filter?.length > 1)) {
          setPage(page - 1);
          setIsDelete(true);
          setPaginationObj({ ...paginationObj, page: page - 1 });
        }
      } else {
        setIsDelete(false);
      }
      const payload = {
        page,
        limit: pageSize,
        used,
        start_date: startDate ? dayjs(startDate).format("YYYY-MM-DD") : null,
        end_date: endDate ? dayjs(endDate).format("YYYY-MM-DD") : null,
        keyword: searchkey?.trim(),
        sort_key: sort.sort_key,
        sort_type: sort.sort_type,
      };

      const path = apiPath.filter;
      const result = await apiGet(path, payload);
      if (result?.status === 200) {
        const response = result?.data?.results;
        setAllFilter(response?.docs);
        setPaginationObj({
          ...paginationObj,
          page: response?.page,
          pageCount: response?.totalPages,
          perPageItem: response?.docs.length,
          totalItems: response.totalDocs,
        });
      }
    } catch (error) {
      console.log("error ", error);
      setPaginationObj({});
      if (error.response.status === 401 || error.response.status === 409) {
        logoutUser();
      }
    }
  };

  const handlePageClick = (event) => {
    const newPage = event.selected + 1;
    setPage(newPage);
  };
  const getUserSuggestion = async () => {
    try {
      const path = apiPath.filter;
      const payload = {
        keyword: searchTerm,
        limit: 5,
      };
      const result = await apiGet(path, payload);
      if (result?.status === 200) {
        const response = result?.data?.results;
        setFilterSuggestion(response?.docs);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handelEdit = (items) => {
    setItem(items);
    setShowModal(true);
  };

  const viewDetailsUser = async (newItem) => {
    try {
      const path = `${apiPath.filter}/${newItem?._id}`;
      const result = await apiGet(path);
      if (result?.status === 200) {
        const response = result?.data?.results;
        setItem(response);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const handleUserView = (item) => {
    viewDetailsUser(item);
    setFilterEditModal(true);
  };

  useEffect(() => {
    getAllFilter();
  }, [page, filterData, sort, pageSize]);

  const handleSearchKey = (e) => {
    setFilterData({ ...filterData, searchkey: e.displayName, isFilter: true });
    setPage(1);
    setSearchTerm(e.displayName);
    setIsSearchVisible(false);
  };

  const handleReset = () => {
    setFilterData({
      used: "",
      category: "",
      searchkey: "",
      startDate: "",
      endDate: "",
      isReset: true,
      isFilter: false,
    });
    setPage(1);
    setIsDelete(true);
    setPageSize(10);
    setSearchTerm("");
  };

  const handleDateChange = (start, end) => {
    setPage(1);
    setFilterData({
      ...filterData,
      startDate: start,
      endDate: end,
      isFilter: true,
    });
    setIsDelete(true);
  };

  const pageSizeCall = (value) => {
    setPageSize(value);
  };

  useEffect(() => {
    const handleDocumentClick = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        handleBlur();
      }
    };
    document.addEventListener("click", handleDocumentClick);
    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []);

  const handleFocus = () => {
    setIsSearchVisible(true);
  };
  const handleBlur = (e) => {
    setIsSearchVisible(false);
  };

  useEffect(() => {
    updatePageName(t("O_FILTERS_MANAGEMENT"));
  }, []);

  useEffect(() => {
    if (!isInitialized) {
      setIsInitialized(true);
    } else if (searchTerm || !filterData?.isReset) {
      getUserSuggestion();
      setPage(1);
    }
  }, [debouncedSearchTerm]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [searchTerm]);
  return (
    <div>
      <div className="bg-[#F9F9F9]">
        <div className="px-3 py-4">
          <div className="bg-white border border-[#E9EDF9] rounded-lg">
            <form className="border-b border-b-[#E3E3E3] flex justify-between px-4 py-3 pt-5">
              <div className="flex flex-wrap  items-center">
                <div className="flex items-center lg:pt-0 pt-3 flex-wrap justify-center">
                  <ODateRangePicker
                    handleDateChange={handleDateChange}
                    isReset={filterData?.isReset}
                    setIsReset={setFilterData}
                  />

                  <button
                    type="button"
                    onClick={handleReset}
                    className="bg-gradientTo text-sm px-8 ml-3 mb-3 py-2 rounded-lg items-center border border-transparent text-white hover:bg-DarkBlue sm:w-auto w-1/2"
                  >
                    {t("O_RESET")}
                  </button>
                </div>
              </div>
              <div className="flex items-center md:justify-end px-4">
                <label
                  htmlFor="default-search"
                  className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
                >
                  Search by display name
                </label>
                <div className="flex">
                  <div className="relative " ref={searchRef}>
                    <div className="relative ">
                      <div className="absolute inset-y-0 right-0 flex items-center pl-3 mr-3 pointer-events-none">
                        {!searchTerm && (
                          <svg
                            aria-hidden="true"
                            className="w-4 h-4 text-[#A5A5A5] dark:text-gray-40"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                          </svg>
                        )}
                      </div>
                      <input
                        type="search"
                        id="default-search"
                        onFocus={handleFocus}
                        autoComplete="off"
                        className="relative m-0 -mr-0.5 block w-[1px] 2xl:min-w-[250px] xl:min-w-[300px] flex-auto rounded-l border border-solid border-neutral-300 bg-transparent bg-clip-padding px-3 py-[0.25rem] text-base font-normal leading-[1.6] text-neutral-700 outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-primary focus:text-neutral-700 focus:shadow-[inset_0_0_0_1px_rgb(59,113,202)] focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:focus:border-primary"
                        placeholder="Search by display name"
                        value={searchTerm}
                        title=""
                        required
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    {isSearchVisible && searchTerm && filter?.length !== 0 && (
                      <div className="absolute z-10 w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        {userSuggestion?.length > 0 ? (
                          userSuggestion?.map((val, ind) => (
                            <p
                              key={ind}
                              className="block w-full px-4 py-2 border-b border-gray-200 cursor-pointer hover:bg-gray-100 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white"
                              onClick={() => {
                                handleSearchKey(val);
                              }}
                            >
                              {" "}
                              {val?.displayName?.slice(0, 29) || "NA"}
                            </p>
                          ))
                        ) : (
                          <p className="block w-full px-4 py-2 border-b">
                            No data found
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {(manager?.add || user?.role === "admin") && (
                  <button
                    onClick={() => setShowModal(true)}
                    type="button"
                    className="bg-gradientTo text-sm px-8 ml-3 mb-0 py-2 rounded-lg items-center border border-transparent text-white hover:bg-DarkBlue sm:w-auto w-1/2"
                  >
                    + Add Filters
                  </button>
                )}
              </div>
            </form>
            <Table
              filter={filter}
              user={user}
              getAllFilter={getAllFilter}
              handelEdit={handelEdit}
              handleUserView={handleUserView}
              page={page}
              setSort={setSort}
              sort={sort}
              manager={manager}
            />
            {paginationObj?.totalItems ? (
              <Pagination
                handlePageClick={handlePageClick}
                options={paginationObj}
                isDelete={isDelete}
                page={page}
                setPageSize={pageSizeCall}
                pageSize={pageSize}
              />
            ) : null}
          </div>
        </div>
      </div>
      <>
        {showModal ? (
          <MemoizedAddEditSound
            setShowModal={setShowModal}
            onClose={() => setShowModal(false)}
            getAllFilter={getAllFilter}
            item={item}
            type="add"
          />
        ) : null}

        {filterEditModal && item ? (
          <MemoizedAddEditSound
            setFilterEditModal={setFilterEditModal}
            onClose={() => setFilterEditModal(false)}
            getAllFilter={getAllFilter}
            item={item}
            type="edit"
          />
        ) : null}
      </>
    </div>
  );
}
export default Filters;
