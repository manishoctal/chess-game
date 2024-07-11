import React, { useContext } from "react";
import { AiFillEye } from "react-icons/ai";
import { useTranslation } from "react-i18next";
import AuthContext from "context/AuthContext";
import { isEmpty, startCase } from "lodash";
import helpers from "../../utils/helpers";
import OTradingTableHead from '../../components/reusable/OTableHead'
import { apiPut } from "utils/apiFetch";
import apiPath from "utils/apiPath";
import useToastContext from "hooks/useToastContext";
import { NavLink } from "react-router-dom";

const TradingQuestionTable = ({
  tradingData,
  allTradingQuestionList,
  page,
  sort,
  setSort,
  manager,
  pageSize,
}) => {
  const { t } = useTranslation();
  const { user } = useContext(AuthContext);
  const notification = useToastContext();

  // change status of offer function start

  const handelStatusChangeTrading = async (item) => {
    try {
      const payload = {
        status: helpers.ternaryCondition(
          item?.status === "inactive",
          "active",
          "inactive"
        ),
        type: "match",
      };
      
      const path = `${apiPath.changeStatus}/${item?._id}`;
      const result = await apiPut(path, payload);
      if (result?.status === 200) {
        notification.success(result.data.message);
        allTradingQuestionList({ statusChange: 1 });
      }

    } catch (error) {
      console.error("error in get all users list==>>>>", error.message);
    }
  };
  // change status of offer function end

const getTableDataTrading=(details,dataClass)=>{
  return <td className={`py-2 px-4 border-r dark:border-[#ffffff38] text-center ${dataClass||''}`}>
  {details || 'N/A'}
</td>
}


  return (
    <div className="p-3">
      <div className="overflow-x-auto relative rounded-lg border">
        <table className="w-full text-xs text-left text-[#A5A5A5] dark:text-gray-400 ">
          <thead className="text-xs text-gray-900 border border-[#E1E6EE] bg-[#E1E6EE] dark:bg-gray-700 dark:text-gray-400 dark:border-[#ffffff38]">
            <tr>
              <th scope="col" className="py-3 px-6 text-center">
                {t("S.NO")}
              </th>
              <OTradingTableHead sort={sort} setSort={setSort} name='MATCH_ID' fieldName='matchId' classTd={'justify-center'}/>
              <OTradingTableHead sort={sort} setSort={setSort} name='MATCH_NAME' fieldName='localTeamShortName'  classTd={'justify-center'}/>
              <OTradingTableHead sort={sort} setSort={setSort} name='FORMAT_TYPE' fieldName='formatType'  classTd={'justify-center'}/>
              <OTradingTableHead sort={sort} setSort={setSort} name='STATUS_OF_MATCHES' fieldName='matchStatus' classTd={'justify-center'} />
              <OTradingTableHead sort={sort} setSort={setSort} name='START_DATE' fieldName='startDate' classTd={'justify-center'} />
              <OTradingTableHead sort={sort} setSort={setSort} name='QUESTIONS' fieldName='questionsCount'  classTd={'justify-center'}/>
              {(manager?.add || manager?.edit || user?.role === "admin") && (<OTradingTableHead sort={sort} setSort={setSort} name='O_STATUS' fieldName='status' classTd={'justify-center'} />)}
              {(manager?.view || user?.role === "admin") && (<th scope="col" className="py-3 px-6 text-center">
                {t("O_ACTION")}
              </th>)}
            </tr>
          </thead>
          <tbody>
            {tradingData?.map((item, i) => (
              <tr
                key={i}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
              >
                <th
                  scope="row"
                  className="py-2 px-4 border-r dark:border-[#ffffff38] font-medium text-gray-900  dark:text-white text-center"
                >
                  {i + 1 + pageSize * (page - 1)}
                </th>
                {getTableDataTrading(item?.matchId)}
                {getTableDataTrading(startCase(item?.matchName)||'N/A','font-bold')}
                {getTableDataTrading(item?.formatType?.toUpperCase()||'N/A')}
                {getTableDataTrading(startCase(item?.matchStatus)||'N/A', helpers.getMatchStatus(item?.matchStatus))}
                {getTableDataTrading(helpers.matchDateFormat(item?.startDate))}
                {getTableDataTrading(item?.questionsCount||'N/A','font-bold')}
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
                          )} match ID ${item?.matchId || 'N/A'}?`,
                          item,
                          handelStatusChangeTrading
                        )
                      }
                    />
                    <div className="w-10 h-5 bg-gray-200 rounded-full peer peer-focus:ring-0 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-gradientTo" />
                  </label>
                </td>)}
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
            {isEmpty(tradingData) ? (
              <tr className="bg-white border-b w-full text-center dark:bg-gray-800 dark:border-gray-700">
                <td className="py-4 px-6" colSpan={9}>
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

export default TradingQuestionTable;
