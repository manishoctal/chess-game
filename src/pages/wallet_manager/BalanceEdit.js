import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import helpers from "utils/helpers";
import OInputField from "components/reusable/OInputField";
const BalanceEdit = ({ setEditShowModal, viewType }) => {
    const { t } = useTranslation();
    const {
        handleSubmit,
        register,
        formState: { errors },
    } = useForm({ mode: "onChange", shouldFocusError: true, defaultValues: {} });
    const [loader] = useState(false)

    const handleSubmitForm = async () => {
    };

    return (
        <>
            <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                <form onSubmit={handleSubmit(handleSubmitForm)} method="post">
                    <div className="relative w-auto my-6 mx-auto max-w-3xl">
                        <div className="overflow-hidden border border-white dark:border-[#ffffff38] rounded-lg shadow-lg relative flex flex-col min-w-[502px] bg-white outline-none focus:outline-none">
                            <div className="dark:bg-gray-900 flex items-center justify-between p-5 border-b dark:border-[#ffffff38] border-solid border-slate-200 rounded-t dark:bg-slate-900">
                                <h3 className="text-xl font-semibold dark:text-white">
                                    {t("EDIT_BALANCE")}
                                </h3>
                                <button
                                    className=" ml-auto flex items-center justify-center  text-black border-2 rounded-full  h-8 w-8 float-right text-3xl leading-none font-extralight outline-none focus:outline-none"
                                    onClick={() => setEditShowModal(false)}
                                >
                                    <button type="button"
                                        title={t("CLOSE")}
                                        className="hover:text-blue-700 transition duration-150 ease-in-out"
                                        data-bs-toggle="tooltip"
                                    >

                                        <span className=" text-[#B8BBBF]  text-4xl ">×</span>
                                    </button>
                                </button>
                            </div>
                            <div className="mb-3">
                                <div className='px-2 flex justify-center mt-5'>
                                    <OInputField
                                        wrapperClassName='relative z-0  w-[300px] group'
                                        name='balanceType'
                                        inputLabel={t('EDIT_BALANCE_TYPE')}
                                        labelType={true}
                                        type='select'
                                        register={register("balanceType", {
                                            required: {
                                                value: true,
                                                message: t("PLEASE_SELECT_BALANCE_TYPE"),
                                            },
                                        })}
                                        selectOptions={[<option value={''}>{t('CHOOSE_BALANCE_TYPE')}</option>, <option value={'edit_deposit'}>{t('EDIT_DEPOSIT_BALANCE')}</option>,
                                        <option value={'edit_deposit'}>{t('EDIT_BONUS_AMOUNT_BALANCE')}</option>,
                                        <option value={'edit_deposit'}>{t('EDIT_WINNING_AMOUNT_BALANCE')}</option>]}
                                    />
                                </div>
                                {errors?.balanceType&&<div class="text-sm text-red-600 w-[389px] flex justify-center">{errors?.balanceType?.message}</div>}
                            </div>


                            <div className='px-2 flex justify-center'>
                                <OInputField
                                    wrapperClassName='relative z-0 mb-3 w-[300px] group'
                                    name='currentBalance'
                                    inputLabel={t('CURRENT_BALANCE')}
                                    labelType={true}
                                    placeholder={t('ENTER_CURRENT_BALANCE')}
                                    register={register("currentBalance", {
                                        required: {
                                            value: true,
                                            message: t("PLEASE_ENTER_CURRENT_BALANCE"),
                                        },
                                        maxLength: {
                                            value: 3,
                                            message: t("MAX_LIMIT_IS_3_CHARACTERS"),
                                        },
                                        min: {
                                            value: 1,
                                            message: t("MINIMUM_VALUE_MUST_IS_1"),
                                        },
                                    })}
                                    type='number'
                                    errors={errors}

                                />
                            </div>
                            <div className='px-2 flex justify-center'>
                                <OInputField
                                    wrapperClassName='relative z-0 mb-3 w-[300px] group'
                                    name='addBalance'
                                    inputLabel={t('ADD_BALANCE')}
                                    placeholder={t('ENTER_BALANCE')}
                                    register={register("addBalance", {
                                        required: {
                                            value: true,
                                            message: t("PLEASE_ENTER_BALANCE"),
                                        },
                                        maxLength: {
                                            value: 3,
                                            message: t("MAX_LIMIT_IS_3_CHARACTERS"),
                                        },
                                        min: {
                                            value: 1,
                                            message: t("MINIMUM_VALUE_MUST_IS_1"),
                                        },
                                    })}
                                    labelType={true}
                                    type='number'
                                    errors={errors}

                                />
                            </div>
                            <div className="dark:border-[#ffffff38] dark:bg-slate-900 flex items-center justify-center p-6 border-t border-solid border-slate-200 rounded-b">
                                <button
                                    className="text-black bg-[#E1E1E1] font-normal px-12 py-2.5 text-sm outline-none focus:outline-none rounded mr-6  ease-linear transition-all duration-150"
                                    type="button"
                                    onClick={() => setEditShowModal(false)}
                                >
                                    {t("CLOSE")}
                                </button>
                                {viewType !== 'view' && helpers.ternaryCondition(loader, <button className="bg-gradientTo text-white active:bg-emerald-600 font-normal text-sm px-8 py-2.5 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1  ease-linear transition-all duration-150">
                                    <div className="spinner-container">
                                        <div className="loading-spinner" />
                                    </div>
                                </button>, <button
                                    className="bg-gradientTo text-white active:bg-emerald-600 font-normal text-sm px-8 py-2.5 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1  ease-linear transition-all duration-150"
                                    type="submit"
                                >
                                    {t("O_EDIT")}
                                </button>)}

                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black" />
        </>
    );
};

export default BalanceEdit;
