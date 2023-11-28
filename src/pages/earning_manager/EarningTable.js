import React, { useContext } from "react";
import { apiPut } from "../../utils/apiFetch";
import apiPath from "../../utils/apiPath";
import dayjs from "dayjs";
import useToastContext from "hooks/useToastContext";
import { AiFillEdit, AiFillEye } from "react-icons/ai";
import { useTranslation } from "react-i18next";
import AuthContext from "context/AuthContext";
import { isEmpty, startCase } from "lodash";
import helper from "../../utils/helpers";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

const EarningTable = ({
  subscription,
  handleUserView,
  allCategory,
  page,
  manager,
  categoryToggle,
}) => {
  const { t } = useTranslation();
  const { user } = useContext(AuthContext);
  const notification = useToastContext();

  const handelStatusChange = async (item) => {
    try {
      const payload = {
        status: item?.status === "inactive" ? "active" : "inactive",
      };
      const path = `${apiPath.changeCategoryStatus}/${item?._id}`;
      const result = await apiPut(path, payload);
      if (result?.status === 200) {
        notification.success(result?.data.message);
        allCategory();
      }
    } catch (error) {
      console.log("error in get all sub admin list==>>>>", error.message);
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
                {t("NICKNAME")}
              </th>
              <th scope="col" className="py-3 px-6">
                {t("O_USER_ID")}
              </th>
              <th scope="col" className="py-3 px-6">
                {t("O_PACK_NAME")}
              </th>
              <th scope="col" className="py-3 px-6">
                {t("O_TRANSACTION_ID")}
              </th>
              <th scope="col" className="py-3 px-6">
                {t("TOTAL_PRICE")}
              </th>
              <th scope="col" className="py-3 px-6">
                {t("TAKEN_DATE")}
              </th>
              {/* {(manager?.add || manager?.edit || user?.role === "admin") && (
                <th scope="col" className="py-3 px-6 text-center">
                  {t("O_STATUS")}
                </th>
              )}
              <th scope="col" className="py-3 px-6 text-center">
                {t("O_ACTION")}
              </th> */}
            </tr>
          </thead>
          <tbody>
            {subscription &&
              subscription?.map((item, i) => (
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
                    {startCase(item?.user?.nickName) ?? "N/A"}
                  </td>
                  <td className="py-2 px-4 border-r dark:border-[#ffffff38]">
                  <td className="py-2 px-4 border-r dark:border-[#ffffff38]">
                     {item?.userId ?? "N/A"}
                  </td>
                  </td>
                  <td className="py-2 px-4 border-r dark:border-[#ffffff38]">
                    {item?.coinPack?.name ?? "N/A"}
                  </td>
                  <td className="py-2 px-4 border-r dark:border-[#ffffff38]">
                    {item?.transactionId ?? ""}
                  </td>
                  <td className="py-2 px-4 border-r dark:border-[#ffffff38]">
                    {item?.amount ?? "N/A"}
                  </td>
                  <td className="py-2 px-4 border-r dark:border-[#ffffff38]">
                    {dayjs(item?.updatedAt).format("DD-MM-YYYY hh:mm A")}
                  </td>

                  {/* {(manager?.add || user?.role === "admin") && (
                    <td className="py-2 px-4 border-r dark:border-[#ffffff38] text-center">
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
                              `Are you sure want to ${
                                e.target.checked ? "active" : "inactive"
                              } '${item.name}'?`,
                              item,
                              handelStatusChange
                            )
                          }
                        />
                        <div className="w-10 h-5 bg-gray-200 rounded-full peer peer-focus:ring-0 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-gradientTo" />
                      </label>
                    </td>
                  )} */}

                  {/* <td className="py-2 px-4 border-l">
                    <div className="">
                      <ul className="flex justify-center align-items-center">
                        {(manager?.add || user?.role === "admin") && (
                          <>
                            <li className="flex items-center px-2 py-2 hover:bg-white hover:text-gradientTo">
                              <NavLink
                                onClick={() => handleUserView(item)}
                                to="/gift-manager/view"
                                state={item}
                                title={t("O_VIEW")}
                                className="px-2 py-2"
                              >
                                <AiFillEye className="cursor-pointer w-5 h-5 text-slate-600 dark:hover:text-white hover:text-blue-700" />{" "}
                              </NavLink>
                            </li>

                            <li className="flex items-center px-2 py-2 hover:bg-white hover:text-gradientTo">
                              <NavLink
                                title={t("O_EDIT")}
                                to="/gift-manager/edit"
                                state={item}
                              >
                                {" "}
                                <AiFillEdit className="cursor-pointer w-5 h-5 text-slate-600" />
                              </NavLink>
                            </li>
                          </>
                        )}
                      </ul>
                    </div>
                  </td> */}
                </tr>
              ))}
            {isEmpty(subscription) ? (
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

export default EarningTable;
