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
import SearchWithOption from '../../components/reusable/SearchableDropdown'
function User() {
  const { t } = useTranslation();
  const location = useLocation();
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
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);

  const [filterData, setFilterData] = useState({
    isKYCVerified: "",
    category: "",
    userId: "",
    startDate: "",
    endDate: "",
    isReset: false,
    isFilter: false,
  });
  const [sort, setSort] = useState({
    sortBy: "createdAt",
    sortType: "desc",
  });

  // get all user start
  const getAllUser = async () => {
    try {
      const { category, startDate, endDate, searchkey, isKYCVerified, userId } = filterData;

      const payload = {
        page,
        pageSize: pageSize,
        status: category,
        startDate: startDate ? dayjs(startDate).format("YYYY-MM-DD") : null,
        endDate: endDate ? dayjs(endDate).format("YYYY-MM-DD") : null,
        keyword: searchkey?.trim(),
        sortKey: sort?.sortBy,
        sortType: sort?.sortType,
        isKYCVerified,
        userId: userId || null
      };

      const path = apiPath.getUsers;
      const result = await apiGet(path, payload);

      if (result?.status === 200) {
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
  }, [page, filterData, sort, pageSize]);

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
      category: "",
      kycStatus: "",
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


  const [filteredItems, setFilteredItems] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  // debounce search start
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm?.trim());
    }, 500);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [searchTerm]);
  const statusPage = (e) => {
    setFilterData({
      ...filterData,
      category: e.target.value,
      isFilter: true,
      isReset: false,
    });
    setPage(1);
  };
  const [isSelected, setIsSelected] = useState(false)
  // debounce search start



  // search option start
  const handleSearchOption = async (event) => {
    const value = event;
    if (value === '') {
      setFilteredItems([]);
      setDropdownVisible(false);
    } else {
      try {

        const payload = {
          keyword: event
        };
        const path = apiPath.searchUsers;
        const result = await apiGet(path, payload);
        if (result?.status === 200) {
          const resultData = result?.data?.results
          setFilteredItems(resultData);
        }

      } catch (error) {
        console.error("error ", error);
      }
      setDropdownVisible(true);
    }
  };

  // search option end

  useEffect(() => {
    if (!isInitialized) {
      setIsInitialized(true);
    } else if ((searchTerm || !filterData?.isReset) && !isSelected) {
      handleSearchOption(debouncedSearchTerm)
      setPage(1);
    }
  }, [debouncedSearchTerm]);

  // debounce search end
  const manager = user?.permission?.find((e) => e.manager === "user_manager");

  return (
    <div>
      <div className="bg-[#F9F9F9] dark:bg-slate-900">
        <div className="px-3 py-4">

          <div className="bg-white border border-[#E9EDF9] rounded-lg dark:bg-slate-800 dark:border-[#ffffff38]">
            <form className="border-b border-b-[#E3E3E3]  px-4 py-3 pt-5 flex flex-wrap justify-between">
              <div className="flex flex-wrap items-center">
                <div className="flex items-center lg:pt-0 pt-3 justify-center">
                  <ODateRangePicker handleDateChange={handleDateChange} isReset={filterData?.isReset} setIsReset={setFilterData} />

                  <div className="flex items-center mb-3 ml-3">
                    <select
                      id="countries"
                      type="password"
                      name="floating_password"
                      className="block p-2 w-full text-sm text-[#A5A5A5] bg-transparent border-2 rounded-lg border-[#DFDFDF]  dark:text-[#A5A5A5] focus:outline-none focus:ring-0  peer"
                      placeholder=" "
                      value={filterData?.category}
                      onChange={statusPage}
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
                    onClick={() => handleReset()}
                    className="bg-gradientTo text-sm px-8 ml-3 mb-3 py-2 rounded-lg items-center border border-transparent text-white hover:bg-DarkBlue sm:w-auto w-1/2"
                    title={t("O_RESET")}
                  >
                    {t("O_RESET")}
                  </button>
                </div>
              </div>
              <div className="flex items-center md:justify-end px-4">
                <label htmlFor="default-search" className="mb-2 font-medium text-sm  text-gray-900 sr-only">

                  {t("USER_ID_EMAIL_MOBILE")}
                </label>
                <div className="flex">
                  <div className="relative">
                    <SearchWithOption searchTerm={searchTerm} setIsSelected={setIsSelected} setFilterData={setFilterData} filterData={filterData} setSearchTerm={setSearchTerm} filteredItems={filteredItems} dropdownVisible={dropdownVisible} setDropdownVisible={setDropdownVisible} setFilteredItems={setFilteredItems} placeholder={t('USER_ID_EMAIL_MOBILE')} />
                  </div>
                </div>
              </div>
            </form>
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
