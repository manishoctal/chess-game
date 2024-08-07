import { isEmpty, startCase } from "lodash";
import { useTranslation } from "react-i18next";
import helpers from "utils/helpers";
import ONotificationTableHead from "../../components/reusable/OTableHead";
const NotificationTable = ({ notifications, paginationObj, sort, setSort, pageSize }) => {
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
              <ONotificationTableHead sort={sort} setSort={setSort} name="NOTIFICATION_TITLE" fieldName="title" classTd={"justify-center"} />
              <ONotificationTableHead sort={sort} setSort={setSort} name="CONTENT" fieldName="description" classTd={"justify-center"} />
              <ONotificationTableHead sort={sort} setSort={setSort} name="USERS" fieldName="userData.firstName" classTd={"justify-center"} />
              <ONotificationTableHead sort={sort} setSort={setSort} name="SEND_DATE" fieldName="createdAt" classTd={"justify-center"} />
            </tr>
          </thead>
          <tbody>
            {notifications &&
              notifications?.map((item, i) => (
                <tr key={i} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <th scope="row" className="py-4 px-6 border-r font-medium text-gray-900  dark:text-white">
                    {i + 1 + pageSize * (paginationObj?.page - 1)}
                  </th>
                  <td className="py-4 px-6 border-r text-center">{startCase(item?.title) || "N/A"}</td>

                  <td className="py-4 px-6 border-r text-center">{startCase(item?.description) || "N/A"}</td>
                  <td className="py-4 px-6 border-r w-60 text-center">
                    {helpers.ternaryCondition(item?.sendTo == "all", "All Users", startCase(item?.sendTo)) || "N/A"}{" "}
                    {item?.sendTo !== "all" && !isEmpty(item?.userData) && <span className="font-bold text-slate-600">({startCase(item?.userData?.firstName || "N/A") + " " + startCase(item?.userData?.lastName) || ""})</span>}
                  </td>
                  <td className="py-4 px-6 border-r text-center">{helpers.getDateAndTime(item?.createdAt)}</td>
                </tr>
              ))}
            {isEmpty(notifications) && (
              <tr className="bg-white text-center border-b dark:bg-gray-800 dark:border-gray-700">
                <td className="py-4 px-6 border-r" colSpan={5}>
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

export default NotificationTable;
