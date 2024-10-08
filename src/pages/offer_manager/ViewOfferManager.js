import React, { useContext, useEffect, useState } from "react";
import { apiGet } from "../../utils/apiFetch";
import apiPath from "../../utils/apiPath";
import OfferAppliedTable from "./OfferAppliedUser";
import Pagination from "../Pagination";
import dayjs from "dayjs";
import ODateRangePicker from "components/shared/datePicker/ODateRangePicker";
import { useTranslation } from "react-i18next";
import AuthContext from "context/AuthContext";
import PageSizeList from "components/PageSizeList";
import OSearch from "components/reusable/OSearch";
import AddEditOffer from "./AddEditOffer";
import { Link, useLocation, useNavigate } from "react-router-dom";
import helpers from "utils/helpers";
import { startCase } from "lodash";
import { FaCircleArrowLeft } from "react-icons/fa6";
import { BiSolidFileExport, BiReset } from "react-icons/bi";

function ViewOfferManager() {
  const { t } = useTranslation();
  const router = useNavigate();
  const { state } = useLocation();
  const { user, updatePageName } = useContext(AuthContext);
  const [editShowModal, setEditShowModal] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [isDelete] = useState(false);
  const [editView, setEditView] = useState();
  const [sort, setSort] = useState({
    sortBy: "createdAt",
    sortType: "desc",
  });
  useEffect(() => {
    if (!state?._id) {
      router("/offer-manager");
    }
  }, [state]);

  const [item, setItem] = useState();
  const manager = user?.permission?.find((e) => e.manager === "offer_manager") ?? {};
  const [offerUsers, setOfferUsers] = useState();
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
  const ViewallOfferList = async () => {
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

      const path = apiPath.getOfferUsers + "/" + state?._id;
      const result = await apiGet(path, payloadData);
      const response = result?.data?.results;
      const resultStatus = result?.data?.success;
      setOfferUsers(response);
      setPaginationViewObj({
        ...viewPaginationObj,
        page: resultStatus ? response.page : null,
        pageCount: resultStatus ? response.totalPages : null,
        perPageItem: resultStatus ? response?.docs.length : null,
        totalItems: resultStatus ? response.totalDocs : null,
      });
    } catch (error) {
      console.error("error in get all sub admin list==>>>>", error.message);
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
    ViewallOfferList();
  }, [filterData, page, sort, pageSize]);

  // get all offer list end

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
    updatePageName(t("VIEW_OFFER_MANAGER"));
  }, []);

  // Download csv function start

  const onCsvDownload = async () => {
    try {
      const { category, startDate, endDate, searchKey } = filterData;
      const payloadCsv = {
        page,
        pageSize: pageSize,
        status: category,
        startDate: startDate ? helpers.getFormattedDate(startDate) : null,
        endDate: endDate ? helpers.getFormattedDate(endDate) : null,
        keyword: searchKey,
        sortBy: sort.sortBy,
        sortType: sort.sortType,
      };

      const path = apiPath.downloadCsv + "/" + state?._id;
      const result = await apiGet(path, payloadCsv);
      if (result?.data?.success) {
        helpers.downloadFile(result?.data?.results?.filePath);
      }
    } catch (error) {
      console.error("error in get all sub admin list==>>>>", error.message);
    }
  };

  // Download csv function end

  const editViewBanner = async (type, data) => {
    setEditView(type);
    setItem(data);
    setEditShowModal(true);
  };

  const getTableData = (details, inputClass) => {
    return <td className={`py-2 px-4 border-r border dark:border-[#ffffff38] text-center font-semibold ${inputClass || ""}`}>{details || "N/A"}</td>;
  };

  const getTableHeader = (name) => {
    return <th className="text-center py-3 px-6">{t(name)}</th>;
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
                  {getTableHeader("OFFER_ID")}
                  {getTableHeader("OFFER_CODE")}
                  {getTableHeader("RESTRICTED_USES")}
                  {getTableHeader("CASH_BONUS")}
                  {getTableHeader("EXPIRY_DATE")}
                  {getTableHeader("O_CREATED_AT")}
                  {getTableHeader("O_STATUS")}
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  {getTableData(state?.offerId)}
                  {getTableData(state?.code)}
                  <td className="py-2 px-4 border-r dark:border-[#ffffff38] text-center font-semibold" style={{ width: "17%" }}>
                    {state?.limitPerUser || "N/A"}
                  </td>
                  {getTableData(helpers.formattedAmount(state?.cashBackAmount) || "N/A")}
                  {getTableData(helpers?.getDateAndTime(state?.expiryDate))}
                  {getTableData(helpers?.getDateAndTime(state?.createdAt))}
                  {getTableData(startCase(state?.status), helpers.ternaryCondition(state?.status == "active", "text-green-600", "text-red-600"))}
                </tr>
              </tbody>
            </table>
          </div>
          <div className="bg-white border border-[#E9EDF9] rounded-lg dark:bg-slate-800 dark:border-[#ffffff38]">
            <form className="border-b border-b-[#E3E3E3] 2xl:flex gap-2 px-4 py-3 justify-between">
              <div className="col-span-2 flex flex-wrap  items-center">
                <div className="flex items-center lg:pt-0 pt-3 flex-wrap justify-center mb-2 2xl:mb-0">
                  <div className="relative flex items-center mb-3">
                    <OSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} placeholder={t("SEARCH_BY_USER_ID_USE_NAME")} />
                  </div>
                  <ODateRangePicker handleDateChange={handleDateChange} isReset={filterData?.isReset} setIsReset={setFilterData} />
                  <button type="button" onClick={handleReset} title={t("O_RESET")} className="bg-gradientTo flex gap-2 text-sm px-6 ml-3 mb-3 py-2 rounded-lg items-center border border-transparent text-white hover:bg-DarkBlue sm:w-auto w-1/2">
                    <BiReset size={18} />
                    {t("O_RESET")}
                  </button>
                </div>
              </div>
              {helpers.ternaryCondition(
                viewPaginationObj?.totalItems,
                <button type="button" title={t("EXPORT_CSV")} className="bg-gradientTo text-sm flex gap-2 px-8 ml-3 mb-3 py-2 rounded-lg items-center border border-transparent text-white hover:bg-DarkBlue sm:w-auto " onClick={onCsvDownload}>
                  <BiSolidFileExport size={18} />
                  {t("EXPORT_CSV")}
                </button>,
                null
              )}
            </form>
            <OfferAppliedTable offerUsers={offerUsers?.docs} editViewBanner={editViewBanner} page={page} setSort={setSort} sort={sort} manager={manager} pageSize={pageSize} />
            <div className="flex justify-between">
              {helpers?.ternaryCondition(
                viewPaginationObj?.totalItems,
                <>
                  <PageSizeList dynamicPage={dynamicPage} pageSize={pageSize} />
                  <Pagination handlePageClick={handlePageClick} options={viewPaginationObj} isDelete={isDelete} page={page} />
                </>,
                null
              )}
            </div>
          </div>
        </div>
      </div>
      {editShowModal && <AddEditOffer setEditShowModal={setEditShowModal} getAllFAQ={ViewallOfferList} item={item} viewType={editView} />}
    </div>
  );
}

export default ViewOfferManager;
