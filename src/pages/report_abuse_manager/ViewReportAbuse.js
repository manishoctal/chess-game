import React from "react";
import { useTranslation } from "react-i18next";
import { startCase } from "lodash";
import dayjs from "dayjs";
const ViewReportAbuse = ({ onHide, viewData, reportTypes, page }) => {
  const { t } = useTranslation();
  return (
    <div>
      <>
        <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
          <div className="relative my-6  w-full max-w-[700px] mx-auto">
            <div className="sm:py-4 sm:px-2 py-8 px-7 ">
              <div className="overflow-hidden border border-white dark:border-[#ffffff38] rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                <div className=" flex items-center justify-between p-5 border-b dark:border-[#ffffff38] border-solid border-slate-200 rounded-t dark:bg-slate-900">
                  <h3 className="text-xl font-semibold pl-3 dark:text-white">
                    {reportTypes === "profile" && (
                      t("VIEW_PROFILE")
                    )}
                    {reportTypes === "video" && (
                      t("VIEW_VIDEO")
                    )}
                    {reportTypes === "image" && (
                      t("VIEW_POST")
                    )}
                  </h3>
                  <button
                    className=" ml-auto flex items-center justify-center  text-black border-2 rounded-full  h-8 w-8 float-right text-3xl leading-none font-extralight outline-none focus:outline-none"
                    onClick={() => onHide()}
                  >
                    <span className=" text-[#B8BBBF]  text-4xl " title="Close">
                      ×
                    </span>
                  </button>
                </div>

                <div className="p-4 dark:bg-slate-800 dark:text-white">
                  <div className="grid items-center">
                    <table className="w-full text-xs text-left text-[#A5A5A5] dark:text-gray-400 ">
                      <thead className="text-xs text-gray-900 border border-[#E1E6EE] bg-[#E1E6EE] dark:bg-gray-700 dark:text-gray-400 dark:border-[#ffffff38]">
                        <tr>
                          <th scope="col" className="py-3 px-6">
                            {t("S.NO")}
                          </th>
                          <th scope="col" className="py-3 px-6">
                            {t("USER_FULL_NAME")}
                          </th>
                          <th scope="col" className="py-3 px-6">
                            {t("O_USER_ID")}
                          </th>
                          <th scope="col" className="py-3 px-6 cursor-pointer">
                            <div className="flex justify-start">
                              <span>{t("CREATED_DATE")}</span>
                            </div>
                          </th>
                          <th scope="col" className="py-3 px-6">
                            {t("REASON_OF_REPORT")}
                          </th>
                          <th scope="col" className="py-3 px-6">
                            {t("NICKNAME")}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {viewData?.reported?.length > 0 &&
                          viewData?.reported?.map((item, i) => (
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
                                {startCase(item?.reportedUser?.fullName) || "N/A"}
                              </td>
                              <td className="py-2 px-4 border-r dark:border-[#ffffff38]">
                                {item?.reportedUser?.userId || "N/A"}
                              </td>
                              <td className="py-2 px-4 border-r dark:border-[#ffffff38]">
                                {dayjs(item?.createdAt).format("DD-MM-YYYY hh:mm A")}
                              </td>
                              <td className="py-2 px-4 border-r dark:border-[#ffffff38]">
                                {item?.reason?.name || "N/A"}
                              </td>
                              <td className="py-2 px-4 border-r dark:border-[#ffffff38]">
                                {item?.reportedUser?.nickName || "N/A"}
                              </td>
                            </tr>
                          ))}
                        {(viewData?.reported?.length <= 0) ? (
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
              </div>
            </div>
          </div>
        </div>
        <div
          className="opacity-25 fixed inset-0 z-40 bg-black"
          onClick={() => onHide()}
        />
      </>
    </div>
  );
};

export default ViewReportAbuse;
