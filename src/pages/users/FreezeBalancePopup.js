import OButton from "components/reusable/OButton";
import useToastContext from "hooks/useToastContext";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { apiPost } from "../../utils/apiFetch";
import apiPath from "../../utils/apiPath";
import { useTranslation } from "react-i18next";
import OInputField from "components/reusable/OInputField";
import FormValidation from "utils/formValidation";
import { IoClose } from "react-icons/io5";
import { handleCopy, handleCut, handlePaste, preventText } from "utils/reusableMethods";
import helpers from "utils/helpers";
const FreezeBalancePopup = ({ handleFreeModal, userId }) => {
    const [isLoading, setIsLoading] = useState(false);
    const formValidation = FormValidation();
    const { t } = useTranslation();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        mode: "onChange",
        shouldFocusError: true,
    });
    const notification = useToastContext();
    const onSubmit = async (data) => {
        try {
            const payload = {
                freezedAmount: data?.amount
            }
            setIsLoading(true);
            const result = await apiPost(`${apiPath.freezeAmount}/${userId?._id}`, payload);
            if (result?.data?.success === true) {
                notification.success(result?.data?.message);
                handleFreeModal()
            } else {
                notification.error(result?.data?.message);
            }
        } catch (error) {
            console.error("error:", error);
        }
        setIsLoading(false);
    };

    console.log("userId", userId)

  

    return (
        <div>
            <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                <div className="relative my-6 w-[390px]">
                    <div className="sm:py-4 sm:px-2 py-8 px-7 ">
                        <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                            <div className="dark:bg-gray-900 flex items-center justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                                <div>
                                    <h3 className="text-xl font-semibold dark:text-white">{t("FREEZE_BALANCE")}</h3>

                                    <strong className="mt-2 block">{helpers.formattedAmount(userId?.freezedAmount)}</strong>
                                    {/* <strong className="text-black text-lg mt-2 block">{helpers?.ternaryCondition(userId?.freezedAmount, helpers?.formattedAmount(parseInt(userId?.freezedAmount),userId?.country), "0")}</strong> */}
                                </div>

                                <button className=" ml-auto flex items-center justify-center  text-black border-2 rounded-full  h-8 w-8 float-right text-3xl leading-none font-extralight outline-none focus:outline-none" onClick={() => handleFreeModal()}>
                                    <span className=" text-[#B8BBBF]  text-4xl " title="Close">
                                        ×
                                    </span>
                                </button>


                            </div>
                            <div className="relative p-6 flex-auto dark:bg-gray-800">
                                <div className="">
                                    <div className="px-2">
                                        <OInputField
                                            wrapperClassName=""
                                            name="amount"
                                            placeholder={t("ENTER_FREEZE_AMOUNT")}
                                            inputLabel={
                                                <>
                                                    {t("FREEZE_BALANCE")}
                                                    <span className="text-red-500">*</span>
                                                </>
                                            }
                                            onCopy={handleCopy}
                                            onCut={handleCut}
                                            onPaste={handlePaste}
                                            onKeyPress={(e) => preventText(e)}
                                            type="text"
                                            autoFocus
                                            register={register("amount", formValidation.freezeAmount)}
                                            errors={errors}
                                        />
                                    </div>


                                </div>
                            </div>
                            <div className="dark:border-[#ffffff38] dark:bg-slate-900 flex items-center justify-center p-6 border-t border-solid border-slate-200 rounded-b">
                                <button
                                    className="text-black bg-[#E1E1E1] font-normal px-6 flex gap-2 py-2.5 text-sm outline-none focus:outline-none rounded mr-6  ease-linear transition-all duration-150"
                                    type="button"
                                    onClick={() => handleFreeModal()}
                                    title={t("CLOSE")}
                                >
                                    <IoClose size={19} /> {t("CLOSE")}
                                </button>
                                <OButton
                                    extraClasses={"!px-6"}
                                    label={
                                        <>
                                            {t("O_SUBMIT")}
                                        </>
                                    }
                                    type="submit"
                                    title={t("O_SUBMIT")}
                                    onClick={handleSubmit(onSubmit)}
                                    loading={isLoading}
                                    disabled={isLoading}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black" />
        </div>
    );
};

export default FreezeBalancePopup;
