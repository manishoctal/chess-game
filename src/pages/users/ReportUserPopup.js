import OButton from "components/reusable/OButton";
import OInputField from "components/reusable/OInputField";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { IoClose } from "react-icons/io5";


const ReportUserPopup = ({ handleReportToggle }) => {
    const { t } = useTranslation();
    const renderTableCell = (content, classNames) => (
        <td className={classNames}>{content}</td>
    );


    const staticUsers = [
        {
            id: 1,
            userId: "U001",
            name: "John Doe",
            userName: "johndoe",
            email: "john@example.com",
            mobile: "123-456-7890",
            userType: "Admin",
            status: "Active"
        },
        {
            id: 2,
            userId: "U002",
            name: "Jane Smith",
            userName: "janesmith",
            email: "jane@example.com",
            mobile: "098-765-4321",
            userType: "User",
            status: "Inactive"
        },
        {
            id: 3,
            userId: "U003",
            name: "Robert Brown",
            userName: "robertbrown",
            email: "robert@example.com",
            mobile: "555-555-5555",
            userType: "Guest",
            status: "Active"
        }
    ];



    const renderTableRows = () => {
        return staticUsers?.map((item, i) => {
            return (
                <tr key={i} >
                    {renderTableCell(i + 1, "py-4 px-3 border-r border font-medium text-gray-900 dark:text-white dark:border-[#ffffff38]")}
                    {renderTableCell(item.userId, "bg-white py-4 px-4 border-r border dark:border-[#ffffff38]")}
                    {renderTableCell(item.name, "bg-white py-4 px-4 border-r border dark:border-[#ffffff38]")}
                    {renderTableCell(i + 1, "py-4 px-3 border-r border font-medium text-gray-900 dark:text-white dark:border-[#ffffff38]")}
                    {renderTableCell(item.userId, "bg-white py-4 px-4 border-r border dark:border-[#ffffff38]")}
                   
                </tr>
            );

        });
    };

    return (
        <>
            <div className="justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">

                <div className={`relative w-auto my-6 mx-auto max-w-[800px]`}>
                    <div className="overflow-hidden border border-white dark:border-[#ffffff38] rounded-lg shadow-lg relative flex flex-col  bg-white outline-none focus:outline-none">
                        <div className="dark:bg-gray-900 flex items-center justify-between p-5 border-b dark:border-[#ffffff38] border-solid border-slate-200 rounded-t dark:bg-slate-900">
                            <h3 className="text-xl font-semibold dark:text-white">{t("REPORT")}</h3>
                            <button className=" ml-auto flex items-center justify-center  text-black border-2 rounded-full  h-8 w-8 float-right text-3xl leading-none font-extralight outline-none focus:outline-none" onClick={() => handleReportToggle()}>
                                <button type="button" title={t("CLOSE")} className="hover:text-blue-700 transition duration-150 ease-in-out" data-bs-toggle="tooltip">
                                    <span className=" text-[#B8BBBF]  text-4xl ">×</span>
                                </button>
                            </button>
                        </div>

                        <div className="px-[20px] py-10">
                            <div className="overflow-x-auto relative rounded-lg border">
                                <table className="w-full text-xs text-left text-[#A5A5A5] dark:text-gray-400 ">
                                    <thead className="text-xs text-gray-900 border border-[#E1E6EE] bg-[#E1E6EE] dark:bg-gray-700 dark:text-gray-400 dark:border-[#ffffff38]">
                                        <tr>
                                            <th scope="col" className="py-3 px-3">
                                                {t("USER_ID")}
                                            </th>


                                            <th scope="col" className="py-3 px-6 text-left">
                                                {t("USER_NAME")}
                                            </th>


                                            <th scope="col" className="py-3 px-6 text-center">
                                                {t("REPORT_RAISED_DATE")}
                                            </th>

                                            <th scope="col" className="py-3 px-6 text-center">
                                                {t("REPORT_REASON")}
                                            </th>

                                            <th scope="col" className="py-3 px-6 text-center">
                                                {t("O_MOBILE_NUMBER")}
                                            </th>

                                        </tr>
                                    </thead>
                                    <tbody>
                                        {/* {users?.length > 0 && renderTableRows()} */}
                                        {renderTableRows()}
                                        {/* {helpers.ternaryCondition(
                isEmpty(users),
                <tr className="bg-white text-center border-b dark:bg-gray-800 dark:border-gray-700">
                  <td
                    className="py-2 px-4 border-r dark:border-[#ffffff38]"
                    colSpan={13}
                  >
                    {t("O_NO_RECORD_FOUND")}
                  </td>
                </tr>,
                null
              )} */}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="dark:border-[#ffffff38] dark:bg-slate-900 flex items-center justify-center p-6 border-t border-solid border-slate-200 rounded-b">
                            <button
                                className="text-black bg-[#E1E1E1] font-normal px-6 flex gap-2 py-2.5 text-sm outline-none focus:outline-none rounded mr-6  ease-linear transition-all duration-150"
                                type="button"
                                onClick={() => handleReportToggle()}
                                title={t("CLOSE")}
                            >
                                <IoClose size={19} /> {t("CLOSE")}
                            </button>
                        </div>
                    </div>
                </div>

            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black" />
        </>
    );
};

export default ReportUserPopup;
