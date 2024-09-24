import OButton from "components/reusable/OButton";
import OInputField from "components/reusable/OInputField";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { IoClose } from "react-icons/io5";


const FreezeBalancePopup = ({ handleFreeModal }) => {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors, isDirty },
    } = useForm({ mode: "onChange", shouldFocusError: true, defaultValues: {} });


    const handleSubmitForm = async data => {
       console.log("DATA",data)
      }
    
    return (
        <>
            <div className="justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                <form method="post" onSubmit={handleSubmit(handleSubmitForm)}>
                    <div className={`relative w-auto my-6 mx-auto max-w-lg`}>
                        <div className="overflow-hidden border border-white dark:border-[#ffffff38] rounded-lg shadow-lg relative flex flex-col  bg-white outline-none focus:outline-none">
                            <div className="dark:bg-gray-900 flex items-center justify-between p-5 border-b dark:border-[#ffffff38] border-solid border-slate-200 rounded-t dark:bg-slate-900">
                                <h3 className="text-xl font-semibold dark:text-white">{t("FREEZE_BALANCE")}</h3>
                                <button className=" ml-auto flex items-center justify-center  text-black border-2 rounded-full  h-8 w-8 float-right text-3xl leading-none font-extralight outline-none focus:outline-none" onClick={() => handleFreeModal()}>
                                    <button type="button" title={t("CLOSE")} className="hover:text-blue-700 transition duration-150 ease-in-out" data-bs-toggle="tooltip">
                                        <span className=" text-[#B8BBBF]  text-4xl ">×</span>
                                    </button>
                                </button>
                            </div>

                            <div className="px-[50px] py-10">
                                <OInputField
                                    wrapperClassName="relative z-0 w-full group"
                                    name="firstName"
                                    placeholder={t("SET_FREEZE_AMOUNT")}
                                    type="text"
                                    autoFocus
                                    register={register("firstName")}
                                    errors={errors}
                                />

                            </div>

                            <div className="dark:border-[#ffffff38] dark:bg-slate-900 flex items-center justify-center p-6 border-t border-solid border-slate-200 rounded-b">
                                <button
                                    className="text-black bg-[#E1E1E1] font-normal px-6 flex gap-2 py-2.5 text-sm outline-none focus:outline-none rounded mr-6  ease-linear transition-all duration-150"
                                    type="button"
                                    onClick={()=>handleFreeModal()}
                                    title={t("CLOSE")}
                                >
                                    <IoClose size={19} /> {t("CLOSE")}
                                </button>
                                <OButton label={<>{t("O_SUBMIT")}</>} type="submit" disabled={isLoading} />
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black" />
        </>
    );
};

export default FreezeBalancePopup;
