import React, { useEffect, useState } from "react";
import { isEmpty, startCase } from "lodash";
import { useTranslation } from "react-i18next";
import helpers from "../../utils/helpers";
import OUserTableHead from "../../components/reusable/OTableHead";
import apiPath from "utils/apiPath";
import { apiGet } from "utils/apiFetch";
import { NavLink } from "react-router-dom";
const TransactionTable = ({ users, page, setSort, sort, pageSize,handleUserViewPage }) => {
  const { t } = useTranslation();
  const [currentRate, setCurrentRate] = useState([]);

  const getAllCourrencyRate = async (currency) => {
    try {
      const path = `${apiPath.correncyConverter}`;
      const result = await apiGet(path);
      console.log("result", result?.data?.results);
      if (result?.status === 200) {
        setCurrentRate(result?.data?.results);
      }
    } catch (error) {
      console.error("error", error.message);
    }
  };

  useEffect(() => {
    getAllCourrencyRate();
  }, []);

  const getDisplayName = (dataRecord) => {
    return <NavLink
    onClick={() => handleUserViewPage(dataRecord)}
     to={`/users/view/${dataRecord?.user?._id}`}
     state={{ ...dataRecord }}
     className="px-2 py-2 hover:text-black"
   >
     {helpers.ternaryCondition( dataRecord?.user?.fullName,  dataRecord?.user?.fullName, "N/A")}
   </NavLink>
    
  };

  const getDisplayUserId = (userRecord) => {
    return userRecord?.user?.userUniqId ?? "N/A";
  };

  const renderTableCell = (content, classNames) => <td className={classNames}>{content}</td>;
  const renderCommonTableCells = (item) => <>{renderTableCell(helpers.getDateAndTime(item?.createdAt) || "N/A", "py-4 px-3 border-r text-center dark:border-[#ffffff38] text-left border font-bold")}</>;

  const getRowClassName = (item) => {
    return item && item.status === "deleted" ? "text-red-600 font-bold" : "bg-white";
  };

  const renderTableRows = () => {
    return users?.map((item, i) => {
      const matchedRate = currentRate.find((rate) => rate.source === item?.user?.currency);
      const amount = item?.amount * matchedRate?.USD;
      const adminComission = item?.adminComission * matchedRate?.USD;
      const transactionFee = item?.transactionFee * matchedRate?.USD;
      const rowClassName = getRowClassName(item);

      return (
        <tr key={item?._id} className={rowClassName}>
          {renderTableCell(i + 1 + pageSize * (page - 1), "py-4 px-3 border-r border  font-medium text-gray-900 text-center dark:text-white dark:border-[#ffffff38]")}
          {renderTableCell(getDisplayUserId(item), "bg-white py-4 px-4 border-r border text-left dark:border-[#ffffff38]")}
          {renderTableCell(getDisplayName(item), "bg-white py-4 px-4 border-r border text-left dark:border-[#ffffff38]")}
          {renderTableCell(helpers.ternaryCondition(item?.user?.email, item?.user?.email, "N/A"), "bg-white py-2 px-4 border-r border text-left dark:border-[#ffffff38] font-bold text-slate-900")}
          {renderTableCell(helpers.ternaryCondition(item?.transactionId, item?.transactionId, "N/A"), "bg-white py-2 px-4 border-r border text-left dark:border-[#ffffff38] font-bold text-slate-900")}
          {renderTableCell(helpers.ternaryCondition(item?.transactionType, startCase(item?.transactionType), "N/A"), "bg-white py-2 px-4 border-r border text-center dark:border-[#ffffff38] font-bold text-slate-900")}
          {renderCommonTableCells(item)}
          <td className="bg-white py-2 px-4 border-r border dark:border-[#ffffff38] text-center font-bold">{helpers.formattedAmount(amount)}</td>
          <td className="bg-white py-2 px-4 border-r border dark:border-[#ffffff38] text-center font-bold">{helpers.formattedAmount(adminComission)}</td>
          <td className="bg-white py-2 px-4 border-r border dark:border-[#ffffff38] text-center font-bold">{helpers.formattedAmount(transactionFee)}</td>
        </tr>
      );
    });
  };

  return (
    <div className="p-3">
      <div className="overflow-x-auto relative rounded-lg border">
        <table className="w-full text-xs text-left text-[#A5A5A5] dark:text-gray-400 ">
          <thead className="text-xs text-gray-900 border border-[#E1E6EE] bg-[#E1E6EE] dark:bg-gray-700 dark:text-gray-400 dark:border-[#ffffff38]">
            <tr>
              <th scope="col" className="py-3 px-3">
                {t("S.NO")}
              </th>

              <OUserTableHead sort={sort} setSort={setSort} name="USER_ID" fieldName="user.userUniqId" />
              <OUserTableHead sort={sort} setSort={setSort} name="FULL_NAME" fieldName="user.fullName" />
              <OUserTableHead sort={sort} setSort={setSort} name="O_EMAIL_ID" fieldName="user.email" />
              <OUserTableHead sort={sort} setSort={setSort} name="O_TRANSACTION_ID" fieldName="transactionId" />
              <OUserTableHead sort={sort} setSort={setSort} name="TRANSACTION_TYPE" fieldName="transactionType" />
              <OUserTableHead sort={sort} setSort={setSort} name="TRANSACTION_DATE" fieldName="createdAt" />
              <OUserTableHead sort={sort} setSort={setSort} name="AMOUNT" fieldName="amount" />
              <OUserTableHead sort={sort} setSort={setSort} name="ADMIN_COMMISSION" fieldName="adminComission" />
              <OUserTableHead sort={sort} setSort={setSort} name="TRANSACTION_FEE" fieldName="transactionFee" />
            </tr>
          </thead>
          <tbody>
            {users && users?.length > 0 && renderTableRows()}
            {helpers.ternaryCondition(
              isEmpty(users),
              <tr className="bg-white text-center border-b dark:bg-gray-800 dark:border-gray-700">
                <td className="py-2 px-4 border-r dark:border-[#ffffff38]" colSpan={13}>
                  {t("O_NO_RECORD_FOUND")}
                </td>
              </tr>,
              null
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionTable;
