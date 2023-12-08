import React from "react";
import dayjs from "dayjs";
import { startCase } from "lodash";
import { useTranslation } from "react-i18next";
const UserViewDetail = ({ onHide, item }) => {
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
                                        {t("VIEW_USER_PROFILE")}
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
                                    <div className="grid grid-cols-3 items-center">
                                        <ul>
                                            <li className="mb-4">
                                                <strong className="mr-2">{t("O_USER_ID")}:</strong>
                                                {item?.userId || "N/A"}
                                            </li>
                                            <li className="mb-4">
                                                <strong className="mr-2">{t("NICKNAME")}:</strong>
                                                {startCase(item?.nickName) || "N/A"}
                                            </li>
                                            <li className="mb-4">
                                                <strong className="mr-2">{t("O_MOBILE")}:</strong>
                                                {item?.mobile ?? "N/A"}
                                            </li>
                                            <li className="mb-4">
                                                <strong className="mr-2">
                                                    {t("CREATED_DATE")}:
                                                </strong>
                                                {dayjs(item?.createdAt).format(
                                                    "DD-MM-YYYY hh:mm A"
                                                )}
                                            </li>
                                        </ul>
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
}

export default UserViewDetail;