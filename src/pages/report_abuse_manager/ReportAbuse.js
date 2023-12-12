import React, { useContext, useEffect, useState } from "react";
import { apiGet } from "../../utils/apiFetch";
import apiPath from "../../utils/apiPath";
import Table from "./Table";
import Pagination from "../Pagination";
import dayjs from "dayjs";
import ODateRangePicker from "components/shared/datePicker/ODateRangePicker";
import { useTranslation } from "react-i18next";
import AuthContext from "context/AuthContext";
import { useLocation, useNavigate } from "react-router";
import { BsArrowLeftCircle } from "react-icons/bs";
import ViewReportAbuse from "./ViewReportAbuse";
import ImageTable from "./ImageTable";
import VideoTable from "./VideoTable";
import UserViewDetail from "./UserViewDetail";
import copy from "copy-to-clipboard";

function ReportAbuse() {
  const { t } = useTranslation();
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const currentUrl = location.pathname;
  const [toggle, setToggle] = useState(false);
  const [reportTypes, setReportType] = useState('profile')
  const [viewData, setViewData] = useState();

  const [openSlide, setOpenSlide] = useState(false);

  const [viewShowModal, setViewShowModal] = useState(false);
  const [item, setItem] = useState("");

  const handleToggle = (items) => {
    setToggle(!toggle);
    setViewData(items);
  };

  const handleUserView = (newItem) => {
    setItem(newItem);
    setViewShowModal(!viewShowModal);
  };

  const handleView = (item) => {
    setOpenSlide(!openSlide);
  }

  const manager = user?.permission?.find((e) => e.manager === "artwork_manager") ?? {};
  const [postData, setPostData] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
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
    artworkStatus: "",
    searchkey: "",
    startDate: "",
    endDate: "",
    isReset: false,
    isFilter: false,
    category: "",
  });
  const [sort, setSort] = useState({
    sortBy: "createdAt",
    sortType: "desc",
  });


  const [copyText, setCopyText] = useState('');

  const handleCopy = (copyItem) => {
    setCopyText(copyItem?.link);
    copy(copyText);
    alert(`Video link copied`)
  }



  const reportAbuseListing = async () => {
    try {
      const { category, startDate, endDate, searchkey } = filterData;
      const payload = {
        page,
        pageSize,
        status: category,
        reportType: reportTypes,
        startDate: startDate ? dayjs(startDate).format("YYYY-MM-DD") : null,
        endDate: endDate ? dayjs(endDate).format("YYYY-MM-DD") : null,
        keyword: searchkey?.trim(),
        sortBy: sort.sortBy,
        sortType: sort.sortType,
      };

      const path = apiPath.reportAbuseListing;
      const result = await apiGet(path, payload);
      const response = result?.data?.results?.docs;
      const resultStatus = result?.data?.success;
      setPostData(response);
      setPaginationObj({
        ...paginationObj,
        page: resultStatus ? response.page : null,
        pageCount: resultStatus ? response.totalPages : null,
        perPageItem: resultStatus ? response?.docs.length : null,
        totalItems: resultStatus ? response.totalDocs : null,
      });
    } catch (error) {
      console.error("error in get all sub admin list==>>>>", error.message);
    }
  };

  const handlePageClick = (event) => {
    const newPage = event.selected + 1;
    setPage(newPage);
  };

  const handleReportType = async (e) => {
    setReportType(e.target.value)
    setPage(1)
    setFilterData({
      isReset: false
    })
  }


  useEffect(() => {
    // reportAbuseListing();
  }, [filterData, page, sort, pageSize]);

  const handleReset = () => {
    setFilterData({
      artworkStatus: "",
      searchkey: "",
      startDate: "",
      endDate: "",
      isReset: true,
      isFilter: false,
      category: "",
    });
    setPage(1);
    setSearchTerm("");
    setPageSize(10);
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
  const statusPage = (e) => {
    setPage(1);
    setFilterData({
      ...filterData,
      category: e.target.value,
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

  const dynamicPage = (e) => {
    setPage(1);
    setPageSize(e.target.value);
  };

  return (
    <div>
      <div className="bg-[#F9F9F9] dark:bg-slate-900">
        <div className="px-3 py-4">
          <div className="bg-white border border-[#E9EDF9] rounded-lg dark:bg-slate-800 dark:border-[#ffffff38]">
            <form className="border-b border-b-[#E3E3E3] 2xl:flex gap-2 px-4 py-3">
              <div className="col-span-2 flex flex-wrap  items-center w-full justify-between">
                <div className="flex items-center lg:pt-0 pt-3 flex-wrap justify-center mb-2 2xl:mb-0">
                  {currentUrl === "/customer-manager/artwork" ? (
                    <div className="mr-2" onClick={() => navigate(-1)}>
                      <BsArrowLeftCircle className="cursor-pointer w-5 h-5 text-slate-600" />
                    </div>
                  ) : null}
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
                      placeholder={t("SEARCH_BY_NAME_USER_ID")}
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
                  <div className="flex items-center  ml-3 mb-3">
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
                  </div>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="bg-gradientTo text-sm px-8 ml-3 mb-3 py-2 rounded-lg items-center border border-transparent text-white hover:bg-DarkBlue sm:w-auto w-1/2"
                  >
                    {t("O_RESET")}
                  </button>
                </div>
                <div className="flex mb-3">
                  <select name='report' id='report' style={{
                    border: 'solid 1px #d9d9d9',
                    padding: '5px 10px',
                    height: '40px',
                    outline: 'none',
                    borderRadius: '8px'
                  }}
                    value={reportTypes}
                    onChange={handleReportType}

                  >
                    {/* <option value=''>{t('SELECT_REPORT')}</option> */}
                    <option value='image'>{t('REPORT_POSTS')}</option>
                    <option value='video'>{t('REPORT_VIDEO')}</option>
                    <option value='profile'>{t('REPORT_PROFILE')}</option>
                  </select>
                </div>
              </div>
            </form>
            {currentUrl === "/report_abuse_manager" && reportTypes === 'profile' && (
              <Table
                reportAbuseListing={reportAbuseListing}
                page={page}
                setSort={setSort}
                sort={sort}
                manager={manager}
                handleToggle={handleToggle}
                handleUserView={handleUserView}
                postData={postData}
              />
            )}

            {currentUrl === "/report_abuse_manager" && reportTypes === 'image' && (
              <ImageTable
                reportAbuseListing={reportAbuseListing}
                page={page}
                setSort={setSort}
                sort={sort}
                manager={manager}
                handleView={handleView}
                handleToggle={handleToggle}
                postData={postData}
              />
            )}

            {currentUrl === "/report_abuse_manager" && reportTypes === 'video' && (
              <VideoTable
                reportAbuseListing={reportAbuseListing}
                page={page}
                manager={manager}
                handleToggle={handleToggle}
                postData={postData}
                handleCopy={handleCopy}
              />
            )}

            <div className="flex justify-between">
              <div className="flex items-center mb-3 ml-3">
                <p className="w-[160px] -space-x-px pt-5 md:pb-5 pr-5 text-gray-500">
                  Page Size
                </p>

                <select
                  id="countries"
                  type=" password"
                  name="floating_password"
                  className=" w-[100px] block p-2 px-2 w-full text-sm text-[#A5A5A5] bg-transparent border-2 rounded-lg border-[#DFDFDF]  dark:text-[#A5A5A5] focus:outline-none focus:ring-0  peer"
                  placeholder=""
                  value={pageSize}
                  onChange={(e) => dynamicPage(e)}
                >
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
              </div>

              {paginationObj?.totalItems ? (
                <Pagination
                  handlePageClick={handlePageClick}
                  options={paginationObj}
                  isDelete={isDelete}
                  page={page}
                />
              ) : null}
            </div>

            {toggle && <ViewReportAbuse onHide={handleToggle} viewData={viewData} reportTypes={reportTypes} page={page} />}


            {viewShowModal && <UserViewDetail onHide={handleUserView} item={item}/>}

          </div>
        </div>
      </div>
    </div>
  );
}

export default ReportAbuse;
