import React, { useContext, useEffect, useState } from "react";
import "chartjs-adapter-date-fns";
import { RiAdminFill } from "react-icons/ri";
import { FaWpforms, FaUserTie } from "react-icons/fa";
import { GiSolarTime } from "react-icons/gi";
import { GrMoney } from "react-icons/gr";
import { MdOutlineCollectionsBookmark } from "react-icons/md";
import { apiGet } from "utils/apiFetch";
import pathObj from "utils/apiPath";
import pendingComplaints from "assets/images/pendingComplaints.png";
import complaints from "assets/images/complaints.png";
import earning from "assets/images/earning.jpg";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import AuthContext from "context/AuthContext";
import ODateRangePicker from "components/shared/datePicker/ODateRangePicker";
import OCountUp from "components/OCountUp";
import { useNavigate } from "react-router-dom";

function Home() {
  const { t } = useTranslation();
  const { logoutUser } = useContext(AuthContext);

  const [dashboardDetails, setDashboardDetails] = useState({});
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState("");
  const [isReset, setIsReset] = useState(false);
  const handleDateChange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };

  const getDashboardDetails = async () => {
    try {
      const payload = {
        startDate: startDate ? dayjs(startDate).format("YYYY-MM-DD") : null,
        endDate: endDate ? dayjs(endDate).format("YYYY-MM-DD") : null,
      };
      const path = pathObj.getDashboardDetails;
      const result = await apiGet(path, payload);
      setDashboardDetails({ ...dashboardDetails, ...result.data.results });
    } catch (error) {
      console.log("error:", error);
      if (error.response.status === 401 || error.response.status === 409) {
        logoutUser();
      }
    }
  };

  useEffect(() => {
     getDashboardDetails();
  }, [startDate, endDate]);

  const handleReset = () => {
    setEndDate("");
    setStartDate("");
    setIsReset(!isReset);
  };

  return (
    <>
      <div className="sm:flex items-center text-center sm:text-left px-3 md:px-4 xl:px-7 lg:px-5  py-4 md:py-8 border dark:bg-slate-900">
        <ODateRangePicker
          handleDateChange={handleDateChange}
          isReset={isReset}
          setIsReset={setIsReset}
          place="dashboard"
        />
        <button
          type="button"
          onClick={handleReset}
          className="bg-gradientTo text-sm px-8 mb-3 ml-3 py-2 rounded-lg items-center border border-transparent text-white hover:bg-DarkBlue sm:w-auto w-1/2"
        >
          {t("O_RESET")}
        </button>
      </div>
      <div className="py-4 px-4 md:px-8 dark:bg-slate-900">
        <div className="sale_report grid pt-10 3xl:grid-cols-4 gap-y-10 gap-4 gap-x-10 2xl:grid-cols-4 sm:grid-cols-2 mb-7 ">
          <div
            className="text-center relative  sm:text-left px-3 md:px-4 xl:px-6 lg:px-5 rounded-lg py-4 md:py-8 border"
            // onClick={() => navigate("/sub-admin-manager")}
          >
            <h3 className="text-center mb-0 text-slate-900 font-bold md:text-3xl sm:text-lg dark:text-white">
              <OCountUp value={dashboardDetails?.totalUserCount} />
              <span className="text-base text-neutral-400 font-normal block pt-3 ">
                {t("TOTAL_NUMBER_USER")}
              </span>
            </h3>
            <span className="text-4xl ml-auto sm:mr-0  mt-2 sm:mt-0 absolute right-[-10px] top-[-10px] p-3 border z-10 bg-white">
              <RiAdminFill />
            </span>
          </div>

          <div
            className="text-center relative  sm:text-left px-3 md:px-4 xl:px-6 lg:px-5 rounded-lg py-4 md:py-8 border"
            // onClick={() => navigate("/customer-manager")}
          >
            <h3 className="text-center mb-0 text-slate-900 font-bold md:text-3xl sm:text-lg dark:text-white">
              <OCountUp value={dashboardDetails?.totalVerifiedBadgeUserCount} />

              <span className="text-base text-neutral-400 font-normal block pt-3 ">
                {t("TOTAL_USER_VERIFICATION_BADGE")}
              </span>
            </h3>
            <span className="text-4xl ml-auto sm:mr-0  mt-2 sm:mt-0 absolute right-[-10px] top-[-10px] p-3 border z-10 bg-white">
              <FaWpforms />
            </span>
          </div>

          <div
            className="text-center relative  sm:text-left px-3 md:px-4 xl:px-6 lg:px-5 rounded-lg py-4 md:py-8 border"
            // onClick={() =>
            //   navigate("/customer-manager", { state: "collector" })
            // }
          >
            <h3 className="text-center mb-0 text-slate-900 font-bold md:text-2xl sm:text-lg text-lg dark:text-white">
              <OCountUp value={dashboardDetails?.totalCollectorCount || 0} />
              <span className="text-base text-neutral-400 font-normal block pt-3 ">
                {t("TOTAL_SUBSCRIPTION_PLANS")}
              </span>
            </h3>
            <span className="text-4xl ml-auto sm:mr-0  mt-2 sm:mt-0 absolute right-[-10px] top-[-10px] p-3 border z-10 bg-white">
              <MdOutlineCollectionsBookmark className="h-8 w-8" />
            </span>
          </div>

          <div className="text-center relative  sm:text-left px-3 md:px-4 xl:px-6 lg:px-5 rounded-lg py-4 md:py-8 border">
            <h3 className="text-center mb-0 text-slate-900 font-bold md:text-3xl sm:text-lg dark:text-white">
              <OCountUp value={dashboardDetails?.totalEarningCount || 0} />
              <span className="text-base text-neutral-400 font-normal block pt-3 ">
                {t("TOTAL_EARNING")}
              </span>
            </h3>
            <span className="text-4xl ml-auto sm:mr-0  mt-2 sm:mt-0 absolute right-[-10px] top-[-10px] p-3 border z-10 bg-white">
              <FaUserTie className="h-8 w-8" />
            </span>
          </div>

          <div
            className="text-center relative  sm:text-left px-3 md:px-4 xl:px-6 lg:px-5 rounded-lg py-4 md:py-8 border"
            // onClick={() => navigate("/artwork-manager")}
          >
            <h3 className="text-center mb-0 text-slate-900 font-bold md:text-3xl sm:text-lg dark:text-white">
              <OCountUp value={dashboardDetails?.totalPostCount || 0} />
              <span className="text-base text-neutral-400 font-normal block pt-3 ">
                {t("TOTAL_POST")}
              </span>
            </h3>
            <span className="text-4xl ml-auto sm:mr-0  mt-2 sm:mt-0 absolute right-[-10px] top-[-10px] p-3 border z-10 bg-white">
              <img
                src={earning}
                className="h-8 w-8 bg-black"
                alt="earningImg"
              />
            </span>
          </div>

          <div className="text-center relative  sm:text-left px-3 md:px-4 xl:px-6 lg:px-5 rounded-lg py-4 md:py-8 border">
            <h3 className="text-center mb-0 text-slate-900 font-bold md:text-3xl sm:text-lg dark:text-white">
              <OCountUp value={dashboardDetails?.totalVideoCount || 0} />
              <span className="text-base text-neutral-400 font-normal block pt-3 ">
                {t("TOTAL_UPLOAD_VIDEO")}
              </span>
            </h3>
            <span className="text-4xl ml-auto sm:mr-0  mt-2 sm:mt-0 absolute right-[-10px] top-[-10px] p-3 border z-10 bg-white">
              <GiSolarTime className="h-8 w-8" />
            </span>
          </div>

          <div className="text-center relative  sm:text-left px-3 md:px-4 xl:px-6 lg:px-5 rounded-lg py-4 md:py-8 border">
            <h3 className="text-center mb-0 text-slate-900 font-bold md:text-3xl sm:text-lg dark:text-white">
              <OCountUp value={dashboardDetails?.totalTagCount || 0} />
              <span className="text-base text-neutral-400 font-normal block pt-3 ">
                {t("TOTAL_LISTED_TAGS")}
              </span>
            </h3>
            <span className="text-4xl ml-auto sm:mr-0  mt-2 sm:mt-0 absolute right-[-10px] top-[-10px] p-3 border z-10 bg-white">
              <GiSolarTime className="h-8 w-8" />
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
