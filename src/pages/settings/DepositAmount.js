import ErrorMessage from "components/ErrorMessage";
import { useForm } from "react-hook-form";
import { apiPost } from "../../utils/apiFetch";
import apiPath from "../../utils/apiPath";
import useToastContext from "hooks/useToastContext";
import { useTranslation } from "react-i18next";
import helper from "utils/helpers";
import { toNumber } from "lodash";

const DepositAmount = ({ setIsAmountModal, getSettings }) => {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onChange", shouldFocusError: true, defaultValues: {} });

  const notification = useToastContext();
  const handleSubmitForm = async (data) => {
    try {
      const path = apiPath.depositAmount;
      const result = await apiPost(path, { amount: toNumber(data?.amount) });
      if (result?.data?.success === true) {
        notification.success(result?.data.message);
        getSettings();
        setIsAmountModal(false);
      } else {
        notification.error(result?.data?.message);
      }
    } catch (error) {
      console.error("error:", error.message);
    }
  };

  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <form onSubmit={handleSubmit(handleSubmitForm)} method="post">
          <div className="relative w-auto my-6 mx-auto max-w-3xl">
            <div className="overflow-hidden border border-white dark:border-[#ffffff38] rounded-lg shadow-lg relative flex flex-col min-w-[502px] bg-white outline-none focus:outline-none">
              <div className=" flex items-center justify-between p-5 border-b dark:border-[#ffffff38] border-solid border-slate-200 rounded-t dark:bg-slate-900">
                <h3 className="text-xl font-semibold dark:text-white flex items-center">
                  {t("DEPOSIT_AMOUNT_IN_ADMIN_WALLET")}
                </h3>
                <button
                  className=" ml-auto flex items-center justify-center  text-black border-2 rounded-full  h-8 w-8 float-right text-3xl leading-none font-extralight outline-none focus:outline-none"
                  onClick={() => setIsAmountModal(false)}
                >
                  <button
                    type="button"
                    className="hover:text-blue-700 transition duration-150 ease-in-out"
                    title={t("CLOSE")}
                    data-bs-toggle="tooltip"
                  >
                    <span className=" text-[#B8BBBF]  text-4xl ">×</span>
                  </button>
                </button>
              </div>

              <div className="relative p-6 flex-auto dark:bg-slate-800">
                <div className="grid grid-cols-1">
                  <div className="w-full">
                    <div
                      method="post"
                      onSubmit={handleSubmit(handleSubmitForm)}
                      className="w-full"
                    >
                      <div className="relative z-0 mb-6 w-full">
                        <input
                          type="number"
                          id="amount"
                          name="amount"
                          className="py-4 px-3 w-full text-sm text-gray-900 bg-transparent border-2 rounded-lg border-[#DFDFDF] appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0  peer"
                          autoFocus
                          step="any"
                          placeholder=" "
                          onKeyPress={helper.preventForNumberInput}
                          max={99999999}
                          {...register("amount", {
                            required: t("PLEASE_ENTER_AMOUNT"),
                            min: {
                              value: 1,
                              message: t("MINIMUM_AMOUNT_MUST_BE_1"),
                            },
                            max: {
                              value: 99999999,
                              message: t("MAXIMUM_AMOUNT_MUST_BE_99999999"),
                            },
                            validate: {
                              whiteSpace: (value) =>
                                value.trim()
                                  ? true
                                  : t("WHITE_SPACES_NOT_ALLOWED"),
                            },
                          })}
                        />
                        <label
                          for="amount"
                          maxLength={200}
                          className="dark:bg-slate-800 peer-focus:font-normal absolute text-sm text-[#A5A5A5] dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 left-3 bg-white p-2 z-10 origin-[2] peer-focus:left-0 peer-focus:text-[#A5A5A5] peer-focus:text-lg peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-8"
                        >
                          {t("ADD_AMOUNT")}
                          <span className="text-red-500">*</span>
                        </label>
                        <ErrorMessage message={errors?.amount?.message} />
                      </div>
                    </div>
                  </div>
                  <div />
                </div>
              </div>
              <div className="dark:border-[#ffffff38] dark:bg-slate-900 flex items-center justify-center p-6 border-t border-solid border-slate-200 rounded-b">
                <button
                  className="text-black bg-[#E1E1E1] font-normal px-12 py-2.5 text-sm outline-none focus:outline-none rounded mr-6  ease-linear transition-all duration-150"
                  type="button"
                  onClick={() => setIsAmountModal(false)}
                >
                  {t("CLOSE")}
                </button>
                <button
                  className="bg-gradientTo text-white active:bg-emerald-600 font-normal text-sm px-8 py-2.5 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1  ease-linear transition-all duration-150"
                  type="submit"
                >
                  {t("O_ADD")}
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

export default DepositAmount;
