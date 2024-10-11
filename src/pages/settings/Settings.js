import ErrorMessage from "../../components/ErrorMessage";
import React, { useContext, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { apiGet, apiPut } from "../../utils/apiFetch";
import pathObj from "../../utils/apiPath";
import useToastContext from "hooks/useToastContext";
import OButton from "components/reusable/OButton";
import { useTranslation } from "react-i18next";
import AuthContext from "context/AuthContext";
import OInputField from "components/reusable/OInputField";
import Credential from "./Credential";
import FormValidation from "utils/formValidation";
import { preventMaxInput } from "utils/validations";
import helpers from "utils/helpers";
import DepositAmount from "./DepositAmount";
import { GrUpdate } from "react-icons/gr";
import { handleKeyDownCashIn, preventMaxHundred } from "utils/reusableMethods";
import Commission from "./Commission";
import GstComponent from "./GstComponent";

const Settings = () => {
  const { logoutUser, user, updatePageName } = useContext(AuthContext);
  const manager = user?.permission?.find((e) => e.manager === "settings") ?? {};
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { isDirty, errors },
  } = useForm({
    mode: "onChange",
    shouldFocusError: true,
    defaultValues: {
    },
  });
  const [settingChangeLoading, setSettingChangeLoading] = useState(false);
  const formValidation = FormValidation();
  const [viewShowModal, setViewShowModal] = useState(false);
  const [isAmountModal, setIsAmountModal] = useState(false);
  const notification = useToastContext();
  const [saveSettingData, setSaveSettingData] = useState("")

  // change setting function start
  const handleSubmitForm = async (data) => {
    try {
      setSettingChangeLoading(true);
      const payload = { ...data, adminEmail: data?.adminEmail?.toLowerCase() }
      const res = await apiPut(pathObj.getSettings, payload);
      if (res.data.success === true) {
        getSettings();
        notification.success(res?.data?.message);
      } else {
        notification.error(res?.data?.message);
      }
    } catch (err) {
      console.error("err:", err);
    } finally {
      setSettingChangeLoading(false);
    }
  };

  // change setting function end

  // get all setting function start

  const getSettings = async () => {
    try {
      const res = await apiGet(pathObj.getSettings);
      if (res) {
        reset(res?.data?.results);
        console.log("res", res)
        setSaveSettingData(res?.data?.results)
      }
    } catch (error) {
      console.error("error:", error);

      if (error.response.status === 401 || error.response.status === 409) {
        logoutUser();
      }
    }
  };

  useEffect(() => {
    getSettings();
  }, []);

  useEffect(() => {
    updatePageName(t("SETTINGS"));
  }, []);

  const urlPattern = /^(http(s):\/\/.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/;

  const validationFields = {

    minWithdrawalLimit: {
      required: { value: true, message: t("PLEASE_ENTER_MINIMUM_WITHDRAWAL_AMOUNT_TO_BANK"), },
      maxLength: { value: 40, message: t("MAX_LIMIT_IS_40_CHARACTERS"), },
      min: { value: 1, message: t("MINIMUM_VALUE_MUST_IS_1"), },
      valueAsNumber: true,
      validate: (value) => value < watch('maxWithdrawalLimit') || t("MIN_VALUE_MUST_BE_LESS_THAN_MAX_VALUE"),
    },

    maxWithdrawalLimit: {
      required: { value: true, message: t("PLEASE_ENTER_MAXIMUM_WITHDRAWAL_AMOUNT_TO_BANK"), },
      maxLength: { value: 40, message: t("MAX_LIMIT_IS_40_CHARACTERS"), },
      min: { value: 1, message: t("MINIMUM_VALUE_MUST_IS_1"), },
      valueAsNumber: true,
    },
    referralAmount: {
      required: { value: true, message: t("PLEASE_ENTER_REFERRAL_AMOUNT"), },
      maxLength: { value: 40, message: t("MAX_LIMIT_IS_40_CHARACTERS"), },
      min: { value: 1, message: t("MINIMUM_VALUE_MUST_IS_1"), },
    },
    signupBonus: {
      required: { value: true, message: t("PLEASE_ENTER_SIGN_UP_BONUS_FOR_LOCAL"), },
      maxLength: { value: 40, message: t("MAX_LIMIT_IS_40_CHARACTERS"), },
      min: { value: 1, message: t("MINIMUM_VALUE_MUST_IS_1"), },
    },

    platformFee: {
      required: { value: true, message: t("PLEASE_ENTER_PLAYER_CARD_PLATFORM_FEE"), },
      min: {
        value: 0.01,
        message: 'Minimum value must is 0.01.'
      }
    },

    gstTimeDeposit: {
      required: { value: true, message: t("PLEASE_ENTER_GST"), },
      min: {
        value: 0.01,
        message: 'Minimum value must is 0.01.'
      }
    },

    tds: {
      required: { value: true, message: t("PLEASE_ENTER_TDS"), },
      min: {
        value: 0.01,
        message: 'Minimum value must is 0.01.'
      }
    },

    youtube: {
      required: {
        value: true,
        message: t("PLEASE_ENTER_YOUTUBE_URL"),
      },

      pattern: {
        value: urlPattern,
        message: t("PLEASE_ENTER_VALID_YOUTUBE_URL"),
      },
    },
    instagram: {
      required: {
        value: true,
        message: t("PLEASE_ENTER_INSTAGRAM_URL"),
      },
      pattern: {
        value: urlPattern,
        message: t("PLEASE_ENTER_VALID_INSTAGRAM_URL"),
      },
    },

    twitter: {
      required: {
        value: true,
        message: t("PLEASE_ENTER_TWITTER_URL"),
      },
      pattern: {
        value: urlPattern,
        message: t("PLEASE_ENTER_VALID_TWITTER_URL"),
      },
    },

    linkedin: {
      required: {
        value: true,
        message: t("PLEASE_ENTER_LINKEDIN_URL"),
      },
      pattern: {
        value: urlPattern,
        message: t("PLEASE_ENTER_VALID_LINKEDIN_URL"),
      },
    },
  }


  return (
    <section className="">
      <div className="sm:px-8 px-4 py-4 ">
        <div className="border  xl:w-full mb-5">
          <header className="border-b  py-2 px-4 bg-gray-100 rounded-t-md dark:bg-gray-800 ">
            <div className="font-semibold dark:text-white">{t("SETTINGS")}</div>
          </header>
          <div className="bg-white py-6 px-4  rounded-b-md dark:bg-gray-800 dark:text-white">
            <main className="justify-center flex-wrap grid lg:grid-cols-1 md:grid-cols-3 sm:grid-cols-2 grid-cols-1  gap-4">

              <div className="grid grid-cols-3 gap-x-5 border p-5 rounded-md">

                <div className="mb-4">
                  <OInputField
                    wrapperClassName="relative z-0  w-full group"
                    type="text"
                    inputLabel={<>{t("ADMIN_EMAIL_ADDRESS")}</>}
                    id="adminEmail"
                    maxLength={50}
                    autoComplete="off"
                    onInput={(e) => preventMaxInput(e, 50)}
                    register={register("adminEmail", formValidation["email"])}
                    placeholder=" "
                    disable={manager?.add === false}
                  />
                  <ErrorMessage message={errors?.adminEmail?.message} />
                </div>


                <div className="">
                  <OInputField
                    wrapperClassName="relative z-0  w-full group"
                    type="text"
                    name="minWithdrawalLimit"
                    inputLabel={<>{t("MIN_WITHDRAWAL_AMOUNT_TO_BANK")}</>}
                    id="minWithdrawalLimit"
                    autoComplete="off"
                    onInput={(e) => preventMaxInput(e, 50)}
                    register={register("minWithdrawalLimit", validationFields?.minWithdrawalLimit)}
                    placeholder=" "
                    disable={manager?.add === false}
                  />
                  <ErrorMessage message={errors?.minWithdrawalLimit?.message} />
                </div>


                <div className="">
                  <OInputField
                    wrapperClassName="relative z-0  w-full group"
                    type="text"
                    name="maxWithdrawalLimit"
                    inputLabel={<>{t("Max_WITHDRAWAL_AMOUNT_TO_BANK")}</>}
                    id="maxWithdrawalLimit"
                    autoComplete="off"
                    onInput={(e) => preventMaxInput(e, 50)}
                    register={register("maxWithdrawalLimit", validationFields?.maxWithdrawalLimit)}
                    placeholder=" "
                    disable={manager?.add === false}
                  />
                  <ErrorMessage message={errors?.maxWithdrawalLimit?.message} />
                </div>


                <ReusableInputField
                  label={t("PLATFORM_FEE")}
                  id="platformFee"
                  register={register}
                  manager={manager}
                  maxLength={3}
                  errors={errors}

                  validationRules={validationFields?.platformFee}
                />

                <div className="">
                  <OInputField
                    wrapperClassName="relative z-0  w-full group"
                    type="number"
                    name="platformFee"
                    inputLabel={<>{t("WITHDRAWAL_REQUEST_EXPIRY_HOURS")}</>}
                    id="platformFee"
                    autoComplete="off"
                    onInput={preventMaxHundred}
                    register={register("platformFee", validationFields?.maxWithdrawalLimit)}
                    placeholder=" "
                    disable={manager?.add === false}
                    onKeyDown={handleKeyDownCashIn} 
                  />
                  <ErrorMessage message={errors?.maxWithdrawalLimit?.message} />
                </div>


              </div>

              <div className="border p-5 rounded-md social-media">
                <h2 className='text-2xl mb-6 font-medium'>Social Links</h2>

                <div className="grid grid-cols-4 gap-x-5">
                  <div className="mb-4">
                    <OInputField
                      wrapperClassName="relative z-0  w-full group"
                      type="text"
                      inputLabel={<>{t("YOUTUBE")}</>}
                      id="youtube"
                      maxLength={50}
                      autoComplete="off"
                      onInput={(e) => preventMaxInput(e, 50)}
                      register={register("youtube", validationFields?.youtube)}
                      placeholder=" "
                      disable={manager?.add === false}
                    />
                    <ErrorMessage message={errors?.youtube?.message} />
                  </div>

                  <div className="mb-4">
                    <OInputField
                      wrapperClassName="relative z-0  w-full group"
                      type="text"
                      inputLabel={<>{t("INSTAGRAM")}</>}
                      id="instagram"
                      maxLength={50}
                      autoComplete="off"
                      onInput={(e) => preventMaxInput(e, 50)}
                      register={register("instagram", validationFields?.instagram)}
                      placeholder=" "
                      disable={manager?.add === false}
                    />
                    <ErrorMessage message={errors?.instagram?.message} />
                  </div>

                  <div className="mb-4">
                    <OInputField
                      wrapperClassName="relative z-0  w-full group"
                      type="text"
                      inputLabel={<>{t("LINKEDIN")}</>}
                      id="linkedin"
                      maxLength={50}
                      autoComplete="off"
                      onInput={(e) => preventMaxInput(e, 50)}
                      register={register("linkedin", validationFields?.linkedin)}
                      placeholder=" "
                      disable={manager?.add === false}
                    />
                    <ErrorMessage message={errors?.linkedin?.message} />
                  </div>

                  <div className="mb-4">
                    <OInputField
                      wrapperClassName="relative z-0  w-full group"
                      type="text"
                      inputLabel={<>{t("TWITTER")}</>}
                      id="twitter"
                      maxLength={50}
                      autoComplete="off"
                      onInput={(e) => preventMaxInput(e, 50)}
                      register={register("twitter", validationFields?.twitter)}
                      placeholder=" "
                      disable={manager?.add === false}
                    />
                    <ErrorMessage message={errors?.twitter?.message} />
                  </div>
                </div>
              </div>





            </main>

            {(manager?.add || user?.role === "admin") && (
              <div className="text-center mt-8">
                <OButton
                  disabled={!isDirty}
                  label={<><GrUpdate size={16} className="mr-2" />{t("O_UPDATE")}</>}
                  type="submit"
                  onClick={handleSubmit(handleSubmitForm)}
                  loading={settingChangeLoading}
                  title={t("O_UPDATE")}
                />
              </div>
            )}
          </div>
        </div>

        <div className="border p-5 rounded-md mb-5">
          <GstComponent saveSettingData={saveSettingData} />
        </div>
        <div className="border p-5 rounded-md">
          <Commission saveSettingData={saveSettingData} />
        </div>

      </div>

      {viewShowModal ? (
        <Credential setViewShowModal={setViewShowModal} email={user?.email} />
      ) : null}
      {helpers.andOperator(
        isAmountModal,
        <DepositAmount
          getSettings={getSettings}
          setIsAmountModal={setIsAmountModal}
        />
      )}
    </section>
  );
};

export default Settings;

const ReusableInputField = ({ label, id, register, errors, validationRules, manager, labelType }) => (
  <div className="relative z-0 mb-6 w-full group">
    <OInputField
      type="number"
      wrapperClassName="relative z-0  w-full group"
      labelType={labelType}
      disable={manager?.add === false}
      inputLabel={<>{label}</>}
      id={id}
      onInput={preventMaxHundred}
      onKeyDown={handleKeyDownCashIn}
      register={register(id, validationRules)}
      placeholder=" "
    />
    <ErrorMessage message={errors?.[id]?.message} />
  </div>
);