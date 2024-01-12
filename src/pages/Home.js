import React, { useContext, useEffect, useState } from 'react'
import 'chartjs-adapter-date-fns'
import { FaUserTie } from 'react-icons/fa'
import { apiGet } from 'utils/apiFetch'
import pathObj from 'utils/apiPath'
import earning from 'assets/images/earning.jpg'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'
import Chart from 'react-apexcharts'

import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale } from 'chart.js'
import AuthContext from 'context/AuthContext'
import ODateRangePicker from 'components/shared/datePicker/ODateRangePicker'
import OCountUp from 'components/OCountUp'
import helpers from 'utils/helpers'
import { Button, ToggleButtonGroup } from '@mui/material'
import MuiToggleButton from '@mui/material/ToggleButton'
import { styled, createTheme, ThemeProvider, StyledEngineProvider } from '@mui/material/styles'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale)

export const lineGraphOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: false,
      text: '',
    },
  },
  scales: {
    y: {
      beginAtZero: true,
    },
  },
}

export const lineGraphData = {
  labels: [],
  datasets: [
    {
      label: 'Users',
      data: [],
    },
  ],
}

export const lineGraphOptions2 = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: false,
      text: '',
    },
  },
  scales: {
    y: {
      beginAtZero: true,
    },
  },
}

