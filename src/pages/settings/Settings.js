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
import imageDefault from "../../assets/images/No-image-found.jpg";
import OImage from "components/reusable/OImage";
import { Link } from "react-router-dom";
import Credential from "./Credential";
import FormValidation from "utils/formValidation";
import { preventMaxInput } from "utils/validations";
import helpers from "utils/helpers";
import DepositAmount from "./DepositAmount";
import { GrUpdate } from "react-icons/gr";

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
    mode: "onBlur",
    shouldFocusError: true,
    defaultValues: {
    },
  });
  const [settingChangeLoading, setSettingChangeLoading] = useState(false);
  const formValidation = FormValidation();
  const [pic] = useState(user?.profilePic ?? imageDefault);
  const [viewShowModal, setViewShowModal] = useState(false);
  const [isAmountModal, setIsAmountModal] = useState(false);
  const notification = useToastContext();


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

  const handleUserView = () => {
    setViewShowModal(true);
  };

  // get all setting function start

  const getSettings = async () => {
    try {
      const res = await apiGet(pathObj.getSettings);
      if (res) {
        reset(res?.data?.results);

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
  // get all setting function end

  useEffect(() => {
    updatePageName(t("SETTINGS"));
  }, []);

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

    playerCardPlatfromFee: {
      required: { value: true, message: t("PLEASE_ENTER_PLAYER_CARD_PLATFORM_FEE"), },
      maxLength: { value: 40, message: t("MAX_LIMIT_IS_40_CHARACTERS"), },
      min: { value: 1, message: t("MINIMUM_VALUE_MUST_IS_1"), },
    },

    stockPlatfromFee: {
      required: { value: true, message: t("PLEASE_ENTER_STOCK_PLATFORM_FEE"), },
      pattern: { value: /^\d+$/, message: t("ONLY_DIGITS_ARE_ALLOWED"), },
      maxLength: { value: 40, message: t("MAX_LIMIT_IS_40_CHARACTERS"), },
      min: { value: 1, message: t("MINIMUM_VALUE_MUST_IS_1"), },
    },
    questionTradePlatformKey: {
      required: { value: true, message: t("PLEASE_ENTER_QUESTION_TRADE_FEE"), },
      maxLength: { value: 40, message: t("MAX_LIMIT_IS_40_CHARACTERS"), },
      min: { value: 1, message: t("MINIMUM_VALUE_MUST_IS_1"), },
    },
    numberOfPlayerStocks: {
      required: { value: true, message: t("PLEASE_ENTER_NUMBER_OF_PLAYER_STOCK"), },
      maxLength: { value: 40, message: t("MAX_LIMIT_IS_40_CHARACTERS"), },
      min: { value: 1, message: t("MINIMUM_VALUE_MUST_IS_1"), },
    },
    numberOfPlayerCards: {
      required: { value: true, message: t("PLEASE_ENTER_NUMBER_OF_PLAYER_CARD"), },
      maxLength: { value: 40, message: t("MAX_LIMIT_IS_40 CHARACTERS"), },
      min: { value: 1, message: t("MINIMUM_VALUE_MUST_IS_1"), },
    },
    penaltyStockPercentage: {
      required: { value: true, message: t("PLEASE_ENTER_PENALTY_OF_STOCK_PERCENTAGE"), },
      maxLength: { value: 3, message: t("MAX_LIMIT_IS_3_CHARACTERS"), },
      min: { value: 1, message: t("MINIMUM_VALUE_MUST_IS_1"), },
    },
    maximumStockPurchase: {
      required: { value: true, message: t("PLEASE_ENTER_MAXIMUM_STOCK_CAN_PURCHASE"), },
      maxLength: { value: 3, message: t("MAX_LIMIT_IS_3_CHARACTERS"), },
      min: { value: 1, message: t("MINIMUM_VALUE_MUST_IS_1"), },
    },
    maximumCardPurchase: {
      required: { value: true, message: t("PLEASE_ENTER_MAXIMUM_CARD_CAN_PURCHASE"), },
      maxLength: { value: 3, message: t("MAX_LIMIT_IS_3 CHARACTERS"), },
      min: { value: 1, message: t("MINIMUM_VALUE_MUST_IS_1"), },
    },
    tds: {
      required: { value: true, message: t("PLEASE_ENTER_TDS"), },
      maxLength: { value: 3, message: t("MAX_LIMIT_IS_3_CHARACTERS"), },
      min: { value: 1, message: t("MINIMUM_VALUE_MUST_IS_1"), },
    },
    maximumSharesForTrade: {
      required: { value: true, message: t("PLEASE_ENTER_MAXIMUM_SHARE_FOR_TRADE"), },
      maxLength: { value: 3, message: t("MAX_LIMIT_IS_3 CHARACTERS"), },
      min: { value: 1, message: t("MINIMUM_VALUE_MUST_IS_1"), },
      valueAsNumber: true,
    },
    minimumSharesForTrade: {
      required: { value: true, message: t("PLEASE_ENTER_MINIMUM_SHARE_FOR_TRADE"), },
      maxLength: { value: 3, message: t("MAX_LIMIT_IS_3 CHARACTERS"), },
      min: { value: 1, message: t("MINIMUM_VALUE_MUST_IS_1"), },
      valueAsNumber: true,
      validate: (value) => value < watch('maximumSharesForTrade') || t("MIN_SHARE_FOR_TRADE_MUST_BE_LESS"),
    },

    playerCardT20: {
      required: { value: true, message: t("PLEASE_ENTER_PLAYER_CARD_T20"), },
      maxLength: { value: 3, message: t("MAX_LIMIT_IS_3_CHARACTERS"), },
      min: { value: 1, message: t("MINIMUM_VALUE_MUST_IS_1"), },
    },
    playerCardOdi: {
      required: { value: true, message: t("PLEASE_ENTER_PLAYER_CARD_ODI"), },
      maxLength: { value: 3, message: t("MAX_LIMIT_IS_3_CHARACTERS"), },
      min: { value: 1, message: t("MINIMUM_VALUE_MUST_IS_1"), },
    },
    playerCardTests: {
      required: { value: true, message: t("PLEASE_ENTER_PLAYER_CARD_TEST"), },
      maxLength: { value: 3, message: t("MAX_LIMIT_IS_3_CHARACTERS"), },
      min: { value: 1, message: t("MINIMUM_VALUE_MUST_IS_1"), },
    },
  }



  return (
    <section className="">
      <form>
        <section className="sm:px-8 px-4 py-4 ">
          <div className="border xl:w-full round">
            <header className="border-b  py-2 px-4 bg-gray-100 rounded-t-md dark:bg-gray-800 ">
              <div className="font-semibold dark:text-white">
                {t("SETTING")}
              </div>
            </header>
      
            <div className="bg-white py-6 px-4 rounded-b-md dark:bg-gray-800 dark:text-white">
              <div className="px-2 w-full">
                <div className="flex flex-col md:flex-row justify-between items-center">
                  <div className="flex flex-col sm:flex-row items-center">
                    <div className="relative w-24 h-24 mb-4 sm:mb-0">
                      <OImage
                        src={pic}
                        fallbackUrl="/images/user.png"
                        className="w-full h-full border rounded-full"
                        alt=""
                      />
                    </div>
                    <div className="pl-0 sm:pl-6 flex flex-col sm:flex-row items-center">
                      {(manager?.add || user?.role === "admin") && (
                        <Link to="/change-password" className="mb-4 sm:mb-0">
                          <OButton
                            label={<>{t("CHANGE_PASSWORD")}</>}
                            type="button"
                            loading={settingChangeLoading}
                            title={t("CHANGE_PASSWORD")}
                          />
                        </Link>
                      )}
                      <OButton
                        label={<>{t("VIEW_LOGIN_CREDENTIALS")}</>}
                        type="button"
                        onClick={() => handleUserView()}
                        loading={settingChangeLoading}
                        title={t("VIEW_LOGIN_CREDENTIALS")}
                        className="mt-4 sm:mt-0"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <main className="flex justify-center items-center flex-wrap grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-6"></main>
            </div>

          </div>
        </section>
      </form>

      <div className="sm:px-8 px-4 py-4 ">
        <div className="border  xl:w-full">
          <header className="border-b  py-2 px-4 bg-gray-100 rounded-t-md dark:bg-gray-800 ">
            <div className="font-semibold dark:text-white">{t("SETTINGS")}</div>
          </header>
          <div className="bg-white py-6 px-4  rounded-b-md dark:bg-gray-800 dark:text-white">
            <main className="justify-center flex-wrap grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1  gap-4">


              <div className="border border-1  border-[#E1DEDE] rounded-md p-4">
                <span className="block text-center p-2 text-sm font-bold bg-gray-100">{t("ADMIN_SETTING")}</span>
                <div className="relative z-0 mb-6 w-full group mt-4">
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

                <ReusableInputField
                  label={t("MIN_WITHDRAWAL_AMOUNT_TO_BANK")}
                  id="minWithdrawalLimit"
                  register={register}
                  errors={errors}
                  manager={manager}
                  validationRules={validationFields?.minWithdrawalLimit}
                />

                <ReusableInputField
                  label={t("Max_WITHDRAWAL_AMOUNT_TO_BANK")}
                  id="maxWithdrawalLimit"
                  register={register}
                  errors={errors}
                  manager={manager}
                  validationRules={validationFields?.maxWithdrawalLimit}
                />

                <ReusableInputField
                  label={t("REFERRAL_BONUS_FOR_TOURIST")}
                  id="referralAmount"
                  register={register}
                  manager={manager}
                  errors={errors}
                  validationRules={validationFields?.referralAmount}
                />
                <ReusableInputField
                  label={t("SIGN_UP_BONUS_FOR_LOCAL")}
                  id="signupBonus"
                  register={register}
                  manager={manager}
                  errors={errors}
                  validationRules={validationFields.signupBonus}
                />
              </div>
              <div className="border border-1  border-[#E1DEDE] rounded-md p-4">
                <div className="mb-4">
                  <span className="block text-center text-sm p-2 font-bold bg-gray-100">{t("PLATFORM_FEE_HEADING")}</span>
                </div>
                <ReusableInputField
                  label={t("PLATFORM_FEE")}
                  id="playerCardPlatfromFee"
                  register={register}
                  manager={manager}
                  errors={errors}
                  validationRules={validationFields?.playerCardPlatfromFee}
                />

                <ReusableInputField
                  label={t("PLATFORM_FEE_STOCK_PERCENTAGE")}
                  id="stockPlatfromFee"
                  register={register}
                  errors={errors}
                  manager={manager}
                  validationRules={validationFields?.stockPlatfromFee}
                />

                <ReusableInputField
                  label={t("PLATFORM_FEE_QUESTION_TRADE")}
                  id="questionTradePlatformKey"
                  register={register}
                  errors={errors}
                  manager={manager}
                  validationRules={validationFields?.questionTradePlatformKey}
                />

                <ReusableInputField
                  label={t("TDS_IN_PERCENTAGE")}
                  id="tds"
                  manager={manager}
                  register={register}
                  errors={errors}
                  validationRules={validationFields?.tds}
                />
              </div>
              <div className="border border-1  border-[#E1DEDE] rounded-md p-4">
                <div className="mb-4">
                  <span className="block text-center text-sm p-2 font-bold bg-gray-100">{t("CARD_AND_STOCK_DETAILS")}</span>
                </div>
                <ReusableInputField
                  label={t("NUMBER_OF_PLAYER_STOCK")}
                  id="numberOfPlayerStocks"
                  register={register}
                  errors={errors}
                  manager={manager}
                  validationRules={validationFields?.numberOfPlayerStocks}
                />

                <ReusableInputField
                  label={t("NUMBER_OF_PLAYER_CARD")}
                  id="numberOfPlayerCards"
                  register={register}
                  manager={manager}
                  errors={errors}
                  validationRules={validationFields?.numberOfPlayerCards}
                />

                <ReusableInputField
                  label={t("PENALTY_OF_PERCENTAGE")}
                  id="penaltyStockPercentage"
                  register={register}
                  manager={manager}
                  errors={errors}
                  validationRules={validationFields?.penaltyStockPercentage}
                />

                <ReusableInputField
                  label={t("MAXIMUM_STOCK_USER_CAN_PURCHASE")}
                  id="maximumStockPurchase"
                  register={register}
                  manager={manager}
                  errors={errors}
                  validationRules={validationFields?.maximumStockPurchase}
                />

                <ReusableInputField
                  label={t("MAXIMUM_CARD_USER_CAN_PURCHASE")}
                  id="maximumCardPurchase"
                  register={register}
                  errors={errors}
                  manager={manager}
                  validationRules={validationFields?.maximumCardPurchase}
                />

                {/* <ReusableInputField
                  label={t("TDS_IN_PERCENTAGE")}
                  id="tds"
                  manager={manager}
                  register={register}
                  errors={errors}
                  validationRules={validationFields?.tds}
                /> */}
              </div>

              <div className="border border-1  border-[#E1DEDE] rounded-md p-4">
                <div className="mb-4">
                  <span className="block text-center text-sm p-2 font-bold bg-gray-100">{t("OTHER_SETTING")}</span>
                </div>
                <ReusableInputField
                  label={t("MAXIMUM_SHARE_FOR_TRADE")}
                  id="maximumSharesForTrade"
                  register={register}
                  errors={errors}
                  manager={manager}
                  validationRules={validationFields?.maximumSharesForTrade}
                />

                <ReusableInputField
                  label={t("MINIMUM_SHARE_FOR_TRADE")}
                  id="minimumSharesForTrade"
                  register={register}
                  errors={errors}
                  manager={manager}
                  validationRules={validationFields?.minimumSharesForTrade}
                />

                <ReusableInputField
                  label={t("PLAYER_CARD_T20")}
                  id="playerCardT20"
                  manager={manager}
                  register={register}
                  errors={errors}
                  validationRules={validationFields?.playerCardT20}
                />
                <ReusableInputField
                  label={t("PLAYER_CARD_ODI")}
                  id="playerCardOdi"
                  register={register}
                  errors={errors}
                  manager={manager}
                  validationRules={validationFields?.playerCardOdi}
                />
                <ReusableInputField
                  label={t("PLAYER_CARD_TEST")}
                  id="playerCardTests"
                  register={register}
                  errors={errors}
                  manager={manager}
                  validationRules={validationFields?.playerCardTests}
                />
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

const ReusableInputField = ({ label, id, register, errors, validationRules, manager }) => (
  <div className="relative z-0 mb-6 w-full group">
    <OInputField
      type="number"
      wrapperClassName="relative z-0  w-full group"
      maxLength={40}
      labelType={true}
      disable={manager?.add === false}
      inputLabel={<>{label}</>}
      id={id}
      register={register(id, validationRules)}
      placeholder=" "
    />
    <ErrorMessage message={errors?.[id]?.message} />
  </div>
);