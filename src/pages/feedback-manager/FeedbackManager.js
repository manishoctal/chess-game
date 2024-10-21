import React, { useContext, useEffect, useState } from "react";
import { apiGet } from "../../utils/apiFetch";
import apiPath from "../../utils/apiPath";
import Pagination from "../Pagination";
import AuthContext from "context/AuthContext";
import dayjs from "dayjs";
import ODateRangePicker from "components/shared/datePicker/ODateRangePicker";
import { useTranslation } from "react-i18next";
import PageSizeList from "components/PageSizeList";
import helpers from "utils/helpers";
import OSearch from "components/reusable/OSearch";
import { BiReset } from "react-icons/bi";
import FeedbackManagerTable from "./FeedbackManagerTable";
import { GoDownload } from "react-icons/go";

function FeedbackManager() {
  const { t } = useTranslation();
  const { logoutUser, notification, user ,updatePageName} = useContext(AuthContext);
  const [paginationObj, setPaginationObj] = useState({
    page: 1,
    pageCount: 1,
    pageRangeDisplayed: 10,
  });
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const manager = user?.permission?.find((e) => e.manager === "feedback_manager") ?? {};
  const [searchTerm, setSearchTerm] = useState("");
  const [allCommunity, setAllCommunity] = useState([]);

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

  // get all notification function start
  const getAllNotifications = async () => {
    try {
      const { startDate, endDate, searchkey, community, status } = filterData;

      const payload = {
        page,
        community,
        sortType: sort.sortType,
        status,
        sortBy: sort.sortBy,
        startDate: startDate ? dayjs(startDate).format("YYYY-MM-DD") : null,
        pageSize,
        endDate: endDate ? dayjs(endDate).format("YYYY-MM-DD") : null,
        keyword: helpers.normalizeSpaces(searchkey) || null,
      };

      const path = apiPath.feedbackListing;
      const result = await apiGet(path, payload);
      if (result?.status === 200) {
        const response = result?.data?.results;
        const resultStatus = result?.data?.success;

        setAllCommunity(response?.docs);

        setPaginationObj({
          ...paginationObj,
          pageCount: helpers.ternaryCondition(resultStatus, response.totalPages, null),
          totalItems: helpers.ternaryCondition(resultStatus, response.totalDocs, null),
          perPageItem: helpers.ternaryCondition(resultStatus, response?.docs.length, null),
          page: helpers.ternaryCondition(resultStatus, response.page, null),
        });
      }
    } catch (error) {
      setPaginationObj({});
      console.error("error ", error);
      if (error.response.status === 401 || error.response.status === 409) {
        logoutUser();
      }
    }
  };

  const handlePageClick = (event) => {
    const newPage = event.selected + 1;
    setPage(newPage);
  };

  useEffect(() => {
    getAllNotifications();
  }, [page, filterData, sort, pageSize]);


  // debounce search start
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

  // debounce search end

  const handleReset = () => {
    setFilterData({
      status: "",
      isReset: true,
      isFilter: false,
      category: "",
      community: "",
      startDate: "",
      endDate: "",
      searchkey: "",
    });
    setSearchTerm("");
    setPage(1);
  };

  const handleDateChange = (start, end) => {
    setPage(1);
    setFilterData({
      ...filterData,
      endDate: end,
      startDate: start,
      isFilter: true,
    });
  };

  const onCsvDownload = async () => {

    const { startDate, endDate, searchkey, community, status } = filterData;

    const payload = {
      community,
      status,
      startDate: startDate ? dayjs(startDate).format("YYYY-MM-DD") : null,
      endDate: endDate ? dayjs(endDate).format("YYYY-MM-DD") : null,
      keyword: helpers.normalizeSpaces(searchkey) || null,
      sortBy: sort.sortBy,
      sortType: sort.sortType,
    };

    try {
      const path = apiPath.downloadFeedback;
      const result = await apiGet(path,payload);
      if (result?.data?.success) {
        helpers.downloadFile(result?.data?.results?.filePath);
      }
    } catch (error) {
      console.error("error in get all dashboard list==>>>>", error.message);
    }
  };

  const handleUserViewPage = () => {
    updatePageName(` ${t("VIEW") + " " + t("USER_MANAGER")}`);
  };

  const dynamicPage = (e) => {
    setPage(1);
    setPageSize(e.target.value);
  };


  return (
    <div>
      <div className="bg-[#F9F9F9] dark:bg-slate-900">
        <div className="px-3 py-4">
          <div className="bg-white border border-[#E9EDF9] rounded-lg dark:bg-gray-800 dark:mt-4">
            <form className="border-b border-b-[#E3E3E3] 2xl:flex gap-2 px-4 py-3">
              <div className="col-span-2 flex flex-wrap  items-center">
                <div className="flex items-center lg:pt-0 pt-3 flex-wrap justify-center mb-2 2xl:mb-0">
                  <div className="relative flex items-center mb-3">
                    <OSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} placeholder={t("SEARCH_BY_KEYWORD")} />
                  </div>
                  <ODateRangePicker handleDateChange={handleDateChange} isReset={filterData?.isReset} setIsReset={setFilterData} />

                  <button type="button" onClick={handleReset} title={t("O_RESET")} className="bg-gradientTo text-sm px-6 flex gap-2 ml-3 mb-3 py-2 rounded-lg items-center border border-transparent text-white hover:bg-DarkBlue sm:w-auto w-1/2">
                    <BiReset size={18} />
                    {t("O_RESET")}
                  </button>
                  <div className="p-5">
                    <button
                      onClick={onCsvDownload} type="button" className="bg-gradientTo text-sm px-6 flex gap-2  mb-3 py-2 rounded-lg items-center border border-transparent text-white hover:bg-DarkBlue sm:w-auto w-1/2"
                    >
                      <GoDownload size={18} className="" />
                      {t("DOWNLOAD_FEEDBACK")}
                    </button>
                  </div>

                </div>
              </div>

              <div className="2xl:ml-auto xl:ml-0 lg:pt-0 pt-2">
                <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">
                  {t("O_SEARCH")}
                </label>


              </div>
            </form>


            <FeedbackManagerTable
              allCommunity={allCommunity}
              notification={notification}
              getAllNotifications={getAllNotifications}
              page={page}
              setSort={setSort}
              handleUserViewPage={handleUserViewPage}
              sort={sort}
              pageSize={pageSize}
              manager={manager}
              paginationObj={paginationObj}
            />


            <div className="flex justify-between">
              {paginationObj?.totalItems ? (
                <>
                  <PageSizeList dynamicPage={dynamicPage} pageSize={pageSize} />
                  <Pagination handlePageClick={handlePageClick} options={paginationObj} page={page} />
                </>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default FeedbackManager;
