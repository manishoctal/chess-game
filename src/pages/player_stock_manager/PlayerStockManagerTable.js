import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import AuthContext from "context/AuthContext";
import { isEmpty, startCase } from "lodash";
import helpers from "../../utils/helpers";
import OPlayerStockTableHead from '../../components/reusable/OTableHead'
import apiPath from "utils/apiPath";
import { apiPut } from "utils/apiFetch";
import useToastContext from "hooks/useToastContext";
import { GrScorecard } from "react-icons/gr";
import ViewScore from './ViewScore'
import OViewDataStock from "components/reusable/OViewData";
const PlayerStockManagerTable = ({
    playerStock,
    page,
    sort,
    setSort,
    manager,
    pageSize,
    getAllplayerStock
}) => {
    const { t } = useTranslation();
    const { user } = useContext(AuthContext);
    const notification = useToastContext();
    const [showScoreModal, setShowScoreModal] = useState()


    // change status of offer function start

    const handelStatusChangeStock = async (item) => {
        try {
            const payloadStock = {
                status: helpers.ternaryCondition(
                    item?.status === "inactive",
                    "active",
                    "inactive"
                ),
                type: "offer",
            };
            const path = `${apiPath.changeStatus}/${item?._id}`;
            const result = await apiPut(path, payloadStock);
            if (result?.status === 200) {
                notification.success(result.data.message);
                getAllplayerStock({ statusChange: 1 });
            }

        } catch (error) {
            console.error("error in change status list==>>>>", error.message);
        }
    };
    // change status of offer function end


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
                            <OPlayerStockTableHead sort={sort} setSort={setSort} name='PLAYER_ID' fieldName='playerId' classTd={'justify-center'} />
                            <OPlayerStockTableHead sort={sort} setSort={setSort} name='NAME' fieldName='playerName' classTd={'justify-center'} />
                            <th scope="col" className="py-3 px-6 text-center">
                                {t("PLAYER_IMAGE")}
                            </th>
                            <OPlayerStockTableHead sort={sort} setSort={setSort} name='PLAYER_TEAM' fieldName='playersTeam' classTd={'justify-center'} />
                            <OPlayerStockTableHead sort={sort} setSort={setSort} name='STOCK_AVAILABLE' fieldName='stockAvailable' classTd={'justify-center'} />
                            <OPlayerStockTableHead sort={sort} setSort={setSort} name='PLAYER_ROLE' fieldName='playerRole' classTd={'justify-center'} />
                            <OPlayerStockTableHead sort={sort} setSort={setSort} name='PLAYER_STOCK_PRICE' fieldName='playerStockPrice' classTd={'justify-center'} />
                            <OPlayerStockTableHead sort={sort} setSort={setSort} name='FORMAT_TYPE' fieldName='formatType' classTd={'justify-center'} />
                            <th scope="col" className="py-3 px-6 text-center">
                                {t("VIEW_SCORE")}
                            </th>
                            {helpers.andOperator((manager?.add || manager?.edit || user?.role === "admin"), (<OPlayerStockTableHead sort={sort} setSort={setSort} name='O_STATUS' fieldName='status' classTd={'justify-center'} />))}
                            <th scope="col" className="py-3 px-6 text-center">
                                {t("O_ACTION")}
                            </th>
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

                                {getTableDataPlayerStock(item?.playerId)}
                                {getTableDataPlayerStock(startCase(item?.playerName || 'N/A'))}
                                <td className="py-2 px-4 border-r dark:border-[#ffffff38] text-center ">
                                    <img src='' />
                                </td>
                                {getTableDataPlayerStock(startCase(item?.playersTeam || 'N/A'))}
                                {getTableDataPlayerStock(item?.stockAvailable)}
                                {getTableDataPlayerStock(startCase(item?.playerRole || 'N/A'))}
                                {getTableDataPlayerStock(helpers.formattedAmount(item?.playerStockPrice))}
                                {getTableDataPlayerStock(startCase(item?.formatType || 'N/A'))}
                                <td className="py-4 px-4 border-r dark:border-[#ffffff38] flex justify-center">
                                    <button onClick={() => { setShowScoreModal(item) }}>
                                        <GrScorecard size={20} title={t('VIEW_SCORE')} />
                                    </button>
                                </td>
                                {helpers.andOperator((manager?.add || manager?.edit || user?.role === "admin"), (<td className="py-2 px-4 border-r dark:border-[#ffffff38]">
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
                                                    )} player ID ${item?.playerId || 'N/A'}?`,
                                                    item,
                                                    handelStatusChangeStock
                                                )
                                            }
                                        />
                                        <div className="w-10 h-5 bg-gray-200 rounded-full peer peer-focus:ring-0 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-gradientTo" />
                                    </label>
                                </td>))}

                                <td className="py-2 border-l px-4">
                                    <div className="">
                                        <ul className="justify-center flex">
                                            <OViewDataStock manager={manager} item={item} link={'/player-stock-manager/view'} />
                                        </ul>
                                    </div>
                                </td>
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
            {showScoreModal && (
                <ViewScore
                    setShowScoreModal={setShowScoreModal}
                    scoreData={showScoreModal}
                />
            )}
        </div>
    );
};

export default PlayerStockManagerTable;
