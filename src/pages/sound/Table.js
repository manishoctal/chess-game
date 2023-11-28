import React from "react";
import { apiDelete, apiPut } from "../../utils/apiFetch";
import dayjs from "dayjs";
import apiPath from "../../utils/apiPath";
import { isEmpty } from "lodash";
import useToastContext from "hooks/useToastContext";
import { useTranslation } from "react-i18next";
import helper from "../../utils/helpers";
import { MdModeEditOutline } from "react-icons/md";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";

const Table = ({
  sounds,
  getAllSound,
  handleUserView,
  user,
  page,
  sort,
  setSort,
  manager,
}) => {
  const { t } = useTranslation();
  const notification = useToastContext();
  const handelStatusChange = async (item) => {
    try {
      const payload = {
        status: !item?.status,
      };
      const path = `${apiPath.changeSoundStatus}/${item?._id}`;
      const result = await apiPut(path, payload);
      if (result?.status === 200) {
        notification.success(result.data.message);
        getAllSound();
      }
    } catch (error) {
      console.log("error in get all sounds list==>>>>", error.message);
    }
  };

  const handleVideoDelete = async (item) => {
    try {
      const path = `${apiPath.getSound}/${item?._id}`;
      const result = await apiDelete(path);
      if (result?.status === 200) {
        notification.success(result.data.message);
        getAllSound();
      }
      // }
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
                #
              </th>
              <th
                scope="col"
                className="py-3 px-6 cursor-pointer"
                onClick={() => {
                  if (
                    sort.sort_key === "firstName" &&
                    sort.sort_type === "asc"
                  ) {
                    setSort({
                      sort_key: "firstName",
                      sort_type: "desc",
                    });
                  } else {
                    setSort({
                      sort_key: "firstName",
                      sort_type: "asc",
                    });
                  }
                }}
              >
                <div className="flex ">
                  <span>Sound name </span>
                </div>
              </th>
              <th scope="col" className="py-3 px-6 cursor-pointer">
                <div className="flex justify-left">
                  <span>Playlist name</span>
                </div>
              </th>
              <th scope="col" className="py-3 px-6">
                <div className="">
                  <span>Artist's name</span>
                </div>
              </th>
              <th scope="col" className="py-3 px-6 cursor-pointer">
                <div className="flex justify-end">
                  <span>Added on</span>
                </div>
              </th>
              <th scope="col" className="py-3 px-6 text-right">
                <div className="text-right">
                  <span>Number of times being used</span>
                </div>
              </th>
              {(manager?.add || user?.role === "admin") && (
                <th scope="col" className="py-3 px-6 text-center">
                  Status
                </th>
              )}
              <th scope="col" className="py-3 px-6 text-center">
                Image
              </th>
              <th scope="col" className="py-3 px-6 text-center">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {sounds?.map((item, i) => (
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
                  {item?.playlistName || "NA"}
                </td>
                <td className="py-4 px-6 border-r">
                  {item?.artistName || "NA"}
                </td>
                <td className="py-4 px-6 border-r text-right">
                  {" "}
                  {dayjs(item?.createdAt).format("DD-MM-YYYY hh:mm A")}
                </td>
                <td className="py-4 px-6 border-r text-center">
                  {item?.usedNo}
                </td>
                {(manager?.add || user?.role === "admin") && (
                  <td className="py-4 px-6 border-r text-center">
                    <label
                      className="inline-flex relative items-center cursor-pointer"
                      title={`${item?.status === true ? "active" : "inactive"}`}
                    >
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={item?.status}
                        onChange={(e) =>
                          helper.alertFunction(
                            `Are you sure want to ${
                              e.target.checked ? "active" : "inactive"
                            } ${item.name}`,
                            item,
                            handelStatusChange
                          )
                        }
                      />
                      <div className="w-10 h-5 bg-gray-200 rounded-full peer peer-focus:ring-0 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-gradientTo" />
                    </label>
                  </td>
                )}
                <td className="py-4 px-6 border-r">
                  {item?.image ? (
                    <img src={item?.image} alt="image" width="80" />
                  ) : (
                    "NA"
                  )}
                </td>

                <td className="py-4 px-6 border-l flex justify-center">
                  {(manager?.add || user?.role === "admin") && (
                    <div className="" onClick={() => handleUserView(item)}>
                      {/* <MdModeEditOutline type='Edit' style={{ fontSize: '24px', cursor: 'pointer' }} /> */}
                      <AiFillEdit
                        className="text-slate-600 dark:hover:text-white"
                        title="Edit"
                        style={{ fontSize: "24px", cursor: "pointer" }}
                      />
                    </div>
                  )}
                  {/* {(manager?.delete || user?.role === 'admin') && (
                      <div className='text-center pl-2' onClick={(e) => helper.alertFunction(`Are you sure want to delete ${item.name}`, item, handleVideoDelete, true)}>
                        <AiFillDelete title='Delete' className="text-red-600" style={{ fontSize: '24px', cursor: 'pointer' }} />
                      </div>)} */}
                </td>
              </tr>
            ))}
            {isEmpty(sounds) ? (
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
