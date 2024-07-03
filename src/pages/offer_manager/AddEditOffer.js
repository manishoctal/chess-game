import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import helpers from "utils/helpers";
import OInputField from "components/reusable/OInputField";
import ODatePicker from "components/shared/datePicker/ODatePicker";
import ErrorMessage from "components/ErrorMessage";
import apiPath from "utils/apiPath";
import { apiPost, apiPut } from "utils/apiFetch";
import useToastContext from "hooks/useToastContext";
import LoaderButton from "components/reusable/LoaderButton";
const AddEditOffer = ({ setEditShowOfferModal, viewType, getAllOfferData, offerDetails }) => {
    const { t } = useTranslation();
    const [date, setDate] = useState(helpers.ternaryCondition(viewType == 'edit', new Date(offerDetails?.expiryDate), ''));
    const {
        handleSubmit,
        register,
        setValue,
        clearErrors,
        reset,
        formState: { errors },
    } = useForm({ mode: "onChange", shouldFocusError: true, defaultValues: {} });
    const [loader, setLoader] = useState(false)

    // default value for edit code
    useEffect(() => {
        if (offerDetails && viewType == 'edit') {
            reset({
                addMinimumAmount: offerDetails?.addMinimumAmount,
                cashBackAmount: offerDetails?.cashBackAmount,
                code: offerDetails?.code,
                expiryDate: offerDetails?.expiryDate,
                limitPerUser: offerDetails?.limitPerUser,
                maxUserLimit: offerDetails?.maxUserLimit
            })
            const dateFormate = new Date(offerDetails?.expiryDate);
            const today = new Date();
            const dateToCheck = new Date(offerDetails?.expiryDate);
            if(dateToCheck < today){
                setValue('expiryDate','')
                return
            }
            setDate(dateFormate)
        }
    }, [offerDetails])

    const notification = useToastContext();


    // submit function start
    const handleSubmitAddOfferForm = async (e) => {
        try {
            setLoader(true)
            const path = helpers.ternaryCondition(viewType == 'add', apiPath.getAllOffer, apiPath.getAllOffer + '/' + offerDetails?._id);
            const apiFunction = helpers.ternaryCondition(viewType === 'add', apiPost, apiPut);
            const result = await apiFunction(path, e);
            if (result?.status === 200) {
                notification.success(result?.data?.message);
                getAllOfferData({ statusChange: 1 });
                setEditShowOfferModal(false)
                setLoader(false)
            }
        }
        catch (error) {
            console.error("error in get all users list==>>>>", error.message);
        } finally {
            setLoader(false)
        }
    };
    // submit function end

    const handleDateChange = (dates) => {
        setValue('expiryDate', dates)
        clearErrors('expiryDate')
        setDate(dates);
    };

    const validationRules = {
        code: {
            required: { value: true, message: t("PLEASE_ENTER_OFFER_CODE") },
            min: { value: 1, message: t("MINIMUM_VALUE_MUST_IS_1") },
        },
        maxUserLimit: {
            required: { value: true, message: t("PLEASE_ENTER_USER_LIMIT") },
            maxLength: { value: 5, message: t("MAX_LIMIT_IS_5_CHARACTERS") },
            min: { value: 1, message: t("MINIMUM_VALUE_MUST_IS_1") },
        },
        limitPerUser: {
            required: { value: true, message: t("PLEASE_ENTER_RESTRICTED_USER") },
            maxLength: { value: 5, message: t("MAX_LIMIT_IS_5_CHARACTERS") },
            min: { value: 1, message: t("MINIMUM_VALUE_MUST_IS_1") },
        },
        cashBackAmount: {
            required: { value: true, message: t("PLEASE_ENTER_CASH_BONUS") },
            maxLength: { value: 5, message: t("MAX_LIMIT_IS_5_CHARACTERS") },
            min: { value: 1, message: t("MINIMUM_VALUE_MUST_IS_1") },
        },
        addMinimumAmount: {
            maxLength: { value: 5, message: t("MAX_LIMIT_IS_5_CHARACTERS") },
            min: { value: 1, message: t("MINIMUM_VALUE_MUST_IS_1") },
        },
        expiryDate: {
            required: { value: true, message: t("PLEASE_CHOOSE_EXPIRY_DATE") },
        },
    };
    return (
        <>
            <div className=" overflow-y-auto justify-center items-center flex overflow-x-hidden  fixed inset-0 z-50 outline-none focus:outline-none">
                <form onSubmit={handleSubmit(handleSubmitAddOfferForm)} method="post">
                    <div className="relative w-auto my-6 mx-auto max-w-3xl">
                        <div className="overflow-hidden  dark:border-[#ffffff38] border border-white rounded-lg shadow-lg relative flex flex-col min-w-[552px] bg-white outline-none focus:outline-none">
                            <div className="flex items-center justify-between p-5 dark:bg-gray-900 border-b dark:border-[#ffffff38] border-solid border-slate-200 rounded-t dark:bg-slate-900">
                                <h3 className="text-xl font-semibold dark:text-white">
                                    {helpers.ternaryCondition(viewType == 'add', t("ADD_OFFER"), t("EDIT_OFFER"))}
                                </h3>
                                <button
                                    className=" ml-auto flex items-center justify-center  text-black border-2 rounded-full  h-8 w-8 float-right text-3xl leading-none font-extralight outline-none focus:outline-none"
                                    onClick={() => setEditShowOfferModal(false)}
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
                                <OfferInputField name="code"
                                    label="OFFER_CODE"
                                    type="text"
                                    placeholder="ENTER_OFFER_CODE"
                                    maxLength={50}
                                    validation={validationRules.code}
                                    errors={errors}
                                    labelType={true}
                                    register={register} />

                                <OfferInputField
                                    name="maxUserLimit"
                                    label="USER_LIMIT"
                                    type="number"
                                    placeholder="ENTER_USER_LIMIT"
                                    maxLength={5}
                                    validation={validationRules.maxUserLimit}
                                    errors={errors}
                                    labelType={true}
                                    register={register}

                                />
                            </div>

                            <div className="flex justify-center mt-3">
                                <OfferInputField
                                    name="limitPerUser"
                                    label="RESTRICTED_USES"
                                    type="number"
                                    placeholder="ENTER_RESTRICTED_USER"
                                    maxLength={5}
                                    validation={validationRules.limitPerUser}
                                    errors={errors}
                                    labelType={true}

                                    register={register}

                                />
                                <OfferInputField
                                    name="cashBackAmount"
                                    label="CASH_BONUS"
                                    type="number"
                                    placeholder="ENTER_CASH_BONUS"
                                    maxLength={5}
                                    validation={validationRules.cashBackAmount}
                                    errors={errors}
                                    labelType={true}
                                    register={register}

                                />
                            </div>
                            <div className="flex justify-center mt-3">
                                <OfferInputField
                                    name="addMinimumAmount"
                                    label="ADD_AMOUNT_UP_TO"
                                    type="number"
                                    placeholder="ENTER_ADD_AMOUNT_UP_TO"
                                    maxLength={5}
                                    labelType={false}
                                    validation={validationRules.addMinimumAmount}
                                    errors={errors}
                                    register={register}

                                />
                                <div className="px-2">
                                    <label htmlFor="validity" className="font-medium text-sm text-[#000] dark:text-gray-400 block" > {t("EXPIRY_DATE")} <span className="text-red-500">*</span> </label>
                                    <ODatePicker
                                        name="validity"
                                        id="validity"
                                        value={date}
                                        handleDateChange={handleDateChange}
                                        minDate="today"
                                        placeholder={t("EXPIRY_DATE")}
                                        inputClass={'relative z-0  !w-[250px] group h-11 mt-1'}
                                        style={{ height: '45px' }}
                                        {...register('expiryDate', { required: t('PLEASE_CHOOSE_EXPIRY_DATE') })} />

                                    {errors?.expiryDate && (
                                        <ErrorMessage
                                            message={errors?.expiryDate?.message}
                                        />
                                    )}
                                </div>
                            </div>
                            <div className="dark:border-[#ffffff38] dark:bg-slate-900 flex items-center justify-center p-6 border-t border-solid border-slate-200 rounded-b">
                                <button
                                    className="text-black bg-[#E1E1E1] font-normal px-12 py-2.5 text-sm outline-none focus:outline-none rounded mr-6  ease-linear transition-all duration-150"
                                    type="button"
                                    title={t("CLOSE")}
                                    onClick={() => setEditShowOfferModal(false)}
                                >
                                    {t("CLOSE")}
                                </button>
                                {helpers.andOperator(viewType !== 'view',
                                    helpers.ternaryCondition(loader,
                                        <LoaderButton />,
                                        <button className="bg-gradientTo text-white active:bg-emerald-600 font-normal text-sm px-8 py-2.5 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1  ease-linear transition-all duration-150" type="submit"
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

export default AddEditOffer;

const OfferInputField = ({
    name,
    label,
    type,
    placeholder,
    maxLength,
    validation,
    errors,
    register,
    labelType,
    disable = false,
}) => {
    const { t } = useTranslation();
    return (
        <div className='px-2 flex justify-center'>
            <OInputField
                wrapperClassName='relative z-0 mb-3 w-[250px] group'
                name={name}
                inputLabel={t(label)}
                placeholder={t(placeholder)}
                register={register(name, validation)}
                type={type}
                errors={errors}
                disable={disable}
                maxLength={maxLength}
                labelType={labelType}
            />
        </div>
    );
};