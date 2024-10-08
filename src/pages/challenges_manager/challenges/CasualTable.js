import React from "react";
import { apiPut } from "../../../utils/apiFetch";
import apiPath from "../../../utils/apiPath";
import { isEmpty, startCase } from "lodash";
import useToastContext from "hooks/useToastContext";
import {  AiFillEye, } from "react-icons/ai";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import helpers from "../../../utils/helpers";
import OUserTableHead from '../../../components/reusable/OTableHead'

const CasualTable = ({
  users,
  getAllUser,
  handleUserView,
  user,
  manager,
  page,
  setSort,
  sort,
  userType,
  pageSize,
}) => {
  const { t } = useTranslation();

  const getDisplayName = (userDetail) => {
    return startCase(userDetail?.creatorDetails?.userUniqId) || 'N/A';
  };

  const getDisplayUserId = (userDetail) => {
    return userDetail?.challengeId ?? "N/A";
  };

  const renderTableCell = (content, classNames) => (
    <td className={classNames}>
      {content}
    </td>
  );


  const renderActionTableCells = (item, type) => {
    console.log("type", type);
    
    return (
      <td className="py-2 px-4 border-l border">
        <div>
          <div className="flex justify-center items-center">
            <NavLink
              onClick={() => handleUserView(item)}
              to={`/challenges-manager/view/${item?._id}`}
              state={{ ...item, type }}
              className="px-2 py-2"
            >
              <AiFillEye className="cursor-pointer w-5 h-5 text-slate-600 dark:hover:text-white hover:text-blue-700" />
            </NavLink>
          </div>
        </div>
      </td>
    );
  };
  


  const getRowClassName = (item) => {
    return item && item.status === "deleted"
      ? "text-red-600 font-bold"
      : "bg-white";
  };

  const renderTableRows = () => {
    return users?.map((item, i) => {
      const rowClassName = getRowClassName(item);
      function getStatus(scheduleDateTime, expiryScheduleDateTime) {
        const currentDate = new Date();
        const scheduleDate = new Date(scheduleDateTime);
        const expiryDate = new Date(expiryScheduleDateTime);
        let status = "";
        if (currentDate > expiryDate) {
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
        <tr key={i} className={rowClassName}>
          {renderTableCell(i + 1 + pageSize * (page - 1), "py-4 px-3 border-r border  font-medium text-gray-900  dark:text-white dark:border-[#ffffff38]")}
          {renderTableCell(getDisplayUserId(item), "bg-white py-4 px-4 border-r border  dark:border-[#ffffff38]")}
          {renderTableCell(getDisplayName(item), "bg-white py-4 px-4 border-r border  dark:border-[#ffffff38]")}

          <td className="bg-white py-4 px-4 border-r border  dark:border-[#ffffff38]">
            <NavLink
              to={`/users/view/${item?._id}`}
              state={{ ...item ,type:"casual"}}
              className="px-2 py-2 hover:text-black"
            >
              {helpers.ternaryCondition(item?.creatorDetails?.userName, item?.creatorDetails?.userName, "N/A")}
            </NavLink>
          </td>


          {renderTableCell(helpers.ternaryCondition(item?.acceptorDetails?.userUniqId, item?.acceptorDetails?.userUniqId, "N/A"), "bg-white py-2 px-4 border-r border  dark:border-[#ffffff38] font-bold text-slate-900")}
          {renderTableCell(helpers.ternaryCondition(item?.acceptorDetails?.userName, item?.acceptorDetails?.userName, "N/A"), "bg-white py-2 px-4 border-r border dark:border-[#ffffff38] text-center font-bold")}
          {renderTableCell(helpers.ternaryCondition(item?.winnerDetails?.userName, item?.winnerDetails?.userName, "N/A"), "bg-white py-2 px-4 border-r border dark:border-[#ffffff38] text-center font-bold")}
          {renderTableCell(helpers.ternaryCondition(item?.time, `${item?.time} Min`, "N/A"), "bg-white py-2 px-4 border-r border dark:border-[#ffffff38] text-center font-bold")}
          {renderTableCell(helpers.getDateAndTime(item?.createdAt, item?.createdAt, "N/A"), "bg-white py-2 px-4 border-r border dark:border-[#ffffff38] text-center font-bold")}
          {renderTableCell(helpers.ternaryCondition(item?.challengeType, startCase(item?.challengeType), "N/A"), "bg-white py-2 px-4 border-r border dark:border-[#ffffff38] text-center font-bold")}
          <td className="bg-white py-2 px-4 border-r border dark:border-[#ffffff38] text-center font-bold">{itemStatus}</td>
          {renderActionTableCells(item, "casual")}
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

              <OUserTableHead sort={sort} setSort={setSort} name='CAUSUAL_CHALLENGE_ID' fieldName='userUniqId' />
              <OUserTableHead sort={sort} setSort={setSort} name='CREATOR_ID' fieldName='fullName' />
              <OUserTableHead sort={sort} setSort={setSort} name='CREATOR_USER_NAME' fieldName='userName' />
              <OUserTableHead sort={sort} setSort={setSort} name='ACCEPTED_ID' fieldName='email' />
              <OUserTableHead sort={sort} setSort={setSort} name='ACCEPTOR_NAME' fieldName='countryCode' />
              <OUserTableHead sort={sort} setSort={setSort} name='WINNER_NAME' fieldName='mobile' />
              <OUserTableHead sort={sort} setSort={setSort} name='TIME_FORMAT' fieldName='createdAt' />
              <OUserTableHead sort={sort} setSort={setSort} name='O_CREATED_AT' fieldName='isKYCVerified' />
              <OUserTableHead sort={sort} setSort={setSort} name='CHALLENGE_TYPE' fieldName='ratingMonetary' />
              <OUserTableHead sort={sort} setSort={setSort} name='MATCH_STATUS' fieldName='ratingCasual' />


              <th scope="col" className="py-3 px-6 text-center">
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
                  colSpan={13}
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

export default CasualTable;
