import { useTranslation } from "react-i18next";
import React from "react";
import helpers from "utils/helpers";
import { IoClose } from "react-icons/io5";
import OImage from "components/reusable/OImage";

const ViewPlayerCardDetails = ({ setIsOpenView, openData, formatType }) => {
    const { t } = useTranslation();


    const playerCardDetails = (name) => {
        return <th scope="col" className="py-3 px-6 text-center">
            {t(name)}
        </th>
    }
    const getPlayerPriceData = (data) => {
        return <td className="py-2 px-4 border-r dark:border-[#ffffff38]  text-center font-bold">{data || '0'}</td>
    }
    const getPlayerRole = (data) => {
        return <td className="py-2 px-4 dark:border-[#ffffff38]  text-center font-bold">{helpers.andOperator(data?.isAllRounder, 'All Rounder')} {helpers.andOperator(data?.isBatsmen, 'Batsman')} {helpers.andOperator(data?.isBowler, 'Bowler')}</td>
    }



    return (
        <>
            <div className=" overflow-y-auto justify-center items-center overflow-x-hidden  fixed inset-0 z-50 outline-none focus:outline-none">
                <form method="post">
                    <div className={`relative w-auto my-6 mx-auto ${helpers.ternaryCondition(formatType == 'image', 'max-w-xl', 'max-w-3xl')} `}>
                        <div className="overflow-hidden  dark:border-[#ffffff38] border border-white rounded-lg shadow-lg relative flex flex-col  bg-white outline-none focus:outline-none">
                            <div className=" flex items-center justify-between p-5 dark:bg-gray-900 border-b dark:border-[#ffffff38] border-solid border-slate-200 rounded-t dark:bg-slate-900">
                                <h3 className="text-xl font-semibold dark:text-white">
                                    {helpers.ternaryCondition(formatType == 'image', t("PLAYER_IMAGE"), t("PLAYER_CARD_DETAILS"))}
                                </h3>
                                <button
                                    title={t("CLOSE")}
                                    className=" ml-auto flex items-center justify-center  text-black border-2 rounded-full  h-8 w-8 float-right text-3xl leading-none font-extralight outline-none focus:outline-none"
                                    onClick={() => setIsOpenView()}>
                                    <span className=" text-[#B8BBBF]  text-4xl ">×</span>
                                </button>
                            </div>

                            {helpers.ternaryCondition(formatType !== 'image', <>
                                <div className="p-5">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">{t('PLAYER_PRICE')}:</label>
                                    <div className="overflow-x-auto relative rounded-lg border">
                                        <table className="w-full text-xs text-left text-[#A5A5A5] dark:text-gray-400 ">
                                            <thead className="text-xs text-gray-900 border border-[#E1E6EE] bg-[#E1E6EE] dark:bg-gray-700 dark:text-gray-400 dark:border-[#ffffff38]">
                                                <tr>
                                                    {playerCardDetails('FORMAT_TYPE')}
                                                    {playerCardDetails('ALL_ROUNDER')}
                                                    {playerCardDetails('BATSMAN')}
                                                    {playerCardDetails('BOWLER')}
                                                    {playerCardDetails('TOTAL_CARDS')}
                                                    {playerCardDetails('PLAYER_ROLE')}
                                                </tr>

                                            </thead>
                                            <tbody>
                                                {formatType == 'T20' && <tr>
                                                    {getPlayerPriceData(t('O_T20'))}
                                                    {getPlayerPriceData(helpers.formattedAmount(openData?.t20RatingAllRounders))}
                                                    {getPlayerPriceData(helpers.formattedAmount(openData?.t20RatingBatsmen))}
                                                    {getPlayerPriceData(helpers.formattedAmount(openData?.testsRatingBowlers))}
                                                    {getPlayerPriceData(openData?.purchasedCardT20)}
                                                    {getPlayerRole(openData)}
                                                </tr>}

                                                {formatType == 'ODI' && <tr>
                                                    {getPlayerPriceData(t('O_ODI'))}
                                                    {getPlayerPriceData(helpers.formattedAmount(openData?.odiRatingAllRounders))}
                                                    {getPlayerPriceData(helpers.formattedAmount(openData?.odiRatingBatsmen))}
                                                    {getPlayerPriceData(helpers.formattedAmount(openData?.odiRatingBowlers))}
                                                    {getPlayerPriceData(openData?.purchasedCardOdi)}
                                                    {getPlayerRole(openData)}

                                                </tr>}

                                                {formatType == 'TEST' && <tr>
                                                    {getPlayerPriceData(t('O_TEST'))}
                                                    {getPlayerPriceData(helpers.formattedAmount(openData?.testsRatingAllRounders))}
                                                    {getPlayerPriceData(helpers.formattedAmount(openData?.testsRatingBatsmen))}
                                                    {getPlayerPriceData(helpers.formattedAmount(openData?.testsRatingBowlers))}
                                                    {getPlayerPriceData(openData?.purchasedCardTests)}
                                                    {getPlayerRole(openData)}

                                                </tr>}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <div className="p-5">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">{t('PLAYER_RANKING')}:</label>
                                    <div className="overflow-x-auto relative rounded-lg border">
                                        <table className="w-full text-xs text-left text-[#A5A5A5] dark:text-gray-400 ">
                                            <thead className="text-xs text-gray-900 border border-[#E1E6EE] bg-[#E1E6EE] dark:bg-gray-700 dark:text-gray-400 dark:border-[#ffffff38]">
                                                <tr>
                                                    {playerCardDetails('FORMAT_TYPE')}
                                                    {playerCardDetails('ALL_ROUNDER')}
                                                    {playerCardDetails('BATSMAN')}
                                                    {playerCardDetails('BOWLER')}
                                                </tr>

                                            </thead>
                                            <tbody>
                                                {formatType == 'T20' && <tr>
                                                    {getPlayerPriceData(t('O_T20'))}
                                                    {getPlayerPriceData(openData?.t20RankingAllRounders || 'N/A')}
                                                    {getPlayerPriceData(openData?.t20RankingBatsmen || 'N/A')}
                                                    {getPlayerPriceData(openData?.t20RankingBowlers || 'N/A')}
                                                </tr>}

                                                {formatType == 'ODI' && <tr>
                                                    {getPlayerPriceData(t('O_ODI'))}
                                                    {getPlayerPriceData(openData?.odiRankingAllRounders || 'N/A')}
                                                    {getPlayerPriceData(openData?.odiRankingBatsmen || 'N/A')}
                                                    {getPlayerPriceData(openData?.odiRankingBowlers || 'N/A')}

                                                </tr>}

                                                {formatType == 'TEST' && <tr>
                                                    {getPlayerPriceData(t('O_TEST'))}
                                                    {getPlayerPriceData(openData?.testsRankingAllRounders || 'N/A')}
                                                    {getPlayerPriceData(openData?.testsRankingBatsmen || 'N/A')}
                                                    {getPlayerPriceData(openData?.testsRankingBowlers || 'N/A')}

                                                </tr>}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </>,
                                <div className="p-5">
                                    <div className="h-[300px] flex justify-center border  m-auto">
                                        <OImage
                                            src={openData?.playerImage}
                                            fallbackUrl="/images/user.png"
                                            className="p-4 h-[300px]"
                                            alt=""
                                        />
                                    </div>
                                </div>
                            )}


                            <div className="dark:border-[#ffffff38] dark:bg-slate-900 flex items-center justify-center p-6 border-t border-solid border-slate-200 rounded-b">
                                <button
                                    title={t("CLOSE")}
                                    className="text-black bg-[#E1E1E1] font-normal px-6 flex gap-2 py-2.5 text-sm outline-none focus:outline-none rounded mr-6  ease-linear transition-all duration-150"
                                    type="button"
                                    onClick={() => setIsOpenView()}>
                                    <IoClose size={19} />{t("CLOSE")}
                                </button>

                            </div>
                        </div>
                    </div>
                </form>
            </div>

            <div className="opacity-25 fixed inset-0 z-40 bg-black" />
        </>
    );
};

export default ViewPlayerCardDetails;