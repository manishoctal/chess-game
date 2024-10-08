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
import ErrorMessage from "components/ErrorMessage";

const ChangePassword = () => {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    reset,
    watch,
    trigger,
    formState: { errors, isDirty },
  } = useForm({ mode: "onChange", shouldFocusError: true, defaultValues: {} });

  const [changePasswordLoading, setChangePasswordLoading] = useState(false);
  const notification = useToastContext();
  const { logoutUser, updatePageName, user } = useContext(AuthContext);
  const [icon, setIcon] = useState(true);
  const [icon2, setIcon2] = useState(true);
  const [icon3, setIcon3] = useState(true);

  useEffect(() => {
    reset({
      question: user.question,
      answer: user.answer,
    });
  }, [user]);

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
        question: data.question,
        answer: data.answer,
      });
      if (res.data.success) {
        reset();
        notification.success(res?.data?.message);
        logoutUser();
      } else {
        notification.error(res?.data?.message);
      }
    } catch (err) {
      console.error("err:", err);
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

  useEffect(() => {
    updatePageName("Change password");
  }, []);

  return (
    <div className="sm:px-8 px-4 py-4 ">
      <div className="border  xl:w-full">
        <header className="border-b  py-2 px-4 bg-gray-100 rounded-t-md dark:bg-gray-800" style={{ height: "40px" }}>
          <div className="font-semibold dark:text-white"></div>
        </header>
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
                  placeholder={t("ENTER_OLD_PASSWORD")}
                  autocomplete="new-password"
                  inputLabel={
                    <>
                      {t("CHANGE_PASSWORD_OLD_PASSWORD")}
                      <span className="text-red-500">*</span>
                    </>
                  }
                  disableAutofill
                  errors={errors}
                  onInput={(e) => preventMaxInput(e, 16)}
                  register={register("oldPassword", {
                    required: "Please enter old password.",
                    validate: {
                      whiteSpace: (value) => (value.trim() ? true : t("WHITE_SPACES_NOT_ALLOWED")),
                    },
                    pattern: {
                      value: validationRules.password,
                      message: "Old password must contain lowercase, uppercase characters, numbers, a special character, and be between 8 to 16 characters long.",
                    },
                  })}
                />
                {icon ? (
                  <span className="password_view absolute top-[41px] right-[20px]" onClick={() => changeIcon()}>
                    <AiFillEyeInvisible className="dark:text-white" />
                  </span>
                ) : (
                  <span className="password_view absolute top-[41px] right-[20px]" onClick={() => changeIcon()}>
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
                  placeholder={t("ENTER_NEW_PASSWORD")}
                  errors={errors}
                  inputLabel={
                    <>
                      {t("CHANGE_PASSWORD_NEW_PASSWORD")}
                      <span className="text-red-500">*</span>
                    </>
                  }
                  onInput={(e) => preventMaxInput(e, 16)}
                  register={register("newPassword", {
                    required: "Please enter new password.",
                    pattern: {
                      value: validationRules.password,
                      message: validationRules.newPasswordMessage,
                    },
                  })}
                />
                {icon2 ? (
                  <span className="password_view absolute top-[41px] right-[20px]" onClick={() => changeIcon2()}>
                    <AiFillEyeInvisible className="dark:text-white" />
                  </span>
                ) : (
                  <span className="password_view absolute top-[41px] right-[20px]" onClick={() => changeIcon2()}>
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
                  placeholder={t("ENTER_CONFIRM_PASSWORD")}
                  errors={errors}
                  inputLabel={
                    <>
                      {t("CHANGE_PASSWORD_CONFIRM_PASSWORD")}
                      <span className="text-red-500">*</span>
                    </>
                  }
                  onInput={(e) => preventMaxInput(e, 16)}
                  register={register("confirm_password", {
                    required: "Please enter confirm password.",
                    validate: (val) => {
                      if (watch("newPassword") !== val) {
                        return "Confirm Password field is not matching with new password field.";
                      }
                    },
                  })}
                />
                {icon3 ? (
                  <span className="password_view absolute top-[41px] right-[20px]" onClick={() => changeIcon3()}>
                    <AiFillEyeInvisible className="dark:text-white" />
                  </span>
                ) : (
                  <span className="password_view absolute top-[41px] right-[20px]" onClick={() => changeIcon3()}>
                    <AiFillEye className="dark:text-white" />
                  </span>
                )}
              </div>
            </div>
            <div className="py-4 px-4">
              <div className="relative">
                <OInputField
                  type="text"
                  name="question"
                  id="question"
                  inputLabel={
                    <>
                      Security question<span className="text-red-500">*</span>
                    </>
                  }
                  wrapperClassName="relative z-0  w-full group"
                  placeholder=" "
                  maxLength={500}
                  register={register("question", {
                    required: t("PLEASE_ENTER_QUESTION"),
                    minLength: {
                      value: 2,
                      message: t("MINIMUM_LENGTH_MUST_BE_2"),
                    },
                    maxLength: {
                      value: 500,
                      message: "Minimum length must be 500.",
                    },
                    validate: {
                      whiteSpace: (value) => (value.trim() ? true : t("WHITE_SPACES_NOT_ALLOWED")),
                    },
                  })}
                />
                <ErrorMessage message={errors?.question?.message} />
              </div>
            </div>
            <div className="py-4 px-4">
              <div className="relative">
                <OInputField
                  type="text"
                  name="answer"
                  id="answer"
                  inputLabel={
                    <>
                      Answer<span className="text-red-500">*</span>
                    </>
                  }
                  wrapperClassName="relative z-0  w-full group"
                  placeholder=" "
                  maxLength={500}
                  register={register("answer", {
                    required: t("PLEASE_ENTER_ANSWER"),
                    minLength: {
                      value: 2,
                      message: t("MINIMUM_LENGTH_MUST_BE_2"),
                    },
                    maxLength: {
                      value: 500,
                      message: "Minimum length must be 500.",
                    },
                    validate: {
                      whiteSpace: (value) => (value.trim() ? true : t("WHITE_SPACES_NOT_ALLOWED")),
                    },
                  })}
                />
                <ErrorMessage message={errors?.answer?.message} />
              </div>
            </div>
          </div>
          <div className="flex justify-center mt-4 mb-4">
            {changePasswordLoading ? (
              <button className="bg-gradientTo text-white active:bg-emerald-600 font-normal text-sm px-8 py-2.5 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1  ease-linear transition-all duration-150">
                <div className="spinner-container">
                  <div className="loading-spinner" />
                </div>
              </button>
            ) : (
              <OButton disabled={!isDirty} label={<>{t("O_SUBMIT")}</>} type="submit" title={t("O_SUBMIT")} />
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
