import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import React, { useState } from "react";
import helpers from "utils/helpers";
import LoaderButton from "components/reusable/LoaderButton";
import OInputField from "components/reusable/OInputField";

const AnnounceResult = ({ setAnnounceResultModal, toAnnounceData }) => {
    const { t } = useTranslation();
    const {
        handleSubmit, } = useForm({ mode: "onChange", shouldFocusError: true, defaultValues: {} });

    const [loader] = useState(false)


    // submit function start
    const handleAnnounceResult = async (e) => {
console.log('e',e)

    };
    // submit function end

    const [selectedButton, setSelectedButton] = useState(null);

    const handleButtonClick = (buttonType) => {
        setSelectedButton(buttonType);
    };

    return (
        <>
            <div className=" overflow-y-auto justify-center items-center overflow-x-hidden  fixed inset-0 z-50 outline-none focus:outline-none">
                <form onSubmit={handleSubmit(handleAnnounceResult)} method="post">
                    <div className="relative w-auto my-6 mx-auto max-w-lg">
                        <div className="overflow-hidden  dark:border-[#ffffff38] border border-white rounded-lg shadow-lg relative flex flex-col  bg-white outline-none focus:outline-none">
                            <div className=" flex items-center justify-between p-5 dark:bg-gray-900 border-b dark:border-[#ffffff38] border-solid border-slate-200 rounded-t dark:bg-slate-900">
                                <h3 className="text-xl font-semibold dark:text-white">
                                    {t("ANNOUNCE_RESULT")}
                                </h3>
                                <button
                                    className=" ml-auto flex items-center justify-center  text-black border-2 rounded-full  h-8 w-8 float-right text-3xl leading-none font-extralight outline-none focus:outline-none"
                                    onClick={() => setAnnounceResultModal(false)}
                                >
                                    <button type="button"
                                        title={t("CLOSE")}
                                        className="hover:text-blue-700 transition duration-150 ease-in-out"
                                        data-bs-toggle="tooltip" >
                                        <span className=" text-[#B8BBBF]  text-4xl ">×</span>
                                    </button>
                                </button>
                            </div>
                            <div className="px-6  py-3 flex justify-center">
                                <div className="relative z-0 mb-6 w-[80%] ">
                                    <OInputField
                                        type="text"
                                        name="title"
                                        id="title"
                                        value={toAnnounceData?.questions}
                                        disable={true}
                                        inputLabel={
                                            <>
                                                {t('O_QUESTION')}
                                            </>
                                        }
                                        wrapperClassName="relative z-0  w-full group"
                                        placeholder={t('ENTER_QUESTION')}

                                    />
                                </div>
                            </div>
                            <div className="px-6 flex justify-center">
                                <div className="relative z-0 mb-6 w-[80%]">
                                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{t('SELECT_ANSWER')}</label>
                                    <button title={t('O_YES')} onClick={() => handleButtonClick('yes')} className={`text-[14px] border-gray-500 px-[50px] py-2 rounded-lg items-center border border  ${helpers.ternaryCondition(selectedButton === 'yes', 'bg-green-600  font-semibold text-white', 'text-[#000000] font-semibold')}`}>
                                        {t('O_YES')}
                                    </button>

                                    <button title={t('O_NO')} onClick={() => handleButtonClick('no')} className={`text-[14px] border-gray-500 px-[50px] py-2 mx-2 rounded-lg items-center border border  ${helpers.ternaryCondition(selectedButton === 'no', 'bg-green-600  font-semibold text-white', 'text-[#000000] font-semibold')}`}>
                                        {t('O_NO')}
                                    </button>
                                </div>
                            </div>
                            <div className="dark:border-[#ffffff38] dark:bg-slate-900 flex items-center justify-center p-6 border-t border-solid border-slate-200 rounded-b">
                                <button
                                    title={t("CLOSE")}
                                    className="text-black bg-[#E1E1E1] font-normal px-12 py-2.5 text-sm outline-none focus:outline-none rounded mr-6  ease-linear transition-all duration-150"
                                    type="button"
                                    onClick={() => setAnnounceResultModal(false)}>
                                    {t("CLOSE")}
                                </button>
                                {helpers.ternaryCondition(loader,
                                    <LoaderButton />,
                                    <button className="bg-gradientTo text-white active:bg-emerald-600 font-normal text-sm px-8 py-2.5 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1  ease-linear transition-all duration-150" type="submit"
                                        title={t("O_ANNOUNCE_RESULT")}>{t("O_ANNOUNCE_RESULT")} </button>)}
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            <div className="opacity-25 fixed inset-0 z-40 bg-black" />
        </>
    );
};

export default AnnounceResult;

