import React, { useContext, useEffect } from "react";
import { AiFillEdit } from "react-icons/ai";
import { useTranslation } from "react-i18next";
import AuthContext from "context/AuthContext";
import { isEmpty } from "lodash";
import { useNavigate } from "react-router-dom";
import helpers from "../../utils/helpers";
import OSubadminTableHead from "../../components/reusable/OTableHead";
const SubTable = ({ subAdmin, page, sort, setSort, manager, handelStatusChange, pageSize }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, updatePageName } = useContext(AuthContext);

  useEffect(() => {
    updatePageName(t("SUB_ADMIN_MANAGERS"));
  }, []);

  const getDateTable = (dateData) => {
    return <td className="py-2 px-4 border-r dark:border-[#ffffff38] text-center">{dateData || "N/A"}</td>;
  };

  const getRoleAssigned = (e) => {
    const prmissionAssigned = e?.permission;
    return prmissionAssigned?.filter((pManager) => pManager.view)?.length;
  };

  return (
    <div className="p-3">
      <div className="overflow-x-auto relative rounded-lg border">
        <table className="w-full text-xs text-left text-[#A5A5A5] dark:text-gray-400 ">
          <thead className="text-xs text-gray-900 border border-[#E1E6EE] bg-[#E1E6EE] dark:bg-gray-700 dark:text-gray-400 dark:border-[#ffffff38]">
            <tr>
              <th scope="col" className="py-3 px-6">
                {t("S.NO")}
              </th>
              <OSubadminTableHead sort={sort} fieldName="adminId" setSort={setSort} name="SUB_ADMIN_ID" />
              <OSubadminTableHead name="FIRST_NAME" fieldName="firstName" sort={sort} setSort={setSort} />
              <OSubadminTableHead name="LAST_NAME" fieldName="lastName" sort={sort} setSort={setSort} />
              <OSubadminTableHead name="EMAIL_ADDRESS" sort={sort} setSort={setSort} fieldName="email" />
              <OSubadminTableHead sort={sort} setSort={setSort} name="COUNTRY_CODE" fieldName="countryCode" />
              <OSubadminTableHead sort={sort} setSort={setSort} name="O_MOBILE_NUMBER" fieldName="mobile" />
              <th scope="col" className="py-3 px-6 text-center">
                {t("ROLE_ASSIGNED")}
              </th>
              <OSubadminTableHead sort={sort} setSort={setSort} name="O_CREATED_AT" fieldName="createdAt" />
              {(manager?.add || manager?.edit || user?.role === "admin") && <OSubadminTableHead sort={sort} setSort={setSort} name="O_STATUS" fieldName="status" classTd={" flex justify-center"} />}
              <th scope="col" className="py-3 px-6 text-center">
                {t("O_ACTION")}
              </th>
            </tr>
          </thead>
          <tbody>
            {subAdmin?.map((item, i) => (
              <tr key={item?._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <th scope="row" className="py-2 px-4 border-r dark:border-[#ffffff38] font-medium text-gray-900  dark:text-white text-center">
                  {i + 1 + pageSize * (page - 1)}
                </th>

                <td className="py-2 px-4 border-r dark:border-[#ffffff38] text-center">{helpers?.ternaryCondition(item?.adminId,item?.adminId,"N/A")}</td>

                <td className="py-2 px-4 border-r dark:border-[#ffffff38]">{helpers?.ternaryCondition(item?.firstName,item?.firstName,"N/A")}</td>
                <td className="py-2 px-4 border-r dark:border-[#ffffff38]">{helpers?.ternaryCondition(item?.lastName,item?.lastName,"N/A")}</td>

                <td className="py-2 px-4 border-r dark:border-[#ffffff38] text-slate-900 font-bold">{helpers?.ternaryCondition(item?.email,item?.email,"N/A")}</td>
                <td className="py-2 px-4 border-r dark:border-[#ffffff38] font-bold text-center">
                  {
                    helpers?.ternaryCondition(item?.countryCode,`+ ${item?.countryCode}`, "N/A")
                  }
                </td>
                <td className="py-2 px-4 border-r dark:border-[#ffffff38] font-bold text-center">{item?.mobile || "N/A"}</td>

                <td className="py-2 px-4 border-r dark:border-[#ffffff38]  font-bold text-slate-600 text-center">{getRoleAssigned(item)}</td>

                {getDateTable(helpers.getDateAndTime(item?.createdAt) || "N/A")}
                {(manager?.add || manager?.edit || user?.role === "admin") && (
                  <td className="py-2 px-4 border-r dark:border-[#ffffff38] text-center">
                    <label className="inline-flex relative items-center cursor-pointer" title={`${helpers.ternaryCondition(item?.status === "active", "Active", "Inactive")}`}>
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={item?.status === "active"}
                        onChange={(e) => helpers.alertFunction(`${t("ARE_YOU_SURE_YOU_WANT_TO")} ${helpers.ternaryCondition(e.target.checked, "active", "inactive")} '${item.name}'?`, item, handelStatusChange)}
                      />
                      <div className="w-10 h-5 bg-gray-200 rounded-full peer peer-focus:ring-0 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-gradientTo" />
                    </label>
                  </td>
                )}
                <td className="py-2 px-4 border-l">
                  <div className="">
                    <ul className="flex justify-center">
              
                      {(manager?.add || user?.role === "admin") && (
                        <button
                          onClick={() =>
                            navigate(`/sub-admin-manager/edit/${item?._id}`, {
                              state: { item, type: "edit" },
                            })
                          }
                          className="px-2 py-2 hover:text-gradientTo"
                        >
                          <button title={t("O_EDIT")}>
                            <AiFillEdit className="cursor-pointer w-5 h-5 text-slate-600" />
                          </button>
                        </button>
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
