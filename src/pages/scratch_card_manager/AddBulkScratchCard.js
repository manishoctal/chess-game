import ErrorMessage from "components/ErrorMessage";
import { useForm } from "react-hook-form";
import { apiPost } from "../../utils/apiFetch";
import apiPath from "../../utils/apiPath";
import useToastContext from "hooks/useToastContext";
import { useTranslation } from "react-i18next";
import ODatePicker from "components/shared/datePicker/ODatePicker";
import { useState } from "react";
import OInputField from "components/reusable/OInputField";
import FormValidation from "utils/formValidation";
import dayjs from "dayjs";
import helper from "utils/helpers";
import { toNumber } from "lodash";

const AddBulkScratchCard = ({ setShowBulkModal, allScratchCard }) => {
  const notification = useToastContext();
  const formValidation = FormValidation();
  const [date, setDate] = useState("");
  const [isValidityError, setIsValidityError] = useState(false);
  const [isLoading] = useState(false);
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onChange", shouldFocusError: true, defaultValues: {} });

  const handleSubmitForm = async (data) => {
    try {
      if (date === "") {
        setIsValidityError(true);
        return;
      }
      const path = apiPath.addBulkScratchCard;
      const payload = {
        ...data,
        expiryDate: date ? dayjs(date).format("YYYY-MM-DD") : null,
        numbersOfCoupon: toNumber(data?.numbersOfCoupon),
        couponAmount: toNumber(data?.couponAmount),
        rewardAmount: toNumber(data?.rewardAmount),
      };

      const result = await apiPost(path, payload);
      if (result?.data?.success === true) {
        notification.success(result?.data.message);
        allScratchCard();
        setShowBulkModal(false);
      } else {
        notification.error(result?.data?.message);
      }
    } catch (error) {
      console.error("error:", error.message);
    }
  };

  const handleDateChange = (dates) => {
    setDate(dates);
    setIsValidityError(false);
  };

  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative w-auto my-6 mx-auto max-w-3xl">
          <div className="md:py-4 sm:px-2 sm:py-8 px-7">
            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none lg:min-w-[762px]">
              <div className="dark:bg-gray-900 flex items-center justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                <h3 className="text-xl font-semibold dark:text-white">
                  {t("ADD_NEW_COUPON")}
                </h3>
                <button
                  className=" ml-auto flex items-center justify-center  text-black border-2 rounded-full  h-8 w-8 float-right text-3xl leading-none font-extralight outline-none focus:outline-none"
                  onClick={() => setShowBulkModal(false)}
                >
                  <span className=" text-[#B8BBBF]  text-4xl " title="Close">
                    ×
                  </span>
                </button>
              </div>
              <div className="relative p-6 flex-auto dark:bg-gray-800">
                <div className="grid grid-cols-2">
                  <div className="md:py-4 sm:px-2 sm:py-3 md:px-7 px-2">
                    <OInputField
                      wrapperClassName="relative z-0  w-full group"
                      name="numbersOfCoupon"
                      inputLabel={
                        <>
                          {t("NUMBER_OF_COUPON")}
                          <span className="text-red-500">*</span>
                        </>
                      }
                      type="text"
                      autoFocus
                      register={register(
                        "numbersOfCoupon",
                        formValidation["numbersOfCoupon"]
                      )}
                      errors={errors}
                    />
                  </div>
                  <div className="md:py-4 sm:px-2 sm:py-3 md:px-7 px-2">
                    <OInputField
                      wrapperClassName="relative z-0   w-full group"
                      name="couponAmount"
                      inputLabel={
                        <>
                          {t("COUPON_AMOUNT")}
                          <span className="text-red-500">*</span>
                        </>
                      }
                      type="number"
                      maxLength={15}
                      register={register(
                        "couponAmount",
                        formValidation["couponAmount"]
                      )}
                      errors={errors}
                    />
                  </div>
                  <div className="md:py-4 sm:px-2 sm:py-3 md:px-7 px-2">
                    <OInputField
                      wrapperClassName="relative z-0   w-full group"
                      name="rewardAmount"
                      inputLabel={
                        <>
                          {t("REWARD_AMOUNT")}
                          <span className="text-red-500">*</span>
                        </>
                      }
                      type="number"
                      maxLength={15}
                      onKeyDown={helper.preventForNumberInput}
                      register={register(
                        "rewardAmount",
                        formValidation["rewardAmount"]
                      )}
                      errors={errors}
                    />
                  </div>

                  <div className="md:py-4 sm:px-2 sm:py-3 md:px-7 px-2">
                    <div className="relative z-0  w-full group">
                      <label
                        htmlFor="validity"
                        className="font-medium text-sm text-[#000] dark:text-gray-400  mb-2 block"
                      >
                        {t("EXPIRY_DATE")}
                        <span className="text-red-500">*</span>
                      </label>
                      <ODatePicker
                        name="validity"
                        id="validity"
                        value={date}
                        // disable={counponData !== undefined}
                        handleDateChange={handleDateChange}
                        minDate="today"
                        placeholder={t("EXPIRY_DATE")}
                      />

                      {isValidityError && (
                        <ErrorMessage
                          message={t("PLEASE_SELECT_EXPIRY_DATE")}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="dark:bg-gray-900 flex items-center justify-center p-6 border-t border-solid border-slate-200 rounded-b">
                <button
                  className="text-black bg-[#E1E1E1] font-normal px-12 py-2.5 text-sm outline-none focus:outline-none rounded mr-6  ease-linear transition-all duration-150"
                  type="button"
                  onClick={() => setShowBulkModal(false)}
                >
                  {t("O_BACK")}
                </button>

                {isLoading ? (
                  <div className="spinner-container bg-LightBlue text-white active:bg-emerald-600 font-normal text-sm px-8 py-2.5 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1  ease-linear transition-all duration-150">
                    <div className="loading-spinner"></div>
                  </div>
                ) : (
                  <button
                    className="bg-gradientTo text-white active:bg-emerald-600 font-normal text-sm px-8 py-2.5 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1  ease-linear transition-all duration-150"
                    type="submit"
                    onClick={handleSubmit(handleSubmitForm, () => {
                      if (date === "") {
                        setIsValidityError(true);
                      }
                    })}
                  >
                    {t("O_ADD")}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black" />
    </>
  );
};

export default AddBulkScratchCard;
