import useToastContext from "hooks/useToastContext";
import React, { useState, useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { apiPost } from "utils/apiFetch";
import pathObj from "utils/apiPath";
import OButton from "components/reusable/OButton";
import { validationRules } from "utils/constants";
import AuthContext from "context/AuthContext";
import { useTranslation } from "react-i18next";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { preventMaxInput } from "utils/validations";
import OInputField from "components/reusable/OInputField";
import { isEmpty } from "lodash";

const ChangePassword = () => {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    reset,
    watch,
    trigger,
    getValues,
    formState: { errors, isDirty },
  } = useForm({ mode: "onChange", shouldFocusError: true, defaultValues: {} });

  const [changePasswordLoading, setChangePasswordLoading] = useState(false);
  const notification = useToastContext();
  const { logoutUser } = useContext(AuthContext);
  const [icon, setIcon] = useState(true);
  const [icon2, setIcon2] = useState(true);
  const [icon3, setIcon3] = useState(true);

  const handleSubmitForm = async (data) => {
    try {
      if (!isDirty) {
        notification.info("Please enter something.");
        return;
      }
      setChangePasswordLoading(true);

      const res = await apiPost(pathObj.changePassword, {
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      });
      if (res.data.success) {
        reset();
        notification.success(res?.data?.message);
        logoutUser();
      } else {
        notification.error(res?.data?.message);
      }
    } catch (err) {
      console.log("err:", err);
    } finally {
      setChangePasswordLoading(false);
    }
  };

  function changeIcon() {
    setIcon(!icon);
  }
  function changeIcon2() {
    setIcon2(!icon2);
  }
  function changeIcon3() {
    setIcon3(!icon3);
  }

  const newPassword = watch("newPassword");
  useEffect(() => {
    if (!isEmpty(newPassword)) {
      trigger("confirm_password");
    }
  }, [newPassword, trigger]);

  return (
    <div className="bg-[#F9F9F9] dark:bg-slate-900">
      <div className="px-3 py-4">
        <div className="bg-white border border-[#E9EDF9] rounded-lg py-4 dark:bg-slate-800">
          <form onSubmit={handleSubmit(handleSubmitForm)} method="post">
            <div className="grid md:grid-cols-3 sm:grid-cols-2">
              <div className="py-4 px-4">
                <div className="relative">
                  <OInputField
                    wrapperClassName="relative z-0 w-full group"
                    type={icon ? "password" : "text"}
                    name="oldPassword"
                    id="oldPassword"
                    autoFocus
                    autocomplete="new-password"
                    inputLabel={
                      <>
                        {t("CHANGE_PASSWORD_OLD_PASSWORD")}
                        <span className="text-red-500">*</span>
                      </>
                    }
                    disableAutofill
                    errors={errors}
                    onInput={(e) => preventMaxInput(e, 15)}
                    register={register("oldPassword", {
                      required: "Please enter old password.",
                      validate: {
                        whiteSpace: (value) => value.trim() ? true : "White spaces not allowed."
                      },
                      pattern: {
                        value: validationRules.password,
                        message:
                          "Old password must contain lowercase,uppercase characters, numbers, special character and must be 8 character long.",
                      },
                    })}
                  />
                  {icon ? (
                    <span
                      className="password_view absolute top-[41px] right-[20px]"
                      onClick={() => changeIcon()}
                    >
                      <AiFillEyeInvisible className="dark:text-white" />
                    </span>
                  ) : (
                    <span
                      className="password_view absolute top-[41px] right-[20px]"
                      onClick={() => changeIcon()}
                    >
                      <AiFillEye className="dark:text-white" />
                    </span>
                  )}
                </div>
              </div>
              <div className="py-4 px-4 ">
                <div className="relative">
                  <OInputField
                    wrapperClassName="relative z-0 w-full group"
                    type={icon2 ? "password" : "text"}
                    name="newPassword"
                    id="newPassword"
                    errors={errors}
                    inputLabel={
                      <>
                        {t("CHANGE_PASSWORD_NEW_PASSWORD")}
                        <span className="text-red-500">*</span>
                      </>
                    }
                    onInput={(e) => preventMaxInput(e, 15)}
                    register={register("newPassword", {
                      required: "Please enter new password.",
                      pattern: {
                        value: validationRules.password,
                        message: validationRules.newPasswordMessage,
                      },
                    })}
                  />
                  {icon2 ? (
                    <span
                      className="password_view absolute top-[41px] right-[20px]"
                      onClick={() => changeIcon2()}
                    >
                      <AiFillEyeInvisible className="dark:text-white" />
                    </span>
                  ) : (
                    <span
                      className="password_view absolute top-[41px] right-[20px]"
                      onClick={() => changeIcon2()}
                    >
                      <AiFillEye className="dark:text-white" />
                    </span>
                  )}
                </div>
              </div>
              <div className="py-4 px-4 ">
                <div className="relative">
                  <OInputField
                    wrapperClassName="relative z-0 w-full group"
                    type={icon3 ? "password" : "text"}
                    name="confirm_password"
                    id="confirm_password"
                    errors={errors}
                    inputLabel={
                      <>
                        {t("CHANGE_PASSWORD_CONFIRM_PASSWORD")}
                        <span className="text-red-500">*</span>
                      </>
                    }
                    onInput={(e) => preventMaxInput(e, 15)}
                    register={register("confirm_password", {
                      required: "Please enter confirm password.",
                      pattern: {
                        value: validationRules.password,
                        message: validationRules.confirmPasswordMessage,
                      },
                      validate: (value, { getValues }) => {
                        const { newPassword } = getValues();
                        return newPassword === value || "New password and confirm password do not match.";
                      },
                    })}
                  />
                  {icon3 ? (
                    <span
                      className="password_view absolute top-[41px] right-[20px]"
                      onClick={() => changeIcon3()}
                    >
                      <AiFillEyeInvisible className="dark:text-white" />
                    </span>
                  ) : (
                    <span
                      className="password_view absolute top-[41px] right-[20px]"
                      onClick={() => changeIcon3()}
                    >
                      <AiFillEye className="dark:text-white" />
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-center mt-4">
              {changePasswordLoading ? (
                <button className="bg-gradientTo text-white active:bg-emerald-600 font-normal text-sm px-8 py-2.5 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1  ease-linear transition-all duration-150">
                  <div className="spinner-container">
                    <div className="loading-spinner" />
                  </div>
                </button>
              ) : (
                <OButton
                  disabled={!isDirty}
                  label={<>{t("O_SUBMIT")}</>}
                  type="submit"
                />
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
