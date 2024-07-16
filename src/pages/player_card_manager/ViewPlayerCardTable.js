import React, { useContext } from "react";
import { AiFillEdit } from "react-icons/ai";
import { useTranslation } from "react-i18next";
import AuthContext from "context/AuthContext";
import { isEmpty, startCase } from "lodash";
import helpers from "../../utils/helpers";
import OViewPlayerCardTableHead from '../../components/reusable/OTableHead'

const ViewPlayerCardTable = ({
    playerCardView,
    page,
    sort,
    setSort,
    manager,
    pageSize,
    editCardLimit
}) => {
    const { t } = useTranslation();
    const { user } = useContext(AuthContext);

    const getTableDataPlayerView = (details, dataClass) => {
        return <td className={`py-2 px-4 border-r dark:border-[#ffffff38] text-center ${dataClass || ''}`}>
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
                            <OViewPlayerCardTableHead sort={sort} setSort={setSort} name='ORDER_ID' fieldName='orderId' classTd={'justify-center w-20'} />
                            <OViewPlayerCardTableHead sort={sort} setSort={setSort} name='DATE' fieldName='date' classTd={'justify-center'} />
                            <OViewPlayerCardTableHead sort={sort} setSort={setSort} name='USER_ID' fieldName='userId' classTd={'justify-center w-20'} />
                            <OViewPlayerCardTableHead sort={sort} setSort={setSort} name='USER_NAME' fieldName='userName' classTd={'justify-center w-40'} />
                            <OViewPlayerCardTableHead sort={sort} setSort={setSort} name='O_EMAIL' fieldName='email' classTd={'justify-center'} />
                            <OViewPlayerCardTableHead sort={sort} setSort={setSort} name='ORDER_TYPE' fieldName='orderType' classTd={'justify-center w-40'} />
                            <OViewPlayerCardTableHead sort={sort} setSort={setSort} name='PLAYER_CARD_DETAILS' fieldName='playerCardDetails' classTd={'justify-center w-40'} />
                            <OViewPlayerCardTableHead sort={sort} setSort={setSort} name='CURRENT_PRICE' fieldName='currentPrice' classTd={'justify-center w-40'} />
                            <OViewPlayerCardTableHead sort={sort} setSort={setSort} name='PROFIT_LOSS' fieldName='profitLoss' classTd={'justify-center'} />
                            <OViewPlayerCardTableHead sort={sort} setSort={setSort} name='TRANSACTION_FEE' fieldName='transactionFee' classTd={'justify-center w-40'} />
                            <OViewPlayerCardTableHead sort={sort} setSort={setSort} name='BOUGHT_PRICE' fieldName='boughtPrice' classTd={'justify-center w-40'} />
                            <OViewPlayerCardTableHead sort={sort} setSort={setSort} name='QUANTITY' fieldName='quantity' classTd={'justify-center'} />
                            <OViewPlayerCardTableHead sort={sort} setSort={setSort} name='TOTAL_AMOUNT' fieldName='totalAmount' classTd={'justify-center w-40'} />
                            <OViewPlayerCardTableHead sort={sort} setSort={setSort} name='O_STATUS' fieldName='status' classTd={'justify-center'} />

                            <th scope="col" className="py-3 px-6 text-center">
                                {t("O_ACTION")}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {playerCardView?.map((item, i) => (
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

                                {getTableDataPlayerView(item?.orderId)}
                                {getTableDataPlayerView(item?.createdAt, 'font-bold')}
                                {getTableDataPlayerView(item?.userId)}
                                {getTableDataPlayerView(startCase(item?.userName||'N/A'))}
                                {getTableDataPlayerView(item?.email)}
                                {getTableDataPlayerView(item?.orderType)}
                                {getTableDataPlayerView(startCase(item?.playerCardDetails||'N/A'))}
                                {getTableDataPlayerView(helpers.formattedAmount(item?.currentPrice))}
                                {getTableDataPlayerView(helpers.formattedAmount(item?.profitLoss))}
                                {getTableDataPlayerView(helpers.formattedAmount(item?.transactionFee))}
                                {getTableDataPlayerView(helpers.formattedAmount(item?.boughtPrice))}
                                {getTableDataPlayerView(item?.quantity)}
                                {getTableDataPlayerView(helpers.formattedAmount(item?.totalAmount))}
                                {getTableDataPlayerView(startCase(item?.status))}
                                <td className="py-2 px-4 border-l">
                                    <div className="">
                                        <ul className="flex justify-center">
                                            {helpers.andOperator((helpers?.orOperator(manager?.add, user?.role === "admin")), (
                                                <li
                                                    onClick={() => { editCardLimit(item) }}
                                                    className="px-2 py-2 hover:text-gradientTo" >
                                                    <a title={t("O_EDIT")}>
                                                        <AiFillEdit className="cursor-pointer w-5 h-5 text-slate-600" />
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {isEmpty(playerCardView) ? (
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

export default ViewPlayerCardTable;
