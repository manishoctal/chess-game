import React, { useContext, useEffect, useState } from "react";
import { apiGet, apiPut } from "../../utils/apiFetch";
import apiPath from "../../utils/apiPath";
import Table from "./Table";
import Pagination from "../Pagination";
import dayjs from "dayjs";
import ODateRangePicker from "components/shared/datePicker/ODateRangePicker";
import { useTranslation } from "react-i18next";
import AuthContext from "context/AuthContext";
import useToastContext from "hooks/useToastContext";

function EmailTemplate() {
  const { t } = useTranslation();
  const notification = useToastContext();
  const { user } = useContext(AuthContext);
  const manager =
    user?.permission?.find((e) => e.manager === "email_manager") ?? {};
  const [emailTemplate, setEmailTemplate] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [isDelete] = useState(false);
  const [paginationObj, setPaginationObj] = useState({
    page: 1,
    pageCount: 1,
    pageRangeDisplayed: 10,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);
  const [filterData, setFilterData] = useState({
    category: "",
    searchkey: "",
    startDate: "",
    endDate: "",
    isReset: false,
    isFilter: false,
  });
  const [sort, setSort] = useState({
    sortBy: "createdAt",
    sortType: "desc",
  });

  const allEmailTemplate = async (data) => {
    try {
      const { category, startDate, endDate, searchkey } = filterData;

      const payload = {
        page: emailTemplate?.nextPage === null ? page - 1 : page,
        pageSize,
        status: category,
        startDate: startDate ? dayjs(startDate).format("YYYY-MM-DD") : null,
        endDate: endDate ? dayjs(endDate).format("YYYY-MM-DD") : null,
        keyword: searchkey?.trim(),
        sortKey: sort.sortBy,
        sortType: sort.sortType,
      };

      const path = apiPath.emailTemplate;
      const result = await apiGet(path, payload);
      const response = result?.data?.results;
      const resultStatus = result?.data?.success;
      setEmailTemplate(response);
      setPaginationObj({
        ...paginationObj,
        page: resultStatus ? response.page : null,
        pageCount: resultStatus ? response.totalPages : null,
        perPageItem: resultStatus ? response?.docs.length : null,
        totalItems: resultStatus ? response.totalDocs : null,
      });
    } catch (error) {
      console.log("error in get all sub admin list==>>>>", error.message);
    }
  };
  const handlePageClick = (event) => {
    const newPage = event.selected + 1;
    setPage(newPage);
  };
  const handelEdit = (item) => {};

  const handleUserView = (item) => {};

  const handelStatusChange = async (item) => {
    try {
      const payload = {
        status: item?.status === "inactive" ? "active" : "inactive",
      };
      const path = `${apiPath.emailStatus}/${item?._id}`;
      const result = await apiPut(path, payload);
      if (result?.status === 200) {
        notification.success(result.data.message);
      }
    } catch (error) {
      console.log("error in get all sub admin list==>>>>", error.message);
    } finally {
      if (
        emailTemplate?.nextPage === null &&
        filterData?.isFilter &&
        emailTemplate?.prevPage
      ) {
        setPage(page - 1);
      } else {
        allEmailTemplate();
      }
    }
  };

  useEffect(() => {
    allEmailTemplate();
  }, [filterData, page, sort]);

  const handleReset = () => {
    setFilterData({
      category: "",
      searchkey: "",
      startDate: "",
      endDate: "",
      isReset: true,
      isFilter: false,
    });
    setPage(1);
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
  };

  useEffect(() => {
    if (!isInitialized) {
      setIsInitialized(true);
    } else if (searchTerm || !filterData?.isReset) {
      setFilterData({
        ...filterData,
        isReset: false,
        searchkey: debouncedSearchTerm || "",
        isFilter: !!debouncedSearchTerm,
      });
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
      <div className="bg-[#F9F9F9] dark:bg-slate-900">
        <div className="px-3 py-4">
          <div className="bg-white border border-[#E9EDF9] rounded-lg dark:bg-slate-800 dark:border-[#ffffff38]">
            <form className="border-b border-b-[#E3E3E3] 2xl:flex gap-2 px-4 py-3">
              <div className="col-span-2 flex flex-wrap  items-center">
                <div className="flex items-center lg:pt-0 pt-3 flex-wrap justify-center mb-2 2xl:mb-0">
                  <div className="relative flex items-center mb-3">
                    <div className="absolute inset-y-0 right-0 flex items-center pl-3 mr-3 pointer-events-none">
                      {!searchTerm ? (
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
                      ) : (
                        ""
                      )}
                    </div>
                    <input
                      type="search"
                      id="default-search"
                      className="block w-full p-2 outline-none text-sm text-gray-900 2xl:min-w-[250px] xl:min-w-[300px] rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Title"
                      value={searchTerm}
                      title=""
                      required
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <ODateRangePicker
                    handleDateChange={handleDateChange}
                    isReset={filterData?.isReset}
                    setIsReset={setFilterData}
                  />
                  {/* <div className="flex items-center  ml-3 mb-3">
                    <select
                      id=""
                      type="text "
                      name="category"
                      className="block p-2 w-full text-sm text-[#A5A5A5] bg-transparent border-2 rounded-lg border-[#DFDFDF] focus:outline-none focus:ring-0  peer"
                      placeholder=" "
                      onChange={(e) => statusPage(e)}
                      value={filterData?.category}
                    >
                      <option defaultValue value="">
                        {t("O_ALL")}
                      </option>
                      <option value="active">{t("O_ACTIVE")}</option>
                      <option value="inactive">{t("O_INACTIVE")}</option>
                    </select>
                  </div> */}
                  <button
                    type="button"
                    onClick={handleReset}
                    className="bg-gradientTo text-sm px-8 ml-3 mb-3 py-2 rounded-lg items-center border border-transparent text-white hover:bg-DarkBlue sm:w-auto w-1/2"
                  >
                    {t("O_RESET")}
                  </button>
                </div>
              </div>
              {/* <div className='flex items-center justify-end px-4 ms-auto mb-3'>
                {(manager?.add ||
                  user?.role === 'admin') && (
                    <button
                      title={t('ADD_EMAIL_TEMPLATE')}
                      type='button'
                      className='bg-gradientTo flex text-sm px-8 ml-3 py-2 rounded-lg items-center border border-transparent text-white hover:bg-DarkBlue whitespace-nowrap'
                      onClick={() => navigate('/email-manager/add')}
                    >
                      + {t('ADD_EMAIL_TEMPLATE')}
                    </button>)}
              </div> */}
            </form>
            <Table
              emailTemplate={emailTemplate?.docs}
              handelEdit={handelEdit}
              allEmailTemplate={allEmailTemplate}
              handleUserView={handleUserView}
              page={page}
              setSort={setSort}
              sort={sort}
              manager={manager}
              handelStatusChange={handelStatusChange}
            />
            {paginationObj?.totalItems ? (
              <Pagination
                handlePageClick={handlePageClick}
                options={paginationObj}
                isDelete={isDelete}
                page={page}
              />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmailTemplate;
