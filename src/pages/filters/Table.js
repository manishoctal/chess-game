import React from "react";
import { isEmpty } from "lodash";
import { useTranslation } from "react-i18next";
import helper from "../../utils/helpers";
import { MdModeEditOutline } from "react-icons/md";
import { apiDelete, apiPut } from "utils/apiFetch";
import apiPath from "utils/apiPath";
import useToastContext from "hooks/useToastContext";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import OTableData from "components/reusable/OTableData";

const Table = ({
  filter,
  page,
  manager,
  user,
  getAllFilter,
  handleUserView,
}) => {
  const { t } = useTranslation();
  const notification = useToastContext();

  const handelStatusChange = async (item) => {
    try {
      const payload = {
        status: !item?.status,
      };
      const path = `${apiPath.filterStatus}/${item?._id}`;
      const result = await apiPut(path, payload);
      if (result?.status === 200) {
        notification.success(result.data.message);
        getAllFilter();
      }
    } catch (error) {
      console.log("error in get all sounds list==>>>>", error.message);
    }
  };
  const handleVideoDelete = async (item) => {
    try {
      const path = `${apiPath.filter}/${item?._id}`;
      const result = await apiDelete(path);
      if (result?.status === 200) {
        notification.success(result.data.message);
        getAllFilter();
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
                <div className="text-right">
                  <span>Duration</span>
                </div>
              </th>
              <th scope="col" className="py-3 px-6">
                <div className="text-right">
                  <span>View count</span>
                </div>
              </th>
              <th scope="col" className="py-3 px-6">
                <div className="text-right">
                  <span>Play count</span>
                </div>
              </th>
              <th scope="col" className="py-3 px-6">
                <div className="text-right">
                  <span>Like count</span>
                </div>
              </th>
              <th scope="col" className="py-3 px-6">
                <div className="text-right">
                  <span>Follower count</span>
                </div>
              </th>
              <th scope="col" className="py-3 px-6">
                <div className="text-right">
                  <span>Tag</span>
                </div>
              </th>
              {/* <th scope='col' className='py-3 px-6'>
                <div className='text-right'>
                  <span>Created at</span>
                </div>
              </th> */}
              <th scope="col" className="py-3 px-6">
                <div className="text-right">
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
            {filter?.map((item, i) => (
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
                {/* <td className='py-4 px-6 border-r'> */}
                <OTableData
                  className="py-4 px-6 border-r"
                  data={item?.displayName}
                />
                {/* {`${item?.displayName}` || 'NA'}{' '} */}
                {/* </td> */}
                <OTableData
                  className="py-4 px-6 border-r"
                  data={item?.description}
                />
                {/* <td className='py-4 px-6 border-r'>{item?.description || 'NA'}</td> */}
                {/* <td className='py-4 px-6 border-r text-right'>
                    {`${item?.duration}` || 'NA'}{' '}
                  </td> */}

                <OTableData
                  className="py-4 px-6 border-r text-right"
                  data={item?.duration}
                />
                {/* <td className='py-4 px-6 border-r text-right'>
                    {`${item?.viewCount}` || 'NA'}{' '}
                  </td> */}
                <OTableData
                  className="py-4 px-6 border-r text-right"
                  data={item?.viewCount}
                />
                {/* <td className='py-4 px-6 border-r text-right'>
                    {`${item?.playCount}` || 'NA'}{' '}
                  </td> */}
                <OTableData
                  className="py-4 px-6 border-r text-right"
                  data={item?.playCount}
                />
                {/* <td className='py-4 px-6 border-r text-right'>
                    {`${item?.likeCount}` || 'NA'}{' '}
                  </td> */}
                <OTableData
                  className="py-4 px-6 border-r"
                  data={item?.likeCount}
                />
                {/* <td className='py-4 px-6 border-r text-right'>
                    {`${item?.followerCount}` || 'NA'}{' '}
                  </td> */}
                <OTableData
                  className="py-4 px-6 border-r text-right"
                  data={item?.followerCount}
                />
                <td className="py-4 px-6 border-r text-right">
                  {item?.tag?.join(", ") || "NA"}{" "}
                </td>
                {item?.thumbnail ? (
                  <OTableData
                    className="py-4 px-6 border-r text-center"
                    type="image"
                    data={item?.thumbnail}
                  />
                ) : (
                  "NA"
                )}

                {(manager?.add || user?.role === "admin") && (
                  <td className="py-4 px-6 border-r text-center">
                    <label
                      className="inline-flex relative items-center cursor-pointer"
                      title={`${
                        item?.status === "active" ? "Active" : "Inactive"
                      }`}
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
                      {/* <MdModeEditOutline title='Edit' style={{ fontSize: '24px', cursor: 'pointer' }} /> */}
                    </div>
                  )}

                  {(manager?.delete || user?.role === "admin") && (
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
                  )}
                </td>

                {/* <td className='py-4 px-6 border-l flex justify-center'>
                    {(manager?.add || user?.role === 'admin') && (
                      <div className='' onClick={() => handleUserView(item)}>

                        <MdModeEditOutline type='Edit' style={{ fontSize: '24px', cursor: 'pointer' }} />
                      </div>)}

                    {(manager?.delete || user?.role === 'admin') && (
                      <div className='text-center flex justify-center pl-2' onClick={(e) => helper.alertFunction(`Are you sure want to delete ${item.displayName}`, item, handleVideoDelete, true)}>
                        <AiFillDelete type='Delete' style={{ fontSize: '24px', cursor: 'pointer' }} />
                      </div>)}
                  </td> */}
              </tr>
            ))}
            {isEmpty(filter) ? (
              <tr className="bg-white text-center border-b dark:bg-gray-800 dark:border-gray-700">
                <td className="py-4 px-6 border-r" colSpan={12}>
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
