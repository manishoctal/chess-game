import React, { useContext } from "react";
import { apiPut, apiDelete } from "../../utils/apiFetch";
import apiPath from "../../utils/apiPath";
import { isEmpty, startCase } from "lodash";
import { AiFillEdit, AiFillDelete, AiFillEye } from "react-icons/ai";
import AuthContext from "context/AuthContext";
import { useTranslation } from "react-i18next";
import useToastContext from "hooks/useToastContext";
import helpers from "../../utils/helpers";
import { BsArrowUpShort } from "react-icons/bs";

const Table = ({
  FAQs,
  getAllFAQ,
  handelEdit,
  paginationObj,
  manager,
  setModalData,
  pageSize,
  sort, setSort
}) => {
  const { t } = useTranslation();
  const { user } = useContext(AuthContext);
  const notification = useToastContext();

  // change status of faq function start
  const handelStatusChange = async (item) => {
    try {
      const payload = {
        status: item?.status === "inactive" ? "active" : "inactive",
        type: "faq",
      };
      const path = `${apiPath.changeStatus}/${item?._id}`;
      const result = await apiPut(path, payload);
      if (result?.status === 200) {
        notification.success(result?.data?.message);
        getAllFAQ();
      }
    } catch (error) {
      console.error("error in get all faqs list==>>>>", error.message);
    }
  };
  // change status of faq function end

  // delete faq function start

  const handelDelete = async (item) => {
    try {
      const path = apiPath.getFAQs + "/" + item?._id;
      const result = await apiDelete(path);
      if (result?.status === 200) {
        notification.success(result?.data.message);
        getAllFAQ({ deletePage: 1 });
      }
    } catch (error) {
      console.error("error in get all FAQs list==>>>>", error.message);
    }
  };
  // delete faq function end

  return (
    <div className="p-3">
      <div className="overflow-x-auto relative rounded-lg border">
        <table className="w-full text-xs text-left text-[#A5A5A5] dark:text-gray-400 ">
          <thead className="text-xs text-gray-900 border border-[#E1E6EE]  bg-[#E1E6EE] dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="py-3 px-6">
                {t("S.NO")}
              </th>
              <th
                scope="col"
                className="py-3 px-6 cursor-pointer"
                onClick={() => {
                  if (sort.sortBy === "title" && sort.sortType === "asc") {
                    setSort({
                      sortBy: "title",
                      sortType: "desc",
                    });
                  } else {
                    setSort({
                      sortBy: "title",
                      sortType: "asc",
                    });
                  }
                }}
              >
                <div className="flex">
                  <span>{t("FAQS_TITLE")}</span>
                  <span>
                    {sort.sortBy === "title" && sort.sortType === "asc" && (
                      <BsArrowUpShort className="w-4 h-4" />
                    )}
                    {sort.sortBy === "title" && sort.sortType === "desc" && (
                      <BsArrowUpShort className="w-4 h-4 rotate-180" />
                    )}
                  </span>
                </div>
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
                <div className="flex justify-center">
                  <span>{t("O_CREATED_AT")}</span>
                  <span>
                    {sort.sortBy === "createdAt" && sort.sortType === "asc" && (
                      <BsArrowUpShort className="w-4 h-4" />
                    )}
                    {sort.sortBy === "createdAt" && sort.sortType === "desc" && (
                      <BsArrowUpShort className="w-4 h-4 rotate-180" />
                    )}
                  </span>
                </div>
              </th>


              <th
                scope="col"
                className="py-3 px-6 cursor-pointer"
                onClick={() => {
                  if (sort.sortBy === "updatedAt" && sort.sortType === "asc") {
                    setSort({
                      sortBy: "updatedAt",
                      sortType: "desc",
                    });
                  } else {
                    setSort({
                      sortBy: "updatedAt",
                      sortType: "asc",
                    });
                  }
                }}
              >
                <div className="flex justify-center">
                  <span>{t("O_UPDATED_AT")}</span>
                  <span>
                    {sort.sortBy === "updatedAt" && sort.sortType === "asc" && (
                      <BsArrowUpShort className="w-4 h-4" />
                    )}
                    {sort.sortBy === "updatedAt" && sort.sortType === "desc" && (
                      <BsArrowUpShort className="w-4 h-4 rotate-180" />
                    )}
                  </span>
                </div>
              </th>



              {(manager?.add || user?.role === "admin") && (
                <th
                  scope="col"
                  className="py-3 px-6 cursor-pointer"
                  onClick={() => {
                    if (sort.sortBy === "status" && sort.sortType === "asc") {
                      setSort({
                        sortBy: "status",
                        sortType: "desc",
                      });
                    } else {
                      setSort({
                        sortBy: "status",
                        sortType: "asc",
                      });
                    }
                  }}
                >
                  <div className="flex justify-center">
                    <span>{t("O_STATUS")}</span>
                    <span>
                      {sort.sortBy === "status" && sort.sortType === "asc" && (
                        <BsArrowUpShort className="w-4 h-4" />
                      )}
                      {sort.sortBy === "status" && sort.sortType === "desc" && (
                        <BsArrowUpShort className="w-4 h-4 rotate-180" />
                      )}
                    </span>
                  </div>
                </th>
              )}
              <th scope="col" className="py-3 px-6 text-center">
                {t("O_ACTION")}
              </th>
            </tr>
          </thead>
          <tbody>
            {FAQs?.map((item, i) => (
              <tr
                key={i}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
              >
                <th
                  scope="row"
                  className="py-2 px-4 border-r dark:border-[#ffffff38] font-medium text-gray-900  dark:text-white"
                >
                  {i + 1 + pageSize * (paginationObj?.page - 1)}
                </th>
                <td className="py-2 px-4 border-r dark:border-[#ffffff38]">
                  {startCase(item?.title) || "N/A"}
                </td>
                <td className="py-2 px-4 border-r dark:border-[#ffffff38] text-center">
                  {helpers.getDateAndTime(item?.createdAt)}
                </td>
                <td className="py-2 px-4 border-r dark:border-[#ffffff38] text-center">
                  {helpers.getDateAndTime(item?.updatedAt)}
                </td>
                {(manager?.add || user?.role === "admin") && (
                  <td className="py-2 px-4 border-r dark:border-[#ffffff38] text-center">
                    <label
                      className="inline-flex relative items-center cursor-pointer"
                      title={`${item?.status === "active" ? "Active" : "Inactive"
                        }`}
                    >
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={item?.status === "active"}
                        onChange={(e) =>
                          helpers.alertFunction(
                            `Are you sure want to ${e.target.checked ? "active" : "inactive"
                            } '${item.title}'?`,
                            item,
                            handelStatusChange
                          )
                        }
                      />
                      <div className="w-10 h-5 bg-gray-200 rounded-full peer peer-focus:ring-0 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-gradientTo" />
                    </label>
                  </td>
                )}
                <td className="py-2 px-4 border-l">
                  <div className="">
                    <ul className="flex justify-center">
                      {(manager?.view || user?.role === "admin") && (
                        <li
                          onClick={() => handelEdit(item, "view")}
                          className="px-2 py-2  hover:text-gradientTo"
                        >
                          <button title={t("FAQS_EDIT_FAQS")}>
                            {" "}
                            <AiFillEye className="w-5 h-5 text-slate-600" />
                          </button>
                        </li>
                      )}
                      {(manager?.add || user?.role === "admin") && (
                        <li
                          onClick={() => handelEdit(item, "edit")}
                          className="px-2 py-2  hover:text-gradientTo"
                        >
                          <button title={t("FAQS_EDIT_FAQS")}>
                            {" "}
                            <AiFillEdit className="w-5 h-5 text-slate-600" />
                          </button>
                        </li>
                      )}

                      {(manager?.delete || user?.role === "admin") && (
                        <li
                          onClick={(e) =>
                            helpers.alertFunction(
                              `Are you sure want to delete '${item.title}'?`,
                              item,
                              handelDelete,
                              true
                            )
                          }
                          className="px-2 py-2 hover:bg-white hover:text-gradientTo"
                        >
                          <button title={t("DELETE_FAQS")}>
                          
                            <AiFillDelete className="w-5 h-5 text-red-600" />{" "}
                          </button>
                        </li>
                      )}
                    </ul>
                  </div>
                </td>
              </tr>
            ))}
            {isEmpty(FAQs) && (
              <tr className="bg-white text-center border-b dark:bg-gray-800 dark:border-gray-700">
                <td
                  className="py-2 px-4 border-r dark:border-[#ffffff38]"
                  colSpan={6}
                >
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

export default Table;
