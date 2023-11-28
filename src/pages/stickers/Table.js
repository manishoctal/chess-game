import React from "react";
import { isEmpty } from "lodash";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import helper from "../../utils/helpers";
import { MdModeEditOutline, MdDelete } from "react-icons/md";
import useToastContext from "hooks/useToastContext";
import apiPath from "utils/apiPath";
import { apiDelete, apiPut } from "utils/apiFetch";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import { BsArrowUpShort } from "react-icons/bs";

const Table = ({
  stickers,
  page,
  manager,
  user,
  sort,
  setSort,
  getAllStickers,
  handleUserView,
}) => {
  const { t } = useTranslation();
  const notification = useToastContext();
  const handelStatusChange = async (item) => {
    try {
      const payload = {
        status: !item?.status,
      };
      const path = `${apiPath.stickerStatus}/${item?._id}`;
      const result = await apiPut(path, payload);
      if (result?.status === 200) {
        notification.success(result.data.message);
        getAllStickers();
      }
      // }
    } catch (error) {
      console.log("error in get all sounds list==>>>>", error.message);
    }
  };
  // const handelDelete = async (item) => {
  //   try {
  //     const path = `${apiPath.stickers}/${item?._id}`;
  //     const result = await apiDelete(path);
  //     if (result?.status === 200) {
  //       notification.success(result.data.message);
  //       getAllStickers();
  //     }
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

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
                  <span>Stickers name</span>
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
                  <span>Display name</span>
                </div>
              </th>
              <th
                scope="col"
                className="py-3 px-6 cursor-pointer "
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
                <div className="flex justify-start">
                  <span>{t("O_CREATED_AT")} </span>
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
              {/* <th scope='col' className='py-3 px-6'>
                <div className='text-right'>
                  <span>Widget content type</span>
                </div>
              </th> */}
              {(manager?.add || user?.role === "admin") && (
                <th scope="col" className="py-3 px-6">
                  <div className="text-center">
                    <span>Status</span>
                  </div>
                </th>
              )}
              <th scope="col" className="py-3 px-6">
                <div className="text-center">
                  <span>Action</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {stickers?.map((item, i) => (
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
                  {`${item?.name}` || "NA"}{" "}
                </td>
                <td className="py-4 px-6 border-r">
                  {item?.displayName || "NA"}
                </td>

                <td className="py-4 px-6 border-r">
                  {dayjs(item?.createdAt).format("DD-MM-YYYY hh:mm A")}
                </td>
                <td className="py-4 px-6 border-r flex justify-center">
                  {item?.sticker ? (
                    <img src={item?.sticker} alt="image" width="80" />
                  ) : (
                    "NA"
                  )}
                </td>
                {(manager?.add || user?.role === "admin") && (
                  <td className="py-4 px-6 border-r text-center">
                    <label
                      className="inline-flex relative  cursor-pointer"
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
                            } ${item.name} ?`,
                            item,
                            handelStatusChange
                          )
                        }
                      />
                      <div className="w-10 h-5 bg-gray-200 rounded-full peer peer-focus:ring-0 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-gradientTo" />
                    </label>
                  </td>
                )}

                <td className="py-4 px-6 border-l text-center">
                  <div className="flex justify-center">
                    {(manager?.add || user?.role === "admin") && (
                      <div className="" onClick={() => handleUserView(item)}>
                        <AiFillEdit
                          className="text-slate-600 dark:hover:text-white"
                          title="Edit"
                          style={{ fontSize: "24px", cursor: "pointer" }}
                        />
                      </div>
                    )}

                    {/* {(manager?.delete || user?.role === "admin") && (
                      <div
                        className="text-center pl-2"
                        onClick={(e) =>
                          helper.alertFunction(
                            `Are you sure want to delete ${item?.name} ? `,
                            item,
                            handelDelete,
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
                  </div>
                </td>
              </tr>
            ))}
            {isEmpty(stickers) ? (
              <tr className="bg-white text-center border-b dark:bg-gray-800 dark:border-gray-700">
                <td className="py-4 px-6 border-r" colSpan={9}>
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
