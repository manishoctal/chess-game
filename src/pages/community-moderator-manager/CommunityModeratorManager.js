import React, { useContext, useEffect, useState } from "react";
import Pagination from "../Pagination";
import AuthContext from "context/AuthContext";
import CommunityModeratorManagerTable from "./CommunityModeratorManagerTable";
import dayjs from "dayjs";
import apiPath from "../../utils/apiPath";
import ODateRangePicker from "components/shared/datePicker/ODateRangePicker";
import { useTranslation } from "react-i18next";
import PageSizeList from "components/PageSizeList";
import helpers from "utils/helpers";
import { apiGet, apiPut } from "../../utils/apiFetch";
import OSearch from "components/reusable/OSearch";
import { BiReset } from "react-icons/bi";
import useToastContext from "hooks/useToastContext";

function CommunityModeratorManager() {
  const { logoutUser, user ,updatePageName} = useContext(AuthContext);
  const notification = useToastContext();
  const manager = user?.permission?.find((e) => e.manager === "community_moderator" || "achievement_and_badges") ?? {};
  const [paginationObj, setPaginationObj] = useState({
    page: 1,
    pageCount: 1,
    pageRangeDisplayed: 10,
  });
  
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [allCommunity, setAllCommunity] = useState([]);
  const { t } = useTranslation();

  const [filterData, setFilterData] = useState({
    category: "",
    searchkey: "",
    startDate: "",
    community: "",
    endDate: "",
    isReset: false,
    isFilter: false,
    
  });
  const [sort, setSort] = useState({
    sortBy: "createdAt",
    sortType: "desc",
  });



  // get all notification function start
  const getAllCommunity = async (data, pageNO) => {
    
    try {
      const { startDate, endDate, searchkey, community,category } = filterData;

      const payload = {
        page,
        startDate: startDate ? dayjs(startDate).format("YYYY-MM-DD") : null,
        endDate: endDate ? dayjs(endDate).format("YYYY-MM-DD") : null,
        keyword: helpers.normalizeSpaces(searchkey) || null,
        sortBy: sort.sortBy,
        sortType: sort.sortType,
        pageSize,
        community,
        status:category,
      };

      const path = apiPath.communityModeratror;
      const result = await apiGet(path, payload);
      console.log("result",result)
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
    getAllCommunity();
  }, [page, filterData, sort, pageSize]);
  // get all notification function end

  const handlePageClick = (event) => {
    const newPage = event.selected + 1;
    setPage(newPage);
  };

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


  const handleUserView = () => {
    updatePageName(` ${t("VIEW") + " " + t("COMMUNITY_MODERATOR_MANAGER")}`);
  };

  const handleReset = () => {
    setFilterData({
      searchkey: "",
      community: "",
      status: "",
      category: "",
      startDate: "",
      endDate: "",
      isReset: true,
      isFilter: false,
    });
    setSearchTerm("");
    setPage(1);
  };

  useEffect(() => {
    updatePageName(t("COMMUNITY_MODERATOR_MANAGER"));
  }, []);

  const handleDateChange = (start, end) => {
    setPage(1);
    setFilterData({
      ...filterData,
      startDate: start,
      endDate: end,
      isFilter: true,
    });
  };

  const handleUserViewPage = () => {
    updatePageName(` ${t("VIEW") + " " + t("USER_MANAGER")}`);
  };

  const dynamicPage = (e) => {
    setPage(1);
    setPageSize(e.target.value);
  };

  const communityStatusChange = (e) => {
    setPage(1);
    setFilterData({ ...filterData, community: e.target.value, isFilter: true });
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

  const handelStatusChange = async (item) => {
    try {
      const payload = {
        status: item?.status === "inactive" ? "active" : "inactive",
        type: "post",
      };
      const path = `${apiPath.changeStatus}/${item?._id}`;
      const result = await apiPut(path, payload);
      if (result?.status === 200) {
        getAllCommunity({ statusChange: 1 });
        notification.success(result.data.message);
       
      }
    } catch (error) {
      console.error("error in get all users list==>>>>", error.message);
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
                    <OSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} placeholder={t("COMMUNITY_MODERATOR_SEARCH_PLACEHOLDER")} />
                  </div>
                  <ODateRangePicker handleDateChange={handleDateChange} isReset={filterData?.isReset} setIsReset={setFilterData} />
                  {(
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
                        <option value="active">{t("O_ACTIVE")}</option>
                        <option value="inactive">{t("O_INACTIVE")}</option>
                      </select>
                    </div>
                  )}

                  {(
                    <div className="flex items-center mb-3 ml-3">
                      <select
                        id="countries"
                        type=" password"
                        name="floating_password"
                        className="block p-2 w-full text-sm text-[#A5A5A5] bg-transparent border-2 rounded-lg border-[#DFDFDF]  dark:text-[#A5A5A5] focus:outline-none focus:ring-0  peer"
                        placeholder=" "
                        value={filterData?.community}
                        onChange={(e) => communityStatusChange(e)}
                      >
                        <option defaultValue value="">
                          {t("O_COMMUNITY")}
                        </option>
                        <option value="global">{t("O_COMMUNITY_GLOBAL")}</option>
                        <option value="friend">{t("O_COMMUNITY_FRIENDS")}</option>
                      </select>
                    </div>
                  )}
                  <button type="button" onClick={handleReset} title={t("O_RESET")} className="bg-gradientTo text-sm px-6 flex gap-2 ml-3 mb-3 py-2 rounded-lg items-center border border-transparent text-white hover:bg-DarkBlue sm:w-auto w-1/2">
                    <BiReset size={18} />
                    {t("O_RESET")}
                  </button>
                </div>
              </div>

              <div className="2xl:ml-auto xl:ml-0 lg:pt-0 pt-2">
                <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">
                  {t("O_SEARCH")}
                </label>
              </div>
            </form>


            <CommunityModeratorManagerTable
              allCommunity={allCommunity}
              notification={notification}
              getAllCommunity={getAllCommunity}
              page={page}
              handleUserView={handleUserView}
              handleUserViewPage={handleUserViewPage}
              setSort={setSort}
              sort={sort}
              pageSize={pageSize}
              manager={manager}
              paginationObj={paginationObj}
              handelStatusChange={handelStatusChange}
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
export default CommunityModeratorManager;
