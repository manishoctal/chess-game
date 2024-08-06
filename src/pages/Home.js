import React, { useContext, useEffect, useState } from "react";
import "chartjs-adapter-date-fns";
import { BiMoneyWithdraw, BiReset } from "react-icons/bi";
import { GoDownload } from "react-icons/go";
import { FaUserTie, FaRegQuestionCircle, FaAddressCard } from "react-icons/fa";
import { AiOutlineStock } from "react-icons/ai";
import { GiProfit } from "react-icons/gi";
import { apiGet } from "utils/apiFetch";
import pathObj from "utils/apiPath";
import earning from "assets/images/earning.jpg";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import Chart from "react-apexcharts";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale } from "chart.js";
import AuthContext from "context/AuthContext";
import ODateRangePicker from "components/shared/datePicker/ODateRangePicker";
import OCountUp from "components/OCountUp";
import helpers from "utils/helpers";
import { createTheme, ThemeProvider, StyledEngineProvider } from "@mui/material/styles";
import useToastContext from "hooks/useToastContext";
import { Link } from "react-router-dom";
import { startCase } from "lodash";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale);

export const lineGraphOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: false,
      text: "",
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 80,
      },
    },
  },
};

export const lineGraphData = {
  labels: [],
  datasets: [
    {
      label: "Users",
      data: [],
    },
  ],
};

export const lineGraphOptions2 = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: false,
      text: "",
    },
  },
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

export const lineGraphData2 = {
  labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  datasets: [
    {
      label: "Sales",
      data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    },
  ],
};

