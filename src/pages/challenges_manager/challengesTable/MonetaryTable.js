import React from "react";
import { apiPut } from "../../../utils/apiFetch";
import apiPath from "../../../utils/apiPath";
import { isEmpty, startCase } from "lodash";
import useToastContext from "hooks/useToastContext";
import { AiFillEye, } from "react-icons/ai";
import { useTranslation } from "react-i18next";
import {  NavLink } from "react-router-dom";
import helpers from "../../../utils/helpers";
import OUserTableHead from '../../../components/reusable/OTableHead'

const MonetaryTable = ({
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
  userResult
}) => {
  const { t } = useTranslation();
  const notification = useToastContext();

  const handelStatusChange = async (item) => {
    try {
      const payload = {
        status: helpers.ternaryCondition(
          item?.status === "inactive",
          "active",
          "inactive"
        ),
        type: "user",
      };
      const path = `${apiPath.changeStatus}/${item?._id}`;
      const result = await apiPut(path, payload);
      if (result?.status === 200) {
        notification.success(result.data.message);
        getAllUser({ statusChange: 1 });
      }
      // }
    } catch (error) {
      console.error("error in get all users list==>>>>", error.message);
    }
  };



  const statusLabel = (item) => {
    let statusText = item?.status === "active" ? "Active" : "Inactive";
    let titleText = `${statusText}`;
    return item?.status === "deleted" ? (
      <div>Deleted</div>
    ) : (
      <label
        className="inline-flex relative items-center cursor-pointer"
        title={titleText}
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
              )} user ?`,
              item,
              handelStatusChange
            )
          }
        />
        <div className="w-10 h-5 bg-gray-200 rounded-full peer peer-focus:ring-0 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-gradientTo" />
      </label>
    );
  };
  const getDisplayName = (userDetail) => {
    return startCase(userDetail?.fullName) || 'N/A';
  };

  const getDisplayUserId = (userDetail) => {
    return userDetail?.userUniqId ?? "N/A";
  };


  const getKycStatusText = (userKyc) => {
    return helpers.ternaryCondition(userKyc?.isKYCVerified === 0, 'No', 'Yes');
  };

  const renderTableCell = (content, classNames) => (
    <td className={classNames}>
      {content}
    </td>
  );
  const renderCommonTableCells = (item) => (
    <>
      {renderTableCell(
        helpers.getDateAndTime(item?.createdAt) || "N/A",
        "py-4 px-3 border-r  dark:border-[#ffffff38] text-center border font-bold"
      )}
      {renderTableCell(
        getKycStatusText(item),
        "py-4 px-3 border-r  dark:border-[#ffffff38] text-center border font-bold"
      )}

    </>
  );



  const renderActionTableCells = (item, userTypeDetail) => (
    <td className="py-2 px-4 border-l border">
      <div className="">
        <div className="flex justify-center items-center">
          <NavLink
            onClick={() => handleUserView(item)}
            to={`/users/view/${item?._id}`}
            state={{ ...item, userTypeDetail }}
            className="px-2 py-2"
          >
            <AiFillEye className="cursor-pointer w-5 h-5 text-slate-600 dark:hover:text-white hover:text-blue-700" />{" "}
          </NavLink>

        </div>
      </div>
    </td>
  );


  const renderStatusTableCell = (item) =>
    helpers.andOperator(
      manager?.add || user?.permission?.length === 0,
      <td className="py-2 px-4 border-r  dark:border-[#ffffff38] text-center border">
        {statusLabel(item)}
      </td>
    );

  const getRowClassName = (item) => {
    return item && item.status === "deleted"
      ? "text-red-600 font-bold"
      : "bg-white";
  };

  const renderTableRows = () => {
    return users?.map((item, i) => {
      const rowClassName = getRowClassName(item);
      return (
        <tr key={i} className={rowClassName}>
          {renderTableCell(i + 1 + pageSize * (page - 1), "py-4 px-3 border-r border  font-medium text-gray-900  dark:text-white dark:border-[#ffffff38]")}
          {renderTableCell(getDisplayUserId(item), "bg-white py-4 px-4 border-r border  dark:border-[#ffffff38]")}
          {renderTableCell(getDisplayName(item), "bg-white py-4 px-4 border-r border  dark:border-[#ffffff38]")}

          <td className="bg-white py-4 px-4 border-r border  dark:border-[#ffffff38]">
            <NavLink
              to={`/users/view/${item?._id}`}
              state={{ ...item }}
              className="px-2 py-2 hover:text-black"
            >
              {helpers.ternaryCondition(item?.userName, item?.userName, "N/A")}
            </NavLink>
          </td>


          {renderTableCell(helpers.ternaryCondition(item?.email, item?.email, "N/A"), "bg-white py-2 px-4 border-r border  dark:border-[#ffffff38] font-bold text-slate-900")}
          {renderTableCell(helpers.ternaryCondition(item?.countryCode, `+ ${item?.countryCode}`, "N/A"), "bg-white py-2 px-4 border-r border dark:border-[#ffffff38] text-center font-bold")}
          {renderTableCell(helpers.ternaryCondition(item?.mobile, item?.mobile, "N/A"), "bg-white py-2 px-4 border-r border dark:border-[#ffffff38] text-center font-bold")}
          {renderCommonTableCells(item)}
          {renderTableCell(helpers.ternaryCondition(item?.ratingMonetary, item?.ratingMonetary, "0"), "bg-white py-2 px-4 border-r border dark:border-[#ffffff38] text-center font-bold")}
          {renderTableCell(helpers.ternaryCondition(item?.ratingCasual, item?.ratingCasual, "0"), "bg-white py-2 px-4 border-r border dark:border-[#ffffff38] text-center font-bold")}
          {
            !userResult && renderStatusTableCell(item)
          }
          {renderActionTableCells(item, userType)}
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

                <OUserTableHead sort={sort} setSort={setSort} name='MONETRY_CHALLENGE_ID' fieldName='userUniqId' />
                <OUserTableHead sort={sort} setSort={setSort} name='CREATOR_USER_NAME' fieldName='fullName' />
                <OUserTableHead sort={sort} setSort={setSort} name='ACCEPTOR_NAME' fieldName='userName' />
                <OUserTableHead sort={sort} setSort={setSort} name='WINNER_NAME' fieldName='email' />
                <OUserTableHead sort={sort} setSort={setSort} name='ACCEPTOR_NAME' fieldName='countryCode' />
                <OUserTableHead sort={sort} setSort={setSort} name='WINNER_NAME' fieldName='mobile' />
                <OUserTableHead sort={sort} setSort={setSort} name='CHALLENGE_CATEGORY' fieldName='createdAt' />
                <OUserTableHead sort={sort} setSort={setSort} name='O_CREATED_AT' fieldName='isKYCVerified' />
                <OUserTableHead sort={sort} setSort={setSort} name='CHALLENGE_TYPE' fieldName='ratingMonetary' />
                <OUserTableHead sort={sort} setSort={setSort} name='MATCH_STATUS' fieldName='ratingCasual' />

                {
                  !userResult && helpers.andOperator(
                    manager?.add || user?.permission?.length === 0,
                    <OUserTableHead sort={sort} setSort={setSort} name='O_STATUS' fieldName='status' />)
                }

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

export default MonetaryTable;
