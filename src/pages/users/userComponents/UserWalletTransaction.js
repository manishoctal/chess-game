import React, { useEffect, useState } from "react";
import { apiGet } from "../../../utils/apiFetch";
import apiPath from "../../../utils/apiPath";
import Pagination from "../../Pagination";
import { useTranslation } from "react-i18next";
import PageSizeList from "components/PageSizeList";
import ODateRangePicker from "components/shared/datePicker/ODateRangePicker";
import dayjs from "dayjs";
import { isEmpty, startCase } from "lodash";

const UserWalletTransaction = (item) => {
  const { t } = useTranslation();
  const [allWalletTransaction, setAllWalletTransaction] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [paginationObj, setPaginationObj] = useState({
    page: 1,
    pageCount: 1,
    pageRangeDisplayed: 10,
  });
  const [filterData, setFilterData] = useState({
    category: "",
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

  const dynamicPage = (e) => {
    setPage(1);
    setPageSize(e.target.value);
  };
  const allTransaction = async (data) => {
    try {
      const { startDate, endDate, category } = filterData;

      const payload = {
        page,
        pageSize,
        keyword: category,
        startDate: startDate ? dayjs(startDate).format("YYYY-MM-DD") : null,
        endDate: endDate ? dayjs(endDate).format("YYYY-MM-DD") : null,
        sortBy: sort.sortBy,
        sortType: sort.sortType,
      };

      const path = apiPath.walletTransactionList + "/" + item.item._id;
      const result = await apiGet(path, payload);
      const response = result?.data?.results?.docs;
      const resultStatus = result?.data?.success;
      setAllWalletTransaction(response);
      setPaginationObj({
        ...paginationObj,
        page: resultStatus ? result?.data?.results.page : null,
        pageCount: resultStatus ? result?.data?.results.totalPages : null,
        perPageItem: resultStatus ? response?.length : null,
        totalItems: resultStatus ? result?.data?.results.totalDocs : null,
      });
    } catch (error) {
      console.error("error in get all sub admin list==>>>>", error.message);
    }
  };
  const handlePageClick = (event) => {
    const newPage = event.selected + 1;
    setPage(newPage);
  };

  useEffect(() => {
    allTransaction();
  }, [filterData, page, sort]);

  const handleReset = () => {
    setFilterData({
      category: "",
      isReset: true,
      startDate: "",
      endDate: "",
      isFilter: false,
    });
    setPage(1);
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

  const statusPage = (e) => {
    console.log(e.target.value);
    setFilterData({ ...filterData, category: e.target.value, isFilter: true });
    setPage(1);
  };

  return (
    <div className="bg-white border border-[#E9EDF9] rounded-lg dark:bg-gray-800 dark:mt-4">
      <form className="border-b border-b-[#E3E3E3] 2xl:flex gap-2 px-4 py-3">
        <div className="col-span-2 flex flex-wrap  items-center">
          <div className="flex items-center lg:pt-0 pt-3 flex-wrap justify-center mb-2 2xl:mb-0">
            <ODateRangePicker
              handleDateChange={handleDateChange}
              isReset={filterData?.isReset}
              setIsReset={setFilterData}
            />
            <div className="flex items-center mb-3 ml-3">
              <select
                id="countries"
                type="password"
                name="floating_password"
                className="block p-2 w-full text-sm text-[#A5A5A5] bg-transparent border-2 rounded-lg border-[#DFDFDF]  dark:text-[#A5A5A5] focus:outline-none focus:ring-0  peer"
                placeholder=" "
                value={filterData?.category}
                onChange={(e) => statusPage(e)}
              >
                <option defaultValue value="">
                  {t("O_ALL")}
                </option>
                <option value="cardDebitCredit">{t("DEBIT_CARD")}</option>
                <option value="cardDebitCredit">{t("CREDIT_CARD")}</option>
                <option value="addMoneyTopUp">{t("SCRATCH_CARD")}</option>
              </select>
            </div>

            <button
              type="button"
              onClick={handleReset}
              title={t("O_RESET")}
              className="bg-gradientTo text-sm px-8 ml-3 mb-3 py-2 rounded-lg items-center border border-transparent text-white hover:bg-DarkBlue sm:w-auto w-1/2"
            >
              {t("O_RESET")}
            </button>
          </div>
        </div>
      </form>
      <div className="p-3">
        <div className="overflow-x-auto relative rounded-lg border">
          <table className="w-full text-xs text-left text-[#A5A5A5] dark:text-gray-400 ">
            <thead className="text-xs text-gray-900 border border-[#E1E6EE] bg-[#E1E6EE] dark:bg-gray-700 dark:text-gray-400 dark:border-[#ffffff38]">
              <tr>
                <th className="px-5 py-3 " scope="col">
                  S/No.
                </th>
                <th className="px-5 py-3 " scope="col">
                  {t("AMOUNT_ADDED")}
                </th>
                <th className="px-5 py-3 " scope="col">
                  {t("WALLET_TYPE")}
                </th>
                <th className="px-5 py-3 " scope="col">
                  {t("TRANSACTION_DATE_TIME")}
                </th>
              </tr>
            </thead>
            <tbody>
              {allWalletTransaction?.map((walletData, i) => (
                <tr
                  key={i}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                >
                  <th
                    scope="row"
                    className="py-2 px-4 border-r dark:border-[#ffffff38] font-medium text-gray-900  dark:text-white"
                  >
                    {i + 1 + pageSize * (page - 1)}
                  </th>
                  <td className="py-2 px-4 border-r dark:border-[#ffffff38]">
                    {startCase(walletData?.transactionAmount) || "N/A"}
                  </td>
                  <td className="py-2 px-4 border-r dark:border-[#ffffff38]">
                    {walletData?.type || "N/A"}
                  </td>
                  <td className="py-2 px-4 border-r dark:border-[#ffffff38]">
                    {dayjs(walletData?.createdAt).format("DD-MM-YYYY hh:mm A")}
                  </td>
                </tr>
              ))}
              {isEmpty(allWalletTransaction) ? (
                <tr className="bg-white border-b w-full text-center dark:bg-gray-800 dark:border-gray-700">
                  <td className="py-4 px-6" colSpan={6}>
                    {t("O_NO_RECORD_FOUND")}
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex justify-between">
        <PageSizeList dynamicPage={dynamicPage} pageSize={pageSize} />
        {paginationObj?.totalItems !== 0 && (
          <Pagination
            handlePageClick={handlePageClick}
            options={paginationObj}
            page={page}
          />
        )}
      </div>
    </div>
  );
};

export default UserWalletTransaction;
