import React, { useContext, useEffect, useState } from "react";
import { apiGet } from "../../utils/apiFetch";
import apiPath from "../../utils/apiPath";
import OButton from "components/reusable/OButton";
import ODateRangePicker from "components/shared/datePicker/ODateRangePicker";
import dayjs from "dayjs";
import StaticContentView from "./StaticContentView";
import StaticContentList from "./StaticContentList";
import Pagination from "../Pagination";
import AuthContext from "context/AuthContext";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const StaticContent = () => {
  const { user, updatePageName } = useContext(AuthContext);
  const navigate = useNavigate();
  const manager =
    user?.permission?.find((e) => e.manager === "static_page_management") ?? {};
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [paginationObj, setPaginationObj] = useState({
    page: 1,
    pageCount: 1,
    pageRangeDisplayed: 10,
  });
  const [countryList, setCountryList] = useState([]);
  const [countryEdit, setCountryEdit] = useState(false);
  const [currentItem, setCurrentItem] = useState("");
  const [countryView, setCountryView] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);
  const [filterData, setFilterData] = useState({
    status: "",
    searchkey: "",
    startDate: "",
    endDate: "",
    isReset: false,
    isFilter: false,
  });
  const [sort, setSort] = useState({
    sortBy: "createdAt",
    sortType: "desc",
  });

  const handleEdit = (item) => {
    setCurrentItem(item);
    setCountryEdit(!countryEdit);
    navigate("/StaticContent/edit", { state: item });
  };
  const handleView = (item) => {
    setCurrentItem(item);
    setCountryView(!countryView);
    if (item?.slug === "faqs") {
      navigate("/StaticContent/faqs");
    } else {
      navigate("/StaticContent/view", { state: item });
    }
  };

  const handlePageClick = (event) => {
    const newPage = event.selected + 1;
    setPage(newPage);
  };

  const getStaticContent = async (data) => {
    try {
      const { status, startDate, endDate, searchkey, isFilter } = filterData;
      if (
        (data?.deletePage && !(countryList?.length > 1)) ||
        (isFilter && status && data?.statusChange && !(countryList?.length > 1))
      ) {
        setPage(page - 1);
        setPaginationObj({ ...paginationObj, page: page - 1 });
      }

      const payload = {
        page,
        pageSize: 10,
        status,
        startDate: startDate ? dayjs(startDate).format("YYYY-MM-DD") : null,
        endDate: endDate ? dayjs(endDate).format("YYYY-MM-DD") : null,
        keyword: searchkey?.trim(),
        sortBy: sort.sortBy,
        sortType: sort.sortType,
      };
      const path = apiPath.getStaticContent;
      const result = await apiGet(path, payload);
      const response = result?.data?.results;
      const resultStatus = result?.data?.success;
      setCountryList(response?.docs);
      setPaginationObj({
        ...paginationObj,
        page: resultStatus ? response.page : null,
        pageCount: resultStatus ? response.totalPages : null,
        perPageItem: resultStatus ? response?.docs.length : null,
        totalItems: resultStatus ? response.totalDocs : null,
      });
    } catch (error) {
      console.log("error in get all country list==>>>>", error.message);
    }
  };

  useEffect(() => {
    // getStaticContent();
  }, [page, filterData, sort]);

  const handleReset = () => {
    setFilterData({
      status: "",
      searchkey: "",
      startDate: "",
      endDate: "",
      isReset: true,
      isFilter: false,
    });
    setPage(1);
    setSearchTerm("");
  };

  const handleDateChange = (start, end) => {
    // setStartDate(start)
    setPage(1);
    // setEndDate(end)
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

  useEffect(() => {
    updatePageName(t("NAV_STATIC_CONTENTS"));
  }, []);

  return (
    <>
      {" "}
      <div className="bg-[#F9F9F9] dark:bg-slate-900">
        <div className="px-3 py-4">
          <div className="bg-white border border-[#E9EDF9] rounded-lg dark:bg-slate-800 dark:border-[#ffffff38]">
            <form className="border-b border-b-[#E3E3E3] 2xl:flex gap-2 px-4 py-3">
              <div className="col-span-2 flex flex-wrap  items-center mb-2 2xl:mb-0">
                <div className="flex items-center lg:pt-0 pt-3 flex-wrap ">
                  <div className="relative flex items-center mb-3">
                    <div className="absolute inset-y-0 right-0 flex items-center pl-3 mr-3 pointer-events-none">
                      {!searchTerm ? (
                        <svg
                          aria-hidden="true"
                          className="w-4 h-4 text-[#A5A5A5] dark:text-gray-40"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          />
                        </svg>
                      ) : (
                        ""
                      )}
                    </div>
                    <input
                      type="search"
                      id="default-search"
                      className="block w-full p-2 outline-none text-sm text-gray-900 2xl:min-w-[250px] xl:min-w-[300px] rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder={t("SEARCH_BY_TITLE")}
                      value={searchTerm}
                      title=""
                      required
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <ODateRangePicker
                    handleDateChange={handleDateChange}
                    isReset={filterData?.isReset}
                    setIsReset={setFilterData}
                  />
                  {/* <div className="flex items-center  ml-3 mb-3">
                    <select
                      id=""
                      type="text "
                      name="status"
                      className="block p-2 w-full text-sm text-[#A5A5A5] bg-transparent border-2 rounded-lg border-[#DFDFDF] focus:outline-none focus:ring-0  peer"
                      placeholder=" "
                      onChange={(e) => statusPage(e)}
                      value={filterData?.status}
                    >
                      <option selected value="">
                        {t("O_ALL")}
                      </option>
                      <option value="active">{t("O_ACTIVE")}</option>
                      <option value="inactive">{t("O_INACTIVE")}</option>
                    </select>
                  </div> */}

                  <OButton
                    label="Reset"
                    type="button"
                    onClick={handleReset}
                    extraClasses="ml-3 mb-3"
                    style={{ borderRadius: "0.5rem" }}
                  />
                </div>
              </div>
              {/* <div className="flex items-center justify-end px-4 ms-auto mb-3">
                {(manager?.add || user?.role === "admin") && (
                  // <button
                  //   title='Add Static content'
                  //   type='button'
                  //   className='bg-gradientTo flex text-sm px-8 ml-3 py-2 rounded-lg items-center border border-transparent text-white hover:bg-DarkBlue whitespace-nowrap'
                  //   onClick={() => handleCategory()}
                  // >
                  //   + {t('ADD_STATIC_CONTENT')}
                  // </button>
                  <button
                    title="Add Static content"
                    type="button"
                    className="bg-gradientTo flex text-sm px-8 ml-3 py-2 rounded-lg items-center border border-transparent text-white hover:bg-DarkBlue whitespace-nowrap"
                    onClick={() => navigate("/StaticContent/add")}
                  >
                    + {t("ADD_STATIC_CONTENT")}
                  </button>
                )}
              </div> */}
            </form>
            <StaticContentList
              countryList={countryList}
              getStaticContent={getStaticContent}
              page={page}
              handleEdit={handleEdit}
              handleView={handleView}
              currentItem={currentItem}
              countryView={countryView}
              setSort={setSort}
              sort={sort}
              manager={manager}
            />
            {countryView && (
              <StaticContentView
                countryView={countryView}
                currentItem={currentItem}
                handleView={handleView}
              />
            )}

            {countryEdit && (
              <staticContentEdit
                handleEdit={handleEdit}
                currentItem={currentItem}
                getStaticContent={getStaticContent}
              />
            )}
            {paginationObj?.totalItems ? (
              <Pagination
                handlePageClick={handlePageClick}
                options={paginationObj}
                page={page}
              />
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
};

export default StaticContent;
