import React, { useContext, useEffect, useState } from 'react'
import 'chartjs-adapter-date-fns'
import { FaUserTie } from 'react-icons/fa'
import { apiGet } from 'utils/apiFetch'
import pathObj from 'utils/apiPath'
import earning from 'assets/images/earning.jpg'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'
import Chart from 'react-apexcharts'
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
import AuthContext from 'context/AuthContext'
import ODateRangePicker from 'components/shared/datePicker/ODateRangePicker'
import OCountUp from 'components/OCountUp'
import helpers from 'utils/helpers'
import { createTheme, ThemeProvider, StyledEngineProvider } from '@mui/material/styles'
import useToastContext from 'hooks/useToastContext'

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
  const { t } = useTranslation()
  const { logoutUser } = useContext(AuthContext)
  const [selectedButton, setSelectedButton] = useState("day")
  const [dashboardDetails, setDashboardDetails] = useState({})
  const [startDate, setStartDate] = useState(dayjs().subtract(1, 'month').format('YYYY-MM-DD'))
  const [endDate, setEndDate] = useState(dayjs().format('YYYY-MM-DD'))
  const [graphTwoStartData, setGraphTwoStartData] = useState((dayjs().subtract(1, 'month').format('YYYY-MM-DD')))
  const [graphTwoEndDate, setGraphTwoEndDate] = useState(dayjs().format('YYYY-MM-DD'))
  const [graphTwoDropdownValue, setGraphTwoDropdownValue] = useState("day")
  const [dayDisableForWeek,setDayDisableForWeek]= useState(false)
  const [dayDisableForDay,setDayDisableForDay]= useState(false)
  const [dayDisableForMonth,setDayDisableForMonth]= useState(false)
  const [dayDisableForYear,setDayDisableForyear]= useState(false)
  
  const [dayDisableForWeekSecond,setDayDisableForWeekSecond]= useState(false)
  const [dayDisableForDaySecond,setDayDisableForDaySecond]= useState(false)
  const [dayDisableForMonthSecond,setDayDisableForMonthSecond]= useState(false)
  const [dayDisableForYearSecond,setDayDisableForyearSecond]= useState(false)
  const notification = useToastContext()
  const [isReset, setIsReset] = useState(false)
  const [chartData, setChartData] = useState({
    options: {
      chart: {
        id: 'basic-bar',
      },
      xaxis: {
        Date: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999]
      },
    },
    series: [
      {
        name: 'Earning',
        data: [30, 40, 45, 50, 49, 60, 70, 91, 49, 60, 70, 91],
      },
    ],
  })
  const [chartDataTwo, setChartDataTwo] = useState({
    options: {
      chart: {
        id: 'basic-bar',
      },
      xaxis: {

        categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999]

      },
    },
    series: [
      {
        name: 'series-1',
        data: [30, 40, 45, 50, 49, 60, 70, 91, 49, 60, 70, 91],
      },
    ],
  })


  const handleDateChange = (start, end, type) => {
    if (type === "first") {
      setStartDate(start)
      setEndDate(end)
      handleActiveForFirst(start, end)
      checkIfButtonShouldBeDisabled(start, end, type);
    } else {
      setGraphTwoStartData(start)
      setGraphTwoEndDate(end)
      handleActiveForSecond(start, end)
      checkIfButtonShouldBeDisabled(start, end, type);
    }
  }

  const handleButtonChange = (data, type) => {
    if (type === "first") {
      setSelectedButton(data)
    } else {
      setGraphTwoDropdownValue(data)
    }
  }
  const theme = createTheme({
    palette: {
      text: {
        primary: '#00ff00',
      },
    },
  })

  const getDashboardDetails = async () => {
    try {
      const payload = {
        startDate: startDate ? dayjs(startDate).format('YYYY-MM-DD') : null,
        endDate: endDate ? dayjs(endDate).format('YYYY-MM-DD') : null
      }
      const path = pathObj.getDashboardDetails
      const result = await apiGet(path, payload)
      setDashboardDetails({ ...dashboardDetails, ...result.data.results })
    } catch (error) {
      console.error('error:', error)
      if (error.response.status === 401 || error.response.status === 409) {
        logoutUser()
      }
    }
  }

  useEffect(() => {
    getDashboardDetails()
  }, [startDate, endDate])


  const handleActiveForFirst = (start, end) => {
    if (start && end) {
      const dateDifference = dayjs(end).diff(start, 'day');
      if (dateDifference > 366) {
        setSelectedButton('year');
      } else if (dateDifference > 31 && dateDifference <= 366) {
        setSelectedButton('month');
      }
      // else if (dateDifference > 7 && dateDifference <= 31) {
      //   setSelectedButton('week');
      // }
      else {
        setSelectedButton('day');
      }
    }
  }
  const handleActiveForSecond = (start, end) => {
    if (start && end) {
      const dateDifference = dayjs(end).diff(start, 'day');
      console.log("dateDifference", dateDifference)
      if (dateDifference > 366) {
        setGraphTwoDropdownValue('year')
      } else if (dateDifference > 31 && dateDifference <= 366) {
        setGraphTwoDropdownValue('month')
      }
      // else if (dateDifference > 7 && dateDifference <= 31) {
      //   setGraphTwoDropdownValue('week')
      // }
      else {
        setGraphTwoDropdownValue('day')
      }
    }

  }


  useEffect(() => {
    if (startDate && endDate && selectedButton) {
      handleGraphApiCall(startDate, endDate, selectedButton, "first")
    }
    if (graphTwoDropdownValue && graphTwoEndDate && graphTwoStartData) {
      handleGraphApiCall(graphTwoStartData, graphTwoEndDate, graphTwoDropdownValue, "second")
    }
  }, [startDate, endDate, selectedButton, graphTwoStartData, graphTwoEndDate, graphTwoDropdownValue])

  const handleGraphApiCall = async (start, end, dropValue, type) => {
    try {
      const payload = {
        startDate: start ? dayjs(start).format('YYYY-MM-DD') : null,
        endDate: end ? dayjs(end).format('YYYY-MM-DD') : null,
        type: dropValue
      };
      const path = pathObj.getEarningManagerGraph;
      const result = await apiGet(path, payload)
      if (result?.data?.success) {
        const newCategories = result?.data?.results?.xAxis
        let newData = result?.data?.results?.yAxis
        if (type === "first") {
          setChartData(prevData => ({
            ...prevData,
            options: {
              ...prevData?.options,
              xaxis: {
                ...prevData?.options?.xaxis,
                categories: newCategories,
              },
            },
            series: [
              {

                ...prevData?.series[0],
                data: newData,
              },
            ],
          }));
        } else {

          setChartDataTwo(prevData => ({
            ...prevData,
            options: {
              ...prevData?.options,
              xaxis: {
                ...prevData?.options?.xaxis,
                categories: newCategories,
              },
            },
            series: [
              {
                ...prevData?.series[0],
                data: (newData),
              },
            ],
          }));
        }
      } else {
        notification.error(result?.data?.message)
      }
    } catch (error) {
      console.error('error:', error);
    }
  }


  const handleReset = () => {
    setEndDate(dayjs().format('YYYY-MM-DD'))
    setStartDate(dayjs().subtract(1, 'month').format('YYYY-MM-DD'))
    setGraphTwoStartData(dayjs().subtract(1, 'month').format('YYYY-MM-DD'))
    setGraphTwoEndDate(dayjs().format('YYYY-MM-DD'))
    setSelectedButton("day")
    setGraphTwoDropdownValue("day")
  }

 

  const checkIfButtonShouldBeDisabled = (start, end, type) => {
    const dateDifference = dayjs(end).diff(start, 'day');
    console.log("dateDifference",dateDifference)
    //DAY
    if (dateDifference >= 1 && dateDifference <= 31) {
      if (type === "second") {
        setDayDisableForyearSecond(true)
        setDayDisableForMonthSecond(true)
      }
      else {
        setDayDisableForyear(true)
        setDayDisableForMonth(true)
      }
    }
    //YEAR
    if (dateDifference > 366) {
      if (type === "second") {
        setDayDisableForMonthSecond(true)
        setDayDisableForDaySecond(true)
        setDayDisableForWeekSecond(true)
      }
      else {
        setDayDisableForMonth(true)
        setDayDisableForDay(true)
        setDayDisableForWeek(true)
      }
    }
    //YEAR
    if (dateDifference > 31 && dateDifference <= 366) {
      if (type === "second") {
        setDayDisableForDaySecond(true)
        setDayDisableForWeekSecond(true)
        setDayDisableForyearSecond(true)
      }
      else {
        setDayDisableForDay(true)
        setDayDisableForWeek(true)
        setDayDisableForyear(true)
      }
    }
    return false;
  };


  console.log("dayDisableForWeek", dayDisableForWeek)
  console.log("dayDisableForDay", dayDisableForDay)
  return (
    <>
      <div className='py-4 px-4 md:px-8 dark:bg-slate-900'>
        <div className='sale_report grid pt-10 3xl:grid-cols-4 gap-y-10 gap-4 gap-x-10 2xl:grid-cols-4 sm:grid-cols-2 mb-7 '>
          <div className='text-center relative  sm:text-left px-3 md:px-4 xl:px-6 lg:px-5 rounded-lg py-4 md:py-8 border'>
            <h3 className='text-center mb-0 text-slate-900 font-bold md:text-3xl sm:text-lg dark:text-white'>
              <OCountUp value={dashboardDetails?.totalUsersCount} />
              <span className='text-base text-neutral-400 font-normal block pt-3 '>
                {t('VIEW_NO_OF_USERS')}
              </span>
            </h3>
            <span className='text-4xl ml-auto sm:mr-0  mt-2 sm:mt-0 absolute right-[-10px] top-[-10px] p-3 border z-10 bg-white'>
              <FaUserTie />
            </span>
          </div>

          <div className='text-center relative  sm:text-left px-3 md:px-4 xl:px-6 lg:px-5 rounded-lg py-4 md:py-8 border'>
            <h3 className='text-center mb-0 text-slate-900 font-bold md:text-3xl sm:text-lg dark:text-white'>
              <OCountUp value={dashboardDetails?.totalActiveUsersCount} />

              <span className='text-base text-neutral-400 font-normal block pt-3 '>
                {t('NO_OF_ACTIVE_USERS')}
              </span>
            </h3>
            <span className='text-4xl ml-auto sm:mr-0  mt-2 sm:mt-0 absolute right-[-10px] top-[-10px] p-3 border z-10 bg-white'>
              <FaUserTie />
            </span>
          </div>
          <div className='text-center relative  sm:text-left px-3 md:px-4 xl:px-6 lg:px-5 rounded-lg py-4 md:py-8 border'>
            <h3 className='text-center mb-0 text-slate-900 font-bold md:text-3xl sm:text-lg dark:text-white'>
              {helpers.formattedAmount(
                dashboardDetails?.AmountAddedByScratchCard
              )}
              <span className='text-base text-neutral-400 font-normal block pt-3 '>
                {t('Amount added by scratchcard')}
              </span>
            </h3>
            <span className='text-4xl ml-auto sm:mr-0  mt-2 sm:mt-0 absolute right-[-10px] top-[-10px] p-3 border z-10 bg-white'>
              <img
                src={earning}
                className='h-8 w-8 bg-black'
                alt='earningImg'
              />
            </span>
          </div>
          <div className='text-center relative  sm:text-left px-3 md:px-4 xl:px-6 lg:px-5 rounded-lg py-4 md:py-8 border'>
            <h3 className='text-center mb-0 text-slate-900 font-bold md:text-3xl sm:text-lg dark:text-white'>
              {helpers.formattedAmount(
                dashboardDetails?.totalPaymentByThaiLocal
              )}
              <span className='text-base text-neutral-400 font-normal block pt-3 '>
                {t('Total payment by thai local')}
              </span>
            </h3>
            <span className='text-4xl ml-auto sm:mr-0  mt-2 sm:mt-0 absolute right-[-10px] top-[-10px] p-3 border z-10 bg-white'>
              <img
                src={earning}
                className='h-8 w-8 bg-black'
                alt='earningImg'
              />
            </span>
          </div>

          <div className='text-center relative  sm:text-left px-3 md:px-4 xl:px-6 lg:px-5 rounded-lg py-4 md:py-8 border'>
            <h3 className='text-center mb-0 text-slate-900 font-bold md:text-3xl sm:text-lg dark:text-white'>
              {helpers.formattedAmount(
                dashboardDetails?.totalAmountAddedToTourist
              )}
              <span className='text-base text-neutral-400 font-normal block pt-3 '>
                {t('Amount added by admin in tourist wallet')}
              </span>
            </h3>
            <span className='text-4xl ml-auto sm:mr-0  mt-2 sm:mt-0 absolute right-[-10px] top-[-10px] p-3 border z-10 bg-white'>
              <img
                src={earning}
                className='h-8 w-8 bg-black'
                alt='earningImg'
              />
            </span>
          </div>
          <div className='text-center relative  sm:text-left px-3 md:px-4 xl:px-6 lg:px-5 rounded-lg py-4 md:py-8 border'>
            <h3 className='text-center mb-0 text-slate-900 font-bold md:text-3xl sm:text-lg dark:text-white'>
              {helpers.formattedAmount(
                dashboardDetails?.totalAmountAddedToLocal
              )}
              <span className='text-base text-neutral-400 font-normal block pt-3 '>
                {t('Amount added by admin in thai local wallet')}
              </span>
            </h3>
            <span className='text-4xl ml-auto sm:mr-0  mt-2 sm:mt-0 absolute right-[-10px] top-[-10px] p-3 border z-10 bg-white'>
              <img
                src={earning}
                className='h-8 w-8 bg-black'
                alt='earningImg'
              />
            </span>
          </div>
          <div className='text-center relative  sm:text-left px-3 md:px-4 xl:px-6 lg:px-5 rounded-lg py-4 md:py-8 border'>
            <h3 className='text-center mb-0 text-slate-900 font-bold md:text-3xl sm:text-lg dark:text-white'>
              {helpers.formattedAmount(
                dashboardDetails?.totalRewardGainedByUser
              )}
              <span className='text-base text-neutral-400 font-normal block pt-3 '>
                {t('Total reward gain by user')}
              </span>
            </h3>
            <span className='text-4xl ml-auto sm:mr-0  mt-2 sm:mt-0 absolute right-[-10px] top-[-10px] p-3 border z-10 bg-white'>
              <img
                src={earning}
                className='h-8 w-8 bg-black'
                alt='earningImg'
              />
            </span>
          </div>

          <div className='text-center relative  sm:text-left px-3 md:px-4 xl:px-6 lg:px-5 rounded-lg py-4 md:py-8 border'>
            <h3 className='text-center mb-0 text-slate-900 font-bold md:text-3xl sm:text-lg dark:text-white'>
              <OCountUp value={dashboardDetails?.usersBetween10And300 || 0} />
              <span className='text-base text-neutral-400 font-normal block pt-3 '>
                {t('USERS_BETWEEN_10_BAHT_TO_300_BAHT')}
              </span>
            </h3>
            <span className='text-4xl ml-auto sm:mr-0  mt-2 sm:mt-0 absolute right-[-10px] top-[-10px] p-3 border z-10 bg-white'>
              <FaUserTie className='h-8 w-8' />
            </span>
          </div>
          <div className='text-center relative  sm:text-left px-3 md:px-4 xl:px-6 lg:px-5 rounded-lg py-4 md:py-8 border'>
            <h3 className='text-center mb-0 text-slate-900 font-bold md:text-3xl sm:text-lg dark:text-white'>
              <OCountUp value={dashboardDetails?.usersBetween200And1000 || 0} />
              <span className='text-base text-neutral-400 font-normal block pt-3 '>
                {t('USERS_BETWEEN_200_BAHT_TO_1000_BAHT')}
              </span>
            </h3>
            <span className='text-4xl ml-auto sm:mr-0  mt-2 sm:mt-0 absolute right-[-10px] top-[-10px] p-3 border z-10 bg-white'>
              <FaUserTie className='h-8 w-8' />
            </span>
          </div>
        </div>
      </div>
      <div className='py-7 px-4 md:px-8 bg-[#F9F9F9] border-solid border-2 border-gray m-10 rounded-md'>
        <div className='sm:flex items-center text-center sm:text-left px-3 md:px-4 xl:px-7 lg:px-5  py-4 md:py-8 border dark:bg-slate-900'>
          {/* <StyledEngineProvider>
            <ThemeProvider theme={theme}>
              <ToggleButtonGroup
                value={selectedButton}
                exclusive
                onChange={(e) => handleButtonChange(e, "first")}
                aria-label="button group"
                className='px-11'
              >
                <ToggleButton value="day" selectedcolor="#00abc0">
                  Daily
                </ToggleButton>
                <ToggleButton value="week" selectedcolor="#00abc0">
                  Weekly
                </ToggleButton>
                <ToggleButton value="month" selectedcolor="#00abc0">
                  Monthly
                </ToggleButton>
                <ToggleButton value="year" selectedcolor="#00abc0">
                  Yearly
                </ToggleButton>
              </ToggleButtonGroup>
            </ThemeProvider>
          </StyledEngineProvider> */}
          <StyledEngineProvider>
            <ThemeProvider theme={theme}>
              <div className='px-11'>
                <button
                  type='button'
                  className={`bg-gradientTo text-sm px-8 mb-3 ml-3 py-2 rounded-lg items-center border border-transparent text-white hover:bg-DarkBlue sm:w-auto w-1/4 ${selectedButton === 'day' ? 'bg-gradient-to-b from-blue-300 to-green-500' : ''}`}
                  onClick={() => handleButtonChange('day', "first")}
                  disabled={dayDisableForDay}
                  // disabled={handleDisable(startDate,endDate)}
                >
                  Daily
                </button>
                <button
                  type='button'
                  className={`bg-gradientTo text-sm px-8 mb-3 ml-3 py-2 rounded-lg items-center border border-transparent text-white hover:bg-DarkBlue sm:w-auto w-1/4 ${selectedButton === 'week' ? 'bg-gradient-to-b from-blue-300 to-green-500' : ''}`}
                  onClick={() => handleButtonChange('week', "first")}
                  disabled={dayDisableForWeek}
                >
                  Weekly
                </button>
                <button
                  type='button'
                  className={`bg-gradientTo text-sm px-8 mb-3 ml-3 py-2 rounded-lg items-center border border-transparent text-white hover:bg-DarkBlue sm:w-auto w-1/4 ${selectedButton === 'month' ? 'bg-gradient-to-b from-blue-300 to-green-500' : ''}`}
                  onClick={() => handleButtonChange('month', "first")}
                  disabled={dayDisableForMonth}
                >
                  Monthly
                </button>
                <button
                  type='button'
                  className={`bg-gradientTo text-sm px-8 mb-3 ml-3 py-2 rounded-lg items-center border border-transparent text-white hover:bg-DarkBlue sm:w-auto w-1/4 ${selectedButton === 'year' ? 'bg-gradient-to-b from-blue-300 to-green-500' : ''}`}
                  onClick={() => handleButtonChange('year', "first")}
                  disabled={dayDisableForYear}
                >
                  Yearly
                </button>
              </div>
            </ThemeProvider>
          </StyledEngineProvider>
          <ODateRangePicker
            handleDateChange={(start, end) => handleDateChange(start, end, "first")}
            isReset={isReset}
            setIsReset={setIsReset}
            filterData={{ endDate: new Date(endDate), startDate: new Date(startDate) }}
            place='dashboard'
          />
          <button
            type='button'
            onClick={handleReset}
            className='bg-gradientTo text-sm px-8 mb-3 ml-3 py-2 rounded-lg items-center border border-transparent text-white hover:bg-DarkBlue sm:w-auto w-1/2'
          >
            {t('O_RESET')}
          </button>
        </div>
        <div className='sale_report grid grid-cols-1 gap-5 mb-7 bg-white p-4'>
          <div className='flex justify-between'>
            <h4 className='font-medium text-lg'>
              {t('EXPENDITURE_BY_THAI_LOCAL')}
            </h4>
          </div>
          <Chart
            options={chartData.options}
            series={chartData.series}
            type='bar'
            // width='1000'
            height='600'
          />

        </div>
      </div>
      <div className='py-7 px-4 md:px-8 bg-[#F9F9F9] border-solid border-2 border-gray m-10 rounded-md'>
        <div className='sm:flex items-center text-center sm:text-left px-3 md:px-4 xl:px-7 lg:px-5  py-4 md:py-8 border dark:bg-slate-900'>
          {/* <StyledEngineProvider>
            <ThemeProvider theme={theme}>
              <ToggleButtonGroup
                value={graphTwoDropdownValue}
                exclusive
                onChange={(e) => handleButtonChange(e, "second")}
                aria-label="button group"
                className='px-11'
              >
                <ToggleButton style={{ backgroundColor: '#00abc0', color: '#fff' }} value="day" selectedcolor="#00abc0">
                  Daily
                </ToggleButton>
                <ToggleButton style={{ backgroundColor: '#00abc0', color: '#fff' }} value="week" selectedcolor="#00abc0">
                  Weekly
                </ToggleButton >
                <ToggleButton style={{ backgroundColor: '#00abc0', color: '#fff' }} value="month" selectedcolor="#00abc0">
                  Monthly
                </ToggleButton>
                <ToggleButton style={{ backgroundColor: '#00abc0', color: '#fff' }} value="year" selectedcolor="#00abc0">
                  Yearly
                </ToggleButton>
              </ToggleButtonGroup>
            </ThemeProvider>
          </StyledEngineProvider> */}
          <StyledEngineProvider>
            <ThemeProvider theme={theme}>
              <div className='px-11'>
                <button
                  type='button'
                  className={`bg-gradientTo text-sm px-8 mb-3 ml-3 py-2 rounded-lg items-center border border-transparent text-white hover:bg-DarkBlue sm:w-auto w-1/4 ${graphTwoDropdownValue === 'day' ? 'bg-gradient-to-b from-blue-300 to-green-500' : ''}`}
                  onClick={() => handleButtonChange('day', "second")}
                  disabled={dayDisableForDaySecond}

                >
                  Daily
                </button>
                <button
                  type='button'
                  className={`bg-gradientTo text-sm px-8 mb-3 ml-3 py-2 rounded-lg items-center border border-transparent text-white hover:bg-DarkBlue sm:w-auto w-1/4 ${graphTwoDropdownValue === 'week' ? 'bg-gradient-to-b from-blue-300 to-green-500' : ''}`}
                  onClick={() => handleButtonChange('week', "second")}
                  disabled={dayDisableForWeekSecond}
                >
                  Weekly
                </button>
                <button
                  type='button'
                  className={`bg-gradientTo text-sm px-8 mb-3 ml-3 py-2 rounded-lg items-center border border-transparent text-white hover:bg-DarkBlue sm:w-auto w-1/4 ${graphTwoDropdownValue === 'month' ? 'bg-gradient-to-b from-blue-300 to-green-500' : ''}`}
                  onClick={() => handleButtonChange('month', "second")}
                  disabled={dayDisableForMonthSecond}
                >
                  Monthly
                </button>
                <button
                  type='button'
                  className={`bg-gradientTo text-sm px-8 mb-3 ml-3 py-2 rounded-lg items-center border border-transparent text-white hover:bg-DarkBlue sm:w-auto w-1/4 ${graphTwoDropdownValue === 'year' ? 'bg-gradient-to-b from-blue-300 to-green-500' : ''}`}
                  onClick={() => handleButtonChange('year', "second")}
                  disabled={dayDisableForYearSecond}
                >
                  Yearly
                </button>
              </div>
            </ThemeProvider>
          </StyledEngineProvider>
          <ODateRangePicker
            handleDateChange={(start, end) => handleDateChange(start, end, "second")}
            isReset={isReset}
            setIsReset={setIsReset}
            filterData={{ startDate: new Date(graphTwoStartData), endDate: new Date(graphTwoEndDate) }}
            place='dashboard'
          />
          <button
            type='button'
            onClick={handleReset}
            className='bg-gradientTo text-sm px-8 mb-3 ml-3 py-2 rounded-lg items-center border border-transparent text-white hover:bg-DarkBlue sm:w-auto w-1/2'
          >
            {t('O_RESET')}
          </button>
        </div>
        <div className='sale_report grid grid-cols-1 gap-5 mb-7 bg-white p-4'>
          <div className='flex justify-between'>
            <h4 className='font-medium text-lg'>
              {t('EXPENDITURE_BY_TOURIST')}
            </h4>
          </div>
          <Chart
            options={chartDataTwo.options}
            series={chartDataTwo.series}
            type='bar'
            // width='1000'
            height='600'
          />

        </div>
      </div>
    </>
  )
}

export default Home
