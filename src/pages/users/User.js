import React, { useContext, useEffect, useState } from "react";
import { apiGet } from "../../utils/apiFetch";
import apiPath from "../../utils/apiPath";
import Table from "./Table";
import Pagination from "../Pagination";
import AuthContext from "context/AuthContext";
import dayjs from "dayjs";
import ODateRangePicker from "components/shared/datePicker/ODateRangePicker";
import { useTranslation } from "react-i18next";
import PageSizeList from "components/PageSizeList";
import helpers from "utils/helpers";
import { useLocation } from "react-router-dom";
import { BiDownload, BiReset } from "react-icons/bi";
import OSearch from "components/reusable/OSearch";
import { GoDownload } from "react-icons/go";
function User() {
  const { t } = useTranslation();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);
  const { logoutUser, user, updatePageName } = useContext(AuthContext);
  const [paginationObj, setPaginationObj] = useState({
    page: 1,
    pageCount: 1,
    pageRangeDisplayed: 10,
  });

  const [users, setAllUser] = useState([]);
  const [userType] = useState(location?.state?.userType ? location?.state?.userType : "tourist");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isDelete] = useState(false);
  const [activeTab, setActiveTab] = useState('Tab1');

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };
  const [filterData, setFilterData] = useState({
    kyc: undefined,
    category: undefined,
    userId: "",
    searchKey: "",
    startDate: "",
    endDate: "",
    isReset: false,
    isFilter: false,
  });
  const [sort, setSort] = useState({
    sortBy: "createdAt",
    sortType: "desc",
  });


  const userResult = helpers?.ternaryCondition(activeTab === "Tab1", false, true)

  const getAllUser = async () => {
    try {
      const { category, startDate, endDate, searchKey, kyc, userId } = filterData;

      const payload = {
        page,
        pageSize: pageSize,
        startDate: startDate ? dayjs(startDate).format("YYYY-MM-DD") : null,
        endDate: endDate ? dayjs(endDate).format("YYYY-MM-DD") : null,
        keyword: helpers.normalizeSpaces(searchKey) || null,
        sortKey: sort?.sortBy,
        sortType: sort?.sortType,
        userId: userId || null,
      };

      if (category && category !== undefined) {
        payload.status = category;
      }

      if (kyc && kyc !== undefined) {
        payload.kyc = kyc;
      }

      const path = `${apiPath.getUsers}/${userResult}`;
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

  // get all user end
  const dynamicPage = (e) => {
    setPage(1);
    setPageSize(e.target.value);
  };

  const handlePageClick = (event) => {
    const newPage = event.selected + 1;
    setPage(newPage);
  };

  const handleUserView = () => {
    updatePageName(` ${t("VIEW") + " " + t("USER_MANAGER")}`);
  };


  useEffect(() => {
    updatePageName(t("O_USERS"));
  }, []);

  const handleReset = () => {
    setFilterData({
      isKYCVerified: "",
      category: undefined,
      kyc: "",
      userId: "",
      startDate: "",
      endDate: "",
      isReset: true,
      isFilter: false,
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
      isReset: false,
    });
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

  const kycStatus = (e) => {
    setFilterData({
      ...filterData,
      isFilter: true,
      isReset: false,
      kyc: e.target.value
    });
    setPage(1);
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

  const manager = user?.permission?.find((e) => e.manager === "user_manager");

  const onCsvDownload = async () => {
    try {
      const { startDate, endDate } = filterData;
      const payloadCsv = {
        startDate: startDate ? helpers.getFormattedDate(startDate) : null,
        endDate: endDate ? helpers.getFormattedDate(endDate) : null,
      };

      const path = apiPath.downloadDashboardCsv;
      const result = await apiGet(path, payloadCsv);
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

          <div className="bg-white border border-[#E9EDF9] rounded-lg dark:bg-slate-800 dark:border-[#ffffff38]">
            <form className="border-b border-b-[#E3E3E3]  px-4 py-3 pt-5 flex flex-wrap">
              <div className="flex items-center md:justify-end mb-3">
                <label htmlFor="default-search" className="mb-2 font-medium text-sm  text-gray-900 sr-only">

                  {t("USER_ID_EMAIL_MOBILE")}
                </label>
                <div className="flex">
                  <div className="relative">
                    <OSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} placeholder={t("USER_ID_EMAIL_MOBILE")} />
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-center">
                <div className="flex items-center lg:pt-0 pt-3 justify-center">
                  <ODateRangePicker handleDateChange={handleDateChange} isReset={filterData?.isReset} setIsReset={setFilterData} />
                  {
                    !userResult && <div className="flex items-center mb-3 ml-3">
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
                        <option value="active">{t("O_ACTIVE")}</option>
                        <option value="inactive">{t("O_INACTIVE")}</option>
                      </select>
                    </div>
                  }


                  <div className="flex items-center mb-3 ml-3">
                    <select
                      id="countries"
                      name="floating_password"
                      className="block p-2 min-w-[100px] text-sm text-[#A5A5A5] bg-transparent border-2 rounded-lg border-[#DFDFDF]  dark:text-[#A5A5A5] focus:outline-none focus:ring-0  peer"
                      placeholder=" "
                      value={filterData?.kyc}
                      onChange={kycStatus}
                    >
                      <option value="">
                        {t("MERCHANT_KYC")}
                      </option>
                      <option value="1">{t("O_YES")}</option>
                      <option value="0">{t("O_NO")}</option>
                    </select>
                  </div>

                  <button
                    type='button'
                    onClick={() => handleReset()}
                    title={t('O_RESET')}
                    className='bg-gradientTo flex gap-2 text-sm px-6 ml-3 mb-3 py-2 rounded-lg items-center border border-transparent text-white hover:bg-DarkBlue sm:w-auto w-1/2'
                  >
                    <BiReset size={18} />
                    {t('O_RESET')}
                  </button>

                </div>
              </div>

            </form>

          <div className="flex items-center justify-between">
          <div className="flex items-center  py-5 px-4">
              <button
                className={` mr-4 text-white active:bg-emerald-600 font-normal text-sm px-8 py-2.5 rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150 ${activeTab === 'Tab1' ? 'bg-gradBlack' : 'bg-gradientTo'}`}
                onClick={() => handleTabClick('Tab1')}
              >
                {t("USERS")}
              </button>
              <button
                className={` text-white active:bg-emerald-600 font-normal text-sm px-8 py-2.5 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 ease-linear transition-all duration-150 ${activeTab === 'Tab2' ? 'bg-gradBlack' : 'bg-gradientTo'}`}
                onClick={() => handleTabClick('Tab2')}
              >
                {t("DELETED_USERS")}
              </button>
            </div>
            <button
               onClick={onCsvDownload}  className={`flex items-center bg-gradientTo mr-4 text-white active:bg-emerald-600 font-normal text-sm px-6 py-2.5 rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-1`}
              >
               <GoDownload size={18} className="mr-2" />
                {t("DOWNLOAD_FEEDBACK")}
              </button>
          </div>

            <Table
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
            />
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
export default User;
