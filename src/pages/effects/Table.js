import React from "react";
import { isEmpty } from "lodash";
import { useTranslation } from "react-i18next";
import helper from "../../utils/helpers";
import { Link } from "react-router-dom";
import { MdModeEditOutline } from "react-icons/md";
import apiPath from "utils/apiPath";
import { apiDelete, apiPut } from "utils/apiFetch";
import useToastContext from "hooks/useToastContext";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import OTableData from "components/reusable/OTableData";
import { BsArrowUpShort } from "react-icons/bs";

const Table = ({
  effect,
  page,
  handleUserView,
  getAllEffect,
  manager,
  sort,
  setSort,
  user,
}) => {
  const { t } = useTranslation();
  const notification = useToastContext();
  // const handleVideoDelete = async (item) => {
  //   try {
  //     const path = `${apiPath.effects}/${item?._id}`;
  //     const result = await apiDelete(path);
  //     if (result?.status === 200) {
  //       notification.success(result.data.message);
  //       getAllEffect();
  //     }
  //     // }
  //   } catch (error) {
  //     console.log("error in get all sounds list==>>>>", error.message);
  //   }
  // };
  const handelStatusChange = async (item) => {
    try {
      const payload = {
        status: !item?.status,
      };
      const path = `${apiPath.effectStatus}/${item?._id}`;
      const result = await apiPut(path, payload);
      if (result?.status === 200) {
        notification.success(result.data.message);
        getAllEffect();
      }
    } catch (error) {
      console.log("error in get all sounds list==>>>>", error.message);
    }
  };

  return (
    <div className="p-3">
      <div className="overflow-x-auto relative rounded-lg border">
        <table className="w-full text-xs text-left text-[#A5A5A5] dark:text-gray-400 ">
          <thead className="text-xs text-gray-900 border border-[#E1E6EE] bg-[#E1E6EE] dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="py-3 px-6">
                {t("S.NO")}
              </th>
              <th scope="col" className="py-3 px-6 cursor-pointer">
                <div className="flex justify-left">
                  <span>Display name</span>
                  {/* <span>
                    {sort.sort_key === 'email' && sort.sort_type === 'asc' && (
                      <BsArrowUpShort className='w-4 h-4' />
                    )}
                    {sort.sort_key === 'email' && sort.sort_type === 'desc' && (
                      <BsArrowUpShort className='w-4 h-4 rotate-180' />
                    )}
                  </span> */}
                </div>
              </th>
              <th scope="col" className="py-3 px-6">
                <div>
                  <span>Description</span>
                </div>
              </th>
              <th scope="col" className="py-3 px-6">
                <div className="text-center">
                  <span>Duration</span>
                </div>
              </th>

              <th scope="col" className="py-3 px-6">
                <div className="text-center">
                  <span>Widget type</span>
                </div>
              </th>

              <th scope="col" className="py-3 px-6">
                <div className="text-center">
                  <span>Widget name</span>
                </div>
              </th>
              <th
                scope="col"
                className="py-3 px-6 cursor-pointer"
                onClick={() => {
                  if (
                    sort.sort_key === "createdAt" &&
                    sort.sort_type === "asc"
                  ) {
                    setSort({
                      sort_key: "createdAt",
                      sort_type: "desc",
                    });
                  } else {
                    setSort({
                      sort_key: "createdAt",
                      sort_type: "asc",
                    });
                  }
                }}
              >
                <div className="flex justify-center">
                  <span>{t("O_CREATED_AT")}</span>
                  <span>
                    {sort.sort_key === "createdAt" &&
                      sort.sort_type === "asc" && (
                        <BsArrowUpShort className="w-4 h-4" />
                      )}
                    {sort.sort_key === "createdAt" &&
                      sort.sort_type === "desc" && (
                        <BsArrowUpShort className="w-4 h-4 rotate-180" />
                      )}
                  </span>
                </div>
              </th>
              <th scope="col" className="py-3 px-6">
                <div className="text-center">
                  <span>Thumbnail</span>
                </div>
              </th>
              {(manager?.add || user?.role === "admin") && (
                <th scope="col" className="py-3 px-6">
                  <div className="text-right">
                    <span>Status</span>
                  </div>
                </th>
              )}
              {/* <th scope='col' className='py-3 px-6'>
                <div className='text-right'>
                  <span>Widget content type</span>
                </div>
              </th> */}
              <th scope="col" className="py-3 px-6">
                <div className="text-center">
                  <span>Action</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {effect?.map((item, i) => (
              <tr
                key={i}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
              >
                <th
                  scope="row"
                  className="py-4 px-6 border-r font-medium text-gray-900  dark:text-white"
                >
                  {i + 1 + 10 * (page - 1)}
                </th>
                <td className="py-4 px-6 border-r">
                  {`${item?.displayName}` || "NA"}{" "}
                </td>
                <td className="py-4 px-6 border-r">
                  {item?.description || "NA"}
                </td>
                <OTableData
                  className="py-4 px-6 border-r text-center"
                  data={item?.duration}
                />

                <OTableData
                  className="py-4 px-6 border-r text-center"
                  data={item?.contentType}
                />
                <OTableData
                  className="py-4 px-6 border-r text-center"
                  data={item?.widget?.name}
                />
                <OTableData
                  className="py-4 px-6 border-r text-center"
                  data={item?.createdAt}
                  type="date"
                />
                <OTableData
                  className="py-4 px-6 border-r text-center"
                  data={item?.thumbnail}
                  type="image"
                />

                {(manager?.add || user?.role === "admin") && (
                  <td className="py-4 px-6 border-r text-center">
                    <label
                      className="inline-flex relative items-center cursor-pointer"
                      title={`${item?.status === true ? true : false}`}
                    >
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={item?.status}
                        onChange={(e) =>
                          helper.alertFunction(
                            `Are you sure want to ${
                              e.target.checked ? "active" : "inactive"
                            } ${item.displayName} ?`,
                            item,
                            handelStatusChange
                          )
                        }
                      />
                      <div className="w-10 h-5 bg-gray-200 rounded-full peer peer-focus:ring-0 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-gradientTo" />
                    </label>
                  </td>
                )}
                <td className="py-4 px-6 border-l flex justify-center">
                  {(manager?.add || user?.role === "admin") && (
                    <div className="" onClick={() => handleUserView(item)}>
                      <AiFillEdit
                        className="text-slate-600 dark:hover:text-white"
                        title="Edit"
                        style={{ fontSize: "24px", cursor: "pointer" }}
                      />
                      {/* <MdModeEditOutline  /> */}
                    </div>
                  )}

                  {/* {(manager?.delete || user?.role === "admin") && (
                    <div
                      className="text-center pl-2"
                      onClick={(e) =>
                        helper.alertFunction(
                          `Are you sure want to delete ${item.displayName}`,
                          item,
                          handleVideoDelete,
                          true
                        )
                      }
                    >
                      <AiFillDelete
                        title="Delete"
                        className="text-red-600"
                        style={{ fontSize: "24px", cursor: "pointer" }}
                      />
                    </div>
                  )} */}
                </td>
              </tr>
            ))}
            {isEmpty(effect) ? (
              <tr className="bg-white text-center border-b dark:bg-gray-800 dark:border-gray-700">
                <td className="py-4 px-6 border-r" colSpan={14}>
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
