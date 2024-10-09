import OButton from "components/reusable/OButton";
import OInputField from "components/reusable/OInputField";
import AuthContext from "context/AuthContext";
import { isEmpty } from "lodash";
import Pagination from "pages/Pagination";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { IoClose } from "react-icons/io5";
import { NavLink } from "react-router-dom";
import { apiGet } from "utils/apiFetch";
import apiPath from "utils/apiPath";
import helpers from "utils/helpers";


const ReportUserPopup = ({ handleReportToggle, reportItem }) => {
    const { t } = useTranslation();
    const renderTableCell = (content, classNames) => (
        <td className={classNames}>{helpers?.ternaryCondition(content, content, "N/A")}</td>
    );
    const { logoutUser } = useContext(AuthContext);

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [reportList, setReportList] = useState([])
    const [paginationObj, setPaginationObj] = useState({
        page: 1,
        pageCount: 1,
        pageRangeDisplayed: 10,
    });

    const getAllReport = async () => {
        try {

            const payload = {
                page,
                pageSize: pageSize,
            };

            const path = `${apiPath.reportHistory}/${reportItem}`;
            const result = await apiGet(path, payload);
            if (result?.data?.success) {
                const response = result?.data?.results;
                setReportList(response?.docs);
                const resultStatus = result?.data?.success;
                setPaginationObj({
                    ...paginationObj,
                    page: helpers.ternaryCondition(resultStatus, response.page, null),
                    perPageItem: helpers.ternaryCondition(resultStatus, response?.docs.length, null),
                    totalItems: helpers.ternaryCondition(resultStatus, response.totalDocs, null),
                    pageCount: helpers.ternaryCondition(resultStatus, response.totalPages, null),
                });
            }
        } catch (error) {
            console.error("error ", error);
            setPaginationObj({});
            if (error.response.status === 401 || error.response.status === 409) {
                logoutUser();
            }
        }
    };

    const handlePageClick = (event) => {
        const newPage = event.selected + 1;
        setPage(newPage);
    };


    useEffect(() => {
        getAllReport();
    }, [page, pageSize]);


    const renderTableRows = () => {
        return reportList?.map((item, i) => {
     
            return (
                <tr key={item?._id} >
                    {renderTableCell(item?.userData?.userUniqId, "py-4 px-3 border-r border font-medium text-gray-900 dark:text-white dark:border-[#ffffff38]")}
                    <td className="py-4 px-6 border-r text-center"><NavLink state={item} to={`/users/view/${item?._id}`} className="hover:text-black">{helpers?.ternaryCondition(item?.userData?.userName,item?.userData?.userName,"N/A")}</NavLink></td>

                    {/* {renderTableCell(item?.userData?.userName, "bg-white py-4 px-4 border-r border dark:border-[#ffffff38]")} */}

                    {renderTableCell(helpers.ternaryCondition(
                        item?.createdAt,
                        helpers.getDateAndTime(item?.createdAt),
                        'N/A'
                    ), "bg-white py-4 px-4 border-r border dark:border-[#ffffff38] text-center")}


                    {renderTableCell(item?.reason, "py-4 px-3 border-r border font-medium text-gray-900 dark:text-white dark:border-[#ffffff38] text-center")}
                    {renderTableCell(
                        helpers.ternaryCondition(
                            item?.userData?.mobile,
                            `+ ${item?.userData?.countryCode || ""} ${item?.userData?.mobile}`,
                            "N/A"
                        ),
                        "bg-white py-2 px-4 border-r border dark:border-[#ffffff38] text-center font-bold"
                    )}


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
                                        {reportList?.length > 0 && renderTableRows()}
                                        {
                                            isEmpty(reportList) &&
                                            <tr className="bg-white text-center border-b dark:bg-gray-800 dark:border-gray-700">
                                                <td
                                                    className="py-2 px-4 border-r dark:border-[#ffffff38]"
                                                    colSpan={13}
                                                >
                                                    {t("O_NO_RECORD_FOUND")}
                                                </td>
                                            </tr>
                                        }
                                    </tbody>
                                </table>
                            </div>

                            {paginationObj?.totalItems ? (
                                <Pagination handlePageClick={handlePageClick} options={paginationObj} page={page} />
                            ) : null}

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
