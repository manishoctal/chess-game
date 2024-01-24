import React, { useState } from "react";
import { apiPut } from "../../utils/apiFetch";
import apiPath from "../../utils/apiPath";
import { isEmpty, startCase } from "lodash";
import dayjs from "dayjs";
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
    let statusText = item?.status === 'active' ? 'Active' : 'Inactive';
    let titleText = `${statusText}`;
    return  item?.status === "deleted" ? (
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
  const getDisplayName = (userDetail, type) => {
    if (type === 'local') {
      return `${userDetail?.firstName} ${userDetail?.lastName ?? ''}`;
    } else {
      return userDetail?.firstName || 'N/A';
    }
  };

  const getWalletAmount = (userData) => {
    return userData?.walletAmount
      ? helpers.formattedAmount(userData?.walletAmount)
      : 0;
  };

  const getKycStatusText = (userKyc) => {
    return helpers.ternaryCondition(
      userKyc?.kycRecord?.isApproved,
      startCase(userKyc?.kycRecord?.isApproved),
      'KYC Not Uploaded Yet'
    );
  };

  const renderTableCell = (content, classNames) => (
    <td className={classNames}>{content}</td>
  );

  const renderUserTypeSpecificCells = (item, userType) => {
    if (userType === 'local') {
      return renderTableCell(getWalletAmount(item), `${
        item && item?.status === 'deleted' ? 'text-red-600' : 'bg-white'
      } py-2 px-4 border-r  dark:border-[#ffffff38] text-center`);
    } else if (userType === 'tourist') {
      return (
        <>
          {renderTableCell(
            helpers.ternaryCondition(item?.upcCode, item?.upcCode, 'N/A'),
            `${
              item && item?.status === 'deleted'
                ? 'text-red-600'
                : 'bg-white'
            } py-4 px-3 border-r  dark:border-[#ffffff38] text-center`
          )}
          {renderTableCell(
            helpers.ternaryCondition(
              item?.referralCode,
              item?.referralCode,
              'N/A'
            ),
            `${
              item && item?.status === 'deleted'
                ? 'text-red-600'
                : 'bg-white'
            } py-4 px-3 border-r text-center dark:border-[#ffffff38]`
          )}
          {renderTableCell(
            helpers.ternaryCondition(
              item?.familyName,
              item?.familyName,
              'N/A'
            ),
            `${
              item && item?.status === 'deleted'
                ? 'text-red-600'
                : 'bg-white'
            } py-4 px-3 border-r text-center dark:border-[#ffffff38]`
          )}
        </>
      );
    }
  };

  const renderTableRows=()=>{
    return  users?.map((item, i) => (
      <tr
        key={i}
        className={`${
          item && item?.status === "deleted"
            ? "text-red-600 font-bold"
            : "bg-white"
        } border-b dark:bg-gray-800 dark:border-[#ffffff38]'`}
      >
         {renderTableCell(
        i + 1 + pageSize * (page - 1),
        'py-4 px-3 border-r  font-medium text-gray-900  dark:text-white dark:border-[#ffffff38]'
      )}
        {renderTableCell(
        getDisplayName(item, userType),
        `${
          item && item?.status === 'deleted'
            ? 'text-red-600'
            : 'bg-white'
        } py-4 px-4 border-r  dark:border-[#ffffff38]'`
      )}
        {renderTableCell(
        helpers.ternaryCondition(
          item?.email,
          item?.email,
          'N/A'
        ),
        `${
          item && item?.status === 'deleted'
            ? 'text-red-600'
            : 'bg-white'
        } py-2 px-4 border-r  dark:border-[#ffffff38] font-bold text-slate-900'`
      )}
        {renderTableCell(
        helpers.ternaryCondition(
          item?.countryCode,
          item?.countryCode,
          "N/A"
        ),
        `${
          item && item?.status === "deleted"
            ? "text-red-600"
            : "bg-white"
        } py-2 px-4 border-r  dark:border-[#ffffff38] text-center font-bold text-slate-900'`
      )}
        
         {renderTableCell(
        helpers.ternaryCondition(
          item?.mobile,
          item?.mobile,
          "N/A"
        ),
        `${
          item && item?.status === "deleted"
            ? "text-red-600"
            : "bg-white"
        } py-2 px-4 border-r dark:border-[#ffffff38] text-center font-bold ${
          item && item?.status === "deleted"
            ? ""
            : "text-slate-900"
        }`
      )}
      {renderUserTypeSpecificCells(item, userType)}
          {renderTableCell(
        getKycStatusText(item),
        'py-4 px-3 border-r  dark:border-[#ffffff38] text-center'
      )}
         {renderTableCell(
        dayjs(item?.createdAt).format('DD-MM-YYYY hh:mm A') || 'N/A',
        'py-4 px-3 border-r  dark:border-[#ffffff38] text-center'
      )}
        {helpers.andOperator(
          manager?.add || user?.permission?.length === 0,
          <td className="py-2 px-4 border-r  dark:border-[#ffffff38] text-center">
            {statusLabel(item)}
          </td>
        )}
        <td className="py-2 px-4 border-l">
          <div className="">
            <div className="flex justify-center items-center">
              <NavLink
                onClick={() => handleUserView(item)}
                to="/users/view"
                state={{ ...item, userType }}
                title={t("O_VIEW")}
                className="px-2 py-2"
              >
                <AiFillEye className="cursor-pointer w-5 h-5 text-slate-600 dark:hover:text-white hover:text-blue-700" />{" "}
              </NavLink>

              {(manager?.add || user?.role === "admin") &&
                userType === "local" &&
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
              {(manager?.add || user?.role === "admin") &&
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
                ))}
              <div>
                <NavLink
                  to="/users/transactionDetails"
                  state={{ userType, userId: item?._id }}
                >
                  <MdHistory
                    className="text-green text-lg cursor-pointer  text-slate-600"
                    title="Transaction details"
                  />
                </NavLink>
              </div>
            </div>
          </div>
        </td>
      </tr>
    ))
  }

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
                  {helpers.ternaryCondition(
                    userType === "local",
                    t("NAME"),
                    t("FIRST_NAME")
                  )}
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
                {helpers.andOperator(
                  userType === "local",
                  <th scope="col" className="py-3 px-6 text-left">
                    {t("AVAILABLE_BALANCE")}
                  </th>
                )}
                {helpers.andOperator(
                  userType === "tourist",
                  <>
                    <th scope="col" className="py-3 px-6 text-left">
                      {t("UPC_CODE")}
                    </th>
                    <th scope="col" className="py-3 px-6 text-left">
                      {t("REFERRAL_CODE")}
                    </th>
                    <th scope="col" className="py-3 px-6 text-left">
                      {t("FAMILY_NAME")}
                    </th>
                  </>
                )}

                <th scope="col" className="py-3 px-6 text-left">
                  {t("KYC_STATUS")}
                </th>
                <th scope="col" className="py-3 px-6 text-left">
                  {t("O_CREATED_AT")}
                </th>

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