function Home() {
  const { t } = useTranslation();
  const { logoutUser, user } = useContext(AuthContext);
  const [selectedButton, setSelectedButton] = useState("day");
  const [dashboardDetails, setDashboardDetails] = useState({});
  const [startDate, setStartDate] = useState(dayjs().subtract(1, "month").format("YYYY-MM-DD"));
  const [endDate, setEndDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [graphTwoStartData, setGraphTwoStartData] = useState(dayjs().subtract(1, "month").format("YYYY-MM-DD"));
  const [graphTwoEndDate, setGraphTwoEndDate] = useState(dayjs().format("YYYY-MM-DD"));

  const [filterData, setFilterData] = useState({
    startDate: "",
    endDate: "",
    isReset: false,
    isFilter: false,
  });

  const [graphTwoDropdownValue, setGraphTwoDropdownValue] = useState("day");
  const getDefaultDateDisableState = () => ({
    first: {
      day: false,
      week: false,
      month: false,
      year: false,
    },
    second: {
      day: false,
      week: false,
      month: false,
      year: false,
    },
  });

  const getDefaultChartData = () => ({
    options: {
      chart: {
        id: "basic-bar",
      },
      xaxis: {
        categories: [],
      },
    },
    series: [
      {
        name: "User Registered",
        data: [12, 23, 45, 66, 76, 87, 89, 53, 67, 2, 45, 78, 342, 67, 234, 77, 53, 173, 53, 46, 43, 56, 34],
      },
    ],
  });

  const [dateDisableState, setDateDisableState] = useState(getDefaultDateDisableState());
  const [setChartData] = useState(getDefaultChartData());
  const [chartDataTwo, setChartDataTwo] = useState(getDefaultChartData());
  const [isReset, setIsReset] = useState(false);
  const notification = useToastContext();

  const manager = user?.permission?.find((e) => e.manager === "dashboard") ?? {};

  const handleDateChange = (start, end, type) => {
    if (type === "first") {
      setStartDate(start);
      setEndDate(end);
      handleActiveForFirst(start, end);
    } else {
      setGraphTwoStartData(start);
      setGraphTwoEndDate(end);
      handleActiveForSecond(start, end);
    }
    checkIfButtonShouldBeDisabled(start, end, type);
  };

  const handleButtonChange = (data, type) => {
    if (type === "first") {
      setSelectedButton(data);
    } else {
      setGraphTwoDropdownValue(data);
    }
  };
  const theme = createTheme({
    palette: {
      text: {
        primary: "#00ff00",
      },
    },
  });

  const getDashboardDetails = async () => {
    try {
      const payload = {
        startDate: helpers?.ternaryCondition(filterData?.startDate, dayjs(filterData?.startDate).format("YYYY-MM-DD"), null),
        endDate: helpers?.ternaryCondition(filterData?.endDate, dayjs(filterData?.endDate).format("YYYY-MM-DD"), null),
      };
      const path = pathObj.getDashboardDetailsss;
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
  }, [startDate, endDate, filterData]);

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

  // useEffect(() => {
  //   if (startDate && endDate && selectedButton) {
  //     // graph api call function ====
  //     handleGraphApiCall(startDate, endDate, selectedButton, "first");
  //   }
  //   if (graphTwoDropdownValue && graphTwoEndDate && graphTwoStartData) {
  //     // graph api call function ====
  //     handleGraphApiCall(graphTwoStartData, graphTwoEndDate, graphTwoDropdownValue, "second");
  //   }
  // }, [startDate, endDate, selectedButton, graphTwoStartData, graphTwoEndDate, graphTwoDropdownValue]);

  const handleActiveForFirst = (start, end) => {
    if (start && end) {
      const dateDifference = dayjs(end).diff(start, "day");
      if (dateDifference > 366) {
        setSelectedButton("year");
      } else if (dateDifference > 31 && dateDifference <= 366) {
        setSelectedButton("month");
      } else {
        setSelectedButton("day");
      }
    }
  };
  const handleActiveForSecond = (start, end) => {
    if (start && end) {
      const dateDifference = dayjs(end).diff(start, "day");
      if (dateDifference > 366) {
        setGraphTwoDropdownValue("year");
      } else if (dateDifference > 31 && dateDifference <= 366) {
        setGraphTwoDropdownValue("month");
      } else {
        setGraphTwoDropdownValue("day");
      }
    }
  };

  // const setChartDataForType = (prevData, newCategories, newData) => ({
  //   ...prevData,
  //   options: {
  //     ...prevData?.options,
  //     xaxis: {
  //       ...prevData?.options?.xaxis,
  //       categories: newCategories,
  //     },
  //   },
  //   series: [
  //     {
  //       ...prevData?.series[0],
  //       data: newData,
  //     },
  //   ],
  // });

  // const handleGraphApiCall = async (start, end, dropValue, type) => {
  //   try {
  //     const payload = {
  //       startDate: helpers?.ternaryCondition(start, dayjs(start).format("YYYY-MM-DD"), null),
  //       endDate: helpers?.ternaryCondition(end, dayjs(end).format("YYYY-MM-DD"), null),
  //       type: dropValue,
  //     };
  //     const path = "";
  //     const result = await apiGet(path, payload);
  //     if (result?.data?.success) {
  //       const newCategories = result?.data?.results?.xAxis;
  //       let yAxisData = result?.data?.results?.yAxis;

  //       if (Array.isArray(yAxisData)) {
  //         let newData = yAxisData.map((number) => Math.round(number));
  //         if (type === "first") {
  //           setChartData((prevData) => setChartDataForType(prevData, newCategories, newData));
  //         } else {
  //           setChartDataTwo((prevData) => setChartDataForType(prevData, newCategories, newData));
  //         }
  //       }
  //     } else {
  //       notification.error(result?.data?.message);
  //     }
  //   } catch (error) {
  //     console.error("error:", error);
  //   }
  // };

  const checkIfButtonShouldBeDisabled = (start, end, type) => {
    const dateDifference = dayjs(end).diff(start, "day");
    const updatedDateDisableState = { ...dateDisableState };

    if (dateDifference >= 1 && dateDifference <= 31) {
      updatedDateDisableState[type].year = true;
      updatedDateDisableState[type].month = true;
    }

    if (dateDifference > 366) {
      updatedDateDisableState[type].month = true;
      updatedDateDisableState[type].day = true;
      updatedDateDisableState[type].week = true;
    }

    if (dateDifference > 31 && dateDifference <= 366) {
      updatedDateDisableState[type].day = true;
      updatedDateDisableState[type].week = true;
      updatedDateDisableState[type].year = true;
    }

    setDateDisableState(updatedDateDisableState);
  };

  const handleReset = () => {
    setEndDate(dayjs().format("YYYY-MM-DD"));
    setStartDate(dayjs().subtract(1, "month").format("YYYY-MM-DD"));
    setGraphTwoStartData(dayjs().subtract(1, "month").format("YYYY-MM-DD"));
    setGraphTwoEndDate(dayjs().format("YYYY-MM-DD"));
    setSelectedButton("day");
    setGraphTwoDropdownValue("day");
  };

  const generateButton = (buttonType, label, selectedButtons, handleButtonChangeData, disableState, keyFor) => {
    const isActive = selectedButtons === buttonType;

    return (
      <button
        type="button"
        className={`bg-gradientTo text-sm px-8 mb-3 ml-3 py-2 rounded-lg items-center border border-transparent text-white hover:bg-DarkBlue sm:w-auto w-1/4 ${isActive ? "bg-gradient-to-b from-blue-300 to-green-500" : ""}`}
        onClick={() => handleButtonChangeData(buttonType, keyFor)}
        disabled={disableState}
      >
        {label}
      </button>
    );
  };

  // if (helpers.andOperator(user?.role == "subAdmin", !manager?.view)) {
  //   return (
  //     <div className="flex justify-center items-center" style={{ height: "700px" }}>
  //       <div className="text-center">
  //         <div className="text-[26px]" style={{ fontWeight: 500 }}>
  //           <h3>Welcome! {`${startCase(user?.firstName)} ${startCase(user?.lastName)}`} You Are Not Authorize To View This Page</h3>
  //         </div>
  //         <div className="text-[20px] mt-1" style={{ fontWeight: 400 }}>
  //           <p>Sorry for the inconvenience.</p>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }
  return (
    <>
      <div className="py-4 px-4 md:px-8 dark:bg-slate-900">
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
            <button type="button" className="bg-gradientTo text-sm px-6 flex gap-2 ml-3 mb-3 py-2 rounded-lg items-center border border-transparent text-white hover:bg-DarkBlue sm:w-auto w-1/2" title={t("DOWNLOAD_CSV")}>
              <GoDownload size={18} /> {t("DOWNLOAD_CSV")}
            </button>
          </div>
        </div>
        <div className="sale_report grid pt-10 3xl:grid-cols-4 gap-y-10 gap-4 gap-x-10 2xl:grid-cols-4 sm:grid-cols-2 mb-7 ">
          <Link to="/users">
            <div className="text-center relative  sm:text-left px-3 md:px-4 xl:px-6 lg:px-5 rounded-lg py-4 md:py-8 border">
              <h3 className="text-center mb-0 text-slate-900 font-bold md:text-3xl sm:text-lg dark:text-white">
                <OCountUp value={dashboardDetails?.totalNumberOfUsers} />
                <span className="text-base text-neutral-400 font-normal block pt-3 ">{t("TOTAL_NO_OF_USERS")}</span>
              </h3>
              <span className="text-4xl ml-auto sm:mr-0  mt-2 sm:mt-0 absolute right-[-10px] top-[-30px] p-3 border z-10 bg-white">
                <FaUserTie />
              </span>
            </div>
          </Link>
          <div className="text-center relative  sm:text-left px-3 md:px-4 xl:px-6 lg:px-5 rounded-lg py-4 md:py-8 border">
            <h3 className="text-center mb-0 text-slate-900 font-bold md:text-3xl sm:text-lg dark:text-white">
              <OCountUp value={dashboardDetails?.totalPlayerCards} />

              <span className="text-base text-neutral-400 font-normal block pt-3 ">{t("TOTAL_CHALLENGE")}</span>
            </h3>
            <span className="text-4xl ml-auto sm:mr-0  mt-2 sm:mt-0 absolute right-[-10px] top-[-30px] p-3 border z-10 bg-white">
              <FaAddressCard size={30} />
            </span>
          </div>
          <div className="text-center relative  sm:text-left px-3 md:px-4 xl:px-6 lg:px-5 rounded-lg py-4 md:py-8 border">
            <h3 className="text-center mb-0 text-slate-900 font-bold md:text-3xl sm:text-lg dark:text-white">
              <OCountUp value={dashboardDetails?.totalPlayerStockList} />

              <span className="text-base text-neutral-400 font-normal block pt-3 ">{t("TOTAL_PUZZLE_CHALLENGES")}</span>
            </h3>
            <span className="text-4xl ml-auto sm:mr-0  mt-2 sm:mt-0 absolute right-[-10px] top-[-30px] p-3 border z-10 bg-white">
              <AiOutlineStock size={30} />
            </span>
          </div>

          <div className="text-center relative  sm:text-left px-3 md:px-4 xl:px-6 lg:px-5 rounded-lg py-4 md:py-8 border">
            <h3 className="text-center mb-0 text-slate-900 font-bold md:text-3xl sm:text-lg dark:text-white">
              <OCountUp value={dashboardDetails?.totalTradingQuestionPosted} />

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
              {helpers.formattedAmount(dashboardDetails?.totalAmountDeposit)}
              <span className="text-base text-neutral-400 font-normal block pt-3 ">{t("TOTAL_WALLET_BALANCE_USER_WALLET")}</span>
            </h3>
            <span className="text-4xl ml-auto sm:mr-0  mt-2 sm:mt-0 absolute right-[-10px] top-[-30px] p-3 border z-10 bg-white">
              <img src={earning} className="h-8 w-8 bg-black" alt="earningImg" />
            </span>
          </div>

          <div className="text-center relative  sm:text-left px-3 md:px-4 xl:px-6 lg:px-5 rounded-lg py-4 md:py-8 border">
            <h3 className="text-center mb-0 text-slate-900 font-bold md:text-3xl sm:text-lg dark:text-white">
              {helpers.formattedAmount(dashboardDetails?.totalAmountWithdrawal)}
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
      {/* <div className="dark:bg-gray-800 py-7 px-4 md:px-8 bg-[#F9F9F9] border-solid border-2 border-gray m-10 rounded-md">
        <div className="sm:flex items-center text-center sm:text-left px-3 md:px-4 xl:px-7 lg:px-5  py-4 md:py-8 border dark:bg-slate-900">
          <StyledEngineProvider>
            <ThemeProvider theme={theme}>
              <div className="px-11">
                {generateButton("day", "Daily", graphTwoDropdownValue, handleButtonChange, dateDisableState.second.day, "second")}
                {generateButton("week", "Weekly", graphTwoDropdownValue, handleButtonChange, dateDisableState.second.week, "second")}
                {generateButton("month", "Monthly", graphTwoDropdownValue, handleButtonChange, dateDisableState.second.month, "second")}
                {generateButton("year", "Yearly", graphTwoDropdownValue, handleButtonChange, dateDisableState.second.year, "second")}
              </div>
            </ThemeProvider>
          </StyledEngineProvider>
          <ODateRangePicker
            handleDateChange={(start, end) => handleDateChange(start, end, "second")}
            isReset={isReset}
            setIsReset={setIsReset}
            filterData={{
              startDate: new Date(graphTwoStartData),
              endDate: new Date(graphTwoEndDate),
            }}
            place="dashboard"
          />
          <button type="button" onClick={handleReset} className="bg-gradientTo text-sm px-6 flex gap-2 mb-3 ml-3 py-2 rounded-lg items-center border border-transparent text-white hover:bg-DarkBlue sm:w-auto w-1/2">
            <BiReset size={18} /> {t("O_RESET")}
          </button>
        </div>
        <div className="dark:bg-gray-900 dark:border sale_report grid grid-cols-1 gap-5 mb-7 bg-white p-4">
          <div className="flex justify-between">
            <h4 className="font-medium text-lg dark:text-white">{t("EXPENDITURE_BY_TOURIST")}</h4>
          </div>
          <Chart
            options={chartDataTwo.options}
            series={chartDataTwo.series}
            type="bar"
            // width='1000'
            height="600"
          />
        </div>
      </div> */}
    </>
  );
}

export default Home;
