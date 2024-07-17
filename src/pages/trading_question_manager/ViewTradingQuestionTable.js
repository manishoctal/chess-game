import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { isEmpty, startCase } from "lodash";
import helpers from "../../utils/helpers";
import OViewTradingTableHead from '../../components/reusable/OTableHead'
import { GrAnnounce } from "react-icons/gr";
import { NavLink } from "react-router-dom";
import { AiFillEye } from "react-icons/ai";
import AuthContext from "context/AuthContext";
import { apiPut } from "utils/apiFetch";
import apiPath from "utils/apiPath";
import useToastContext from "hooks/useToastContext";
import AnnounceResult from './AnnounceResult'
const ViewTradingQuestionTable = ({
  viewTradingData,
  page,
  sort,
  setSort,
  manager,
  pageSize,
  ViewallTradingQuestionsList
}) => {
  const { t } = useTranslation();

  const { user } = useContext(AuthContext)
  const notification = useToastContext();
  const [announceModal, setAnnounceResultModal] = useState(false)
  const [announceData, setAnnounceData] = useState()
  const getViewTradingValue = (details, detailsClass) => {
    return <td className={`py-2 px-4 border-r dark:border-[#ffffff38] ${detailsClass || ''}`}>
      {details || 'N/A'}
    </td>
  }


  const handelViewStatusChangeTrading = async (item) => {
    try {
      const payload = {
        status: helpers.ternaryCondition(
          item?.status === "inactive",
          "active",
          "inactive"
        ),
        type: "question",
      };
      const path = `${apiPath.changeStatus}/${item?._id}`;
      const result = await apiPut(path, payload);
      if (result?.status === 200) {
        ViewallTradingQuestionsList()
        notification.success(result.data.message);

      }

    } catch (error) {
      console.error("error in get status change list==>>>>", error.message);
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
              <OViewTradingTableHead sort={sort} setSort={setSort} name='QUESTIONS_NAME' fieldName='questionObj.questionText' />
              <OViewTradingTableHead sort={sort} setSort={setSort} name='O_CREATED_AT' fieldName='createdAt' classTd={'justify-center'} />
              <OViewTradingTableHead sort={sort} setSort={setSort} name='YES_COUNT' fieldName='optionACount' classTd={'justify-center'} />
              <OViewTradingTableHead sort={sort} setSort={setSort} name='NO_COUNT' fieldName='optionBCount' classTd={'justify-center'} />
              {(manager?.add || manager?.edit || user?.role === "admin") && (
                <OViewTradingTableHead sort={sort} setSort={setSort} name='O_STATUS' fieldName='status' classTd={'justify-center'} />)}
              {(manager?.add || manager?.edit || user?.role === "admin") && (
                <OViewTradingTableHead sort={sort} setSort={setSort} name='MARK_ANSWER' fieldName='announceStatus' classTd={'justify-center'} />)}
              <th scope="col" className="py-3 px-6 text-center">
                {t("POLL_STATUS")}
              </th>
              {(manager?.view || user?.role === "admin") && (<th scope="col" className="py-3 px-6">
                {t("O_ACTION")}
              </th>)}
            </tr>
          </thead>
          <tbody>
            {viewTradingData?.map((item, i) => (
              <tr
                key={i}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
              >
                <th
                  scope="row"
                  className="py-2 px-4 border-r dark:border-[#ffffff38] font-medium text-gray-900  dark:text-white"
                >
                  {i + 1 + pageSize * (page - 1)}
                </th>
                {getViewTradingValue(startCase(item?.questionObj?.questionText) || 'N/A', 'font-bold')}
                {getViewTradingValue(helpers.getDateAndTime(item?.createdAt))}
                {getViewTradingValue(item?.optionACount?.toString() || 'N/A', 'font-bold text-center')}
                {getViewTradingValue(item?.optionBCount || 'N/A', 'font-bold text-center')}
                {(manager?.add || manager?.edit || user?.role === "admin") && (<td className="py-2 px-4 border-r dark:border-[#ffffff38] text-center">
                  <label
                    className="inline-flex relative items-center cursor-pointer"
                    title={startCase(item?.status)}
                  >
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={item?.status === "active"}
                      onChange={(e) =>
                        helpers.alertFunction(
                          `${t("ARE_YOU_SURE_YOU_WANT_TO")} ${helpers.ternaryCondition(
                            e.target.checked,
                            "active",
                            "inactive"
                          )} question ?`,
                          item,
                          handelViewStatusChangeTrading
                        )
                      }
                    />
                    <div className="w-10 h-5 bg-gray-200 rounded-full peer peer-focus:ring-0 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-gradientTo" />
                  </label>
                </td>)}
                {(manager?.add || manager?.edit || user?.role === "admin") && (<td className={`py-2 px-4 text-center border-r dark:border-[#ffffff38]`}>
                  {helpers.ternaryCondition(!item?.announceStatus, <button title={t('ANNOUNCE_RESULT')} onClick={() => { setAnnounceResultModal(true); setAnnounceData(item) }} className="bg-gradientTo text-[10px] px-2 py-2 rounded-lg items-center border border-transparent text-white hover:bg-DarkBlue">
                    <GrAnnounce size={17} />
                  </button>, <span className="text-green-600 font-bold">{t("RESULT_ANNOUNCED")}</span>)}
                </td>)}
                <td className={`py-2 px-4 border-r dark:border-[#ffffff38] text-center`}>
                <div className="flex flex-col md:flex-row justify-center items-center">
                  <button title={startCase(item?.optionA)} className=" text-[10px] border-gray-500 px-3 py-2 rounded-lg items-center border text-white hover:bg-gray-100">
                    <span className="text-[#000000] font-semibold">{startCase(item?.optionA)} {helpers.orOperator(item?.pollAStatus, 0)}</span>
                  </button>

                  <button title={startCase(item?.optionB)} className=" text-[10px] border-gray-500 px-3 mx-2 py-2 rounded-lg items-center border text-white hover:bg-gray-100">
                    <span className="text-[#000000] font-semibold">{t('O_NO')} {helpers.orOperator(item?.pollBStatus, 0)}</span>
                  </button>
                  </div>
                </td>
                {(manager?.view || user?.role === "admin") && (<td className="py-2 px-4 border-l">
                  <div className="">
                    <ul className="flex justify-center">
                      <li className="px-2 py-2 hover:text-gradientTo">
                        <NavLink to='/trading-question-manager/view' title={t("O_VIEW")} state={item}>
                          <AiFillEye className="cursor-pointer w-5 h-5 text-slate-600" />
                        </NavLink>
                      </li>

                    </ul>
                  </div>
                </td>)}
              </tr>
            ))}
            {isEmpty(viewTradingData) ? (
              <tr className="bg-white border-b w-full text-center dark:bg-gray-800 dark:border-gray-700">
                <td className="py-4 px-6" colSpan={9}>
                  {t("O_NO_RECORD_FOUND")}
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
      {announceModal && (
        <AnnounceResult
          setAnnounceResultModal={setAnnounceResultModal}
          toAnnounceData={announceData}
        />
      )}
    </div>
  );
};

export default ViewTradingQuestionTable;
