import React, { useContext, useEffect, useState } from "react";
import { apiGet } from "../../utils/apiFetch";
import dayjs from "dayjs";
import ODateRangePicker from "components/shared/datePicker/ODateRangePicker";
import PageSizeList from "components/PageSizeList";
import helpers from "utils/helpers";
import { useLocation } from "react-router-dom";
import balanceIcon from "../../assets/icons/icon/balance.svg";
import { useTranslation } from "react-i18next";
import { BiReset } from "react-icons/bi";
import OSearch from "components/reusable/OSearch";
import TransactionTable from "./TransactionTable";
import { GoDownload } from "react-icons/go";
import apiPath from "../../utils/apiPath";
import Pagination from "../Pagination";
import AuthContext from "context/AuthContext";

function Transaction() {
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);
  const { t } = useTranslation();
  const location = useLocation();
  const [totalBalance,setTotalBalance]=useState("")
  const [searchTerm, setSearchTerm] = useState("");
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

  const [filterData, setFilterData] = useState({
    userId: "",
    searchKey: "",
    startDate: "",
    endDate: "",
    isReset: false,
    isFilter: false,
    transactionType: "",
  });
  const [sort, setSort] = useState({
    sortBy: "createdAt",
    sortType: "desc",
  });

  const getAllUser = async () => {
    try {
      const { transactionType, startDate, endDate, searchKey, userId } = filterData;

      const payload = {
        keyword: helpers.normalizeSpaces(searchKey) || null,
        sortKey: sort?.sortBy,
        sortType: sort?.sortType,
        startDate: startDate ? dayjs(startDate).format("YYYY-MM-DD") : null,
        page,
        pageSize: pageSize,
        endDate: endDate ? dayjs(endDate).format("YYYY-MM-DD") : null,
        userId: userId || null,
      };

      if (transactionType && transactionType !== undefined) {
        payload.transactionType = transactionType;
      }

      const path = `${apiPath.transactionList}`;
      const result = await apiGet(path, payload);
      if (result?.data?.success) {
        const response = result?.data?.results;
        setAllUser(response?.docs);
        const resultStatus = result?.data?.success;
        setPaginationObj({
          ...paginationObj,
          page: helpers.ternaryCondition(resultStatus, response.page, null),
          perPageItem: helpers.ternaryCondition(resultStatus, response?.docs.length, null),
          pageCount: helpers.ternaryCondition(resultStatus, response.totalPages, null),
          totalItems: helpers.ternaryCondition(resultStatus, response.totalDocs, null),
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




  const handleReset = () => {
    setFilterData({
      transactionType: undefined,
      kyc: "",
      userId: "",
      startDate: "",
      endDate: "",
      isReset: true,
      isFilter: false,
      category:""
    });
    
    setPage(1);
    setSearchTerm("");
    setPageSize(10);
  };

  const onCsvDownload = async () => {
    try {
      const { transactionType, startDate, endDate, searchkey, status } = filterData;
      const payload = {
        startDate: startDate ? dayjs(startDate).format("YYYY-MM-DD") : null,
        endDate: endDate ? dayjs(endDate).format("YYYY-MM-DD") : null,
        sortBy: sort.sortBy,
        sortType: sort.sortType,
        keyword: helpers.normalizeSpaces(searchkey) || null,
        status,
      };

      if (transactionType && transactionType !== undefined) {
        payload.transactionType = transactionType;
      }

      const path = apiPath.transactionCSV;
      const result = await apiGet(path, payload);
      if (result?.data?.success) {
        helpers.downloadFile(result?.data?.results?.filePath);
      }
    } catch (error) {
      console.error("error in get all dashboard list==>>>>", error.message);
    }
  };

  useEffect(() => {
    updatePageName(t("NAV_TRANSACTION_MANAGER"));
  }, []);

  const getTotalBalance = async () => {
    try {

      const path = `${apiPath.transactionTotalBalance}`;
      const result = await apiGet(path);
      if (result?.data?.success) {
        setTotalBalance(result?.data?.results)
      }
    } catch (error) {
      console.error("error ", error);
    }
  }


  useEffect(()=>{
    getTotalBalance()
  },[])

  const handleUserViewPage = () => {
    updatePageName(` ${t("VIEW") + " " + t("USER_MANAGER")}`);
  };

  const statusPage = (e) => {
    const selectedValue = e.target.value;

    setFilterData((prevData) => ({
      ...prevData,
      transactionType: selectedValue ? selectedValue : undefined,
      isFilter: true,
      isReset: false,
    }));
    setPage(1);
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

  const manager = user?.permission?.find((e) => e.manager === "transaction_manager");

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
                    <OSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} placeholder={t("SEARCH_BY_FULL_NAME_TRANSACTION_EMAIL")} />
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-center">
                <div className="flex items-center lg:pt-0 pt-3 justify-center">
                  <ODateRangePicker handleDateChange={handleDateChange} isReset={filterData?.isReset} setIsReset={setFilterData} />

                  <div className="flex items-center mb-3 ml-3">
                    <select
                      id="countries"
                      type="password"
                      name="floating_password"
                      className="block p-2 w-full text-sm text-[#A5A5A5] bg-transparent border-2 rounded-lg border-[#DFDFDF] dark:text-[#A5A5A5] focus:outline-none focus:ring-0 peer"
                      placeholder=""
                      value={filterData?.category}
                      onChange={statusPage}
                    >
                      <option value="">{t("TRANSACTION_TYPE")}</option>
                      <option value="walletDeposit">{t("O_WALLET_DEPOSIT")}</option>
                      <option value="withdrawMoney">{t("O_WITHDRAW_MONEY")}</option>
                      <option value="casualChallenge">{t("O_CASUAL_CHALLENGE")}</option>
                      <option value="monetaryChallenge">{t("O_MONETARY_CHALLENGE")}</option>
                      {/* <option value="deposit">{t("O_DEPOSIT")}</option> */}
                      <option value="refundMonetaryChallenge">{t("O_REFUND_MONETARY_CHALLENGE")}</option>
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleReset()}
                    title={t("O_RESET")}
                    className="bg-gradientTo flex gap-2 text-sm px-6 ml-3 mb-3 py-2 rounded-lg items-center border border-transparent text-white hover:bg-DarkBlue sm:w-auto w-1/2"
                  >
                    <BiReset size={18} />
                    {t("O_RESET")}
                  </button>
                  <div className="p-5">
                    <button onClick={onCsvDownload} type="button" className="bg-gradientTo text-sm px-6 flex gap-2  mb-3 py-2 rounded-lg items-center border border-transparent text-white hover:bg-DarkBlue sm:w-auto w-1/2">
                      <GoDownload size={18} className="" />
                      {t("EXPORT_CSV_TRANSACTION")}
                    </button>
                  </div>
                  <div className="bg-gradientTo rounded-lg p-4 m-5 max-w-[200px] ml-auto">
            <div className="flex items-center">
              <figure className="mr-3">
                <img src={balanceIcon} alt="" />
              </figure>
              <figcaption className="text-white">
                <span className="block">{helpers.formattedAmount(totalBalance?.totalEarning) || 0}</span>
                <span className="text-sm">{t("TOTAL_EARNING")}</span>
              </figcaption>
            </div>
          </div>
             

                </div>
              </div>
            </form>
            
            <TransactionTable handleUserViewPage={handleUserViewPage} users={users} paginationObj={paginationObj} user={user} getAllUser={getAllUser} page={page} setSort={setSort} sort={sort} setPage={setPage} pageSize={pageSize} userType={userType} manager={manager} />
            <div className="flex justify-between">
              <PageSizeList dynamicPage={dynamicPage} pageSize={pageSize} />
              {paginationObj?.totalItems ? <Pagination handlePageClick={handlePageClick} options={paginationObj} isDelete={isDelete} page={page} /> : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Transaction;
