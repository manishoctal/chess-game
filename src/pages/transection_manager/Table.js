import React from "react";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import { isEmpty } from "lodash";

const Table = ({ artistVerification, page }) => {
  const { t } = useTranslation();

  return (
    <div className="p-3">
      <div className="overflow-x-auto relative rounded-lg border">
        <table className="w-full text-xs text-left text-[#A5A5A5] dark:text-gray-400 ">
          <thead className="text-xs text-gray-900 border border-[#E1E6EE] bg-[#E1E6EE] dark:bg-gray-700 dark:text-gray-400 dark:border-[#ffffff38]">
            <tr>
              <th scope="col" className="py-3 px-6">
                #
              </th>
              <th scope="col" className="py-3 px-6">
                Transaction Id
              </th>
              <th scope="col" className="py-3 px-6">
                User name (from)
              </th>
              <th scope="col" className="py-3 px-6">
                User name (to)
              </th>
              <th scope="col" className="py-3 px-6">
                Transaction amount
              </th>
              <th scope="col" className="py-3 px-6">
                Transaction type
              </th>
              <th scope="col" className="py-3 px-6">
                Payment mode
              </th>
              <th scope="col" className="py-3 px-6 text-center">
                Created at
              </th>
            </tr>
          </thead>
          <tbody>
            {artistVerification?.map((item, i) => (
              <tr
                key={i}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
              >
                <th
                  scope="row"
                  className="py-2 px-4 border-r dark:border-[#ffffff38] font-medium text-gray-900  dark:text-white"
                >
                  {i + 1 + 10 * (page - 1)}
                </th>
                <td className="py-2 px-4 border-r dark:border-[#ffffff38]">
                  {item?.transactionId || "N/A"}
                </td>
                <td className="py-2 px-4 border-r dark:border-[#ffffff38]">{`${item?.userTransferor?.firstName} ${item?.userTransferor?.lastName}`}</td>
                <td className="py-2 px-4 border-r dark:border-[#ffffff38]">{`${item?.userTransferee?.firstName} ${item?.userTransferee?.lastName}`}</td>
                <td className="py-2 px-4 border-r dark:border-[#ffffff38]">
                  {item?.transactionAmount || "N/A"}
                </td>
                <td className="py-2 px-4 border-r dark:border-[#ffffff38]">
                  {item?.transactionType || "N/A"}
                </td>
                <td className="py-2 px-4 border-r dark:border-[#ffffff38] ">
                  {item?.modeOfPayment || "N/A"}
                </td>
                <td className="py-2 px-4 border-r dark:border-[#ffffff38] text-center">
                  {dayjs(item?.createdAt).format("DD-MM-YYYY hh:mm A")}
                </td>
              </tr>
            ))}
            {isEmpty(artistVerification) ? (
              <tr className="bg-white border-b w-full text-center dark:bg-gray-800 dark:border-gray-700">
                <td className="py-4 px-6" colSpan={12}>
                  {t("O_NO_RECORD_FOUND")}
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
