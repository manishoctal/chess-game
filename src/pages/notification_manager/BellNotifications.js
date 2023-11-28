import React, { useContext, useEffect, useState } from "react";
import { apiGet } from "../../utils/apiFetch";
import apiPath from "../../utils/apiPath";
import { isEmpty, startCase } from "lodash";
import { useTranslation } from "react-i18next";
import Pagination from "pages/Pagination";
import AuthContext from "context/AuthContext";
import dayjs from "dayjs";

const BellNotifications = () => {
  const { updatePageName } = useContext(AuthContext);
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  const [paginationObj, setPaginationObj] = useState({
    page: 1,
    pageCount: 5,
    pageRangeDisplayed: 10,
  });

  const handlePageClick = (event) => {
    const newPage = event.selected + 1;
    setPage(newPage);
  };

  const getNotifications = async () => {
    const payload = { page, pageSize };
    const result = await apiGet(apiPath.getBellNotification, payload);
    if (result?.status === 200) {
      const response = result?.data?.results;
      setUsers(response?.docs);
      setPaginationObj({
        ...paginationObj,
        page: response.page,
        pageCount: response.totalPages,
        perPageItem: response?.docs.length,
        totalItems: response.totalDocs,
      });
    }
  };

  useEffect(() => {
    getNotifications();
    updatePageName(t("O_NOTIFICATION"));
  }, [page]);

  return (
    <>
      <div className="p-3">
        <div className="overflow-x-auto relative rounded-lg border">
          <table className="w-full text-xs text-left text-[#A5A5A5] dark:text-gray-400 ">
            <thead className="text-xs text-gray-900 border border-[#E1E6EE] bg-[#E1E6EE] dark:bg-gray-700 dark:text-gray-400 dark:border-[#ffffff38]">
              <tr>
                <th scope="col" className="py-3 px-6">
                  #
                </th>
                <th scope="col" className="py-3 px-6">
                  <div className="flex items-center">{t("O_TITLE")}</div>
                </th>
                <th scope="col" className="py-3 px-6">
                  <div className="flex items-center">{t("O_MESSAGE")}</div>
                </th>
                <th scope="col" className="py-3 px-6">
                  <div className="flex items-center">{t("CREATED_DATE")}</div>
                </th>
              </tr>
            </thead>
            <tbody>
              {users &&
                users?.map((item, i) => (
                  <tr
                    key={i}
                    className="even:bg-gray-50 odd:bg-white bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                  >
                    <th
                      scope="row"
                      className="py-2 px-4 border-r dark:border-[#ffffff38] font-medium text-gray-900  dark:text-white"
                    >
                      {i + 1 + 10 * (paginationObj?.page - 1)}
                    </th>
                    <td className="py-2 px-4 border-r dark:border-[#ffffff38]">
                      {startCase(item?.title)}
                    </td>
                    <td className="py-2 px-4 border-r dark:border-[#ffffff38]">
                      {item?.description}
                    </td>
                    <td className="py-2 px-4 border-r dark:border-[#ffffff38]">
                      {dayjs(item?.createdAt).format("DD-MM-YYYY hh:mm A")}{" "}
                    </td>
                  </tr>
                ))}
              {isEmpty(users) && (
                <tr className="bg-white text-center border-b dark:bg-gray-800 dark:border-gray-700">
                  <td
                    className="py-2 px-4 border-r dark:border-[#ffffff38]"
                    colSpan={11}
                  >
                    {t("O_NO_RECORD_FOUND")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {paginationObj?.totalItems !== 0 && (
        <Pagination
          handlePageClick={handlePageClick}
          options={paginationObj}
          page={page}
        />
      )}
    </>
  );
};

export default BellNotifications;
