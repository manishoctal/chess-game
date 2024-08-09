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
import SubscriptionUser from "./SubscriptionUser";

function ViewSubscriptionManager() {
  const { t } = useTranslation();
  const router = useNavigate();
  const { state } = useLocation();
  const { user, updatePageName } = useContext(AuthContext);
  const [pageSize, setPageSize] = useState(10);
  const [isDelete] = useState(false);
  const [sort, setSort] = useState({
    sortBy: "createdAt",
    sortType: "desc",
  });
  useEffect(() => {
    if (!state?._id) {
      router("/subscribed-manager");
    }
  }, [state]);

  const manager = user?.permission?.find((e) => e.manager === "subscribed_manager") ?? {};
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

      const path = apiPath.getSubscriptionUsers + "/" + state?._id;
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
      console.error("error in get all subscription list==>>>>", error.message);
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
    updatePageName(t("VIEW_SUBSCRIPTION_MANAGER"));
  }, []);

  return (
    <div>
      <div className="bg-[#F9F9F9] dark:bg-slate-900">
        <div className="px-3 py-4">
          <div className="flex active mb-5 ml-4 ">
            <Link aria-current="page" className="" to={-1}>
              <FaCircleArrowLeft size={27} />
            </Link>
          </div>
          <div className="bg-white border border-[#E9EDF9] rounded-lg dark:bg-slate-800 dark:border-[#ffffff38]">
            <form className="border-b border-b-[#E3E3E3] 2xl:flex gap-2 px-4 py-3 justify-between">
              <div className="col-span-2 flex flex-wrap  items-center">
                <div className="flex items-center lg:pt-0 pt-3 flex-wrap justify-center mb-2 2xl:mb-0">
                  <div className="relative flex items-center mb-3">
                    <OSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} placeholder={t("SEARCH_BY_USER_ID_MOBILE")} />
                  </div>
                  {(manager?.add || manager?.edit || user?.role === "admin") && (
                    <div className="flex items-center mb-3 ml-3">
                      <select
                        id="countries"
                        type=" password"
                        name="floating_password"
                        className="block p-2 w-full text-sm text-[#A5A5A5] bg-transparent border-2 rounded-lg border-[#DFDFDF]  dark:text-[#A5A5A5] focus:outline-none focus:ring-0  peer"
                        placeholder=" "
                        value={filterData?.category}
                        onChange={(e) => adminStatusPage(e)}
                      >
                        <option defaultValue value="">
                          {t("O_ALL")}
                        </option>
                        <option value="active">{t("O_ACTIVE")}</option>
                        <option value="expire">{t("EXPIRE")}</option>
                      </select>
                    </div>
                  )}
                  <ODateRangePicker handleDateChange={handleDateChange} isReset={filterData?.isReset} setIsReset={setFilterData} />
                  <button type="button" onClick={handleReset} title={t("O_RESET")} className="bg-gradientTo flex gap-2 text-sm px-6 ml-3 mb-3 py-2 rounded-lg items-center border border-transparent text-white hover:bg-DarkBlue sm:w-auto w-1/2">
                    <BiReset size={18} />
                    {t("O_RESET")}
                  </button>
                </div>
              </div>
            </form>
            <SubscriptionUser subscriptionUsers={subscriptionUsers?.docs} page={page} setSort={setSort} sort={sort} manager={manager} pageSize={pageSize} />
            <div className="flex justify-between">
              {helpers.ternaryCondition(
                viewPaginationObj?.totalItems,
                <>
                  <PageSizeList dynamicPage={dynamicPage} pageSize={pageSize} />
                  <Pagination handlePageClick={handlePageClick} options={viewPaginationObj} isDelete={isDelete} page={page} />{" "}
                </>,
                null
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewSubscriptionManager;
