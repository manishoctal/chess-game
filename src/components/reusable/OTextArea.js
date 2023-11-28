import ErrorMessage from "components/ErrorMessage";
import React from "react";

const OTextArea = (props) => {
  const {
    wrapperClassName,
    name,
    inputLabel,
    type,
    placeholder,
    register,
    errors,
    ...rest
  } = props;

  return (
    <div className={wrapperClassName || "relative z-0 mb-6 w-full group"}>
      <textarea
        type={type}
        name={name}
        id={name}
        style={{ height: "150px" }}
        className="block h-150 py-4 px-3 w-full text-sm text-gray-900 bg-transparent border-2 rounded-lg border-[#DFDFDF] appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0  peer"
        placeholder={placeholder || " "}
        {...register}
        {...rest}
      />
      <label
        htmlFor={name}
        className="peer-focus:font-normal absolute text-sm text-[#A5A5A5] dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 left-3 bg-white  dark:bg-slate-900 p-2 z-10 origin-[2] peer-focus:left-0 peer-focus:text-[#A5A5A5] peer-focus:text-lg peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-8"
      >
        {inputLabel}
      </label>
      <ErrorMessage message={errors?.[name]?.message} />
    </div>
  );
};

export default OTextArea;
