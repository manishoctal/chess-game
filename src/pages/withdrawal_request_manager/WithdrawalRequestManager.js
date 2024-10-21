import apiPath from "../../utils/apiPath";
import { useTranslation } from "react-i18next";
import AuthContext from "context/AuthContext";
import React, { useContext, useEffect, useState } from "react";
import Pagination from "../Pagination";
import OSearch from "components/reusable/OSearch";
import { BiReset } from "react-icons/bi";
import { GoDownload } from "react-icons/go";
import dayjs from "dayjs";
import { apiGet } from "../../utils/apiFetch";
import ODateRangePicker from "components/shared/datePicker/ODateRangePicker";
import PageSizeList from "components/PageSizeList";
import WithdrawalRequestTable from "./WithdrawalRequestTable";
import helpers from "utils/helpers";

function WithdrawalRequestManager() {
  const { logoutUser, notification, user } = useContext(AuthContext);
  const manager = user?.permission?.find((e) => e.manager === "widthDrawal_request_manager") ?? {};
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [paginationObj, setPaginationObj] = useState({
    page: 1,
    pageCount: 1,
    pageRangeDisplayed: 10,
  });
  
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isInitialized, setIsInitialized] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [allCommunity, setAllCommunity] = useState([]);

  const [filterData, setFilterData] = useState({
    category: "",
    searchkey: "",
    startDate: "",
    endDate: "",
    isReset: false,
    isFilter: false,
    status: "",
  });
  const [sort, setSort] = useState({
    sortBy: "createdAt",
    sortType: "desc",
  });

  // get all notification function start
  const getAllWithdrawal = async () => {
    try {
      const { startDate, endDate, searchkey, community, category } = filterData;

      const payload = {
        pageSize,
        status:category,
        sortType: sort.sortType,
        page,
        community,
        keyword: helpers.normalizeSpaces(searchkey) || null,
        endDate: endDate ? dayjs(endDate).format("YYYY-MM-DD") : null,
        startDate: startDate ? dayjs(startDate).format("YYYY-MM-DD") : null,
        sortBy: sort.sortBy,
      };

      const path = apiPath.withdrawalManagerList;
      const result = await apiGet(path, payload);
      if (result?.status === 200) {
        const response = result?.data?.results;
        const resultStatus = result?.data?.success;

        setAllCommunity(response?.docs);

        setPaginationObj({
          ...paginationObj,
          page: helpers.ternaryCondition(resultStatus, response.page, null),
          pageCount: helpers.ternaryCondition(resultStatus, response.totalPages, null),
          perPageItem: helpers.ternaryCondition(resultStatus, response?.docs.length, null),
          totalItems: helpers.ternaryCondition(resultStatus, response.totalDocs, null),
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

  useEffect(() => {
    getAllWithdrawal();
  }, [page, filterData, sort, pageSize]);



  const handlePageClick = (event) => {
    const newPage = event.selected + 1;
    setPage(newPage);
  };

  const handleDateChange = (start, end) => {
    setPage(1);
    setFilterData({
      ...filterData,
      startDate: start,
      isFilter: true,
      endDate: end,
    });
  };
  // debounce search start
  useEffect(() => {
    if (!isInitialized) {
      setIsInitialized(true);
    } else if (searchTerm || !filterData?.isReset) {
      setFilterData({
        ...filterData,
        searchkey: debouncedSearchTerm || "",
        isFilter: !!debouncedSearchTerm,
        isReset: false,
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
      isReset: true,
      isFilter: false,
      startDate: "",
      status: "",
      community: "",
      category: "",
      searchkey: "",
      endDate: "",
    });
    setSearchTerm("");
    setPage(1);
  };

 

  const dynamicPage = (e) => {
    setPage(1);
    setPageSize(e.target.value);
  };

  const statusPage = (e) => {
    const selectedValue = e.target.value;

    setFilterData((prevData) => ({
      ...prevData,
      category: selectedValue,
      isFilter: true,
      isReset: false,
    }));
    setPage(1);
  };

  const onCsvDownload = async () => {

    try {
      const { startDate, endDate, searchkey, status } = filterData;

      const payload = {
        status,
        startDate: startDate ? dayjs(startDate).format("YYYY-MM-DD") : null,
        endDate: endDate ? dayjs(endDate).format("YYYY-MM-DD") : null,
        sortBy: sort.sortBy,
        keyword: helpers.normalizeSpaces(searchkey) || null,
        sortType: sort.sortType,
      }
      const path = apiPath.downloadExcelWithdrawal;
      const result = await apiGet(path, payload);
      if (result?.data?.success) {
        helpers.downloadFile(result?.data?.results?.filePath);
      }
    } catch (error) {
      console.error("error in get all dashboard list==>>>>", error.message);
    }
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
                    <OSearch setSearchTerm={setSearchTerm} placeholder={t("SEARCH_BY_FULL_NAME_USER_MOBILE_USER_NAME")} searchTerm={searchTerm}  />
                  </div>
                  <ODateRangePicker handleDateChange={handleDateChange} isReset={filterData?.isReset} setIsReset={setFilterData} />
                  <div className="flex items-centerml-3">
                    <div className="flex items-center mb-3 ml-3">
                    <select
                        id="countries"
                        type="password"
                        name="floating_password"
                        className="block p-2 w-full text-sm text-[#A5A5A5] bg-transparent border-2 rounded-lg border-[#DFDFDF]  dark:text-[#A5A5A5] focus:outline-none focus:ring-0  peer"
                        placeholder=""
                        value={filterData?.category}
                        onChange={statusPage}
                      >
                        <option value="">
                          {t("O_ALL")}
                        </option>
                        <option value="accepted">{t("ACCEPTED")}</option>
                        <option value="rejected">{t("REJECTED")}</option>
                        <option value="pending">{t("PENDING")}</option>
                      </select>
                    </div>

                  </div>
                  <button type="button" onClick={handleReset} title={t("O_RESET")} className="bg-gradientTo text-sm px-6 flex gap-2 ml-3 mb-3 py-2 rounded-lg items-center border border-transparent text-white hover:bg-DarkBlue sm:w-auto w-1/2">
                    <BiReset size={18} />
                    {t("O_RESET")}
                  </button>
                  <div className="p-5">
                    <button
                      onClick={onCsvDownload} type="button" className="bg-gradientTo text-sm px-6 flex gap-2  mb-3 py-2 rounded-lg items-center border border-transparent text-white hover:bg-DarkBlue sm:w-auto w-1/2"
                    >
                      <GoDownload size={18} className="" />
                      {t("EXPORT_DATA_CSV")}
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


            <WithdrawalRequestTable
              allCommunity={allCommunity}
              notification={notification}
              getAllWithdrawal={getAllWithdrawal}
              page={page}
              setSort={setSort}
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
export default WithdrawalRequestManager;
