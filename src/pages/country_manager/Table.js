import React, { useContext } from "react";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import AuthContext from "context/AuthContext";
import { isEmpty } from "lodash";
import helper from "../../utils/helpers";
import { Link } from "react-router-dom";
import { AiFillEdit } from "react-icons/ai";
import { BsArrowUpShort } from "react-icons/bs";
import OImage from "components/reusable/OImage";
import { apiPut } from "utils/apiFetch";
import apiPath from "../../utils/apiPath";
import useToastContext from "hooks/useToastContext";

const Table = ({
  allCountry,
  page,
  manager,
  handleEdit,
  countryListing,
  setSort,
  sort,
}) => {
  const { t } = useTranslation();
  const { user } = useContext(AuthContext);

  const notification = useToastContext();
  const handelStatusChange = async (item) => {
    try {
      const payload = {
        status: item?.status === "inactive" ? "active" : "inactive",
      };
      const path = `${apiPath.changeCountryStatus}/${item?._id}`;
      const result = await apiPut(path, payload);
      if (result?.status === 200) {
        notification.success(result?.data?.message);
        countryListing();
      }
    } catch (error) {
      console.log("error in get all faqs list==>>>>", error.message);
    }
  };

  return (
    <div className="p-3">
      <div className="overflow-x-auto relative rounded-lg border">
        <table className="w-full text-xs text-left text-[#A5A5A5] dark:text-gray-400 ">
          <thead className="text-xs text-gray-900 border border-[#E1E6EE] bg-[#E1E6EE] dark:bg-gray-700 dark:text-gray-400 dark:border-[#ffffff38]">
            <tr>
              <th scope="col" className="py-3 px-6">
                {t("S.NO")}
              </th>
              <th scope="col" className="py-3 px-6">
                {t("COUNTRY_CODE")}
              </th>
              <th scope="col" className="py-3 px-6">
                {t("O_COUNTRY")}
              </th>
              <th
                scope="col"
                className="py-3 px-6 cursor-pointer text-right"
                onClick={() => {
                  if (sort.sortBy === "createdAt" && sort.sortType === "asc") {
                    setSort({
                      sortBy: "createdAt",
                      sortType: "desc",
                    });
                  } else {
                    setSort({
                      sortBy: "createdAt",
                      sortType: "asc",
                    });
                  }
                }}
              >
                <div className="flex justify-start">
                  <span>{t("O_CREATED_AT")} </span>
                  <span>
                    {sort.sortBy === "createdAt" && sort.sortType === "asc" && (
                      <BsArrowUpShort className="w-4 h-4" />
                    )}
                    {sort.sortBy === "createdAt" &&
                      sort.sortType === "desc" && (
                        <BsArrowUpShort className="w-4 h-4 rotate-180" />
                      )}
                  </span>
                </div>
              </th>
              <th scope="col" className="py-3 px-6">
                {t("O_STATUS")}
              </th>
              {(manager?.add || user?.role === "admin") && (
                <th scope="col" className="py-3 px-6 text-center">
                  {t("O_ACTION")}
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {allCountry?.map((item, i) => (
              <tr
                key={i}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
              >
                <th
                  scope="row"
                  className="py-2 px-4 border-r dark:border-[#ffffff38] font-medium text-gray-900  dark:text-white"
                >
                  {i + 1 + 10 * (page - 1)}
                </th>
                <td className="py-2 px-4 border-r dark:border-[#ffffff38]">
                  {item?.countryCode || "N/A"}
                </td>
                <td className="py-2 px-4 border-r dark:border-[#ffffff38]">
                  {item?.name || "N/A"}
                </td>

                <td className="py-2 px-4 border-r dark:border-[#ffffff38]">
                  {dayjs(item?.createdAt).format("DD-MM-YYYY hh:mm A") || "N/A"}
                </td>
                <td className="py-2 px-4 border-r dark:border-[#ffffff38]">
                  {((manager?.add || user?.role === "admin") && (
                    <label
                      className="inline-flex relative items-center cursor-pointer"
                      title={`${
                        item?.status === "active" ? "Active" : "Inactive"
                      }`}
                    >
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={item?.status === "active"}
                        onChange={(e) =>
                          helper.alertFunction(
                            `Are you sure you want to ${
                              e.target.checked ? "active" : "inactive"
                            } '${item?.name}'?`,
                            item,
                            handelStatusChange
                          )
                        }
                      />
                      <div className="w-10 h-5 bg-gray-200 rounded-full peer peer-focus:ring-0 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-gradientTo" />
                    </label>
                  )) ||
                    "N/A"}
                </td>
                {(manager?.add || user?.role === "admin") && (
                  <td className="py-2 px-4 border-l">
                    <div className="">
                      <ul className="flex justify-center">
                        <li
                          className="px-2 py-2  hover:text-gradientTo"
                          onClick={() => handleEdit(item)}
                        >
                          <button title={t("O_EDIT")}>
                            {" "}
                            <AiFillEdit className="cursor-pointer w-5 h-5 text-slate-600 hover:dark:text-white" />
                          </button>
                        </li>
                      </ul>
                    </div>
                  </td>
                )}
              </tr>
            ))}
            {isEmpty(allCountry) ? (
              <tr className="bg-white border-b w-full text-center dark:bg-gray-800 dark:border-gray-700">
                <td className="py-4 px-6" colSpan={12}>
                  {t("O_NO_RECORD_FOUND")}
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
