import React, { useState } from "react";
import { apiPut } from "../../utils/apiFetch";
import apiPath from "../../utils/apiPath";
import { isEmpty, startCase } from "lodash";
import useToastContext from "hooks/useToastContext";
import { AiFillEdit, AiFillEye } from "react-icons/ai";
import { useTranslation } from "react-i18next";

import { NavLink } from "react-router-dom";
import UserEdit from "./UserEdit";
import { GiTakeMyMoney } from "react-icons/gi";
import { MdHistory } from "react-icons/md";
import AddAmount from "./AddAmount";
import helpers from "../../utils/helpers";

const Table = ({
  users,
  getAllUser,
  handleUserView,
  user,
  manager,
  page,
  sort,
  setSort,
  userType,
  pageSize,
}) => {
  const { t } = useTranslation();
  const notification = useToastContext();

  const [editShowModal, setEditShowModal] = useState(false);
  const [editItem, setEditItem] = useState("");
  const [isAmountModal, setIsAmountModal] = useState(false);
  const [addAmountUser, setAddAmountUser] = useState("");

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

  const handelEdit = (item) => {
    setEditItem(item);
    setEditShowModal(!editShowModal);
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
    return `${userDetail?.firstName} ${userDetail?.lastName ?? ""}`;
  };

  const getDisplayUserId = (userDetail) => {
    return userDetail?.userId ?? "";
  };
  

  const getWalletAmount = (userData) => {
    return userData?.inviteCode ? userData?.inviteCode : 'N/A'

  };

  const getKycStatusText = (userKyc) => {
    return helpers.ternaryCondition(userKyc?.kycStatus, 'Yes', 'No',);
  };

  const renderTableCell = (content, classNames) => (
    <td className={classNames}>{content}</td>
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
            to="/users/view"
            state={{ ...item, userTypeDetail }}
            title={t("O_VIEW")}
            className="px-2 py-2"
          >
            <AiFillEye className="cursor-pointer w-5 h-5 text-slate-600 dark:hover:text-white hover:text-blue-700" />{" "}
          </NavLink>

          {(manager?.add || user?.role === "admin") &&
            userTypeDetail === "local" &&
            (item?.status !== "deleted" ? (
              <div onClick={() => handelEdit(item)}>
                <AiFillEdit
                  className="text-green text-lg cursor-pointer  text-slate-600"
                  title="Edit user"
                />
              </div>
            ) : (
              ""
            ))}

          {/* {(manager?.add || user?.role === "admin") &&
            (item?.status !== "deleted" ? (
              <div
                onClick={() => {
                  setIsAmountModal(true);
                  setAddAmountUser(item);
                }}
              >
                <GiTakeMyMoney
                  className="text-green text-lg cursor-pointer  text-slate-600"
                  title="Add amount"
                />
              </div>
            ) : (
              ""
            ))} */}
          {/* <div>
            <NavLink
              to="/users/transactionDetails"
              state={{ userId: item?._id, ...item, userTypeDetail }}
            >
              <MdHistory
                className="text-green text-lg cursor-pointer  text-slate-600"
                title="Transaction details"
              />
            </NavLink>
          </div> */}
        </div>
      </div>
    </td>
  );

  const renderUserTypeSpecificCells = (item) => {
    return renderTableCell(getWalletAmount(item), "bg-white py-2 px-4 border-r border  dark:border-[#ffffff38] text-center font-bold"
    );
  }

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
          {renderTableCell(getDisplayUserId(item, userType), "bg-white py-4 px-4 border-r border  dark:border-[#ffffff38]")}
          {renderTableCell(getDisplayName(item, userType), "bg-white py-4 px-4 border-r border  dark:border-[#ffffff38]")}
          {renderTableCell(helpers.ternaryCondition(item?.userName, item?.userName, "N/A"), "bg-white border py-2 px-4 border-r  dark:border-[#ffffff38] font-bold ")}
          {renderTableCell(helpers.ternaryCondition(item?.email, item?.email, "N/A"), "bg-white py-2 px-4 border-r border  dark:border-[#ffffff38] font-bold text-slate-900")}
          {renderTableCell(helpers.ternaryCondition(item?.countryCode,item?.countryCode?.includes('+')?item?.countryCode:'+'+item?.countryCode, "N/A"), "bg-white border py-2 px-4 border-r  dark:border-[#ffffff38] text-center font-bold")}
          {renderTableCell(helpers.ternaryCondition(item?.mobile, item?.mobile, "N/A"), "bg-white py-2 px-4 border-r border dark:border-[#ffffff38] text-center font-bold")}
          {renderUserTypeSpecificCells(item, userType)}
          {renderCommonTableCells(item)}
          {renderStatusTableCell(item)}
          {renderActionTableCells(item, userType)}
        </tr>
      );
      // )
      // )
    });
  };

  return (
    <>
      <div className="p-3">
        <div className="overflow-x-auto relative rounded-lg border">
          <table className="w-full text-xs text-left text-[#A5A5A5] dark:text-gray-400 ">
            <thead className="text-xs text-gray-900 border border-[#E1E6EE] bg-[#E1E6EE] dark:bg-gray-700 dark:text-gray-400 dark:border-[#ffffff38]">
              <tr>
                <th scope="col" className="py-3 px-3">
                  {t("S.NO")}
                </th>
                <th scope="col" className="py-3 px-6">
                  {t("USER_ID")}
                </th>
                <th scope="col" className="py-3 px-6">
                  {t("FULL_NAME")}
                </th>
                <th scope="col" className="py-3 px-6">
                  {t("USER_NAME")}
                </th>

                <th scope="col" className="py-3 px-6">
                  <div className="text-left">{t("O_EMAIL_ID")}</div>
                </th>
                <th scope="col" className="py-3 px-6">
                  <div className="text-left">{t("COUNTRY_CODE")}</div>
                </th>
                <th scope="col" className="py-3 px-6">
                  <div className="text-left">{t("O_MOBILE_NUMBER")}</div>
                </th>

                <th scope="col" className="py-3 px-6 text-left">
                  {t("INVITE_CODE")}
                </th>
                <th scope="col" className="py-3 px-6 text-left">
                  {t("JOINED_DATE")}
                </th>


                <th scope="col" className="py-3 px-6 text-left">
                  {t("KYC_VERIFIED")}
                </th>
                {/* <th scope="col" className="py-3 px-6 text-left">
                  {t("O_CREATED_AT")}
                </th> */}

                {helpers.andOperator(
                  manager?.add || user?.permission?.length === 0,
                  <th scope="col" className="py-3 px-6 text-left">
                    {t("O_STATUS")}
                  </th>
                )}
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

      {helpers.andOperator(
        editShowModal,
        <UserEdit
          item={editItem}
          setEditShowModal={setEditShowModal}
          getAllUser={getAllUser}
        />
      )}

      {helpers.andOperator(
        isAmountModal,
        <AddAmount
          addAmountUser={addAmountUser}
          getAllUser={getAllUser}
          setIsAmountModal={setIsAmountModal}
          userType={userType}
        />
      )}
    </>
  );
};

export default Table;
