import React, { useContext } from "react";
import { AiFillEdit, AiFillEye } from "react-icons/ai";
import { useTranslation } from "react-i18next";
import AuthContext from "context/AuthContext";
import { isEmpty, startCase } from "lodash";
import helpers from "../../utils/helpers";
import OWalletTableHead from '../../components/reusable/OTableHead'
import { apiPut } from "utils/apiFetch";
import apiPath from "utils/apiPath";
import useToastContext from "hooks/useToastContext";
import { NavLink } from "react-router-dom";

const OfferTable = ({
  subAdmin,
  allOfferList,
  page,
  sort,
  setSort,
  manager,
  pageSize,
  editViewBanner
}) => {
  const { t } = useTranslation();
  const { user } = useContext(AuthContext);
  const notification = useToastContext();

  // change status of offer function start

  const handelStatusChange = async (item) => {
    try {
      const payload = {
        status: helpers.ternaryCondition(
          item?.status === "inactive",
          "active",
          "inactive"
        ),
        type: "offer",
      };
      const path = `${apiPath.changeStatus}/${item?._id}`;
      const result = await apiPut(path, payload);
      if (result?.status === 200) {
        notification.success(result.data.message);
        allOfferList({ statusChange: 1 });
      }

    } catch (error) {
      console.error("error in get all users list==>>>>", error.message);
    }
  };
  // change status of offer function end


const getTableData=(details,dataClass)=>{
  return <td className={`py-2 px-4 border-r dark:border-[#ffffff38] text-center ${dataClass||''}`}>
  {details || 'N/A'}
</td>
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
              <OWalletTableHead sort={sort} setSort={setSort} name='OFFER_ID' fieldName='offerId' classTd={'justify-center'}/>
              <OWalletTableHead sort={sort} setSort={setSort} name='OFFER_CODE' fieldName='code'  classTd={'justify-center'}/>
              <OWalletTableHead sort={sort} setSort={setSort} name='USER_LIMIT' fieldName='maxUserLimit'  classTd={'justify-center'}/>
              <OWalletTableHead sort={sort} setSort={setSort} name='RESTRICTED_USES' fieldName='limitPerUser' classTd={'justify-center'} />
              <OWalletTableHead sort={sort} setSort={setSort} name='CASH_BONUS' fieldName='cashBackAmount'  classTd={'justify-center'}/>
              <OWalletTableHead sort={sort} setSort={setSort} name='EXPIRY_DATE' fieldName='expiryDate'  classTd={'justify-center'}/>
              <OWalletTableHead sort={sort} setSort={setSort} name='O_CREATED_AT' fieldName='createdAt'  classTd={'justify-center'}/>
              <OWalletTableHead sort={sort} setSort={setSort} name='O_UPDATED_AT' fieldName='updatedAt'  classTd={'justify-center'}/>
              <OWalletTableHead sort={sort} setSort={setSort} name='O_STATUS' fieldName='status' classTd={'justify-center'} />
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

                {getTableData(item?.offerId)}
                {getTableData(item?.code,'font-bold')}
                {getTableData(item?.maxUserLimit)}
                {getTableData(item?.limitPerUser)}
                {getTableData(helpers.formattedAmount(item?.cashBackAmount))}
                {getTableData(helpers.getDateAndTime(item?.expiryDate))}
                {getTableData(helpers.getDateAndTime(item?.createdAt))}
                 {getTableData(helpers.getDateAndTime(item?.updatedAt))}
                <td className="py-2 px-4 border-r dark:border-[#ffffff38]">
                  <label
                    className="inline-flex relative items-center cursor-pointer"
                    title={startCase(item?.status)}
                  >
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={item?.status === "active"}
                      onChange={(e) =>
                        helpers.alertFunction(
                          `${t("ARE_YOU_SURE_YOU_WANT_TO")} ${helpers.ternaryCondition(
                            e.target.checked,
                            "active",
                            "inactive"
                          )} offer ID ${item?.offerId || 'N/A'}?`,
                          item,
                          handelStatusChange
                        )
                      }
                    />
                    <div className="w-10 h-5 bg-gray-200 rounded-full peer peer-focus:ring-0 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-gradientTo" />
                  </label>
                </td>
                <td className="py-2 px-4 border-l">
                  <div className="">
                    <ul className="flex justify-center">

                      {(manager?.add || user?.role === "admin") && (
                        <li
                          onClick={() => { editViewBanner('edit', item) }}
                          className="px-2 py-2 hover:text-gradientTo" >
                          <a title={t("O_EDIT")}>
                            <AiFillEdit className="cursor-pointer w-5 h-5 text-slate-600" />
                          </a>
                        </li>
                      )}
                      {(manager?.view || user?.role === "admin") && (<li className="px-2 py-2 hover:text-gradientTo">
                        <NavLink to='/offer-manager/view' title={t("O_VIEW")} state={item}>
                          <AiFillEye className="cursor-pointer w-5 h-5 text-slate-600" />
                        </NavLink>
                      </li>)}

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

export default OfferTable;
