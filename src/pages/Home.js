import React, { useContext, useEffect, useState } from "react";
import "chartjs-adapter-date-fns";
import { RiAdminFill } from "react-icons/ri";
import { FaWpforms, FaUserTie } from "react-icons/fa";
import { GiSolarTime } from "react-icons/gi";
import { MdOutlineCollectionsBookmark } from "react-icons/md";
import { apiGet } from "utils/apiFetch";
import pathObj from "utils/apiPath";
import earning from "assets/images/earning.jpg";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";

import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
} from 'chart.js'
import AuthContext from "context/AuthContext";
import ODateRangePicker from "components/shared/datePicker/ODateRangePicker";
import OCountUp from "components/OCountUp";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
)

const monthsLabels = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'June',
  'July',
  'Aug',
  'Sept',
  'Oct',
  'Nov',
  'Dec'
]

export const lineGraphOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top'
    },
    title: {
      display: false,
      text: ''
    }
  },
  scales: {
    y: {
      beginAtZero: true
    }
  }
}

export const lineGraphData = {
  labels: [],
  datasets: [
    {
      label: 'Users',
      data: []
    }
  ]
}

export const lineGraphOptions2 = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top'
    },
    title: {
      display: false,
      text: ''
    }
  },
  scales: {
    y: {
      beginAtZero: true
    }
  }
}

