import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import React, { useState } from "react";
import helpers from "utils/helpers";
import LoaderButton from "components/reusable/LoaderButton";
import OInputField from "components/reusable/OInputField";
import { GrAnnounce } from "react-icons/gr";
import { FaEdit } from "react-icons/fa";

const EditLimitModal = ({ setEditShowLimitModal, cardLimitEdit,getAllPlayerCard }) => {
    console.log("🚀 ~ EditLimitModal ~ cardLimitEdit,getAllPlayerCard:", cardLimitEdit,getAllPlayerCard);
    const { t } = useTranslation();
    const {
        handleSubmit, } = useForm({ mode: "onChange", shouldFocusError: true, defaultValues: {} });

    const [loader] = useState(false)


    // submit function start
    const handleUpdateLimit = async (e) => {
    console.log("🚀 ~ handleUpdateLimit ~ e:", e);

    };
    // submit function end


    return (
        <>
            <div className=" overflow-y-auto justify-center items-center overflow-x-hidden  fixed inset-0 z-50 outline-none focus:outline-none">
                <form onSubmit={handleSubmit(handleUpdateLimit)} method="post">
                    <div className="relative w-auto my-6 mx-auto max-w-md">
                        <div className="overflow-hidden  dark:border-[#ffffff38] border border-white rounded-lg shadow-lg relative flex flex-col  bg-white outline-none focus:outline-none">
                            <div className=" flex items-center justify-between p-5 dark:bg-gray-900 border-b dark:border-[#ffffff38] border-solid border-slate-200 rounded-t dark:bg-slate-900">
                                <h3 className="text-xl font-semibold dark:text-white">
                                    {t("EDIT_CARD_LIMIT_IN_MARKET")}
                                </h3>
                                <button
                                    className=" ml-auto flex items-center justify-center  text-black border-2 rounded-full  h-8 w-8 float-right text-3xl leading-none font-extralight outline-none focus:outline-none"
                                    onClick={() => setEditShowLimitModal(false)}
                                >
                                    <button type="button"
                                        title={t("CLOSE")}
                                        className="hover:text-blue-700 transition duration-150 ease-in-out"
                                        data-bs-toggle="tooltip" >
                                        <span className=" text-[#B8BBBF]  text-4xl ">×</span>
                                    </button>
                                </button>
                            </div>
                            <div className="px-6  py-3">
                                <div className="relative z-0 mb-6">
                                    <OInputField
                                        type="text"
                                        name="title"
                                        id="title"
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
                           
                            <div className="dark:border-[#ffffff38] dark:bg-slate-900 flex items-center justify-center p-6 border-t border-solid border-slate-200 rounded-b">
                                <button
                                    title={t("CLOSE")}
                                    className="text-black bg-[#E1E1E1] font-normal px-12 py-2.5 text-sm outline-none focus:outline-none rounded mr-6  ease-linear transition-all duration-150"
                                    type="button"
                                    onClick={() => setEditShowLimitModal(false)}>
                                    {t("CLOSE")}
                                </button>
                                {helpers.ternaryCondition(loader,
                                    <LoaderButton />,
                                    <button className="bg-gradientTo text-white active:bg-emerald-600 font-normal text-sm px-8 flex gap-2 py-2.5 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1  ease-linear transition-all duration-150" type="submit"
                                        title={t("O_EDIT")}> <FaEdit size={16} />{t("O_EDIT")} </button>)}
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            <div className="opacity-25 fixed inset-0 z-40 bg-black" />
        </>
    );
};

export default EditLimitModal;

