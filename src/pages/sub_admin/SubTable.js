import React, { useContext, useEffect } from "react";
import { AiFillEdit, AiFillEye } from "react-icons/ai";
import { useTranslation } from "react-i18next";
import AuthContext from "context/AuthContext";
import { isEmpty, startCase } from "lodash";
import { useNavigate } from "react-router-dom";
import helpers from "../../utils/helpers";
import OSubadminTableHead from '../../components/reusable/OTableHead'
const SubTable = ({
  subAdmin,
  page,
  sort,
  setSort,
  manager,
  handelStatusChange,
  pageSize,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, updatePageName } = useContext(AuthContext);

  useEffect(() => {
    updatePageName(t("SUB_ADMIN_MANAGERS"));
  }, []);


  const getDateTable = (dateData) => {
    return <td className="py-2 px-4 border-r dark:border-[#ffffff38]">
      {dateData || 'N/A'}
    </td>
  }


  const getRoleAssigned = (e) => {
    const prmissionAssigned = e?.permission
    return prmissionAssigned?.filter(pManager => pManager.view)?.length;
  }


  return (
    <div className="p-3">
      <div className="overflow-x-auto relative rounded-lg border">
        <table className="w-full text-xs text-left text-[#A5A5A5] dark:text-gray-400 ">
          <thead className="text-xs text-gray-900 border border-[#E1E6EE] bg-[#E1E6EE] dark:bg-gray-700 dark:text-gray-400 dark:border-[#ffffff38]">
            <tr>
              <th scope="col" className="py-3 px-6">
                {t("S.NO")}
              </th>
              <OSubadminTableHead sort={sort} fieldName='adminId' setSort={setSort} name='O_ID' />
              <OSubadminTableHead name='FULL_NAME' fieldName='name' sort={sort} setSort={setSort} />
              <OSubadminTableHead name='O_EMAIL_ID' sort={sort} setSort={setSort} fieldName='email' />
             
              <OSubadminTableHead sort={sort} setSort={setSort} name='O_MOBILE' fieldName='mobile' />
              <OSubadminTableHead sort={sort} setSort={setSort} name='ADDRESS' fieldName='address' />
              <th scope="col" className="py-3 px-6 text-center">
                {t("ROLE_ASSIGNED")}
              </th>
              <OSubadminTableHead sort={sort} setSort={setSort} name='O_CREATED_AT' fieldName='createdAt' />
              <OSubadminTableHead sort={sort} name='O_UPDATED_AT' setSort={setSort} fieldName='updatedAt' />
              {(manager?.add || manager?.edit || user?.role === "admin") && (
                <OSubadminTableHead sort={sort} setSort={setSort} name='O_STATUS' fieldName='status' />
              )}
              <th scope="col" className="py-3 px-6 text-center">
                {t("O_ACTION")}
              </th>
            </tr>
          </thead>
          <tbody>
            {subAdmin?.map((item, i) => (
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

                <td className="py-2 px-4 border-r dark:border-[#ffffff38]">
                  {startCase(item?.adminId) || 'N/A'}
                </td>

                <td className="py-2 px-4 border-r dark:border-[#ffffff38]">
                  {startCase(item?.firstName + " " + item?.lastName)}
                </td>

                <td className="py-2 px-4 border-r dark:border-[#ffffff38] text-slate-900 font-bold">
                  {item?.email||'N/A'}
                </td>
              
                <td className="py-2 px-4 border-r dark:border-[#ffffff38]">
                  {item?.mobile || "N/A"}
                </td>
                <td className="py-2 px-4 border-r dark:border-[#ffffff38]">
                  {startCase(item?.address) || "N/A"}
                </td>

                <td className="py-2 px-4 border-r dark:border-[#ffffff38]  font-bold text-slate-600 text-center">
                  {getRoleAssigned(item)}
                </td>

                {getDateTable(helpers.getDateAndTime(item?.createdAt) || 'N/A')}
                {getDateTable(helpers.getDateAndTime(item?.updatedAt) || 'N/A')}
                {(manager?.add || manager?.edit || user?.role === "admin") && (
                  <td className="py-2 px-4 border-r dark:border-[#ffffff38] text-center">
                    <label
                      className="inline-flex relative items-center cursor-pointer"
                      title={`${helpers.ternaryCondition(item?.status === "active", "Active", "Inactive")
                        }`}
                    >
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={item?.status === "active"}
                        onChange={(e) =>
                          helpers.alertFunction(
                            `${t("ARE_YOU_SURE_YOU_WANT_TO")} ${helpers.ternaryCondition(e.target.checked, "active", "inactive")} '${item.name}'?`,
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
                        onClick={() =>
                          navigate("/sub-admin-manager/add", {
                            state: { item, type: "view" },
                          })
                        }
                        className="px-2 py-2 hover:text-gradientTo"
                      >
                        <a title={t("O_VIEW")}>

                          <AiFillEye className="cursor-pointer w-5 h-5 text-slate-600" />
                        </a>
                      </li>
                      {(manager?.add || user?.role === "admin") && (
                        <li
                          onClick={() =>
                            navigate("/sub-admin-manager/add", {
                              state: { item, type: "edit" },
                            })
                          }
                          className="px-2 py-2 hover:text-gradientTo"
                        >
                          <a title={t("O_EDIT")}>

                            <AiFillEdit className="cursor-pointer w-5 h-5 text-slate-600" />
                          </a>
                        </li>
                      )}
                    </ul>
                  </div>
                </td>
              </tr>
            ))}
            {isEmpty(subAdmin) ? (
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

export default SubTable;