export const lineGraphData2 = {
  labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  datasets: [
    {
      label: 'Sales',
      data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    }
  ]
}
function Home() {
  const { t } = useTranslation();
  const { logoutUser } = useContext(AuthContext);

  const [dashboardDetails, setDashboardDetails] = useState({});
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState("");
  const [reRender, setReRender] = useState(false)
  const [usersGraphYears, setUsersGraphYears] = useState([])
  const [orderGraphYears, setOrderGraphYears] = useState([])

  const [graphPayload, setGraphPayload] = useState({
    graphYear: '-1',
    graphMonth: '-1'
  })
  const [isReset, setIsReset] = useState(false);
  const handleYearSelect = e => {
    setGraphPayload({
      ...graphPayload,
      graphYear: e.target.value
    })
  }
  const handleMonthSelect = e => {
    setGraphPayload({
      ...graphPayload,
      graphMonth: e.target.value
    })
  }
  const handleResetGraph = () => {
    setGraphPayload({
      graphYear: '-1',
      graphMonth: '-1'
    })
  }
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
    //  getDashboardDetails();
  }, [startDate, endDate]);


  useEffect(() => {
    if (graphPayload?.graphMonth !== '-1') {
      if (dashboardDetails?.userGraph?.daysList) {
        const newDates = dashboardDetails?.userGraph?.daysList
        lineGraphData.labels = newDates
        // working on y axis data
        let refData = lineGraphData.datasets[0].data
        while (refData.length > 0) {
          refData.pop()
        }
        const daysEarnReport = dashboardDetails?.userGraph?.daysEarnReport
        for (let i = 0; i < daysEarnReport.length; i++) {
          refData.push(daysEarnReport[i])
        }
        lineGraphData.datasets[0].data = refData

        setReRender(prev => !prev)
      }
    } else {
      if (dashboardDetails?.userGraph?.monthlyEarnReport) {
        // working on y axis data
        let refData = lineGraphData.datasets[0].data
        while (refData.length > 0) {
          refData.pop()
        }
        const monthlyEarnReport = dashboardDetails?.userGraph?.monthlyEarnReport
        for (let i = 0; i < monthlyEarnReport.length; i++) {
          refData.push(monthlyEarnReport[i])
        }
        lineGraphData.labels = [...monthsLabels]
        setReRender(prev => !prev)
      }
    }
    if (dashboardDetails?.userGraph?.graphDate) {
      let yearArray = []
      yearArray.push(dashboardDetails?.userGraph?.graphDate?.endYear)
      for (
        let i = yearArray[0] - 1;
        i >= dashboardDetails?.userGraph?.graphDate?.startYear;
        i--
      ) {
        yearArray.push(i)
      }
      setUsersGraphYears([...yearArray])
    }
  }, [dashboardDetails])

  useEffect(() => {
    if (graphPayload?.graphMonth !== '-1') {
      if (dashboardDetails?.orderGraph?.daysList) {
        const newDates = dashboardDetails?.orderGraph?.daysList
        lineGraphData2.labels = newDates
        // working on y axis data
        let refData = lineGraphData2.datasets[0].data
        while (refData.length > 0) {
          refData.pop()
        }
        const daysEarnReportOrder =
          dashboardDetails?.orderGraph?.daysEarnReportOrder
        for (let i = 0; i < daysEarnReportOrder?.length; i++) {
          refData.push(daysEarnReportOrder[i])
        }
        lineGraphData2.datasets[0].data = refData

        setReRender(prev => !prev)
      }
    } else {
      if (dashboardDetails?.orderGraph?.monthlyEarnDataOrder) {
        // working on y axis data
        let refData = lineGraphData2.datasets[0].data
        while (refData.length > 0) {
          refData.pop()
        }
        const monthlyEarnDataOrder =
          dashboardDetails?.orderGraph?.monthlyEarnDataOrder
        for (let i = 0; i < monthlyEarnDataOrder.length; i++) {
          refData.push(monthlyEarnDataOrder[i])
        }
        lineGraphData2.labels = [...monthsLabels]
        setReRender(prev => !prev)
      }
    }
    if (dashboardDetails?.orderGraph?.graphDate) {
      let yearArray = []
      yearArray.push(dashboardDetails?.orderGraph?.graphDate?.endYear)
      for (
        let i = yearArray[0] - 1;
        i >= dashboardDetails?.orderGraph?.graphDate?.startYear;
        i--
      ) {
        yearArray.push(i)
      }
      setOrderGraphYears([...yearArray])
    }
  }, [dashboardDetails])

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
                {t("VIEW_NO_OF_USERS")}
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
                {t("NO_OF_ACTIVE_USERS")}
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
                {t("NO_OF_INACTIVE_USERS")}
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
                {t("NO_OF_TOTAL_TRANSACTION")}
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
                {t("NO_OF_WALLET_TO_BANK_TRANSACTION")}
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
                {t("NO_OF_BANK_TO_WALLET_TRANSACTION")}
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
                {t("TOTAL_AMOUNT_ADDED")}
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
                {t("TOTAL_AMOUNT_GIVEN")}
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
                {t("ACTIVE_LOGGED_IN_USER")}
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
                {t("USERS_BETWEEN_10_BAHT_TO_300_BAHT")}
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
                {t("USERS_BETWEEN_200_BAHT_TO_1000_BAHT")}
              </span>
            </h3>
            <span className="text-4xl ml-auto sm:mr-0  mt-2 sm:mt-0 absolute right-[-10px] top-[-10px] p-3 border z-10 bg-white">
              <GiSolarTime className="h-8 w-8" />
            </span>
          </div>
        </div>
      </div>
      <div className='py-7 px-4 md:px-8 bg-[#F9F9F9] border-solid border-2 border-gray m-10 rounded-md'>
        <div className='flex justify-center mb-5'>
          <div className='flex items-center mb-3 ml-4'>
            <select
              name='month'
              className='flex flex-row-reverse border outline-none border-[#E9EDF9] text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full  p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
              value={graphPayload?.graphYear}
              onChange={handleYearSelect}
            >
              <option value='-1'>{t('DASHBOARD_SELECT_YEAR')}</option>
              {usersGraphYears?.map(year => {
                return <option key={year}>{year}</option>
              })}
            </select>
          </div>

          <div className='flex items-center mb-3 ml-4'>
            <select
              name='month'
              className='flex flex-row-reverse border outline-none border-[#E9EDF9] text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full  p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
              value={graphPayload?.graphMonth}
              onChange={handleMonthSelect}
            >
              <option value='-1'>{t('DASHBOARD_SELECT_MONTH')}</option>
              <option value='1'>{t('DASHBOARD_JANUARY')}</option>
              <option value='2'>{t('DASHBOARD_FEBRUARY')}</option>
              <option value='3'>{t('DASHBOARD_MARCH')}</option>
              <option value='4'>{t('DASHBOARD_APRIL')}</option>
              <option value='5'>{t('DASHBOARD_MAY')}</option>
              <option value='6'>{t('DASHBOARD_JUNE')}</option>
              <option value='7'>{t('DASHBOARD_JULY')}</option>
              <option value='8'>{t('DASHBOARD_AUGUST')}</option>
              <option value='9'>{t('DASHBOARD_SEPTEMBER')}</option>
              <option value='10'>{t('DASHBOARD_OCTOBER')}</option>
              <option value='11'>{t('DASHBOARD_NOVEMBER')}</option>
              <option value='12'>{t('DASHBOARD_DECEMBER')}</option>
            </select>
          </div>
          <div className='flex items-center ml-2 sm:mb-0'>
            <button
              type='button'
              onClick={handleResetGraph}
              className='bg-gradientTo text-sm px-8 mb-3 ml-3 py-2 rounded-lg items-center border border-transparent text-white hover:bg-DarkBlue sm:w-auto w-1/2'
            >
              {t('O_RESET')}
            </button>
          </div>
        </div>

        <div className='sale_report grid grid-cols-2 gap-5 mb-7'>
          <div className='bg-white p-8 rounded-lg'>
            <div className='flex justify-between'>
              <h4 className='font-medium text-lg'>{t('EXPENDITURE_BY_TOURIST')}</h4>
            </div>
            <Line options={lineGraphOptions} data={lineGraphData} />
          </div>

          <div className='bg-white p-8 rounded-lg'>
            <h4 className='font-medium text-lg'>{t('PAYMENTS_MADE_BY_LOCALS')}</h4>
            <Line options={lineGraphOptions} data={lineGraphData2} />
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
