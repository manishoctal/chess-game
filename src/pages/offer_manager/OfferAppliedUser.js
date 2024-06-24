import React  from "react";
import { useTranslation } from "react-i18next";
import { isEmpty, startCase } from "lodash";
import helpers from "../../utils/helpers";
import OWalletTableHead from '../../components/reusable/OTableHead'

const OfferAppliedUser = ({
  subAdmin,
  page,
  sort,
  setSort,
  pageSize,
}) => {
  const { t } = useTranslation();
// change status of offer function start

  return (
    <div className="p-3">
      <div className="overflow-x-auto relative rounded-lg border">
        <table className="w-full text-xs text-left text-[#A5A5A5] dark:text-gray-400 ">
          <thead className="text-xs text-gray-900 border border-[#E1E6EE] bg-[#E1E6EE] dark:bg-gray-700 dark:text-gray-400 dark:border-[#ffffff38]">
            <tr>
              <th scope="col" className="py-3 px-6">
                {t("S.NO")}
              </th>
              <OWalletTableHead sort={sort} setSort={setSort} name='USER_ID' fieldName='userId' />
              <OWalletTableHead sort={sort} setSort={setSort} name='FULL_NAME' fieldName='name' />
              <OWalletTableHead sort={sort} setSort={setSort} name='USER_NAME' fieldName='userName' />
              <OWalletTableHead sort={sort} setSort={setSort} name='MOBILE_NUMBER' fieldName='mobile' />
              <OWalletTableHead sort={sort} setSort={setSort} name='OFFER_CODE' fieldName='offerCode' />
              <OWalletTableHead sort={sort} setSort={setSort} name='USED_DATE' fieldName='usedDate' />
              <OWalletTableHead sort={sort} setSort={setSort} name='AMOUNT_ADDED' fieldName='amountAdded' />
              <OWalletTableHead sort={sort} setSort={setSort} name='CASH_BONUS' fieldName='cashBonus' />
             
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
                  {startCase(item?.bannerId) || 'N/A'}
                </td>

                <td className="py-2 px-4 border-r dark:border-[#ffffff38]">
                  {item?.name || 'N/A'}
                </td>
                <td className="py-2 px-4 border-r dark:border-[#ffffff38]">
                  {helpers.getDateAndTime(item?.createdAt)}
                </td>
                <td className="py-2 px-4 border-r dark:border-[#ffffff38]">
                  {helpers.getDateAndTime(item?.updatedAt)}
                </td>
                <td className="py-2 px-4 border-r dark:border-[#ffffff38]">
                  {helpers.getDateAndTime(item?.updatedAt)}
                </td>
                <td className="py-2 px-4 border-r dark:border-[#ffffff38]">
                  {helpers.getDateAndTime(item?.updatedAt)}
                </td>
                <td className="py-2 px-4 border-r dark:border-[#ffffff38]">
                  {helpers.getDateAndTime(item?.updatedAt)}
                </td>
                
                <td className="py-2 px-4 border-l">
                {helpers.getDateAndTime(item?.updatedAt)}
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

export default OfferAppliedUser;
