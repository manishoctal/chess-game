import React, { useContext, useEffect, useState } from "react";
import "chartjs-adapter-date-fns";
import { BiMoneyWithdraw, BiReset } from "react-icons/bi";
import { GoDownload } from "react-icons/go";
import { FaUserTie, FaRegQuestionCircle, FaAddressCard } from "react-icons/fa";
import { AiOutlineStock } from "react-icons/ai";
import { GiProfit } from "react-icons/gi";
import { apiGet } from "utils/apiFetch";
import earning from "assets/images/earning.jpg";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import AuthContext from "context/AuthContext";
import ODateRangePicker from "components/shared/datePicker/ODateRangePicker";
import OCountUp from "components/OCountUp";
import helpers from "utils/helpers";
import apiPath from "utils/apiPath";
import { NavLink } from "react-router-dom";

function Dashboard() {
  const { t } = useTranslation();
  const { logoutUser } = useContext(AuthContext);
  const [dashboardDetails, setDashboardDetails] = useState({});
  const [filterData, setFilterData] = useState({
    startDate: "",
    endDate: "",
    isReset: false,
    isFilter: false,
  });

  const getDashboardDetails = async () => {
    try {
      const payload = {
        startDate: helpers?.ternaryCondition(filterData?.startDate, dayjs(filterData?.startDate).format("YYYY-MM-DD"), null),
        endDate: helpers?.ternaryCondition(filterData?.endDate, dayjs(filterData?.endDate).format("YYYY-MM-DD"), null),
      };
      const path = apiPath.getDashboardDetails;
      const result = await apiGet(path, payload);
      setDashboardDetails({ ...dashboardDetails, ...result.data.results });
    } catch (error) {
      if (error.response.status === 401 || error.response.status === 409) {
        logoutUser();
      }
    }
  };

  useEffect(() => {
    getDashboardDetails();
  }, [filterData]);

  const handleResetDashboard = () => {
    setFilterData({
      startDate: "",
      endDate: "",
      isReset: true,
      isFilter: false,
    });
  };

  const handleDashboardDateChange = (start, end) => {
    setFilterData({
      ...filterData,
      startDate: start,
      endDate: end,
      isFilter: true,
      isReset: false,
    });
  };

  const onCsvDownload = async () => {
    try {
      const { startDate, endDate } = filterData;
      const payloadCsv = {
        startDate: startDate ? helpers.getFormattedDate(startDate) : null,
        endDate: endDate ? helpers.getFormattedDate(endDate) : null,
      };

      const path = apiPath.downloadDashboardCsv;
      const result = await apiGet(path, payloadCsv);
      if (result?.data?.success) {
        helpers.downloadFile(result?.data?.results?.filePath);
      }
    } catch (error) {
      console.error("error in get all dashboard list==>>>>", error.message);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center mt-3 mb-3">
        <div className="flex items-center lg:pt-0 pt-3 justify-center">
          <ODateRangePicker handleDateChange={handleDashboardDateChange} isReset={filterData?.isReset} setIsReset={setFilterData} />
          <button
            type="button"
            onClick={() => handleResetDashboard()}
            className="bg-gradientTo text-sm px-6 flex gap-2 ml-3 mb-3 py-2 rounded-lg items-center border border-transparent text-white hover:bg-DarkBlue sm:w-auto w-1/2"
            title={t("O_RESET")}
          >
            <BiReset size={18} /> {t("O_RESET")}
          </button>
          <button type="button" className="bg-gradientTo text-sm px-6 flex gap-2 ml-3 mb-3 py-2 rounded-lg items-center border border-transparent text-white hover:bg-DarkBlue sm:w-auto w-1/2" title={t("DOWNLOAD_CSV")} onClick={onCsvDownload}>
            <GoDownload size={18} /> {t("DOWNLOAD_CSV")}
          </button>
        </div>
      </div>
      <div className="sale_report grid pt-10 3xl:grid-cols-4 gap-y-10 gap-4 gap-x-10 2xl:grid-cols-4 sm:grid-cols-2 mb-7 ">
        {/* <Link to="/users"> */}
        <NavLink to="/users" state={"active"} className="cursor-pointer text-center relative  sm:text-left px-3 md:px-4 xl:px-6 lg:px-5 rounded-lg py-4 md:py-8 border">
          <h3 className="text-center mb-0 text-slate-900 font-bold md:text-3xl sm:text-lg dark:text-white">
            <OCountUp value={dashboardDetails?.totalActiveUsers} />
            <span className="text-base text-neutral-400 font-normal block pt-3 ">{t("TOTAL_NO_OF_ACTIVE_USERS")}</span>
          </h3>
          <span className="text-4xl ml-auto sm:mr-0  mt-2 sm:mt-0 absolute right-[-10px] top-[-30px] p-3 border z-10 bg-white">
            <FaUserTie />
          </span>
        </NavLink>
        {/* </Link> */}
        {/* <Link to="/users"> */}
        <NavLink to="/users" state={"inactive"} className="text-center relative  sm:text-left px-3 md:px-4 xl:px-6 lg:px-5 rounded-lg py-4 md:py-8 border">
          <h3 className="text-center mb-0 text-slate-900 font-bold md:text-3xl sm:text-lg dark:text-white">
            <OCountUp value={dashboardDetails?.totalInactiveUsers} />
            <span className="text-base text-neutral-400 font-normal block pt-3 ">{t("TOTAL_NO_OF_INACTIVE_USERS")}</span>
          </h3>
          <span className="text-4xl ml-auto sm:mr-0  mt-2 sm:mt-0 absolute right-[-10px] top-[-30px] p-3 border z-10 bg-white">
            <FaUserTie />
          </span>
        </NavLink>
        {/* </Link> */}
        <NavLink to="/challenges-manager" state={"casual"} className="text-center relative  sm:text-left px-3 md:px-4 xl:px-6 lg:px-5 rounded-lg py-4 md:py-8 border">
          <h3 className="text-center mb-0 text-slate-900 font-bold md:text-3xl sm:text-lg dark:text-white">
            <OCountUp value={dashboardDetails?.totalFreeChallenge} />

            <span className="text-base text-neutral-400 font-normal block pt-3 ">{t("FREE_CHALLENGE")}</span>
          </h3>
          <span className="text-4xl ml-auto sm:mr-0  mt-2 sm:mt-0 absolute right-[-10px] top-[-30px] p-3 border z-10 bg-white">
            <FaAddressCard size={30} />
          </span>
        </NavLink>
        <NavLink to="/challenges-manager" state={"monetary"} className="text-center relative  sm:text-left px-3 md:px-4 xl:px-6 lg:px-5 rounded-lg py-4 md:py-8 border">
          <h3 className="text-center mb-0 text-slate-900 font-bold md:text-3xl sm:text-lg dark:text-white">
            <OCountUp value={dashboardDetails?.totalPaidChallenge} />

            <span className="text-base text-neutral-400 font-normal block pt-3 ">{t("PAID_CHALLENGE")}</span>
          </h3>
          <span className="text-4xl ml-auto sm:mr-0  mt-2 sm:mt-0 absolute right-[-10px] top-[-30px] p-3 border z-10 bg-white">
            <FaAddressCard size={30} />
          </span>
        </NavLink>
        <div className="text-center relative  sm:text-left px-3 md:px-4 xl:px-6 lg:px-5 rounded-lg py-4 md:py-8 border">
          <h3 className="text-center mb-0 text-slate-900 font-bold md:text-3xl sm:text-lg dark:text-white">
            <OCountUp value={dashboardDetails?.totalPuzzleChallenge} />

            <span className="text-base text-neutral-400 font-normal block pt-3 ">{t("TOTAL_PUZZLE_CHALLENGES")}</span>
          </h3>
          <span className="text-4xl ml-auto sm:mr-0  mt-2 sm:mt-0 absolute right-[-10px] top-[-30px] p-3 border z-10 bg-white">
            <AiOutlineStock size={30} />
          </span>
        </div>

        <div className="text-center relative  sm:text-left px-3 md:px-4 xl:px-6 lg:px-5 rounded-lg py-4 md:py-8 border">
          <h3 className="text-center mb-0 text-slate-900 font-bold md:text-3xl sm:text-lg dark:text-white">
            <OCountUp value={dashboardDetails?.totalTournament} />

            <span className="text-base text-neutral-400 font-normal block pt-3 ">{t("TOTAL_TOURNAMENT")}</span>
          </h3>
          <span className="text-4xl ml-auto sm:mr-0  mt-2 sm:mt-0 absolute right-[-10px] top-[-30px] p-3 border z-10 bg-white">
            <FaRegQuestionCircle size={30} />
          </span>
        </div>
        <div className="text-center relative  sm:text-left px-3 md:px-4 xl:px-6 lg:px-5 rounded-lg py-4 md:py-8 border">
          <h3 className="text-center mb-0 text-slate-900 font-bold md:text-3xl sm:text-lg dark:text-white">
            {helpers.formattedAmount(dashboardDetails?.totalAdminProfit)}
            <span className="text-base text-neutral-400 font-normal block pt-3 ">{t("TOTAL_NET_ADMIN_PROFIT")}</span>
          </h3>
          <span className="text-4xl ml-auto sm:mr-0  mt-2 sm:mt-0 absolute right-[-10px] top-[-30px] p-3 border z-10 bg-white">
            <GiProfit size={30} />
          </span>
        </div>
        <div className="text-center relative  sm:text-left px-3 md:px-4 xl:px-6 lg:px-5 rounded-lg py-4 md:py-8 border">
          <h3 className="text-center mb-0 text-slate-900 font-bold md:text-3xl sm:text-lg dark:text-white">
            {helpers.formattedAmount(dashboardDetails?.totalWalletBalance)}
            <span className="text-base text-neutral-400 font-normal block pt-3 ">{t("TOTAL_WALLET_BALANCE_USER_WALLET")}</span>
          </h3>
          <span className="text-4xl ml-auto sm:mr-0  mt-2 sm:mt-0 absolute right-[-10px] top-[-30px] p-3 border z-10 bg-white">
            <img src={earning} className="h-8 w-8 bg-black" alt="earningImg" />
          </span>
        </div>

        <div className="text-center relative  sm:text-left px-3 md:px-4 xl:px-6 lg:px-5 rounded-lg py-4 md:py-8 border">
          <h3 className="text-center mb-0 text-slate-900 font-bold md:text-3xl sm:text-lg dark:text-white">
            {helpers.formattedAmount(dashboardDetails?.totalAmountDeposit)}
            <span className="text-base text-neutral-400 font-normal block pt-3 ">{t("TOTAL_AMOUNT_DEPOSIT")}</span>
          </h3>
          <span className="text-4xl ml-auto sm:mr-0  mt-2 sm:mt-0 absolute right-[-10px] top-[-30px] p-3 border z-10 bg-white">
            <BiMoneyWithdraw size={30} />
          </span>
        </div>
        <div className="text-center relative  sm:text-left px-3 md:px-4 xl:px-6 lg:px-5 rounded-lg py-4 md:py-8 border">
          <h3 className="text-center mb-0 text-slate-900 font-bold md:text-3xl sm:text-lg dark:text-white">
            {helpers.formattedAmount(dashboardDetails?.totalAmountWithdrawal)}
            <span className="text-base text-neutral-400 font-normal block pt-3 ">{t("TOTAL_AMOUNT_WITHDRAWAL")}</span>
          </h3>
          <span className="text-4xl ml-auto sm:mr-0  mt-2 sm:mt-0 absolute right-[-10px] top-[-30px] p-3 border z-10 bg-white">
            <BiMoneyWithdraw size={30} />
          </span>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
