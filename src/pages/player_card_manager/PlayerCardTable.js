import React, { useContext } from "react";
import { AiFillEdit, AiFillEye } from "react-icons/ai";
import { useTranslation } from "react-i18next";
import AuthContext from "context/AuthContext";
import { isEmpty } from "lodash";
import helpers from "../../utils/helpers";
import OPlayerCardTableHead from '../../components/reusable/OTableHead'
import { NavLink } from "react-router-dom";

const PlayerCardTable = ({
    playerCard,
    page,
    sort,
    setSort,
    manager,
    pageSize,
    editCardLimit
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
                            <OPlayerCardTableHead sort={sort} setSort={setSort} name='FORMAT_TYPE' fieldName='offerId' classTd={'justify-center'} />
                            <OPlayerCardTableHead sort={sort} setSort={setSort} name='AVAILABLE_CARD' fieldName='code' classTd={'justify-center'} />
                            <OPlayerCardTableHead sort={sort} setSort={setSort} name='PLAYER_NAME' fieldName='maxUserLimit' classTd={'justify-center'} />
                            <OPlayerCardTableHead sort={sort} setSort={setSort} name='GENDER' fieldName='limitPerUser' classTd={'justify-center'} />
                            <OPlayerCardTableHead sort={sort} setSort={setSort} name='PLAYER_PRICE' fieldName='cashBackAmount' classTd={'justify-center'} />
                            <OPlayerCardTableHead sort={sort} setSort={setSort} name='PLAYER_IMAGE' fieldName='expiryDate' classTd={'justify-center'} />
                            <OPlayerCardTableHead sort={sort} setSort={setSort} name='PLAYER_ROLE' fieldName='createdAt' classTd={'justify-center'} />
                            <OPlayerCardTableHead sort={sort} setSort={setSort} name='TOTAL_CARDS' fieldName='updatedAt' classTd={'justify-center'} />
                            <OPlayerCardTableHead sort={sort} setSort={setSort} name='RANKING' fieldName='status' classTd={'justify-center'} />
                            <OPlayerCardTableHead sort={sort} setSort={setSort} name='PLAYERS_TEAM' fieldName='status' classTd={'justify-center'} />

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

                                {getTableDataPlayerCard(item?.offerId)}
                                {getTableDataPlayerCard(item?.code, 'font-bold')}
                                {getTableDataPlayerCard(item?.maxUserLimit)}
                                {getTableDataPlayerCard(item?.limitPerUser)}
                                {getTableDataPlayerCard(helpers.formattedAmount(item?.cashBackAmount))}
                                {getTableDataPlayerCard(helpers.getDateAndTime(item?.expiryDate))}
                                {getTableDataPlayerCard(helpers.getDateAndTime(item?.createdAt))}
                                {getTableDataPlayerCard(helpers.getDateAndTime(item?.updatedAt))}
                                {getTableDataPlayerCard(helpers.getDateAndTime(item?.updatedAt))}

                                {getTableDataPlayerCard(helpers.getDateAndTime(item?.updatedAt))}


                                <td className="py-2 px-4 border-l">
                                    <div className="">
                                        <ul className="flex justify-center">

                                            {(manager?.add || user?.role === "admin") && (
                                                <li
                                                    onClick={() => { editCardLimit(item) }}
                                                    className="px-2 py-2 hover:text-gradientTo" >
                                                    <a title={t("O_EDIT")}>
                                                        <AiFillEdit className="cursor-pointer w-5 h-5 text-slate-600" />
                                                    </a>
                                                </li>
                                            )}
                                            {(manager?.view || user?.role === "admin") && (<li className="px-2 py-2 hover:text-gradientTo">
                                                <NavLink to='/' title={t("O_VIEW")} state={item}>
                                                    <AiFillEye className="cursor-pointer w-5 h-5 text-slate-600" />
                                                </NavLink>
                                            </li>)}

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
