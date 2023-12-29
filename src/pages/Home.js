import React, { useContext, useEffect, useState } from 'react'
import 'chartjs-adapter-date-fns'
import { FaUserTie } from 'react-icons/fa'
import { apiGet } from 'utils/apiFetch'
import pathObj from 'utils/apiPath'
import earning from 'assets/images/earning.jpg'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'
import Chart from 'react-apexcharts'

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
import AuthContext from 'context/AuthContext'
import ODateRangePicker from 'components/shared/datePicker/ODateRangePicker'
import OCountUp from 'components/OCountUp'
import helpers from 'utils/helpers'

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
function Home () {
  const { t } = useTranslation()
  const { logoutUser } = useContext(AuthContext)

  const [dashboardDetails, setDashboardDetails] = useState({})
  const [startDate, setStartDate] = useState()
  const [endDate, setEndDate] = useState('')
  const [chartData, setChartData] = useState({
    options: {
      chart: {
        id: 'basic-bar'
      },
      xaxis: {
        // categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999]
        categories: [
          'January',
          'Febrauray',
          'March',
          'April',
          'May',
          'June',
          'July',
          'August',
          'September',
          'October',
          'November',
          'December'
        ]
      }
    },
    series: [
      {
        name: 'series-1',
        data: [30, 40, 45, 50, 49, 60, 70, 91, 49, 60, 70, 91]
      }
    ]
  })
  const [usersGraphYears] = useState([])

  const [graphPayload, setGraphPayload] = useState({
    graphYear: '-1',
    graphMonth: '-1'
  })
  const [isReset, setIsReset] = useState(false)
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
    setStartDate(start)
    setEndDate(end)
  }

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

  const handleReset = () => {
    setEndDate('')
    setStartDate('')
    setIsReset(!isReset)
  }

  return (
    <>
      <div className='sm:flex items-center text-center sm:text-left px-3 md:px-4 xl:px-7 lg:px-5  py-4 md:py-8 border dark:bg-slate-900'>
        <ODateRangePicker
          handleDateChange={handleDateChange}
          isReset={isReset}
          setIsReset={setIsReset}
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
              <OCountUp value={dashboardDetails?.totalTagCount || 0} />
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
              <OCountUp value={dashboardDetails?.totalTagCount || 0} />
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
        
        <div className='sale_report grid grid-cols-1 gap-5 mb-7 bg-white p-4'>
        <div className='flex justify-between'>
              <h4 className='font-medium text-lg'>
                {t('EXPENDITURE_BY_TOURIST')}
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
    </>
  )
}

export default Home
