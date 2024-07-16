import React, { useContext } from "react";
import { AiFillEye } from "react-icons/ai";
import { useTranslation } from "react-i18next";
import AuthContext from "context/AuthContext";
import { isEmpty, startCase } from "lodash";
import helpers from "../../utils/helpers";
import OPlayerCardTableHead from '../../components/reusable/OTableHead'
import { NavLink } from "react-router-dom";
import OViewDataCard from "components/reusable/OViewData";
const PlayerCardTable = ({
    playerCard,
    page,
    sort,
    setSort,
    manager,
    pageSize,

}) => {
    const { t } = useTranslation();
    const { user } = useContext(AuthContext);

    const getTableDataPlayerCard = (details, dataClass) => {
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
                            <OPlayerCardTableHead sort={sort} setSort={setSort} name='FORMAT_TYPE' fieldName='formatType' classTd={'justify-center'} />
                            <OPlayerCardTableHead sort={sort} setSort={setSort} name='AVAILABLE_CARD' fieldName='availableCard' classTd={'justify-center'} />
                            <OPlayerCardTableHead sort={sort} setSort={setSort} name='PLAYER_NAME' fieldName='playerName' classTd={'justify-center'} />
                            <OPlayerCardTableHead sort={sort} setSort={setSort} name='GENDER' fieldName='gender' classTd={'justify-center'} />
                            <OPlayerCardTableHead sort={sort} setSort={setSort} name='PLAYER_PRICE' fieldName='playerPrice' classTd={'justify-center'} />
                            <th scope="col" className="py-3 px-6 text-center">
                                {t("PLAYER_IMAGE")}
                            </th>
                            <OPlayerCardTableHead sort={sort} setSort={setSort} name='PLAYER_ROLE' fieldName='playerRole' classTd={'justify-center'} />
                            <OPlayerCardTableHead sort={sort} setSort={setSort} name='TOTAL_CARDS' fieldName='totalCards' classTd={'justify-center'} />
                            <OPlayerCardTableHead sort={sort} setSort={setSort} name='RANKING' fieldName='ranking' classTd={'justify-center'} />
                            <OPlayerCardTableHead sort={sort} setSort={setSort} name='PLAYERS_TEAM' fieldName='playersTeam' classTd={'justify-center'} />

                            <th scope="col" className="py-3 px-6 text-center">
                                {t("O_ACTION")}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {playerCard?.map((item, i) => (
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

                                {getTableDataPlayerCard(item?.formatType)}
                                {getTableDataPlayerCard(item?.availableCard, 'font-bold')}
                                {getTableDataPlayerCard(startCase(item?.playerName || 'N/A'))}
                                {getTableDataPlayerCard(startCase(item?.gender || 'N/A'))}
                                {getTableDataPlayerCard(helpers.formattedAmount(item?.playerPrice))}
                                <td className="py-2 px-4 border-r dark:border-[#ffffff38] text-center ">
                                    <img src='' />
                                </td>
                                {getTableDataPlayerCard(startCase(item?.playerRole || 'N/A'))}
                                {getTableDataPlayerCard(item?.totalCards)}
                                {getTableDataPlayerCard(item?.ranking)}
                                {getTableDataPlayerCard(startCase(item?.playersTeam || 'N/A'))}

                                <td className="py-2 border-l px-4">
                                    <div className="">
                                        <ul className="justify-center flex">
                                            <OViewDataCard manager={manager} item={item} link={'/player-card-manager/view'} />

                                        </ul>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {isEmpty(playerCard) ? (
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

export default PlayerCardTable;
