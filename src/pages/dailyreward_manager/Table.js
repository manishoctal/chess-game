import React from "react";
import { isEmpty, startCase } from "lodash";
import { SiAndroidauto } from "react-icons/si";
import { useTranslation } from "react-i18next";
import { BsReplyAll } from "react-icons/bs";
import { AiFillEye, AiFillEdit } from "react-icons/ai";
import { apiPut } from "../../utils/apiFetch";
import apiPath from "../../utils/apiPath";
import useToastContext from "hooks/useToastContext";
import dayjs from "dayjs";
import helper from "../../utils/helpers";
import OImage from "components/reusable/OImage";
import defaultImage from "../../assets/images/No-image-found.jpg";
import { BsArrowUpShort } from "react-icons/bs";
const Table = ({
  users,
  rewardListing,
  toggleModalAddEdit,
  rewardData,
  page,
  user,
  sort,
  setSort,
  handelReply,
  manager,
}) => {
  const { t } = useTranslation();
  const notification = useToastContext();

  const handelStatusChange = async (item) => {
    try {
      const payload = {
        status: item?.status === "inactive" ? "active" : "inactive",
      };
      const path = `${apiPath.changeRewardStatus}/${item?._id}`;
      const result = await apiPut(path, payload);
      if (result?.status === 200) {
        notification.success(result?.data?.message);
        rewardListing();
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
                {t("DAYS_SEQUENCE")}
              </th>

              <th
                scope="col"
                className="py-3 px-6 cursor-pointer"
                onClick={() => {
                  if (sort.sort_key === "name" && sort.sort_type === "asc") {
                    setSort({
                      sort_key: "name",
                      sort_type: "desc",
                    });
                  } else {
                    setSort({
                      sort_key: "name",
                      sort_type: "asc",
                    });
                  }
                }}
              >
                <div className="flex justify-start">
                  <span>{t("REWARD")}</span>
                  <span>
                    {sort.sort_key === "name" && sort.sort_type === "asc" && (
                      <BsArrowUpShort className="w-4 h-4" />
                    )}
                    {sort.sort_key === "name" && sort.sort_type === "desc" && (
                      <BsArrowUpShort className="w-4 h-4 rotate-180" />
                    )}
                  </span>
                </div>
              </th>

              <th scope="col" className="py-3 px-6">
                {t("NO_COINS")}
              </th>
              <th scope="col" className="py-3 px-6">
                {t("NO_GIFTS")}
              </th>
              <th scope="col" className="py-3 px-6 text-center">
                {t("UPLOADED_FAVICON")}
              </th>
              <th
                scope="col"
                className="py-3 px-6 cursor-pointer"
                onClick={() => {
                  if (
                    sort.sort_key === "createdAt" &&
                    sort.sort_type === "asc"
                  ) {
                    setSort({
                      sort_key: "createdAt",
                      sort_type: "desc",
                    });
                  } else {
                    setSort({
                      sort_key: "createdAt",
                      sort_type: "asc",
                    });
                  }
                }}
              >
                <div className="flex justify-center">
                  <span>{t("O_CREATED_AT")}</span>
                  <span>
                    {sort.sort_key === "createdAt" &&
                      sort.sort_type === "asc" && (
                        <BsArrowUpShort className="w-4 h-4" />
                      )}
                    {sort.sort_key === "createdAt" &&
                      sort.sort_type === "desc" && (
                        <BsArrowUpShort className="w-4 h-4 rotate-180" />
                      )}
                  </span>
                </div>
              </th>
              <th scope="col" className="py-3 px-6">
                {t("Status")}
              </th>

              <th scope="col" className="py-3 px-6 text-center">
                {t("O_ACTION")}
              </th>
            </tr>
          </thead>
          <tbody>
            {rewardData.length > 0 &&
              rewardData?.map((item, i) => (
                <tr
                  key={item?._id}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                >
                  <th
                    scope="row"
                    className="py-2 px-4 border-r dark:border-[#ffffff38] font-medium text-gray-900  dark:text-white"
                  >
                    {i + 1 + 10 * (page - 1)}
                  </th>
                  <td className="py-2 px-4 border-r dark:border-[#ffffff38]">
                    {item?.daySequence || "N/A"}
                  </td>
                  <td className="py-2 px-4 border-r dark:border-[#ffffff38]">
                    {startCase(item?.name) || "N/A"}
                  </td>
                  <td className="py-2 px-4 border-r dark:border-[#ffffff38] text-left">
                    {}
                    {item?.rewardType == "coin" ? item?.quantity : "N/A"}
                  </td>

                  <td className="py-2 px-4 border-r dark:border-[#ffffff38] text-left">
                    {item?.rewardType == "gift" ? item?.quantity : "N/A"}
                  </td>
                  <td className="py-2 px-4 border-r dark:border-[#ffffff38] text-center">
                    <OImage
                      src={item?.image}
                      fallbackUrl={defaultImage}
                      className="w-[40px] h-[40px] inline"
                      alt=""
                    />
                  </td>
                  <td className="py-4 px-3 border-r dark:border-[#ffffff38] dark:border-[#ffffff38] text-center">
                    {dayjs(item?.createdAt).format("DD-MM-YYYY hh:mm A") ||
                      "N/A"}{" "}
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
                  <td className="py-2 px-4 border-r dark:border-[#ffffff38] text-left flex justify-center">
                    {(manager?.add || user?.role === "admin") && (
                      <div
                        onClick={() => toggleModalAddEdit(item, "edit")}
                        className="px-2 py-2 hover:text-gradientTo"
                      >
                        <a title={t("O_EDIT")}>
                          {" "}
                          <AiFillEdit className="cursor-pointer w-5 h-5 text-slate-600 hover:dark:text-white" />
                        </a>
                      </div>
                    )}

                    {(manager?.view || user?.role === "admin") && (
                      <div
                        onClick={() => toggleModalAddEdit(item, "view")}
                        className="px-2 py-2  hover:text-gradientTo"
                      >
                        <p title="View">
                          {" "}
                          <AiFillEye className="cursor-pointer w-5 h-5 text-slate-600 hover:dark:text-white" />{" "}
                        </p>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            {isEmpty(rewardData) ? (
              <tr className="bg-white text-center border-b dark:bg-gray-800 dark:border-gray-700">
                <td
                  className="py-2 px-4 border-r dark:border-[#ffffff38]"
                  colSpan={8}
                >
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