export const lineGraphData2 = {
  labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  datasets: [
    {
      label: 'Sales',
      data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    },
  ],
}
function Home() {
  const { t } = useTranslation()
  const { logoutUser } = useContext(AuthContext)
  const [selectedButton, setSelectedButton] = useState("")
  const [dashboardDetails, setDashboardDetails] = useState({})
  const [earningGraphDetails, setEarningGraphDetails] = useState({})
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [graphTwoStartData, setGraphTwoStartData] = useState('')
  const [graphTwoEndDate, setGraphTwoEndDate] = useState('')
  const [graphTwoDropdownValue, setGraphTwoDropdownValue] = useState("")
  const [chartData, setChartData] = useState({
    options: {
      chart: {
        id: 'basic-bar',
      },
      xaxis: {

        categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999]
        // categories: ['January', 'Febrauray', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      },
    },
    series: [
      {
        name: 'series-1',
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
        // categories: ['January', 'Febrauray', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      },
    },
    series: [
      {
        name: 'series-1',
        data: [30, 40, 45, 50, 49, 60, 70, 91, 49, 60, 70, 91],
      },
    ],
  })

  const [isReset, setIsReset] = useState(false)

  const handleDateChange = (start, end, type) => {
    if (type === "first") {
      setStartDate(start)
      setEndDate(end)
    } else {
      setGraphTwoStartData(start)
      setGraphTwoEndDate(end)
    }
  }

  const handleButtonChange = (e, type) => {
    console.log()
    if (type === "first") {
      setSelectedButton(e.target.value)
    } else {
      setGraphTwoDropdownValue(e.target.value)
    }
  }
  const theme = createTheme({
    palette: {
      text: {
        primary: '#00ff00',
      },
    },
  })

  const ToggleButton = styled(MuiToggleButton)(({ selectedcolor }) => ({
    '&.Mui-selected, &.Mui-selected:hover': {
      color: 'white',
      backgroundColor: selectedcolor,
    },
  }))

  const getDashboardDetails = async () => {
    try {
      const payload = {
        startDate: startDate ? dayjs(startDate).format('YYYY-MM-DD') : null,
        endDate: endDate ? dayjs(endDate).format('YYYY-MM-DD') : null,
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
    getDashboardDetails();
  }, [startDate, endDate, selectedButton, graphTwoDropdownValue]);

  useEffect(() => {
    if (startDate && endDate && selectedButton) {
      handleGraphFirst(startDate, endDate, selectedButton, "first")
    }
    if (graphTwoDropdownValue && graphTwoEndDate && graphTwoStartData) {
      handleGraphFirst(graphTwoStartData, graphTwoEndDate, graphTwoDropdownValue, "second")
    }
  }, [startDate, endDate, selectedButton, graphTwoStartData, graphTwoEndDate, graphTwoDropdownValue])

  const handleGraphFirst = async (start, end, dropValue, type) => {
    try {
      const payload = {
        startDate: start ? dayjs(start).format('YYYY-MM-DD') : null,
        endDate: end ? dayjs(end).format('YYYY-MM-DD') : null,
        type: dropValue
      };
      const path = pathObj.getEarningManagerGraph;
      const result = await apiGet(path, payload)
      const newCategories = result.data.results.xAxis
      let newData = result.data.results.yAxis
      if (type === "first") {
        setChartData(prevData => ({
          ...prevData,
          options: {
            ...prevData.options,
            xaxis: {
              ...prevData.options.xaxis,
              categories: newCategories,
            },
          },
          series: [
            {

              ...prevData.series[0],
              data: newData,
            },
          ],
        }));
      } else {

        setChartDataTwo(prevData => ({
          ...prevData,
          options: {
            ...prevData.options,
            xaxis: {
              ...prevData.options.xaxis,
              categories: newCategories,
            },
          },
          series: [
            {

              ...prevData.series[0],
              data: newData,
            },
          ],
        }));
      }
    } catch (error) {
      console.error('error:', error);
    }
  }


  return (
    <>
      <div className='py-4 px-4 md:px-8 dark:bg-slate-900'>
        <div className='sale_report grid pt-10 3xl:grid-cols-6 gap-y-10 gap-4 gap-x-10 2xl:grid-cols-5 xl:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 mb-7 '>
          <div className='text-center relative  sm:text-left px-3 md:px-4 xl:px-6 lg:px-5 rounded-lg py-4 md:py-8 border'>
            <h3 className='text-center mb-0 text-slate-900 font-bold md:text-3xl sm:text-lg dark:text-white'>
              <OCountUp value={dashboardDetails?.totalUsersCount} />
              <span className='text-base text-neutral-400 font-normal block pt-3 '>{t('VIEW_NO_OF_USERS')}</span>
            </h3>
            <span className='text-4xl ml-auto sm:mr-0  mt-2 sm:mt-0 absolute right-[-10px] top-[-10px] p-3 border z-10 bg-white'>
              <FaUserTie />
            </span>
          </div>

          <div className='text-center relative  sm:text-left px-3 md:px-4 xl:px-6 lg:px-5 rounded-lg py-4 md:py-8 border'>
            <h3 className='text-center mb-0 text-slate-900 font-bold md:text-3xl sm:text-lg dark:text-white'>
              <OCountUp value={dashboardDetails?.totalActiveUsersCount} />

              <span className='text-base text-neutral-400 font-normal block pt-3 '>{t('NO_OF_ACTIVE_USERS')}</span>
            </h3>
            <span className='text-4xl ml-auto sm:mr-0  mt-2 sm:mt-0 absolute right-[-10px] top-[-10px] p-3 border z-10 bg-white'>
              <FaUserTie />
            </span>
          </div>
          <div className='text-center relative  sm:text-left px-3 md:px-4 xl:px-6 lg:px-5 rounded-lg py-4 md:py-8 border'>
            <h3 className='text-center mb-0 text-slate-900 font-bold md:text-3xl sm:text-lg dark:text-white'>
              {helpers.formattedAmount(dashboardDetails?.AmountAddedByScratchCard)}
              <span className='text-base text-neutral-400 font-normal block pt-3 '>{t('Amount added by scratchcard')}</span>
            </h3>
            <span className='text-4xl ml-auto sm:mr-0  mt-2 sm:mt-0 absolute right-[-10px] top-[-10px] p-3 border z-10 bg-white'>
              <img src={earning} className='h-8 w-8 bg-black' alt='earningImg' />
            </span>
          </div>
          <div className='text-center relative  sm:text-left px-3 md:px-4 xl:px-6 lg:px-5 rounded-lg py-4 md:py-8 border'>
            <h3 className='text-center mb-0 text-slate-900 font-bold md:text-3xl sm:text-lg dark:text-white'>
              {helpers.formattedAmount(dashboardDetails?.totalPaymentByThaiLocal)}
              <span className='text-base text-neutral-400 font-normal block pt-3 '>{t('Total payment by thai local')}</span>
            </h3>
            <span className='text-4xl ml-auto sm:mr-0  mt-2 sm:mt-0 absolute right-[-10px] top-[-10px] p-3 border z-10 bg-white'>
              <img src={earning} className='h-8 w-8 bg-black' alt='earningImg' />
            </span>
          </div>

          <div className='text-center relative  sm:text-left px-3 md:px-4 xl:px-6 lg:px-5 rounded-lg py-4 md:py-8 border'>
            <h3 className='text-center mb-0 text-slate-900 font-bold md:text-3xl sm:text-lg dark:text-white'>
              {helpers.formattedAmount(dashboardDetails?.totalAmountAddedToTourist)}
              <span className='text-base text-neutral-400 font-normal block pt-3 '>{t('Amount added by admin in tourist wallet')}</span>
            </h3>
            <span className='text-4xl ml-auto sm:mr-0  mt-2 sm:mt-0 absolute right-[-10px] top-[-10px] p-3 border z-10 bg-white'>
              <img src={earning} className='h-8 w-8 bg-black' alt='earningImg' />
            </span>
          </div>
          <div className='text-center relative  sm:text-left px-3 md:px-4 xl:px-6 lg:px-5 rounded-lg py-4 md:py-8 border'>
            <h3 className='text-center mb-0 text-slate-900 font-bold md:text-3xl sm:text-lg dark:text-white'>
              {helpers.formattedAmount(dashboardDetails?.totalAmountAddedToLocal)}
              <span className='text-base text-neutral-400 font-normal block pt-3 '>{t('Amount added by admin in thai local wallet')}</span>
            </h3>
            <span className='text-4xl ml-auto sm:mr-0  mt-2 sm:mt-0 absolute right-[-10px] top-[-10px] p-3 border z-10 bg-white'>
              <img src={earning} className='h-8 w-8 bg-black' alt='earningImg' />
            </span>
          </div>
          <div className='text-center relative  sm:text-left px-3 md:px-4 xl:px-6 lg:px-5 rounded-lg py-4 md:py-8 border'>
            <h3 className='text-center mb-0 text-slate-900 font-bold md:text-3xl sm:text-lg dark:text-white'>
              {helpers.formattedAmount(dashboardDetails?.totalRewardGainedByUser)}
              <span className='text-base text-neutral-400 font-normal block pt-3 '>{t('Total reward gain by user')}</span>
            </h3>
            <span className='text-4xl ml-auto sm:mr-0  mt-2 sm:mt-0 absolute right-[-10px] top-[-10px] p-3 border z-10 bg-white'>
              <img src={earning} className='h-8 w-8 bg-black' alt='earningImg' />
            </span>
          </div>

          <div className='text-center relative  sm:text-left px-3 md:px-4 xl:px-6 lg:px-5 rounded-lg py-4 md:py-8 border'>
            <h3 className='text-center mb-0 text-slate-900 font-bold md:text-3xl sm:text-lg dark:text-white'>
              <OCountUp value={dashboardDetails?.usersBetween10And300 || 0} />
              <span className='text-base text-neutral-400 font-normal block pt-3 '>{t('USERS_BETWEEN_10_BAHT_TO_300_BAHT')}</span>
            </h3>
            <span className='text-4xl ml-auto sm:mr-0  mt-2 sm:mt-0 absolute right-[-10px] top-[-10px] p-3 border z-10 bg-white'>
              <FaUserTie className='h-8 w-8' />
            </span>
          </div>
          <div className='text-center relative  sm:text-left px-3 md:px-4 xl:px-6 lg:px-5 rounded-lg py-4 md:py-8 border'>
            <h3 className='text-center mb-0 text-slate-900 font-bold md:text-3xl sm:text-lg dark:text-white'>
              <OCountUp value={dashboardDetails?.usersBetween200And1000 || 0} />
              <span className='text-base text-neutral-400 font-normal block pt-3 '>{t('USERS_BETWEEN_200_BAHT_TO_1000_BAHT')}</span>
            </h3>
            <span className='text-4xl ml-auto sm:mr-0  mt-2 sm:mt-0 absolute right-[-10px] top-[-10px] p-3 border z-10 bg-white'>
              <FaUserTie className='h-8 w-8' />
            </span>
          </div>
        </div>
      </div>
      <div className='grid grid-cols-2'>
        <div className='py-2 px-2 md:px-2 border-solid border-2 border-gray m-5 rounded-md'>
          <div className='flex justify-between items-center mb-4'>
            <b>First chart</b>
            <div>
              <select className='block p-2 w-full text-sm text-[#A5A5A5] bg-transparent border-2 rounded-lg border-[#DFDFDF]' value={selectedButton} onChange={(e) => handleButtonChange(e, "first")}>
                <option value="">Select</option>
                <option value="daily">Daily</option>
                <option value="week">Weekly</option>
                <option value="month">Monthly</option>
                <option value="year">Yearly</option>
              </select>
            </div>
            <div className='flex'>
              <ODateRangePicker handleDateChange={(start, end) => handleDateChange(start, end, "first")} isReset={isReset} setIsReset={setIsReset} place='dashboard' />
            </div>
          </div>

          <Chart options={chartData.options} series={chartData.series} type='bar' height='600' />
        </div>
        <div className='py-2 px-2 md:px-2 border-solid border-2 border-gray m-5 rounded-md'>
          <div className='flex justify-between items-center mb-4'>
            <div>
              <b>Second chart</b>
              <select className='block p-2 w-full text-sm text-[#A5A5A5] bg-transparent border-2 rounded-lg border-[#DFDFDF]' value={graphTwoDropdownValue} onChange={(e) => handleButtonChange(e, "second")}>
                <option value="">Select</option>
                <option value="daily">Daily</option>
                <option value="week">Weekly</option>
                <option value="month">Monthly</option>
                <option value="year">Yearly</option>
              </select>
            </div>
            <div className='flex'>
              <ODateRangePicker handleDateChange={(start, end) => handleDateChange(start, end, "second")} isReset={isReset} setIsReset={setIsReset} place='dashboard' />
            </div>
          </div>

          <Chart options={chartDataTwo.options} series={chartDataTwo.series} type='bar' height='600' />
        </div>
      </div>
    </>
  )
}

export default Home
