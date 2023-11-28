import React from "react";
import dayjs from "dayjs";
import { AiFillEye, AiOutlineCopy } from "react-icons/ai";
import { useTranslation } from "react-i18next";
import { isEmpty, startCase } from "lodash";

import { Link, useNavigate } from "react-router-dom";

import apiPath from "../../utils/apiPath";
import { apiPut } from "utils/apiFetch";
import useToastContext from "hooks/useToastContext";
import helper from "../../utils/helpers";
import OImage from "components/reusable/OImage";
import defaultImage from "../../assets/images/No-image-found.jpg";
import { BsArrowUpShort } from "react-icons/bs";


const Table = ({
    page,
    pageSize,
    handleToggle,
    postData,
    videoListing,
    handleCopy,
    setSort,
    sort,
}) => {
    const { t } = useTranslation();
    const notification = useToastContext();

    const handelStatusChange = async (item) => {
        try {
            const payload = {
                status: item?.status === "inactive" ? "active" : "inactive",
            };
            const path = `${apiPath.changeVideoStatus}/${item?._id}`;
            const result = await apiPut(path, payload);
            if (result?.status === 200) {
                notification.success(result.data.message);
                videoListing({ statusChange: 1 });
            }
            // }
        } catch (error) {
            console.log("error in get all users list==>>>>", error.message);
        }
    };

    console.log("postData", postData);

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
                                {t("O_USER_ID")}
                            </th>
                            <th scope="col" className="py-3 px-6">
                                {t("NICKNAME")}
                            </th>
                            <th scope="col" className="py-3 px-6">
                                {t("O_MOBILE")}
                            </th>
                            <th scope="col" className="py-3 px-6">
                                {t("VIDEO_URL")}
                            </th>
                            <th scope="col" className="py-3 px-6">
                                {t("NO_OF_LIKES")}
                            </th>
                            <th scope="col" className="py-3 px-6">
                                {t("NO_OF_COMMENTS")}
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
                                <div className="flex justify-start">
                                    <span>{t("CREATED_DATE")}</span>
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
                                {t("O_STATUS")}
                            </th>
                            <th scope="col" className="py-3 px-6">
                                {t("O_ACTION")}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {postData.length > 0 &&
                            postData?.map((item, i) => (
                                <tr
                                    key={item?._id}
                                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                                >
                                    <th
                                        scope="row"
                                        className="py-2 px-4 border-r dark:border-[#ffffff38] font-medium text-gray-900  dark:text-white"
                                    >
                                        {i + 1 + pageSize * (page - 1)}
                                    </th>
                                    <td className="py-2 px-4 border-r dark:border-[#ffffff38]">
                                        {item?.user?.userId || "N/A"}
                                    </td>
                                    <td className="py-2 px-4 border-r dark:border-[#ffffff38]">
                                        {startCase(item?.user?.nickName) || "N/A"}
                                    </td>
                                    <td className="py-2 px-4 border-r dark:border-[#ffffff38]">
                                        +{item?.user?.countryCode || 234}{item?.user?.mobile || "N/A"}
                                    </td>
                                    <td className="py-2 px-4 border-r dark:border-[#ffffff38]">
                                        {item?.link ? <Link to={item?.link} target="_blank">{t("VIEW_VIDEO")}</Link>  : "N/A"}
                                        {item?.link ? <AiOutlineCopy className="cursor-pointer text-slate-600 dark:hover:text-white" onClick={()=> handleCopy(item)}/> : ""} 
                                    </td>
                                    <td className="py-2 px-4 border-r dark:border-[#ffffff38]">
                                        {item?.likes || 0}
                                    </td>
                                    <td className="py-2 px-4 border-r dark:border-[#ffffff38]">
                                        {item?.comments || 0}
                                    </td>
                                    <td className="py-2 px-4 border-r dark:border-[#ffffff38]">
                                        {" "}
                                        {dayjs(item?.createdAt).format("DD-MM-YYYY hh:mm A")}
                                    </td>

                                    <td className="py-4 px-6">
                                        <label
                                            className="inline-flex relative items-center cursor-pointer"
                                            title={`${item?.status === "active" ? "Active" : "Inactive"
                                                }`}
                                        >
                                            <input
                                                type="checkbox"
                                                className="sr-only peer"
                                                checked={item?.status === "active"}
                                                onChange={(e) =>
                                                    helper.alertFunction(
                                                        `Are you sure you want to ${e.target.checked ? "active" : "inactive"
                                                        } ${item?.user?.nickName ? item?.user?.nickName : ""
                                                        }?`,
                                                        item,
                                                        handelStatusChange
                                                    )
                                                }
                                            />
                                            <div className="w-10 h-5 bg-gray-200 rounded-full peer peer-focus:ring-0 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-gradientTo" />
                                        </label>
                                    </td>

                                    <td className="py-2 px-4 border-l">
                                        <div className="">
                                            <ul className="flex">
                                                <li
                                                    onClick={() => handleToggle(item)}
                                                    className="px-2 py-2 hover:text-gradientTo"
                                                >
                                                    <a title={t("O_VIEW")} className="">
                                                        {" "}
                                                        <AiFillEye className="cursor-pointer w-5 h-5 text-slate-600 dark:hover:text-white" />
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        {isEmpty(postData) ? (
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
