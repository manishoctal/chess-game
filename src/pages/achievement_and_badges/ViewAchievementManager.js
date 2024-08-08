import React, { useContext, useEffect, useState } from "react";
import { apiGet } from "../../utils/apiFetch";
import apiPath from "../../utils/apiPath";
import Pagination from "../Pagination";
import dayjs from "dayjs";
import ODateRangePicker from "components/shared/datePicker/ODateRangePicker";
import { useTranslation } from "react-i18next";
import AuthContext from "context/AuthContext";
import PageSizeList from "components/PageSizeList";
import OSearch from "components/reusable/OSearch";
import { Link, useLocation, useNavigate } from "react-router-dom";
import helpers from "utils/helpers";
import { FaCircleArrowLeft } from "react-icons/fa6";
import { BiReset } from "react-icons/bi";
import AchievementUser from "./AchievementUser";
import { startCase } from "lodash";
import OImage from "components/reusable/OImage";
import ShowImage from "./ShowImage";

function ViewAchievementManager() {
  const { t } = useTranslation();
  const router = useNavigate();
  const { state } = useLocation();
  const { user, updatePageName } = useContext(AuthContext);
  const [pageSize, setPageSize] = useState(10);
  const [isDelete] = useState(false);
  const [showImage, setShowImage] = useState();
  const [showBanner, setShowBanner] = useState(false);
  const [sort, setSort] = useState({
    sortBy: "createdAt",
    sortType: "desc",
  });
  useEffect(() => {
    if (!state?._id) {
      router("/achievement-and-badges");
    }
  }, [state]);

  const manager = user?.permission?.find((e) => e.manager === "achievement_and_badges") ?? {};
  const [subscriptionUsers, setSubscriptionUsers] = useState();
  const [page, setPage] = useState(1);
  const [filterData, setFilterData] = useState({
    category: "",
    searchKey: "",
    startDate: "",
    endDate: "",
    isReset: false,
    isFilter: false,
  });
  const [viewPaginationObj, setPaginationViewObj] = useState({
    page: 1,
    pageCount: 1,
    pageRangeDisplayed: 10,
  });
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // get all offer list start
  const ViewAllSubscriptionList = async () => {
    try {
      const { category, startDate, endDate, searchKey } = filterData;
      const payloadData = {
        page,
        pageSize: pageSize,
        status: category,
        startDate: startDate ? dayjs(startDate).format("YYYY-MM-DD") : null,
        endDate: endDate ? dayjs(endDate).format("YYYY-MM-DD") : null,
        keyword: helpers.normalizeSpaces(searchKey) || null,
        sortBy: sort.sortBy,
        sortType: sort.sortType,
      };

      const path = apiPath.getAchievementUsers + "/" + state?._id;
      const result = await apiGet(path, payloadData);
      const response = result?.data?.results;
      const resultStatus = result?.data?.success;
      setSubscriptionUsers(response);
      setPaginationViewObj({
        ...viewPaginationObj,
        page: resultStatus ? response.page : null,
        pageCount: resultStatus ? response.totalPages : null,
        perPageItem: resultStatus ? response?.docs.length : null,
        totalItems: resultStatus ? response.totalDocs : null,
      });
    } catch (error) {
      console.error("error in get all badges list==>>>>", error.message);
    }
  };

  const dynamicPage = (e) => {
    setPage(1);
    setPageSize(e.target.value);
  };

  const handleReset = () => {
    setFilterData({
      category: "",
      startDate: "",
      searchKey: "",
      endDate: "",
      isReset: true,
      isFilter: false,
    });
    setPage(1);
    setSearchTerm("");
    setPageSize(10);
  };

  useEffect(() => {
    // api call function
    ViewAllSubscriptionList();
  }, [filterData, page, sort, pageSize]);

  // get all offer list end

  const handlePageClick = (event) => {
    const newPage = event.selected + 1;
    setPage(newPage);
  };
  const adminStatusPage = (e) => {
    setFilterData({ ...filterData, category: e.target.value, isFilter: true });
  };

  // debounce search start
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
    const timeoutId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [searchTerm]);

  // debounce search end

  useEffect(() => {
    updatePageName(t("VIEW_ACHIEVEMENT_AND_BADGES_MANAGER"));
  }, []);

  const getTableData = (details, inputClass) => {
    return <td className={`py-2 px-4 border-r border dark:border-[#ffffff38] text-center font-semibold ${inputClass || ""}`}>{details || "N/A"}</td>;
  };

  const getTableHeader = (name) => {
    return <th className="text-center py-3 px-6">{t(name)}</th>;
  };

  const handleShowImage = (showData) => {
    setShowImage(showData);
    setShowBanner(!showBanner);
  };

  return (
    <div>
      <div className="bg-[#F9F9F9] dark:bg-slate-900">
        <div className="px-3 py-4">
          <div className="flex active mb-5 ml-4 ">
            <Link aria-current="page" className="" to={-1}>
              <FaCircleArrowLeft size={27} />
            </Link>
          </div>
          <div className="m-5">
            <table className="w-full text-xs text-left text-[#A5A5A5] dark:text-gray-400 ">
              <thead className="text-xs text-gray-900 border border-[#E1E6EE] bg-[#E1E6EE] dark:bg-gray-700 dark:text-gray-400 dark:border-[#ffffff38]">
                <tr>
                  {getTableHeader("ID")}
                  {getTableHeader("TYPE")}
                  {getTableHeader("NAME")}
                  {getTableHeader("DESCRIPTION")}
                  {getTableHeader("CRITERIA")}
                  {getTableHeader("GAME_TYPE")}
                  {getTableHeader("WON_MATCH_ELO_RATING")}
                  {getTableHeader("O_CREATED_AT")}
                  {getTableHeader("IMAGE")}
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 ">
                  {getTableData(state?.achievementId)}
                  {getTableData(state?.type)}
                  {getTableData(state?.name)}
                  {getTableData(state?.description)}
                  {getTableData(state?.criteria)}
                  {getTableData(state?.gameType?.gameType)}
                  {getTableData(state?.rating)}
                  {getTableData(helpers?.getDateAndTime(state?.createdAt))}
                  <td className="py-2 px-4 border-r dark:border-[#ffffff38] w-[200px]">
                    <OImage src={state.image} className="w-[50px] h-[50px] rounded-full m-auto" alt="profile picture" onClick={() => handleShowImage(state)} />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          {showBanner && showImage && <ShowImage handleShowImage={handleShowImage} showImage={showImage} />}
          <div className="bg-white border border-[#E9EDF9] rounded-lg dark:bg-slate-800 dark:border-[#ffffff38]">
            <form className="border-b border-b-[#E3E3E3] 2xl:flex gap-2 px-4 py-3 justify-between">
              <div className="col-span-2 flex flex-wrap  items-center">
                <div className="flex items-center lg:pt-0 pt-3 flex-wrap justify-center mb-2 2xl:mb-0">
                  <div className="relative flex items-center mb-3">
                    <OSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} placeholder={t("SEARCH_BY_USER_ID_MOBILE")} />
                  </div>
                  <ODateRangePicker handleDateChange={handleDateChange} isReset={filterData?.isReset} setIsReset={setFilterData} />
                  <button type="button" onClick={handleReset} title={t("O_RESET")} className="bg-gradientTo flex gap-2 text-sm px-6 ml-3 mb-3 py-2 rounded-lg items-center border border-transparent text-white hover:bg-DarkBlue sm:w-auto w-1/2">
                    <BiReset size={18} />
                    {t("O_RESET")}
                  </button>
                </div>
              </div>
            </form>
            <AchievementUser subscriptionUsers={subscriptionUsers?.docs} page={page} setSort={setSort} sort={sort} manager={manager} pageSize={pageSize} />
            <div className="flex justify-between">
              <PageSizeList dynamicPage={dynamicPage} pageSize={pageSize} />
              {viewPaginationObj?.totalItems ? <Pagination handlePageClick={handlePageClick} options={viewPaginationObj} isDelete={isDelete} page={page} /> : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewAchievementManager;
