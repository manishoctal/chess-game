import { isEmpty, startCase } from "lodash";
import { useTranslation } from "react-i18next";
import helpers from "utils/helpers";
import ONotificationTableHead from "../../components/reusable/OTableHead";
import apiPath from "utils/apiPath";
import { apiGet, apiPost } from "utils/apiFetch";
import useToastContext from "hooks/useToastContext";
import { getTimeDifference } from "utils/reusableMethods";
import { useEffect, useState } from "react";

const WithdrawalRequestTable = ({ allCommunity, paginationObj, sort, setSort, pageSize, getAllWithdrawal }) => {
  const { t } = useTranslation();
  const notification = useToastContext();
  const [currentRate, setCurrentRate] = useState([]);
  const handleReject = async (item) => {
    try {
      const payload = {
        status: "rejected",
      };
      const path = `${apiPath.rejectWithdrawalReqeust}/${item?._id}`;
      const result = await apiPost(path, payload);
      console.log("result", result);
      if (result?.data?.success) {
        notification.success(result?.data?.message);
        getAllWithdrawal();
      } else {
        notification.error(result?.data?.message);
      }
    } catch (error) {
      console.error("error", error.message);
    }
  };

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

  return (
    <div className="p-3">
      <div className="overflow-x-auto relative rounded-lg border">
        <table className="w-full text-xs text-left text-[#A5A5A5] dark:text-gray-400 ">
          <thead className="text-xs text-gray-900 border border-[#E1E6EE] bg-[#E1E6EE] dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="py-3 px-6">
                {t("S.NO")}
              </th>
              <ONotificationTableHead sort={sort} setSort={setSort} name="USER_ID" fieldName="user.userUniqId" classTd={"justify-center"} />
              <ONotificationTableHead sort={sort} setSort={setSort} name="FULL_NAME" fieldName="user.fullName" classTd={"justify-center"} />
              <ONotificationTableHead sort={sort} setSort={setSort} name="USER_NAME" fieldName="user.userName" classTd={"justify-center"} />
              <ONotificationTableHead sort={sort} setSort={setSort} name="O_EMAIL_ID" fieldName="user.email" classTd={"justify-center"} />
              <ONotificationTableHead sort={sort} setSort={setSort} name="O_COUNTRY_CODE" fieldName="user.countryCode" classTd={"justify-center"} />
              <ONotificationTableHead sort={sort} setSort={setSort} name="O_MOBILE" fieldName="user.mobile" classTd={"justify-center"} />
              <ONotificationTableHead sort={sort} setSort={setSort} name="TOTAL_BALANCE" fieldName="user.totalAmount" classTd={"justify-center"} />
              <ONotificationTableHead sort={sort} setSort={setSort} name="REQUESTED_AMOUNT" fieldName="amount" classTd={"justify-center"} />
              <th scope="col" className="py-3 px-6 text-center">
                {t("REMAINING_AMOUNT")}
              </th>
              <ONotificationTableHead sort={sort} setSort={setSort} name="REQUESTED_DATE" fieldName="createdAt" classTd={"justify-center"} />
              <ONotificationTableHead sort={sort} setSort={setSort} name="O_STATUS" fieldName="status" classTd={"justify-center"} />
              <th scope="col" className="py-3 px-6 text-center">
                {t("TIME_LEFT")}
              </th>
              <th scope="col" className="py-3 px-6 text-center">
                {t("O_ACTION")}
              </th>
            </tr>
          </thead>
          <tbody>
            {allCommunity &&
              allCommunity?.length > 0 &&
              allCommunity?.map((item, i) => {
                const matchedRate = currentRate.find((rate) => rate.source === item?.user?.currency);
                const reqeustedAmount = item?.amount * matchedRate?.USD;
                const remainingAmount = item?.user?.totalAmount * matchedRate?.USD;
                const totalAmount = reqeustedAmount + remainingAmount;
                return (
                  <tr key={i} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    <th scope="row" className="py-4 px-6 border-r font-medium text-gray-900  dark:text-white">
                      {i + 1 + pageSize * (paginationObj?.page - 1)}
                    </th>
                    <td className="py-4 px-6 border-r text-center">{helpers?.ternaryCondition(item?.user?.userUniqId, item?.user?.userUniqId, "N/A")}</td>
                    <td className="py-4 px-6 border-r text-center">{helpers?.ternaryCondition(item?.user?.fullName, item?.user?.fullName, "N/A")}</td>
                    <td className="py-4 px-6 border-r text-center">{helpers?.ternaryCondition(item?.user?.userName, item?.user?.userName, "N/A")}</td>
                    <td className="py-4 px-6 border-r text-center">{helpers?.ternaryCondition(item?.user?.email, item?.user?.email, "N/A")}</td>
                    <td className="py-4 px-6 border-r text-center">{helpers?.ternaryCondition(item?.user?.countryCode, `+ ${item?.user?.countryCode}`, "N/A")}</td>
                    <td className="py-4 px-6 border-r text-center">{helpers?.ternaryCondition(item?.user?.mobile, item?.user?.mobile, "N/A")}</td>
                    <td className="py-4 px-6 border-r text-center">{helpers.formattedAmount(totalAmount)}</td>
                    <td className="py-4 px-6 border-r text-center">{helpers.formattedAmount(reqeustedAmount)}</td>
                    <td className="py-4 px-6 border-r text-center">{helpers.formattedAmount(remainingAmount)}</td>
                    <td className="py-4 px-6 border-r text-center">{helpers.getDateAndTime(item?.createdAt)}</td>
                    <td className={`py-4 px-6 border-r text-center ${item?.status === "accepted" ? "text-green-500" : item?.status === "rejected" ? "text-red-500" : "text-gray-600"}`}>
                      <strong>{helpers?.ternaryCondition(item?.status, startCase(item?.status), "N/A")}</strong>
                    </td>
                    <td className="py-4 px-3 border-r text-center ">{item?.status === "pending" && getTimeDifference(item?.expiryTime)}</td>
                    <td className="py-4 px-6 border-r text-center">
                      {helpers?.ternaryCondition(
                        item?.status === "pending",
                        <button
                          onClick={() =>
                            helpers.alertFunction(
                              "Are you sure you want to reject?",
                              {
                                _id: item?._id,
                                status: "rejected",
                              },
                              handleReject
                            )
                          }
                          className="bg-red-600 text-sm px-4 flex gap-2 ml-3 mb-3 py-2 rounded-lg items-center border border-transparent text-white hover:bg-red-600 sm:w-auto w-1/2"
                        >
                          Reject
                        </button>,
                        ""
                      )}
                    </td>
                  </tr>
                );
              })}

            {isEmpty(allCommunity) && (
              <tr className="bg-white text-center border-b dark:bg-gray-800 dark:border-gray-700">
                <td className="py-4 px-6 border-r" colSpan={15}>
                  {t("O_NO_RECORD_FOUND")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WithdrawalRequestTable;
