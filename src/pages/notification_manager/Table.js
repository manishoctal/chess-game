import React from "react";
import { isEmpty, startCase } from "lodash";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import { BsArrowUpShort } from "react-icons/bs";

const Table = ({ allNotification, page, sort, setSort }) => {
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
                {t("TITLE")}
              </th>
              <th scope="col" className="py-3 px-6">
                {t("OFFERS_DESCRIPTION")}
              </th>
              <th scope="col" className="py-3 px-6">
                {t("SEND_TO")}
              </th>
              <th
                scope="col"
                className="py-3 px-6 cursor-pointer"
                onClick={() => {
                  if (sort.sortBy === "createdAt" && sort.sortType === "asc") {
                    setSort({
                      sortBy: "createdAt",
                      sortType: "desc",
                    });
                  } else {
                    setSort({
                      sortBy: "createdAt",
                      sortType: "asc",
                    });
                  }
                }}
              >
                <div className="flex">
                  <span>{t("CREATED_DATE")}</span>
                  <span>
                    {sort.sortBy === "createdAt" && sort.sortType === "asc" && (
                      <BsArrowUpShort className="w-4 h-4" />
                    )}
                    {sort.sortBy === "createdAt" &&
                      sort.sortType === "desc" && (
                        <BsArrowUpShort className="w-4 h-4 rotate-180" />
                      )}
                  </span>
                </div>
              </th>
              {/* <th scope='col' className='py-3 px-6'>
                {t('O_ACTION')}
              </th> */}
            </tr>
          </thead>
          <tbody>
            {allNotification?.map((item, i) => (
              <tr
                key={i}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
              >
                <th
                  scope="row"
                  className="py-3 px-6 border-r dark:border-[#ffffff38] font-medium text-gray-900  dark:text-white"
                >
                  {i + 1 + 10 * (page - 1)}
                </th>
                <td className="py-3 px-6 border-r dark:border-[#ffffff38]">
                  {item?.title}{" "}
                </td>
                <td className="py-3 px-6 border-r dark:border-[#ffffff38]">
                  {item?.description}
                </td>
                <td className="py-3 px-6 border-r dark:border-[#ffffff38]">
                  {startCase(item?.sendTo)}
                </td>
                <td className="py-3 px-6 border-r dark:border-[#ffffff38]">
                  {dayjs(item?.createdAt).format("DD-MM-YYYY hh:mm A")}{" "}
                </td>
                {/* <th scope='col' className='py-3 px-6'>
                    <AiFillEye />
                  </th> */}
              </tr>
            ))}
            {isEmpty(allNotification) ? (
              <tr className="bg-white text-center border-b dark:bg-gray-800 dark:border-gray-700">
                <td
                  className="py-2 px-4 border-r dark:border-[#ffffff38]"
                  colSpan={6}
                >
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
