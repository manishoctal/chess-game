import React, { useContext } from "react";
import { AiFillEye } from "react-icons/ai";
import { useTranslation } from "react-i18next";
import AuthContext from "context/AuthContext";
import { isEmpty } from "lodash";
import dayjs from "dayjs";

const Table = ({ coinPurchaseListing,handleView, page, manager }) => {
    const { t } = useTranslation();
    const { user } = useContext(AuthContext);
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
                                {t("USER_ID")}
                            </th>
                            <th scope="col" className="py-3 px-6">
                                {t("USER_NICKNAME")}
                            </th>
                            <th scope="col" className="py-3 px-6">
                                {t("PACK_NAME")}
                            </th>
                            <th scope="col" className="py-3 px-6 text-center">
                                {t("TAKEN_DATE")}
                            </th>
                            <th scope="col" className="py-3 px-6 text-center">
                                {t("PRICE")}
                            </th>
                            <th scope="col" className="py-3 px-6 text-center">
                                {t("O_ACTION")}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {coinPurchaseListing?.map((item, i) => (
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
                                    {item?.users?.userId || "N/A"}
                                </td>
                                <td className="py-2 px-4 border-r dark:border-[#ffffff38]">
                                    {item?.users?.nickName || "N/A"}
                                </td>
                                <td className="py-2 px-4 border-r dark:border-[#ffffff38]">
                                    {item?.package?.name || "N/A"}
                                </td>
                                <td className="py-2 px-4 border-r dark:border-[#ffffff38]">
                                    {dayjs(item?.createdAt).format("DD-MM-YYYY hh:mm A")}
                                </td>
                                <td className="py-2 px-4 border-r dark:border-[#ffffff38]">
                                    {item?.package?.price || "N/A"}
                                </td>
                                {(manager?.view || user?.role === "admin") && (
                                <td
                                    onClick={() => handleView(item)}
                                    className="px-2 py-2 justify-center flex hover:text-gradientTo"
                                >
                                    <p title="View">
                                    {" "}
                                    <AiFillEye className="cursor-pointer w-5 h-5 text-slate-600 hover:dark:text-white" />{" "}
                                    </p>
                                </td>
                                )}
                            </tr>
                        ))}
                        {isEmpty(coinPurchaseListing) ? (
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