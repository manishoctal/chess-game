import React from "react";
import { isEmpty, startCase } from "lodash";
import { AiFillEye, } from "react-icons/ai";
import { useTranslation } from "react-i18next";
import {  NavLink } from "react-router-dom";
import helpers from "../../../utils/helpers";
import OUserTableHead from '../../../components/reusable/OTableHead'

const MonetaryTable = ({
  users,
  handleUserView,
  user,
  manager,
  page,
  setSort,
  sort,
  userType,
  pageSize,
  userResult,
  handleUserViewPage
}) => {
  const { t } = useTranslation();

  const getDisplayName = (userDetail) => {
    
    return <NavLink
    onClick={() => handleUserViewPage(userDetail)}
     to={`/users/view/${userDetail?._id}`}
     state={{ ...userDetail }}
     className="px-2 py-2 hover:text-black"
   >
     {helpers.ternaryCondition( userDetail?.user?.userName,  startCase(userDetail?.user?.userName), "N/A")}
   </NavLink>
    
  };

  const getDisplayUserId = (userDetail) => {
    return userDetail?.challengeId ?? "N/A";
  };


  const renderTableCell = (content, classNames) => (
    <td className={classNames}>
      {content}
    </td>
  );

  const renderActionTableCells = (item, type) => (
    <td className="py-2 px-4 border-l border">
      <div className="">
        <div className="flex justify-center items-center">
          <NavLink
            onClick={() => handleUserView(item)}
            to={`/challenges-manager/view/${item?._id}`}
            state={{ ...item, type }}
            className="px-2 py-2"
          >
            <AiFillEye className="cursor-pointer w-5 h-5 text-slate-600 dark:hover:text-white hover:text-blue-700" />{" "}
          </NavLink>

        </div>
      </div>
    </td>
  );


  const renderTableRows = () => {
    return users?.map((item, i) => {

      function getStatus(scheduleDateTime, expiryScheduleDateTime) {
        const currentDate = new Date();
        const scheduleDate = new Date(scheduleDateTime);
        const expiryDate = new Date(expiryScheduleDateTime);
        let status = "";
        if ((item?.resultAnnounced) || (!item?.resultAnnounced && currentDate > expiryDate)) {
          status = "Complete";
        } else if (currentDate > scheduleDate) {
          status = "Running";
        } else {
          status = "Upcoming";
        }
        return status;
      }

      const itemStatus = getStatus(item?.scheduleDateTime, item?.expiryScheduleDateTime);
      return (
        <tr key={item?._id}>
          {renderTableCell(i + 1 + pageSize * (page - 1), "py-4 px-3 border-r border  font-medium text-gray-900 text-center dark:text-white dark:border-[#ffffff38]")}
          {renderTableCell(getDisplayUserId(item), "bg-white py-4 px-4 border-r border text-center dark:border-[#ffffff38]")}
          {renderTableCell(getDisplayName(item), "bg-white py-4 px-4 border-r border  dark:border-[#ffffff38]")}
          {renderTableCell(helpers.ternaryCondition(item?.acceptorDetails?.userName, item?.acceptorDetails?.userName, "N/A"), "bg-white py-2 px-4 border-r border dark:border-[#ffffff38] text-left")}
          {renderTableCell(helpers.ternaryCondition(item?.winnerDetails?.userName,item?.winnerDetails?.userName, "N/A"), "bg-white py-2 px-4 border-r border dark:border-[#ffffff38] text-left")}
          {renderTableCell(helpers.ternaryCondition(item?.challengeCategory, item?.challengeCategory, "N/A"), "bg-white py-2 px-4 border-r border dark:border-[#ffffff38] text-center")}
          {renderTableCell(helpers.ternaryCondition(item?.time, `${item?.time} Min`, "N/A"), "bg-white py-2 px-4 border-r border dark:border-[#ffffff38] text-left")}
          {renderTableCell(helpers.getDateAndTime(item?.createdAt, item?.createdAt, "N/A"), "bg-white py-2 px-4 border-r border dark:border-[#ffffff38] text-center")}
          {renderTableCell(helpers.ternaryCondition(item?.type, startCase(item?.type), "N/A"), "bg-white py-2 px-4 border-r border dark:border-[#ffffff38] text-center")}
          {renderTableCell(helpers.ternaryCondition(item?.adminMoneyAtSake, helpers?.formattedAmount(item?.adminMoneyAtSake), helpers?.formattedAmount(0)), "bg-white py-2 px-4 border-r border dark:border-[#ffffff38] text-center")}
          {renderTableCell(helpers.ternaryCondition(item?.adminMoneyCommission, helpers?.formattedAmount(item?.adminMoneyCommission), helpers?.formattedAmount(0)), "bg-white py-2 px-4 border-r border dark:border-[#ffffff38] text-center")}
          {renderTableCell(helpers.ternaryCondition(item?.adminMoneyPlatformFee, helpers?.formattedAmount(item?.adminMoneyPlatformFee), helpers?.formattedAmount(0)), "bg-white py-2 px-4 border-r border dark:border-[#ffffff38] text-center")}
          {renderTableCell(itemStatus, "bg-white py-2 px-4 border-r border dark:border-[#ffffff38] text-center")}
          {renderActionTableCells(item, "monetary")}
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
                <OUserTableHead sort={sort} setSort={setSort} name='MONETRY_CHALLENGE_ID' fieldName='challengeId' />
                <OUserTableHead sort={sort} setSort={setSort} name='CREATOR_USER_NAME' fieldName='creatorDetails.userName' />
                <OUserTableHead sort={sort} setSort={setSort} name='ACCEPTOR_NAME' fieldName='user.userName' />
                <OUserTableHead sort={sort} setSort={setSort} name='WINNER_NAME' fieldName='winnerDetails.userName' />
                <OUserTableHead sort={sort} setSort={setSort} name='CHALLENGE_CATEGORY' fieldName='challengeCategory' />
                <OUserTableHead sort={sort} setSort={setSort} name='TIME_FORMAT' fieldName='time' />
                <OUserTableHead sort={sort} setSort={setSort} name='O_CREATED_AT' fieldName='createdAt' />
                <OUserTableHead sort={sort} setSort={setSort} name='CHALLENGE_TYPE' fieldName='type' />
                <OUserTableHead sort={sort} setSort={setSort} name='MONEY_AT_STACK' fieldName='moneyAtStake' />
                <OUserTableHead sort={sort} setSort={setSort} name='ADMIN_COMMISION' fieldName='adminComission' />
                <OUserTableHead sort={sort} setSort={setSort} name='PLATFORM_FEE_HEADING' fieldName='platformFee' />
                <OUserTableHead sort={sort} setSort={setSort} name='MATCH_STATUS' fieldName='expiryScheduleDateTime' />
                {
                  !userResult && helpers.andOperator(
                    manager?.add || user?.permission?.length === 0,
                    <OUserTableHead sort={sort} setSort={setSort} name='O_STATUS' fieldName='status' />)
                }

                <th scope="col" className="py-3 px-6 text-left">
                  {t("O_ACTION")}
                </th>
              </tr>
            </thead>
            <tbody>
              {users?.length > 0 && renderTableRows()}
              {helpers.ternaryCondition(
                isEmpty(users),
                <tr className="bg-white text-center border-b dark:bg-gray-800 dark:border-gray-700">
                  <td
                    className="py-2 px-4 border-r dark:border-[#ffffff38]"
                    colSpan={18}
                  >
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

export default MonetaryTable;
