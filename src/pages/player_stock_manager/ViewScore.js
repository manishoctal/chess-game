import { useTranslation } from "react-i18next";
import React from "react";
import { startCase } from "lodash";
import { IoClose } from "react-icons/io5";
const ViewScore = ({ setShowScoreModal, scoreData }) => {
    const { t } = useTranslation();
    
    // for view match details
    const getTableDataViewScore = (details, inputClass) => {
        return <td className={`py-2 px-4 border-r border dark:border-[#ffffff38] text-center font-semibold ${inputClass || ''}`}>
            {details || 'N/A'}
        </td>
    }

    const getTableHeaderViewScore = (name) => {
        return <th className='text-center py-3 px-6'>{t(name)}</th>

    }

    return (
        <>
            <div className=" overflow-y-auto justify-center items-center overflow-x-hidden  fixed inset-0 z-50 outline-none focus:outline-none">
                <form>
                    <div className="relative w-auto my-6 mx-auto max-w-4xl">
                        <div className="overflow-hidden  dark:border-[#ffffff38] border border-white rounded-lg shadow-lg relative flex flex-col  bg-white outline-none focus:outline-none">
                            <div className=" flex items-center justify-between p-5 dark:bg-gray-900 border-b dark:border-[#ffffff38] border-solid border-slate-200 rounded-t dark:bg-slate-900">
                                <h3 className="text-xl font-semibold dark:text-white">
                                    {t("VIEW_SCORE")}
                                </h3>
                                <button
                                    className=" ml-auto flex items-center justify-center  text-black border-2 rounded-full  h-8 w-8 float-right text-3xl leading-none font-extralight outline-none focus:outline-none"
                                    onClick={() => setShowScoreModal(false)}
                                >
                                    <span type="button"
                                        title={t("CLOSE")}
                                        className="hover:text-blue-700 transition duration-150 ease-in-out"
                                        data-bs-toggle="tooltip" >
                                        <span className=" text-[#B8BBBF]  text-4xl ">×</span>
                                    </span>
                                </button>
                            </div>
                            <div className='m-5'>
                                <label className="block mb-2 text-sm  font-medium text-gray-900 dark:text-white font-semibold">{t('Player_STOCK_DETAILS')} :</label>
                                <div className="overflow-x-auto relative rounded-lg border">
                                <table className="w-full text-xs text-left text-[#A5A5A5] dark:text-gray-400 ">
                                    <thead className="text-xs text-gray-900 border border-[#E1E6EE] bg-[#E1E6EE] dark:bg-gray-700 dark:text-gray-400 dark:border-[#ffffff38]">
                                        <tr>
                                            {getTableHeaderViewScore('PLAYER_NAME')}
                                            {getTableHeaderViewScore('PLAYERS_TEAM')}
                                            {getTableHeaderViewScore('PLAYER_ROLE')}
                                            {getTableHeaderViewScore('FORMAT_TYPE')}
                                            {getTableHeaderViewScore('STOCK_AVAILABLE')}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                            {getTableDataViewScore(startCase(scoreData?.playerName) || 'N/A')}
                                            {getTableDataViewScore(startCase(scoreData?.playersTeam) || 'N/A')}
                                            {getTableDataViewScore(startCase(scoreData?.playerRole) || 'N/A')}
                                            {getTableDataViewScore(startCase(scoreData?.formatType) || 'N/A')}
                                            {getTableDataViewScore(startCase(scoreData?.stockAvailable) || 'N/A')}

                                        </tr>
                                    </tbody>
                                </table>
                                </div>
                            </div>
                            <div className='m-5'>
                                <label className="block mb-2 text-sm  font-medium text-gray-900 dark:text-white font-semibold">{t('PLAYER_SCORE')} :</label>
                                <div className="overflow-x-auto relative rounded-lg border">
                                <table className="w-full text-xs text-left text-[#A5A5A5] dark:text-gray-400 ">
                                    <thead className="text-xs text-gray-900 border border-[#E1E6EE] bg-[#E1E6EE] dark:bg-gray-700 dark:text-gray-400 dark:border-[#ffffff38]">
                                        <tr>
                                            {getTableHeaderViewScore('O_MATCHES')}
                                            {getTableHeaderViewScore('O_SCORE')}
                                        </tr>
                                    </thead>
                                    <tbody>
                                            {scoreData?.playerScore?.map((res,i)=>{return(
                                                  <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={i}>
                                                {getTableDataViewScore(startCase(res?.match) || 'N/A')}
                                                {getTableDataViewScore(startCase(res?.score) || 'N/A')}
                                                </tr>
                                            )})}
                                    </tbody>
                                </table>
                                </div>
                            </div>

                            <div className="dark:border-[#ffffff38] dark:bg-slate-900 flex items-center justify-center p-6 border-t border-solid border-slate-200 rounded-b">
                                <button
                                    title={t("CLOSE")}
                                    className="text-black bg-[#E1E1E1] font-normal px-6 flex gap-2 py-2.5 text-sm outline-none focus:outline-none rounded mr-6  ease-linear transition-all duration-150"
                                    type="button"
                                    onClick={() => setShowScoreModal(false)}
                                >
                                    <IoClose size={19}/> {t("CLOSE")}
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

export default ViewScore;

