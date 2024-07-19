import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_blue.css";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
const pickerClasses = [

  "cursor-pointer",
  "bg-calendar dark:bg-calendarDark",
  "bg-[right_10px_top_10px]",
  "bg-[length:18px_18px]",
  "bg-no-repeat",
  "flex",
  "flex-row-reverse",
  "border",
  "outline-none",
  "text-gray-900",
  "text-sm",
  "rounded-lg",
  "block",
  "w-full",
  "p-2",
  "dark:bg-gray-700",
  "dark:placeholder-gray-400",
  "dark:text-white",
  "dark:focus:ring-blue-500",
  "dark:focus:border-blue-500",
];
const ODateRangePicker = (props) => {
  const { t } = useTranslation();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const onChangeStartDate = ([date]) => {
    setStartDate(date);
    props?.handleDateChange(date, endDate);
  };
  const onChangeEndDate = ([date]) => {
    setEndDate(date);
    props.handleDateChange(startDate, date);
  };
  const handleReset = () => {
    setStartDate("");
    setEndDate("");
  };
  useEffect(() => {
    if (props?.place === "dashboard") {
      handleReset();
    } else {
      if (props?.isReset) {
        props?.setIsReset({
          ...props?.filterData,
          startDate: false,
          endDate: false,
        });
        handleReset();
      }
    }
  }, [props?.isReset]);

  useEffect(() => {
    setStartDate(props?.filterData?.startDate);
    setEndDate(props?.filterData?.endDate);
  }, []);

  return (
    // <div className='sm:flex items-center text-center sm:text-left px-3 md:px-4 xl:px-7 lg:px-5  md:py-5 py-4 md:py-8 border'>
    <>
      <div className=" relative flex items-center mb-3">
        <label className="mx-2 text-[#B8BBBF] text-xs whitespace-nowrap">
          {t("O_FROM")}
        </label>
        <Flatpickr
          className={pickerClasses.join(" ")}
          name="start_date"
          placeholder={t("O_START_DATE")}
          value={startDate}
          options={{
            maxDate: endDate,
            dateFormat: "d-m-Y",
          }}
          onChange={onChangeStartDate}
        />
      </div>
      <div className="relative flex items-center mb-3">
        <label className="mx-2 text-[#B8BBBF] text-xs whitespace-nowrap">
          {t("O_TO")}
        </label>
        <Flatpickr
          className={pickerClasses.join(" ")}
          name="end_date"
          placeholder={t("O_END_DATE")}
          value={endDate}
          options={{
            minDate: startDate,
            dateFormat: "d-m-Y",
          }}
          onChange={onChangeEndDate}
        />
      </div>
    </>
    // </div>
  );
};

export default ODateRangePicker;
