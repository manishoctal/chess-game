import React, { useContext, useEffect } from "react";
import { AiFillDelete, AiFillEdit, AiFillEye } from "react-icons/ai";
import { useTranslation } from "react-i18next";
import AuthContext from "context/AuthContext";
import { isEmpty, startCase } from "lodash";
import helpers from "../../utils/helpers";
import OImage from "components/reusable/OImage";
import OBannerTableHead from '../../components/reusable/OTableHead'

const BannerTable = ({
  allBanner,
  handelDelete,
  page,
  sort,
  setSort,
  manager,
  handelStatusChange,
  pageSize,
  editViewBanner
}) => {
  const { t } = useTranslation();
  const { user, updatePageName } = useContext(AuthContext);
  useEffect(() => {
    updatePageName(t("SUB_ADMIN_MANAGERS"));
  }, []);


  return (
    <div className="p-3">
      <div className="overflow-x-auto relative rounded-lg border">
        <table className="w-full text-xs text-left text-[#A5A5A5] dark:text-gray-400 ">
          <thead className="text-xs text-gray-900 border border-[#E1E6EE] bg-[#E1E6EE] dark:bg-gray-700 dark:text-gray-400 dark:border-[#ffffff38]">
            <tr>
              <th scope="col" className="py-3 px-6">
                {t("S.NO")}
              </th>

              <OBannerTableHead sort={sort} setSort={setSort} name='BANNER_ID' fieldName='bannerId' classTd={'justify-center'}/>
           
              <th scope="col" className="py-3 px-6 flex justify-center">
                {t("BANNER_IMAGE")}
              </th>
              <OBannerTableHead sort={sort} setSort={setSort} name='O_CREATED_AT' fieldName='createdAt' classTd={'justify-center'}/>

              <OBannerTableHead sort={sort} setSort={setSort} name='O_UPDATED_AT' fieldName='updatedAt' classTd={'justify-center'}/>

              {(manager?.add || manager?.edit || user?.role === "admin") && (
                <th scope="col" className="py-3 px-6 text-center">
                  {t("O_STATUS")}
                </th>
              )}
              <th scope="col" className="py-3 px-6 text-center">
                {t("O_ACTION")}
              </th>
            </tr>
          </thead>
          <tbody>
            {allBanner?.map((item, i) => (
              <tr
                key={i}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
              >
                <th
                  scope="row"
                  className="py-2 px-4 border-r dark:border-[#ffffff38] font-medium text-gray-900  dark:text-white"
                >
                  {i + 1 + pageSize * (page - 1)}
                </th>

                <td className="py-2 px-4 border-r dark:border-[#ffffff38] text-center">
                  {startCase(item?.bannerId) || 'N/A'}
                </td>

                <td className="py-2 px-4 border-r dark:border-[#ffffff38]  flex justify-center">
                  <ul>
                    <li onClick={() => { editViewBanner('view', item) }} style={{cursor:'pointer'}}>
                      <OImage
                        src={
                          item?.image
                            ? item?.image
                            : null
                        }
                        fallbackUrl='/images/user.png'
                        className='w-14 h-14'
                        alt=''
                        style={{ borderRadius: '50%' }}
                      />
                    </li>
                  </ul>
                </td>
                <td className="py-2 px-4 border-r dark:border-[#ffffff38] text-center">
                  {helpers.getDateAndTime(item?.createdAt)}
                </td>
                <td className="py-2 px-4 border-r dark:border-[#ffffff38] text-center">
                  {helpers.getDateAndTime(item?.updatedAt)}
                </td>
                {(manager?.add || manager?.edit || user?.role === "admin") && (
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
                            `${t("ARE_YOU_SURE_YOU_WANT_TO")} ${e.target.checked ? "active" : "inactive"
                            } banner ID '${item?.bannerId}'?`,
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
                      <li
                        onClick={() => { editViewBanner('view', item) }}
                        className="px-2 py-2 hover:text-gradientTo"
                      >
                        <a title={t("O_VIEW")}>

                          <AiFillEye className="cursor-pointer w-5 h-5 text-slate-600" />
                        </a>
                      </li>
                      {(manager?.add || user?.role === "admin") && (
                        <li
                          onClick={() => { editViewBanner('edit', item) }}
                          className="px-2 py-2 hover:text-gradientTo"
                        >
                          <a title={t("O_EDIT")}>

                            <AiFillEdit className="cursor-pointer w-5 h-5 text-slate-600" />
                          </a>
                        </li>
                      )}


                      {(manager?.add || user?.role === "admin") && (
                        <li
                          onClick={(e) =>
                            helpers.alertFunction(
                              `${t("ARE_YOU_SURE_YOU_WANT_TO")} delete banner ID"
                             '${item?.bannerId}'?`,
                              item,
                              handelDelete
                            )
                          }

                          className="px-2 py-2 hover:text-gradientTo"
                        >
                          <a title={t("O_DELETE")}>

                            <AiFillDelete className="cursor-pointer w-5 h-5 text-red-600" />
                          </a>
                        </li>
                      )}

                    </ul>
                  </div>
                </td>
              </tr>
            ))}
            {isEmpty(allBanner) ? (
              <tr className="bg-white border-b w-full text-center dark:bg-gray-800 dark:border-gray-700">
                <td className="py-4 px-6" colSpan={9}>
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

export default BannerTable;
