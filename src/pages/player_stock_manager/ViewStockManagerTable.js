import React from "react";
import { useTranslation } from "react-i18next";
import { isEmpty, startCase } from "lodash";
import helpers from "../../utils/helpers";
import OViewPlayerStockTableHead from '../../components/reusable/OTableHead'
const ViewStockManagerTable = ({
    playerStock,
    page,
    sort,
    setSort,
    pageSize,
    
}) => {
    const { t } = useTranslation();

    const getTableDataPlayerStock = (details, dataClass) => {
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
                            <th scope="col" className="py-3 px-6 text-center">
                                {t("S.NO")}
                            </th>
                            <OViewPlayerStockTableHead sort={sort} setSort={setSort} name='ORDER_ID' fieldName='orderId' classTd={'justify-center'} />
                            <OViewPlayerStockTableHead sort={sort} setSort={setSort} name='O_CREATED_AT' fieldName='createdAt' classTd={'justify-center'} />
                            <OViewPlayerStockTableHead sort={sort} setSort={setSort} name='ORDER_TYPE' fieldName='orderType' classTd={'justify-center'} />
                            <OViewPlayerStockTableHead sort={sort} setSort={setSort} name='USER_NAME' fieldName='userName' classTd={'justify-center'} />
                            <OViewPlayerStockTableHead sort={sort} setSort={setSort} name='O_EMAIL' fieldName='email' classTd={'justify-center'} />
                            <OViewPlayerStockTableHead sort={sort} setSort={setSort} name='PLAYER_NAME' fieldName='playerName' classTd={'justify-center'} />
                            <OViewPlayerStockTableHead sort={sort} setSort={setSort} name='PLAYER_STOCK_PRICE' fieldName='playerStockPrice' classTd={'justify-center'} />
                            <OViewPlayerStockTableHead sort={sort} setSort={setSort} name='CURRENT_PLAYER_STOCK_PRICE' fieldName='currentPlayerStockPrice' classTd={'justify-center'} />
                            <OViewPlayerStockTableHead sort={sort} setSort={setSort} name='NUMBER_OF_SHARES' fieldName='shareCount' classTd={'justify-center'} />
                            <OViewPlayerStockTableHead sort={sort} setSort={setSort} name='TOTAL_AMOUNT' fieldName='totalAmount' classTd={'justify-center'} />
                            <OViewPlayerStockTableHead sort={sort} setSort={setSort} name='TOTAL_PROFIT_LOSS' fieldName='totalProfitLoss' classTd={'justify-center'} />
                        </tr>
                    </thead>
                    <tbody>
                        {playerStock?.map((item, i) => (
                            <tr
                                key={i}
                                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                            >
                                <th
                                    scope="row"
                                    className="py-2 px-4 border-r dark:border-[#ffffff38] font-medium text-gray-900  dark:text-white text-center"
                                >
                                    {i + 1 + pageSize * (page - 1)}
                                </th>
                                {getTableDataPlayerStock(item?.orderId)}
                                {getTableDataPlayerStock(helpers.getDateAndTime(item?.createdAt))}
                                {getTableDataPlayerStock(startCase(item?.orderType || 'N/A'))}
                                {getTableDataPlayerStock(item?.userName)}
                                {getTableDataPlayerStock(item?.email || 'N/A')}
                                {getTableDataPlayerStock(startCase(item?.playerName||'N/A'))}
                                {getTableDataPlayerStock(helpers.formattedAmount(item?.playerStockPrice))} 
                                {getTableDataPlayerStock(helpers.formattedAmount(item?.currentPlayerStockPrice))} 
                                {getTableDataPlayerStock(item?.shareCount)} 
                                {getTableDataPlayerStock(helpers.formattedAmount(item?.totalAmount))} 
                                {getTableDataPlayerStock(helpers.formattedAmount(item?.totalProfitLoss))} 
                            </tr>
                        ))}
                        {isEmpty(playerStock) ? (
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

export default ViewStockManagerTable;
