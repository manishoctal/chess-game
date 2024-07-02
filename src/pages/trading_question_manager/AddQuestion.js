import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import helpers from "utils/helpers";
import ODatePicker from "components/shared/datePicker/ODatePicker";
import ErrorMessage from "components/ErrorMessage";
import apiPath from "utils/apiPath";
import { apiPost, apiPut } from "utils/apiFetch";
import useToastContext from "hooks/useToastContext";
import LoaderButton from "components/reusable/LoaderButton";
const AddQuestion = ({ setEditShowTradingModal, viewType, offerDetails, ViewallTradingQuestionsList }) => {
    const { t } = useTranslation();
    const [date, setDate] = useState(helpers.ternaryCondition(viewType == 'edit', new Date(offerDetails?.expiryDate), ''));
    const {
        handleSubmit,
        register,
        setValue,
        clearErrors,

        formState: { errors },
    } = useForm({ mode: "onChange", shouldFocusError: true, defaultValues: {} });
    const [loader, setLoader] = useState(false)

    // default value for edit code


    const notification = useToastContext();


    // submit function start
    const handleSubmitAddQuestionForm = async (e) => {
        try {
            setLoader(true)
            const path = helpers.ternaryCondition(viewType == 'add', apiPath.getAllOffer, apiPath.getAllOffer + '/' + offerDetails?._id);
            const apiFunction = helpers.ternaryCondition(viewType === 'add', apiPost, apiPut);
            const result = await apiFunction(path, e);
            if (result?.status === 200) {
                notification.success(result?.data?.message);
                ViewallTradingQuestionsList({ statusChange: 1 });
                setEditShowTradingModal(false)
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

    const handleDateChangeExpiry = (dates) => {
        setValue('expiryDate', dates)
        clearErrors('expiryDate')
        setDate(dates);
    };


    return (
        <>
            <div className=" overflow-y-auto justify-center items-center flex overflow-x-hidden  fixed inset-0 z-50 outline-none focus:outline-none">
                <form onSubmit={handleSubmit(handleSubmitAddQuestionForm)} method="post">
                    <div className="relative w-auto my-6 mx-auto max-w-3xl">
                        <div className="overflow-hidden  dark:border-[#ffffff38] border border-white rounded-lg shadow-lg relative flex flex-col min-w-[552px] bg-white outline-none focus:outline-none">
                            <div className=" flex items-center justify-between p-5 dark:bg-gray-900 border-b dark:border-[#ffffff38] border-solid border-slate-200 rounded-t dark:bg-slate-900">
                                <h3 className="text-xl font-semibold dark:text-white">
                                    {helpers.ternaryCondition(viewType == 'add', t("ADD_OFFER"), t("EDIT_OFFER"))}
                                </h3>
                                <button
                                    className=" ml-auto flex items-center justify-center  text-black border-2 rounded-full  h-8 w-8 float-right text-3xl leading-none font-extralight outline-none focus:outline-none"
                                    onClick={() => setEditShowTradingModal(false)}
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

                            <div className="flex justify-center mt-3">
                                <div className="px-2">
                                    <label htmlFor="validity" className="font-medium text-sm text-[#000] dark:text-gray-400 block" > {t("EXPIRY_DATE")} <span className="text-red-500">*</span> </label>
                                    <ODatePicker
                                        name="validity"
                                        id="validity"
                                        value={date}
                                        handleDateChange={handleDateChangeExpiry}
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
                                    onClick={() => setEditShowTradingModal(false)}
                                >
                                    {t("CLOSE")}
                                </button>

                                {helpers.ternaryCondition(loader,
                                    <LoaderButton />,
                                    <button className="bg-gradientTo text-white active:bg-emerald-600 font-normal text-sm px-8 py-2.5 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1  ease-linear transition-all duration-150" type="submit"
                                        title={t("O_ADD")}>{t("O_ADD")} </button>)}
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black" />
        </>
    );
};

export default AddQuestion;

