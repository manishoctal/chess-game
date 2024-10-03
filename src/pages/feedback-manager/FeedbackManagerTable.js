import { isEmpty } from "lodash";
import { useTranslation } from "react-i18next";
import helpers from "utils/helpers";
import ONotificationTableHead from "../../components/reusable/OTableHead";
import { NavLink } from "react-router-dom";
import { Rating } from "@mui/material";

const FeedbackManagerTable = ({ allCommunity, paginationObj, sort, setSort, pageSize, manager, handelStatusChange }) => {
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
              <ONotificationTableHead sort={sort} setSort={setSort} name="Username" fieldName="username" classTd={"justify-center"} />
              <ONotificationTableHead sort={sort} setSort={setSort} name="Message" fieldName="message" classTd={"justify-center"} />
              <ONotificationTableHead sort={sort} setSort={setSort} name="Rating" fieldName="rating" classTd={"justify-center"} />
              <ONotificationTableHead sort={sort} setSort={setSort} name="Created At" fieldName="createdAt" classTd={"justify-center"} />
            </tr>
          </thead>
          <tbody>
            {allCommunity && allCommunity?.length > 0  &&
              allCommunity?.map((item, i) => (
                <tr key={i} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <th scope="row" className="py-4 px-6 border-r font-medium text-gray-900  dark:text-white">
                    {i + 1 + pageSize * (paginationObj?.page - 1)}
                  </th>
                  <td className="py-4 px-6 border-r text-center"><NavLink state={item} to={`/users/view/${item?._id}`}>{helpers?.ternaryCondition(item?.userDetails?.userName,item?.userDetails?.userName,"N/A")}</NavLink></td>
                  <td className="py-4 px-6 border-r text-center">{helpers?.ternaryCondition(item?.message,item?.message,"N/A")}</td>
                  <td className="py-4 px-6 border-r text-center">
                  {helpers?.ternaryCondition(item?.rating,<Rating name="half-rating-read" value={item?.rating || 0} readOnly precision={0.5} />,"N/A" )}
                  </td>
                  <td className="py-4 px-6 border-r text-center">{helpers.getDateAndTime(item?.createdAt)}</td>
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

export default FeedbackManagerTable;
