import React from "react";

const DynamicLabel = (props) => {
  return (
    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
      {props?.name}
      {props?.type == true && <span className="text-red-500">*</span>}
    </label>
  );
};

export default DynamicLabel;
