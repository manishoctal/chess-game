import { isEmpty, startCase } from "lodash";
import { useTranslation } from "react-i18next";
import helpers from "utils/helpers";
import ONotificationTableHead from "../../components/reusable/OTableHead";

const WithdrawalRequestTable = ({ allCommunity, paginationObj, sort, setSort, pageSize }) => {
  const { t } = useTranslation();

  return (
    <div className="p-3">
      <div className="overflow-x-auto relative rounded-lg border">
        <table className="w-full text-xs text-left text-[#A5A5A5] dark:text-gray-400 ">
          <thead className="text-xs text-gray-900 border border-[#E1E6EE] bg-[#E1E6EE] dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="py-3 px-6">
                {t("S.NO")}
              </th>
              <ONotificationTableHead sort={sort} setSort={setSort} name='USER_ID' fieldName='userUniqId' classTd={"justify-center"} />
              <ONotificationTableHead sort={sort} setSort={setSort} name='FULL_NAME' fieldName='fullName' classTd={"justify-center"} />
              <ONotificationTableHead sort={sort} setSort={setSort} name='USER_NAME' fieldName='userName' classTd={"justify-center"} />
              <ONotificationTableHead sort={sort} setSort={setSort} name='O_EMAIL_ID' fieldName='email' classTd={"justify-center"} />
              <ONotificationTableHead sort={sort} setSort={setSort} name='O_MOBILE' fieldName='mobile' classTd={"justify-center"} />
              <ONotificationTableHead sort={sort} setSort={setSort} name="TOTAL_BALANCE" fieldName="totalBalance" classTd={"justify-center"} />
              <ONotificationTableHead sort={sort} setSort={setSort} name="REQUESTED_AMOUNT" fieldName="requestedAmount" classTd={"justify-center"} />
              <ONotificationTableHead sort={sort} setSort={setSort} name="REMAINING_AMOUNT" fieldName="remainingAmount" classTd={"justify-center"} />
              <ONotificationTableHead sort={sort} setSort={setSort} name="REQUESTED_DATE" fieldName="requestedDate" classTd={"justify-center"} />
              <ONotificationTableHead sort={sort} setSort={setSort} name="O_STATUS" fieldName="status" classTd={"justify-center"} />
              <ONotificationTableHead sort={sort} setSort={setSort} name="TIME_LEFT" fieldName="timeLeft" classTd={"justify-center"} />
              <th scope="col" className="py-3 px-6 text-center">
                  {t("O_ACTION")}
                </th>
            </tr>
          </thead>
          <tbody>
            {allCommunity && allCommunity?.length > 0 &&
              allCommunity?.map((item, i) => (
                <tr key={i} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <th scope="row" className="py-4 px-6 border-r font-medium text-gray-900  dark:text-white">
                    {i + 1 + pageSize * (paginationObj?.page - 1)}
                  </th>
                  <td className="py-4 px-6 border-r text-center">{helpers?.ternaryCondition(item?.userDetails?.userUniqId, item?.userDetails?.userUniqId, "N/A")}</td>
                  <td className="py-4 px-6 border-r text-center">{helpers?.ternaryCondition(item?.userDetails?.fullName, item?.userDetails?.fullName, "N/A")}</td>
                  <td className="py-4 px-6 border-r text-center">{helpers?.ternaryCondition(item?.userDetails?.userName, item?.userDetails?.userName, "N/A")}</td>
                  <td className="py-4 px-6 border-r text-center">{helpers?.ternaryCondition(item?.userDetails?.email, item?.userDetails?.email, "N/A")}</td>
                  <td className="py-4 px-6 border-r text-center">{helpers?.ternaryCondition(item?.userDetails?.mobile, item?.userDetails?.mobile, "N/A")}</td>
                  <td className="py-4 px-6 border-r text-center">{helpers?.ternaryCondition(item?.userDetails?.totalBalance, item?.userDetails?.totalBalance, "0")}</td>
                  <td className="py-4 px-6 border-r text-center">{helpers?.ternaryCondition(item?.requestedAmount, item?.requestedAmount, "0")}</td>
                  <td className="py-4 px-6 border-r text-center">{helpers?.ternaryCondition(item?.remainingAmount, item?.remainingAmount, "0")}</td>
                  <td className="py-4 px-6 border-r text-center">{helpers.getDateAndTime(item?.createdAt)}</td>
                  <td className={`py-4 px-6 border-r text-center ${item?.status === 'accepted' ? 'text-green-500' : item?.status === 'rejected' ? 'text-red-500' : 'text-gray-600'
                    }`}>
                    {helpers?.ternaryCondition(item?.status, startCase(item?.status), "N/A")}
                  </td>
                  <td className="py-4 px-6 border-r text-center">{helpers.getDateAndTime(item?.createdAt)}</td>
                  <td className="py-4 px-6 border-r text-center"><button className="bg-red-600 text-sm px-4 flex gap-2 ml-3 mb-3 py-2 rounded-lg items-center border border-transparent text-white hover:bg-red-600 sm:w-auto w-1/2">Reject</button></td>
                </tr>
              ))}

            {isEmpty(allCommunity) && (
              <tr className="bg-white text-center border-b dark:bg-gray-800 dark:border-gray-700">
                <td className="py-4 px-6 border-r" colSpan={12}>
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
