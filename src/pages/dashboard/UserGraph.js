import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { apiGet } from "utils/apiFetch";
import pathObj from "utils/apiPath";
import { BiReset } from "react-icons/bi";

const UserGraph = () => {
  const [categories, setCategories] = useState(["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"]);
  const [graphData, setGraphData] = useState([
    {
      name: "users",
      data: [10, 0, 100, 0, 49, 0, 69, 91, 148],
    },
  ]);
  const [graphYear, setGraphYear] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");

  function generateYearArray(date) {
    const startDate = new Date(date);
    const startYear = startDate.getFullYear();
    const currentYear = new Date().getFullYear();

    return Array.from({ length: currentYear - startYear + 1 }, (_, index) => startYear + index);
  }

  const getGraphUserDetails = async (year = 0, month = 0) => {
    try {
      const payload = { year, month };
      const path = pathObj.getGraphUserDetails;
      const result = await apiGet(path, payload);
      const success = result.data?.success;
      if (success) {
        const response = result.data?.results;
        const data = result.data?.results?.userRegistrations;
        const count = data?.map((item) => item?.count);
        const labels = data?.map((item) => item?.label);
        setCategories(labels);
        setGraphData([{ name: "users", data: count }]);
        setGraphYear(generateYearArray(response?.year));
      }
    } catch (error) {
      console.log("Error in getGraphUserDetails:", error.message);
    }
  };

  useEffect(() => {
    getGraphUserDetails();
  }, []);


  const handleYearSelect = (e) => {
    const year = e.target.value;
    setSelectedYear(year);
    if (year) {
      const month = selectedMonth ? selectedMonth : 0;
      getGraphUserDetails(year, month);
    }
  };

  const handleMonthSelect = (e) => {
    const month = e.target.value;
    setSelectedMonth(month);
    if (selectedYear) {
      getGraphUserDetails(selectedYear, month);
    }
  };

  const resetFilters = () => {
    setSelectedYear("");
    setSelectedMonth("");
    getGraphUserDetails();
  };

  const options = {
    chart: {
      height: 350,
      width: 200,
      type: "line",
      zoom: {
        enabled: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "straight",
    },
    title: {
      text: "User Registration Graph",
      align: "center",
    },
    grid: {
      row: {
        colors: ["#f3f3f3", "transparent"],
        opacity: 0.5,
      },
    },
    xaxis: {
      categories: categories,
    },
  };

  return (
    <div id="chart">
      <div className="flex mb-5">
        <div className="flex items-center mb-3 ml-4">
          <select
            name="year"
            className="flex flex-row-reverse border outline-none border-[#E9EDF9] text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            value={selectedYear}
            onChange={handleYearSelect}
          >
            <option value="">Select Year</option>
            {graphYear?.map((year) => {
              return (
                <option value={year} key={year}>
                  {`${year}`}
                </option>
              );
            })}
          </select>
        </div>
        <div className="flex items-center mb-3 ml-4">
          <select
            name="month"
            className="flex flex-row-reverse border outline-none border-[#E9EDF9] text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            value={selectedMonth}
            onChange={handleMonthSelect}
          >
            <option value="0">Select Month</option>
            <option value="1">Jan</option>
            <option value="2">Feb</option>
            <option value="3">Mar</option>
            <option value="4">Apr</option>
            <option value="5">May</option>
            <option value="6">Jun</option>
            <option value="7">Jul</option>
            <option value="8">Aug</option>
            <option value="9">Sep</option>
            <option value="10">Oct</option>
            <option value="11">Nov</option>
            <option value="12">Dec</option>
          </select>
        </div>
        <div className="flex items-center ml-2 sm:mb-0">
          <button type="button" onClick={resetFilters} className="bg-gradientTo text-sm px-6 flex gap-2 ml-3 mb-3 py-2 rounded-lg items-center border border-transparent text-white hover:bg-DarkBlue sm:w-auto w-1/2">
            <BiReset size={18} /> Reset
          </button>
        </div>
      </div>
      <Chart options={options} series={graphData} type="line" height={350} width={750} />
    </div>
  );
};

export default UserGraph;
