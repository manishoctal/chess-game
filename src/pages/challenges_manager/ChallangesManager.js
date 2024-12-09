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
import { useLocation, useNavigate } from "react-router-dom";
import { BiReset } from "react-icons/bi";
import OSearch from "components/reusable/OSearch";
import CasualTable from "./challenges/CasualTable";
import MonetaryTable from "./challenges/MonetaryTable";
import { GoDownload } from "react-icons/go";

function ChallangesManager() {
  const { t } = useTranslation();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeInactiveStatus, setActiveInactiveStatus] = useState(location?.state ?? "");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);
  
  const { logoutUser, user, updatePageName } = useContext(AuthContext);
  const [paginationObj, setPaginationObj] = useState({
    page: 1,
    pageCount: 1,
    pageRangeDisplayed: 10,
  });

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const [pageSize, setPageSize] = useState(10);
  const [users, setAllUser] = useState([]);
  const [userType] = useState(location?.state?.userType ? location?.state?.userType : "tourist");
  const [activeTab, setActiveTab] = useState(activeInactiveStatus ? activeInactiveStatus : "casual");
  const [page, setPage] = useState(1);
  const [isDelete] = useState(false);
  const navigate = useNavigate();

  const [filterData, setFilterData] = useState({
    category: undefined,
    userId: "",
    isFilter: false,
    matchStatus: undefined,
    searchKey: "",
    endDate: "",
    isReset: false,
    startDate: "",
  });
  const [sort, setSort] = useState({
    sortType: "desc",
    sortBy: "createdAt",
  });


  const userResult = helpers?.ternaryCondition(activeTab === "casual", "casual", "monetary")

  const getAllUser = async () => {
    try {
      const { category, startDate, endDate, searchKey, matchStatus, userId } = filterData;

      const payload = {
        page,
        startDate: startDate ? dayjs(startDate).format("YYYY-MM-DD") : null,
        keyword: helpers.normalizeSpaces(searchKey) || null,
        userId: userId || null,
        pageSize: pageSize,
        endDate: endDate ? dayjs(endDate).format("YYYY-MM-DD") : null,
        sortKey: sort?.sortBy,
        sortType: sort?.sortType,
        status: category
      };


      if (matchStatus && matchStatus !== undefined) {
        payload.matchStatus = matchStatus;
      }
      const path = `${apiPath.challengeManager}/list/${userResult}`;
      const result = await apiGet(path, payload);
      if (result?.data?.success) {
        const response = result?.data?.results;
        setAllUser(response?.docs);
        const resultStatus = result?.data?.success;
        setPaginationObj({
          ...paginationObj,
          page: helpers.ternaryCondition(resultStatus, response.page, null),
          perPageItem: helpers.ternaryCondition(resultStatus, response?.docs.length, null),
          totalItems: helpers.ternaryCondition(resultStatus, response.totalDocs, null),
          pageCount: helpers.ternaryCondition(resultStatus, response.totalPages, null),
        });
      }
    } catch (error) {
      console.error("error ", error);
      setPaginationObj({});
      if (error.response.status === 401 || error.response.status === 409) {
        logoutUser();
      }
    }
  };


  useEffect(() => {
    getAllUser();
  }, [page, filterData, sort, pageSize, activeTab]);
  
  const handlePageClick = (event) => {
    const newPage = event.selected + 1;
    setPage(newPage);
  };

  // get all user end
  const dynamicPage = (e) => {
    setPage(1);
    setPageSize(e.target.value);
  };


  const handleUserView = () => {
    updatePageName(` ${t("VIEW") + " " + t("CASUAL_CHALLENGE")}`);
  };

  const handleMonetryView = () => {
    updatePageName(` ${t("VIEW") + " " + t("MONETARY_CHALLENGE")}`);
  };

  const handleUserViewPage = () => {
    updatePageName(` ${t("VIEW") + " " + t("USER_MANAGER")}`);
  };


  useEffect(() => {
    updatePageName(t("CHALLENGES_MANAGER"));
  }, []);

  const handleReset = () => {
    setFilterData({
      category: "",
      matchStatus: "",
      isFilter: false,
      startDate: "",
      isKYCVerified: "",
      endDate: "",
      userId: "",
      isReset: true,
    });
    navigate({ path: '/users', replace: false, state: {} })
    setPage(1);
    navigate(location.pathname, { replace: true, state: "" });
    setActiveInactiveStatus("");
    setSearchTerm("");
    setPageSize(10);
  };


  const handleDateChange = (start, end) => {
    setPage(1);
    setFilterData({
      ...filterData,
      startDate: start,
      isReset: false,
      isFilter: true,
      endDate: end,
    });
  };


  useEffect(() => {
    if (!isInitialized) {
      setIsInitialized(true);
    } else if (searchTerm || !filterData?.isReset) {
      setFilterData({
        ...filterData,
        isReset: false,
        searchKey: debouncedSearchTerm || "",
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

  const manager = user?.permission?.find((e) => e.manager === "challenges_manager");

  const onCsvDownload = async () => {
    const { category, startDate, endDate, searchKey, userId,matchStatus } = filterData;
    const payload = {
      page,
      startDate: startDate ? dayjs(startDate).format("YYYY-MM-DD") : null,
      keyword: helpers.normalizeSpaces(searchKey) || null,
      userId: userId || null,
      pageSize: pageSize,
      endDate: endDate ? dayjs(endDate).format("YYYY-MM-DD") : null,
      sortKey: sort?.sortBy,
      sortType: sort?.sortType,
      status: category
    };

    if (matchStatus && matchStatus !== undefined) {
      payload.matchStatus = matchStatus;
    }
    try {
      const result = await apiGet(`${apiPath.challengeCSVDownload}/${userResult}`, payload);
      if (result?.data?.success) {
        helpers.downloadFile(result?.data?.results?.filePath);
      }
    } catch (error) {
      console.error("error in get all dashboard list==>>>>", error.message);
    }
  };

  const statusPage = (e) => {
    const selectedValue = e.target.value;
    setFilterData((prevData) => ({
      ...prevData,
      category: selectedValue ? selectedValue : undefined,
      isFilter: true,
      isReset: false,
    }));
    setPage(1);
  };

  const handleMatchStatus = (e) => {
    setFilterData({
      ...filterData,
      isFilter: true,
      isReset: false,
      matchStatus: e.target.value
    });
    setPage(1);
  };

  return (
    <div>
      <div className="bg-[#F9F9F9] dark:bg-slate-900">
        <div className="px-3 py-4">
          <div className="bg-white border border-[#E9EDF9] rounded-lg dark:bg-slate-800 dark:border-[#ffffff38]">
            <form className="border-b border-b-[#E3E3E3]  px-4 py-3 pt-5 flex flex-wrap">
              <div className="flex items-center md:justify-end mb-3">
                <label htmlFor="default-search" className="mb-2 font-medium text-sm  text-gray-900 sr-only">

                  {t("SEARCH_CHALLENGES_ID")}
                </label>
                <div className="flex">
                  <div className="relative">
                    <OSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} placeholder={t("SEARCH_CHALLENGES_ID")} />
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-center">
                <div className="flex items-center lg:pt-0 pt-3 justify-center">
                  <ODateRangePicker handleDateChange={handleDateChange} isReset={filterData?.isReset} setIsReset={setFilterData} />
                  {
                    <div className="flex items-center mb-3 ml-3">


                      <select
                        id="countries"
                        type="password"
                        name="floating_password"
                        className="block p-2 mr-3 w-full text-sm text-[#A5A5A5] bg-transparent border-2 rounded-lg border-[#DFDFDF]  dark:text-[#A5A5A5] focus:outline-none focus:ring-0  peer"
                        placeholder=""
                        value={filterData?.category}
                        onChange={statusPage}
                      >
                        <option value="">
                          {t("ALL_CHALLENGE_TYPE")}
                        </option>
                        <option value="instant">{t("INSTANT")}</option>
                        <option value="schedule">{t("SCHEDULE")}</option>
                      </select>


                      <select
                        id="countries"
                        name="floating_password"
                        className="block p-2 min-w-[150px] text-sm text-[#A5A5A5] bg-transparent border-2 rounded-lg border-[#DFDFDF]  dark:text-[#A5A5A5] focus:outline-none focus:ring-0  peer"
                        placeholder=" "
                        value={filterData?.matchStatus}
                        onChange={handleMatchStatus}
                      >
                        <option value="">
                          {t("ALL_MATCH_STATUS")}
                        </option>
                        <option value="upcoming">{t("NOT_STARTED")}</option>
                        <option value="running">{t("RUNNING")}</option>
                        <option value="complete">{t("COMPLETE")}</option>
                        <option value="cancelled">{t("CANCELLED")}</option>
                      </select>
                    </div>
                  }


                  <button
                    type='button'
                    onClick={() => handleReset()}
                    title={t('O_RESET')}
                    className='bg-gradientTo flex gap-2 text-sm px-6 ml-3 mb-3 py-2 rounded-lg items-center border border-transparent text-white hover:bg-DarkBlue sm:w-auto w-1/2'
                  >
                    <BiReset size={18} />
                    {t('O_RESET')}
                  </button>
                  <button type="button" className="bg-gradientTo text-sm px-6 flex gap-2 ml-3 mb-3 py-2 rounded-lg items-center border border-transparent text-white hover:bg-DarkBlue sm:w-auto w-1/2" title={t("DOWNLOAD_CSV")} onClick={onCsvDownload}>
                    <GoDownload size={18} /> {t("DOWNLOAD_CSV")}
                  </button>
                </div>
              </div>

            </form>

            <div className="flex items-center justify-between">


              <div className="flex items-center p-5">
                <button
                  className={` mr-4 text-white active:bg-emerald-600 font-normal text-sm px-8 py-2.5 rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150 ${activeTab === 'casual' ? 'bg-gradBlack' : 'bg-gradientTo'}`}
                  onClick={() => handleTabClick('casual')}
                >
                  {t("CASUAL_CHALLENGE")}
                </button>
                <button
                  className={` text-white active:bg-emerald-600 font-normal text-sm px-8 py-2.5 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 ease-linear transition-all duration-150 ${activeTab === 'monetary' ? 'bg-gradBlack' : 'bg-gradientTo'}`}
                  onClick={() => handleTabClick('monetary')}
                >
                  {t("MONETARY_CHALLENGE")}
                </button>
              </div>
            </div>

            {
              helpers?.ternaryCondition(activeTab === "casual", <CasualTable
                users={users}
                user={user}
                getAllUser={getAllUser}
                handleUserView={handleUserView}
                page={page}
                setSort={setSort}
                sort={sort}
                setPage={setPage}
                pageSize={pageSize}
                userType={userType}
                manager={manager}
                userResult={userResult}
                handleUserViewPage={handleUserViewPage}
              />, <MonetaryTable
                users={users}
                user={user}
                getAllUser={getAllUser}
                handleUserView={handleMonetryView}
                page={page}
                setSort={setSort}
                sort={sort}
                setPage={setPage}
                pageSize={pageSize}
                userType={userType}
                manager={manager}
                handleUserViewPage={handleUserViewPage}
                userResult={userResult}
              />
              )
            }

            <div className="flex justify-between">
              <PageSizeList dynamicPage={dynamicPage} pageSize={pageSize} />
              {paginationObj?.totalItems ? (
                <Pagination handlePageClick={handlePageClick} options={paginationObj} isDelete={isDelete} page={page} />
              ) : null}
            </div>
          </div>
        </div>
      </div>





    </div>
  );
}
export default ChallangesManager;
