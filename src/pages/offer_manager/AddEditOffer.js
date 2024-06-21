import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import helpers from "utils/helpers";
import OInputField from "components/reusable/OInputField";
import ODatePicker from "components/shared/datePicker/ODatePicker";
import ErrorMessage from "components/ErrorMessage";
import apiPath from "utils/apiPath";
import { apiPost } from "utils/apiFetch";
import useToastContext from "hooks/useToastContext";
const BalanceEdit = ({ setEditShowModal, viewType, getAllOfferData, offerDetails }) => {
    const { t } = useTranslation();
    const [date, setDate] = useState("");
    const {
        handleSubmit,
        register,
        setValue,
        clearErrors,
        reset,
        formState: { errors },
    } = useForm({ mode: "onChange", shouldFocusError: true, defaultValues: {} });
    const [loader] = useState(false)
    useEffect(()=>{
        if(offerDetails&&viewType=='edit'){
            reset(offerDetails)
            const date = new Date(offerDetails?.expiryDate);
            date.toLocaleString('en-GB');
            console.log('offerDetails',date)

        }
    },[offerDetails])
    const notification = useToastContext();

    const handleSubmitForm = async (e) => {
        try {
            const path = apiPath.getAllOffer;
            const result = await apiPost(path, e);
            if (result?.status === 200) {
                notification.success(result.data.message);
                getAllOfferData({ statusChange: 1 });
            }
        }
        catch (error) {
            console.error("error in get all users list==>>>>", error.message);
        }
    };
    const handleDateChange = (dates) => {
        setValue('expiryDate', dates)
        clearErrors('expiryDate')
        setDate(dates);
    };
    return (
        <>
            <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                <form onSubmit={handleSubmit(handleSubmitForm)} method="post">
                    <div className="relative w-auto my-6 mx-auto max-w-3xl">
                        <div className="overflow-hidden border border-white dark:border-[#ffffff38] rounded-lg shadow-lg relative flex flex-col min-w-[552px] bg-white outline-none focus:outline-none">
                            <div className="dark:bg-gray-900 flex items-center justify-between p-5 border-b dark:border-[#ffffff38] border-solid border-slate-200 rounded-t dark:bg-slate-900">
                                <h3 className="text-xl font-semibold dark:text-white">
                                    {viewType == 'add' ? t("ADD_OFFER") : t("EDIT_OFFER")}
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


                            <div className="flex justify-center mt-5">
                                <div className='px-2 flex justify-center'>
                                    <OInputField
                                        wrapperClassName='relative z-0 mb-3 w-[250px] group'
                                        name='code'
                                        inputLabel={t('OFFER_CODE')}
                                        labelType={true}
                                        placeholder={t('ENTER_OFFER_CODE')}
                                        register={register("code", {
                                            required: {
                                                value: true,
                                                message: t("PLEASE_ENTER_OFFER_CODE"),
                                            },

                                            min: {
                                                value: 1,
                                                message: t("MINIMUM_VALUE_MUST_IS_1"),
                                            },
                                        })}
                                        type='text'
                                        errors={errors}

                                    />
                                </div>
                                <div className='px-2 flex justify-center'>
                                    <OInputField
                                        wrapperClassName='relative z-0 mb-3 w-[250px] group'
                                        name='maxUserLimit'
                                        inputLabel={t('USER_LIMIT')}
                                        placeholder={t('ENTER_USER_LIMIT')}
                                        register={register("maxUserLimit", {
                                            required: {
                                                value: true,
                                                message: t("PLEASE_ENTER_USER_LIMIT"),
                                            },
                                            maxLength: {
                                                value: 5,
                                                message: t("MAX_LIMIT_IS_5_CHARACTERS"),
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
                            </div>

                            <div className="flex justify-center mt-3">
                                <div className='px-2 flex justify-center'>
                                    <OInputField
                                        wrapperClassName='relative z-0 mb-3 w-[250px] group'
                                        name='limitPerUser'
                                        inputLabel={t('RESTRICTED_USES')}
                                        labelType={true}
                                        placeholder={t('ENTER_RESTRICTED_USER')}
                                        register={register("limitPerUser", {
                                            required: {
                                                value: true,
                                                message: t("PLEASE_ENTER_RESTRICTED_USER"),
                                            },
                                            maxLength: {
                                                value: 5,
                                                message: t("MAX_LIMIT_IS_5_CHARACTERS"),
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
                                        wrapperClassName='relative z-0 mb-3 w-[250px] group'
                                        name='cashBackAmount'
                                        inputLabel={t('CASH_BONUS')}
                                        placeholder={t('ENTER_CASH_BONUS')}
                                        register={register("cashBackAmount", {
                                            required: {
                                                value: true,
                                                message: t("PLEASE_ENTER_CASH_BONUS"),
                                            },
                                            maxLength: {
                                                value: 5,
                                                message: t("MAX_LIMIT_IS_5_CHARACTERS"),
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
                            </div>

                            <div className="flex justify-center mt-3">
                                <div className='px-2 flex justify-center'>
                                    <OInputField
                                        wrapperClassName='relative z-0 mb-3 w-[250px] group'
                                        name='addAmountUpTo'
                                        inputLabel={t('ADD_AMOUNT_UP_TO')}
                                        labelType={true}
                                        placeholder={t('ENTER_ADD_AMOUNT_UP_TO')}
                                        register={register("addAmountUpTo", {
                                            required: {
                                                value: true,
                                                message: t("PLEASE_ENTER_ADD_UP_TO_AMOUNT"),
                                            },
                                            maxLength: {
                                                value: 5,
                                                message: t("MAX_LIMIT_IS_5_CHARACTERS"),
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
                                    <div className="">
                                        <label htmlFor="validity" className="font-medium text-sm text-[#000] dark:text-gray-400 block" > {t("EXPIRY_DATE")} <span className="text-red-500">*</span> </label>
                                        <ODatePicker
                                            name="validity"
                                            id="validity"
                                            value={date}
                                            handleDateChange={handleDateChange}
                                            minDate="today"
                                            placeholder={t("EXPIRY_DATE")}
                                            inputClass={'relative z-0  w-[250px] group h-12 mt-1'}
                                            {...register('expiryDate', { required: t('PLEASE_CHOOSE_EXPIRY_DATE') })}
                                        />

                                        {errors?.expiryDate && (
                                            <ErrorMessage
                                                message={errors?.expiryDate?.message}
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="dark:border-[#ffffff38] dark:bg-slate-900 flex items-center justify-center p-6 border-t border-solid border-slate-200 rounded-b">
                                <button
                                    className="text-black bg-[#E1E1E1] font-normal px-12 py-2.5 text-sm outline-none focus:outline-none rounded mr-6  ease-linear transition-all duration-150"
                                    type="button"
                                    onClick={() => setEditShowModal(false)}
                                >
                                    {t("CLOSE")}
                                </button>
                                {helpers.andOperator(viewType !== 'view',
                                    helpers.ternaryCondition(loader,
                                        <button className="bg-gradientTo text-white active:bg-emerald-600 font-normal text-sm px-8 py-2.5 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1  ease-linear transition-all duration-150">
                                            <div className="spinner-container">
                                                <div className="loading-spinner" />
                                            </div>
                                        </button>,
                                        <button
                                            className="bg-gradientTo text-white active:bg-emerald-600 font-normal text-sm px-8 py-2.5 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1  ease-linear transition-all duration-150"
                                            type="submit"
                                            title={helpers.ternaryCondition(viewType == 'add', t("O_ADD"), t("O_EDIT"))}>{helpers.ternaryCondition(viewType == 'add', t("O_ADD"), t("O_EDIT"))} </button>))}
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
