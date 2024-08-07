import React, { useContext, useEffect, useState } from "react";
import { apiDelete, apiGet, apiPut } from "../../utils/apiFetch";
import apiPath from "../../utils/apiPath";
import Table from "./Table";
import Pagination from "../Pagination";
import dayjs from "dayjs";
import ODateRangePicker from "components/shared/datePicker/ODateRangePicker";
import { useTranslation } from "react-i18next";
import AuthContext from "context/AuthContext";
import useToastContext from "hooks/useToastContext";
import PageSizeList from "components/PageSizeList";
import OSearch from "components/reusable/OSearch";
import { BiReset } from "react-icons/bi";
import { IoIosAdd } from "react-icons/io";
import helpers from "utils/helpers";
import AddEditAchievement from "./AddEditAchievement";

function AchievementBadges() {
  const { t } = useTranslation();
  const notification = useToastContext();
  const { user, updatePageName } = useContext(AuthContext);
  const manager = user?.permission?.find((e) => e.manager === "achievement_and_badges") ?? {};
  const [badges, setBadges] = useState();
  const [editShowModal, setEditShowOfferModal] = useState(false);
  const [editView, setEditView] = useState();
  const [item, setItem] = useState();
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
    category: "",
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

  const allAchievement = async (data, pageNO) => {
    try {
      const { category, startDate, endDate, searchKey } = filterData;

      const payload = {
        page,
        pageSize: pageSize,
        status: category,
        startDate: startDate ? dayjs(startDate).format("YYYY-MM-DD") : null,
        endDate: endDate ? dayjs(endDate).format("YYYY-MM-DD") : null,
        keyword: helpers.normalizeSpaces(searchKey) || null,
        sortBy: sort.sortBy,
        sortType: sort.sortType,
      };

      const path = apiPath.getAchievement;
      const result = await apiGet(path, payload);
      const response = result?.data?.results;
      const resultStatus = result?.data?.success;
      setBadges(response);
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

  const dynamicPage = (e) => {
    setPage(1);
    setPageSize(e.target.value);
  };

  const editViewBanner = async (type, data) => {
    setEditView(type);
    setItem(data);
    setEditShowOfferModal(true);
  };
  useEffect(() => {
    allAchievement();
  }, [filterData, page, sort, pageSize]);

  const handelStatusChange = async (item) => {
    try {
      const payload = {
        status: item?.status === "inactive" ? "active" : "inactive",
        type: "achievement",
      };
      const path = `${apiPath.changeStatus}/${item?._id}`;
      const result = await apiPut(path, payload);
      if (result?.status === 200) {
        notification.success(result.data.message);
        allAchievement({ statusChange: 1 });
      }
    } catch (error) {
      console.error("error in get all badges list==>>>>", error.message);
    }
  };

  const handelDelete = async (item) => {
    try {
      const path = apiPath.editSubAdmin + "/" + item?._id;
      const result = await apiDelete(path);
      if (result?.status === 200) {
        notification.success(result?.data.message);
        allAchievement({ deletePage: 1 });
      }
    } catch (error) {
      console.error("error in get all badges list==>>>>", error.message);
    }
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
        searchKey: debouncedSearchTerm || "",
        isFilter: !!debouncedSearchTerm,
      });
      setPage(1);
    }
  }, [debouncedSearchTerm]);

  const adminStatusPage = (e) => {
    setPage(1);
    setFilterData({ ...filterData, category: e.target.value, isFilter: true });
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [searchTerm]);
  useEffect(() => {
    updatePageName(t("ACHIEVEMENT_AND_BADGES"));
  }, []);

  return (
    <div>
      <div className="bg-[#F9F9F9] dark:bg-slate-900">
        <div className="px-3 py-4">
          <div className="bg-white border border-[#E9EDF9] rounded-lg dark:bg-slate-800 dark:border-[#ffffff38]">
            <form className="border-b border-b-[#E3E3E3] 2xl:flex gap-2 px-4 py-3">
              <div className="col-span-2 flex flex-wrap  items-center">
                <div className="flex items-center lg:pt-0 pt-3 flex-wrap justify-center mb-2 2xl:mb-0">
                  <div className="relative flex items-center mb-3 w-[300px]">
                    <OSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} placeholder={t("ACHIEVEMENT_AND_BADGES_NAME")} />
                  </div>

                  <ODateRangePicker handleDateChange={handleDateChange} isReset={filterData?.isReset} setIsReset={setFilterData} />
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
                        <option value="inactive">{t("O_INACTIVE")}</option>
                      </select>
                    </div>
                  )}

                  <button type="button" onClick={handleReset} title={t("O_RESET")} className="bg-gradientTo flex gap-2 text-sm px-6 ml-3 mb-3 py-2 rounded-lg items-center border border-transparent text-white hover:bg-DarkBlue sm:w-auto w-1/2">
                    <BiReset size={18} />
                    {t("O_RESET")}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-end px-4 ms-auto mb-3">
                {(manager?.add || user?.role === "admin") && (
                  <button
                    title={t("ADD")}
                    type="button"
                    className="bg-gradientTo flex text-sm px-4 ml-3 py-2 rounded-lg items-center border border-transparent text-white hover:bg-DarkBlue whitespace-nowrap"
                    onClick={() => {
                      setEditShowOfferModal(true);
                      setEditView("add");
                      setItem("");
                    }}
                  >
                    <IoIosAdd size={20} />
                    {t("ADD")}
                  </button>
                )}
              </div>
            </form>
            <Table
              badges={badges?.docs}
              allAchievement={allAchievement}
              handelDelete={handelDelete}
              editViewBanner={editViewBanner}
              page={page}
              setSort={setSort}
              sort={sort}
              manager={manager}
              handelStatusChange={handelStatusChange}
              pageSize={pageSize}
            />

            <div className="flex justify-between">
              {helpers.ternaryCondition(
                paginationObj?.totalItems,
                <>
                  <PageSizeList dynamicPage={dynamicPage} pageSize={pageSize} />
                  <Pagination handlePageClick={handlePageClick} options={paginationObj} isDelete={isDelete} page={page} />
                </>,
                null
              )}
            </div>
          </div>
        </div>
      </div>
      {editShowModal && <AddEditAchievement setEditShowOfferModal={setEditShowOfferModal} allAchievement={allAchievement} offerDetails={item} viewType={editView} />}
    </div>
  );
}

export default AchievementBadges;
