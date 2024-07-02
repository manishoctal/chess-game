import React from "react";
import { useTranslation } from "react-i18next";
import { isEmpty, startCase } from "lodash";
import helpers from "../../utils/helpers";
import OViewTradingTableHead from '../../components/reusable/OTableHead'

const ViewTradingQuestionTable = ({
  viewTradingData,
  page,
  sort,
  setSort,
  pageSize,
}) => {
  const { t } = useTranslation();
  // change status of offer function start

  const getViewTradingValue = (details, detailsClass) => {
    return <td className={`py-2 px-4 border-r dark:border-[#ffffff38] ${detailsClass || ''}`}>
      {details || 'N/A'}
    </td>
  }


  return (
    <div className="p-3">
      <div className="overflow-x-auto relative rounded-lg border">
        <table className="w-full text-xs text-left text-[#A5A5A5] dark:text-gray-400 ">
          <thead className="text-xs text-gray-900 border border-[#E1E6EE] bg-[#E1E6EE] dark:bg-gray-700 dark:text-gray-400 dark:border-[#ffffff38]">
            <tr>
              <th scope="col" className="py-3 px-6">
                {t("S.NO")}
              </th>
              <OViewTradingTableHead sort={sort} setSort={setSort} name='QUESTIONS_NAME' fieldName='questions' />
              <OViewTradingTableHead sort={sort} setSort={setSort} name='O_CREATED_AT' fieldName='createdAt' />
              <OViewTradingTableHead sort={sort} setSort={setSort} name='YES_COUNT' fieldName='yesSelected' />
              <OViewTradingTableHead sort={sort} setSort={setSort} name='NO_COUNT' fieldName='noSelected' />
              <OViewTradingTableHead sort={sort} setSort={setSort} name='O_STATUS' fieldName='status' />
              <th scope="col" className="py-3 px-6">
                {t("MARK_ANSWER")}
              </th>
              <th scope="col" className="py-3 px-6">
                {t("POLL_STATUS")}
              </th>
              <th scope="col" className="py-3 px-6">
                {t("O_ACTION")}
              </th>
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
                {getViewTradingValue(item?.userDetail?.userId)}
                {getViewTradingValue(startCase(item?.userDetail?.fullName) || 'N/A')}
                {getViewTradingValue(item?.userDetail?.userName || 'N/A')}
                {getViewTradingValue(item?.userDetail?.mobile || 'N/A')}
                {getViewTradingValue(item?.offerDetails?.code || 'N/A', 'font-bold')}
                {getViewTradingValue(helpers.getDateAndTime(item?.createdAt))}
                {getViewTradingValue(helpers.formattedAmount(item?.transactionAmount) || 'N/A', 'font-bold')}
                {getViewTradingValue(helpers.formattedAmount(item?.cashbackAmount) || 'N/A', 'font-bold')}
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

    </div>
  );
};

export default ViewTradingQuestionTable;
