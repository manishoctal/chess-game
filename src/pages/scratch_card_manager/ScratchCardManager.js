import React, { useContext, useEffect, useState } from "react";
import { apiGet } from "../../utils/apiFetch";
import apiPath from "../../utils/apiPath";
import Pagination from "../Pagination";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import AuthContext from "context/AuthContext";
import ScratchCardTable from "./ScratchCardTable";
import AddScratchCard from "./AddScratchCard";
import PageSizeList from "components/PageSizeList";
import OSearch from "components/reusable/OSearch";
import AddBulkScratchCard from "./AddBulkScratchCard";

function ScratchCardManager() {
  const { t } = useTranslation();
  const { user, updatePageName } = useContext(AuthContext);
  const manager =
    user?.permission?.find((e) => e.manager === "scratch_card_manager") ?? {};

  const ternaryCondition = (condition, first, second) => {
    return condition ? first : second;
  };
  const [subAdmin, setSubAdmin] = useState();
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
  const [showModal, setShowModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [filterData, setFilterData] = useState({
    category: "",
    searchkey: "",
    startDate: "",
    endDate: "",
    isReset: false,
    isFilter: false,
  });
  const [sort] = useState({
    sortBy: "createdAt",
    sortType: "desc",
  });

  const allScratchCard = async () => {
    try {
      const { startDate, endDate, searchkey } = filterData;

      const payload = {
        page,
        pageSize: pageSize,

        startDate: ternaryCondition(
          startDate,
          dayjs(startDate).format("YYYY-MM-DD"),
          null
        ),
        endDate: ternaryCondition(
          endDate,
          dayjs(endDate).format("YYYY-MM-DD"),
          null
        ),
        keyword: searchkey,
        sortBy: sort.sortBy,
        sortType: sort.sortType,
      };

      const path = apiPath.addScratchCard;
      const result = await apiGet(path, payload);
      const response = result?.data?.results;
      const resultStatus = result?.data?.success;
      setSubAdmin(response);
      setPaginationObj({
        ...paginationObj,
        page: ternaryCondition(resultStatus, response.page, null),
        pageCount: ternaryCondition(resultStatus, response.totalPages, null),
        perPageItem: ternaryCondition(
          resultStatus,
          response?.docs.length,
          null
        ),
        totalItems: ternaryCondition(resultStatus, response.totalDocs, null),
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

  useEffect(() => {
    allScratchCard();
  }, [filterData, page, sort, pageSize]);

  useEffect(() => {
    if (!isInitialized) {
      setIsInitialized(true);
    } else if (searchTerm || !filterData?.isReset) {
      setFilterData({
        ...filterData,
        isReset: false,
        isFilter: !!debouncedSearchTerm,
        searchkey: debouncedSearchTerm || "",
      });
      setPage(1);
    }
  }, [debouncedSearchTerm]);
  useEffect(() => {
    updatePageName(t("SCRATCH_CARD_MANAGER"));
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [searchTerm]);

  return (
    <>
      <div>
        <div className="bg-[#F9F9F9] dark:bg-slate-900">
          <div className="px-3 py-4">
            <div className="bg-white border border-[#E9EDF9] rounded-lg dark:bg-slate-800 dark:border-[#ffffff38]">
              <form className="border-b border-b-[#E3E3E3] 2xl:flex gap-2 px-4 py-3">
                <div className="col-span-2 flex flex-wrap  items-center">
                  <div className="flex items-center lg:pt-0 pt-3 flex-wrap justify-center mb-2 2xl:mb-0">
                    <div className="relative flex items-center mb-3">
                      <OSearch
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        placeholder={t("SEARCH_BY_COUPON_CODE")}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-end px-4 ms-auto mb-3">
                  {/* {(manager?.add || user?.role === "admin") && (
                    <button
                      title={t("ADD_BULK")}
                      type="button"
                      className="bg-gradientTo flex text-sm px-8 ml-3 py-2 rounded-lg items-center border border-transparent text-white hover:bg-DarkBlue whitespace-nowrap"
                      onClick={setShowBulkModal}
                    >
                      + {t("ADD_BULK")}
                    </button>
                  )} */}
                  {
                    // TODO: Need to revert above commented code if we deploy bulk card related code
                  }
                  {(manager?.add || user?.role === "admin") && (
                    <button
                      title={t("ADD_NEW")}
                      type="button"
                      className="bg-gradientTo flex text-sm px-8 ml-3 py-2 rounded-lg items-center border border-transparent text-white hover:bg-DarkBlue whitespace-nowrap"
                      onClick={setShowModal}
                    >
                      + {t("ADD_NEW")}
                    </button>
                  )}
                </div>
              </form>
              <ScratchCardTable
                subAdmin={subAdmin?.docs}
                page={page}
                pageSize={pageSize}
              />
              <div className="flex justify-between">
                <PageSizeList dynamicPage={dynamicPage} pageSize={pageSize} />
                {ternaryCondition(
                  paginationObj?.totalItems,
                  <Pagination
                    handlePageClick={handlePageClick}
                    options={paginationObj}
                    isDelete={isDelete}
                    page={page}
                  />,
                  null
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {showModal && (
        <AddScratchCard
          setShowModal={setShowModal}
          allScratchCard={allScratchCard}
        />
      )}
      {showBulkModal && (
        <AddBulkScratchCard
          setShowBulkModal={setShowBulkModal}
          allScratchCard={allScratchCard}
        />
      )}
    </>
  );
}

export default ScratchCardManager;
