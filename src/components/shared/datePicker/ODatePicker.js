import React, { useState } from "react";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_blue.css";
function ODatePicker({ handleDateChange, value,minDate,maxDate ,placeholder,inputClass}) {
  const [dates, setDate] = useState(value || "");

  const onChange = ([date]) => {
    setDate(date);
    handleDateChange(date);
  };
  return (
    <Flatpickr
      //   className="flex flex-row-reverse border border-[#E9EDF9] text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full  p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      className={`block py-3 px-3 w-full text-sm text-gray-900 bg-transparent border-2 rounded-lg border-[#DFDFDF] appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none max-w-lg focus:ring-0  peer ${inputClass||''}`}
      name="date"
      placeholder={placeholder}
      options={{
        // minDate: "today",
        minDate,
        dateFormat: "d-m-Y",
        maxDate,
        defaultDate: dates,
      }}
      onChange={onChange}
    />
  );
}

export default ODatePicker;
