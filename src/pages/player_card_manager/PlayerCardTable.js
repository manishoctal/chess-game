import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { isEmpty, startCase } from "lodash";
import helpers from "../../utils/helpers";
import OPlayerCardTableHead from '../../components/reusable/OTableHead'
import OViewDataCard from "components/reusable/OViewData";
import { AiFillEdit, AiFillEye } from "react-icons/ai";
import AuthContext from "context/AuthContext";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import OImage from "components/reusable/OImage";
import ViewCardDetails from './ViewPlayerCardDetails'
const PlayerCardTable = ({
    playerCard,
    page,
    sort,
    setSort,
    manager,
    pageSize,
    editCardLimit, activeIndex,
    activeData,
    handleAccordionClick

}) => {
    const { t } = useTranslation();
    const { user } = useContext(AuthContext)

    const getTableDataPlayerCard = (details, dataClass) => {
        return <td className={`py-2 px-4 border dark:border-[#ffffff38] text-center ${dataClass || ''}`}>
            {details || 'N/A'}
        </td>
    }


    const handleAccordionOnOff = (index, item) => {
        handleAccordionClick(index, item)
    };


    const PlayerCardHeader = (name) => {
        return <th className="py-3 px-3 cursor-pointer text-center">{t(name)}</th>
    }

    const [isOpenView, setIsOpenView] = useState()
    const [formatType, setFormatType] = useState()
    return (
        <div className="p-3">
            <div className="overflow-x-auto relative rounded-lg border">
                <table className="w-full text-xs text-left text-[#A5A5A5] dark:text-gray-400 ">
                    <thead className="text-xs text-gray-900 border border-[#E1E6EE] bg-[#E1E6EE] dark:bg-gray-700 dark:text-gray-400 dark:border-[#ffffff38]">
                        <tr>
                            <th scope="col" className="py-3 px-6  ">
                            </th>
                            <th scope="col" className="py-3 px-6 text-center">
                                {t("S.NO")}
                            </th>
                            <OPlayerCardTableHead sort={sort} setSort={setSort} name='PLAYER_NAME' fieldName='playerName' classTd={'justify-center'} />
                            <OPlayerCardTableHead sort={sort} setSort={setSort} name='GENDER' fieldName='gender' classTd={'justify-center'} />
                            <th scope="col" className="py-3 px-6 text-center">
                                {t("PLAYER_IMAGE")}
                            </th>
                            <OPlayerCardTableHead sort={sort} setSort={setSort} name='PLAYERS_TEAM' fieldName='team' classTd={'justify-center'} />
                            <th scope="col" className="py-3 px-6 text-center">
                                {t("O_ACTION")}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {playerCard?.map((item, i) => (
                            <React.Fragment key={i}>
                                <tr
                                    key={i}
                                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 cursor-pointer text-center"
                                    onClick={() => handleAccordionOnOff(i, item)}
                                >
                                    <th
                                        scope="row"
                                        className="py-2 px-4 border-r dark:border-[#ffffff38] font-medium text-gray-900  dark:text-white"
                                    >
                                        <button
                                            className="text-blue-500 hover:underline">
                                            {activeIndex === i ? <MdKeyboardArrowUp size={20} /> : <MdKeyboardArrowDown size={20} />}
                                        </button>
                                    </th>

                                    <th
                                        scope="row"
                                        className="py-2 px-4 border-r text-center dark:border-[#ffffff38] font-medium text-gray-900  dark:text-white">
                                        {i + 1 + pageSize * (page - 1)}
                                    </th>


                                    {getTableDataPlayerCard(startCase(item?.playerName || 'N/A'),'font-bold')}
                                    {getTableDataPlayerCard(startCase(item?.gender || 'N/A'),'font-bold')}
                                    <td className="py-2 px-4 border-r dark:border-[#ffffff38] flex justify-center">
                                        <div className="relative w-14 h-15 mb-4 sm:mb-0">
                                            <OImage
                                                src={item?.playerImage}
                                                fallbackUrl="/images/user.png"
                                                className="w-full h-full border rounded-full"
                                                alt=""
                                            />
                                        </div>
                                    </td>
                                    {getTableDataPlayerCard(startCase(item?.team || 'N/A'),'font-bold')}

                                    <td className="py-2 border-l px-4">
                                        <div className="">
                                            <ul className="justify-center flex">

                                                {helpers.andOperator((helpers?.orOperator(manager?.add, user?.role === "admin")), (
                                                    <li
                                                        onClick={(e) => { e.stopPropagation(); editCardLimit(item) }}
                                                        className="px-2 py-2 hover:text-gradientTo" >
                                                        <a title={t("O_EDIT")}>
                                                            <AiFillEdit className="cursor-pointer w-5 h-5 text-slate-600" />
                                                        </a>
                                                    </li>
                                                ))}
                                                <OViewDataCard manager={manager} item={item} link={'/player-card-manager/view'} />

                                            </ul>
                                        </div>
                                    </td>
                                </tr>
                                {helpers.andOperator(activeIndex === i, (
                                    <tr>
                                        <td colSpan="14" className="pt-3 pb-3 bg-gray-50">
                                            <div className="transition-all duration-500 ease-in-out overflow-hidden w-full flex justify-center " style={{ maxHeight: helpers.ternaryCondition(activeIndex === i , '500px' , '0') }}>
                                                <table className="w-[90%] text-xs text-left text-[#A5A5A5] dark:text-gray-400">
                                                    <thead className="text-xs text-gray-900 border border-[#E1E6EE] bg-[#E1E6EE] dark:bg-gray-700 dark:text-gray-400 dark:border-[#ffffff38]">
                                                        <tr>
                                                            {PlayerCardHeader('FORMAT_TYPE')}
                                                            {PlayerCardHeader('AVAILABLE_CARD')}
                                                            {PlayerCardHeader('PLAYER_DETAILS')}

                                                        </tr>

                                                    </thead>
                                                    <tbody>
                                                        {helpers.orOperator(helpers.orOperator(activeData?.t20RankingAllRounders, activeData?.t20RankingBatsmen), activeData?.t20RankingBowlers) && <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" >
                                                            {getTableDataPlayerCard('T20')}
                                                            {getTableDataPlayerCard(activeData?.availableCardT20, 'font-bold')}
                                                            <td className="py-3 px-3 cursor-pointer text-center border-r flex justify-center" onClick={() => { setIsOpenView(activeData); setFormatType('T20') }}><AiFillEye className="cursor-pointer w-5 h-5 text-slate-600" title={t('VIEW')}/></td>


                                                        </tr>}
                                                        {helpers.orOperator(helpers.orOperator(activeData?.odiRankingAllRounders, activeData?.odiRankingBatsmen), activeData?.odiRankingBowlers) && <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" >
                                                            {getTableDataPlayerCard('ODI')}
                                                            {getTableDataPlayerCard(activeData?.availableCardOdi, 'font-bold')}
                                                            <td className="py-3 px-3 cursor-pointer text-center border-r flex justify-center" onClick={() => { setIsOpenView(activeData); setFormatType('ODI') }}><AiFillEye className="cursor-pointer w-5 h-5 text-slate-600" title={t('VIEW')}/></td>


                                                        </tr>}
                                                        {helpers.orOperator(helpers.orOperator(activeData?.testsRankingAllRounders, activeData?.testsRankingBatsmen), activeData?.testsRankingBowlers) && <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" >
                                                            {getTableDataPlayerCard('TEST')}
                                                            {getTableDataPlayerCard(activeData?.availableCardTests, 'font-bold')}
                                                            <td className="py-3 px-3 cursor-pointer text-center border-r flex justify-center" onClick={() => { setIsOpenView(activeData); setFormatType('TEST') }}><AiFillEye className="cursor-pointer w-5 h-5 text-slate-600" title={t('VIEW')}/></td>
                                                        </tr>}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </React.Fragment>
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

            {isOpenView && (
                <ViewCardDetails
                    openData={isOpenView}
                    setIsOpenView={setIsOpenView}
                    formatType={formatType}
                />
            )}

        </div>
    );
};

export default PlayerCardTable;
