import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "layout/Loader";
import ErrorMessage from "components/ErrorMessage";
import { apiGet, apiPost } from "utils/apiFetch";
import pathObj from "utils/apiPath";
import useToastContext from "hooks/useToastContext";
import OButton from "components/reusable/OButton";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { validationRules } from "utils/constants";
import { useTranslation } from "react-i18next";
import logoImage from "../../assets/images/login_logo.png";
import { preventMaxInput } from "utils/validations";

function ResetPassword() {
  const { t } = useTranslation();
  const { resetToken } = useParams();
  const notification = useToastContext();
  const [icon, setIcon] = useState(true);
  const [icon2, setIcon2] = useState(true);
  const [questionType, setQuestionType] = useState(false);

  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isDirty },
  } = useForm({ mode: "onBlur", shouldFocusError: true, defaultValues: {} });
  const [resetPasswordLoading, setResetPasswordLoading] = useState(false);

  const onSubmit = async (data) => {
    let res;
    try {
      setResetPasswordLoading(true);
      res = await apiPost(pathObj.resetPassword + "/" + resetToken, {
        password: data.password,
        answer: data.answer,
      });
      if (res.data.success) {
        navigate("/");
        notification.success("Password successfully changed");
      } else {
        notification.error(res?.data?.message);
      }
    } catch (err) {
      console.error("err:", err);
    } finally {
      setResetPasswordLoading(false);
    }
  };

  const allQuestionType = async (O) => {
    try {
      const path = pathObj.getCheckUser + "/" + resetToken;
      const result = await apiGet(path, {});
      const response = result?.data?.results;
      console.log("response", response);
      setQuestionType(response);
    } catch (error) {
      console.error("error in get all question list==>>>>", error.message);
    }
  };

  useEffect(() => {
    allQuestionType();
  }, []);

  return (
    <div className="bg-gradient-to-r from-gradientFrom to-gradientTo h-full">
      <Loader />
      <div className="p-4">
        <div className="login-form bg-white max-w-lg m-auto mt-10 sm:mt-16 md:mt-28 rounded-[20px]">
          <form className="sm:py-12 sm:px-11 py-8 px-7" onSubmit={handleSubmit(onSubmit)} method="post">
            <img src={logoImage} alt="" className="m-auto py-2" />
            <h1 className="text-center text-[40px] font-bold mb-6">{t("RESET_PASSWORD")}</h1>
            {questionType?.isQuestionSet === true && (
              <div>
                <h2 className="mb-3">
                  <span>Security question: </span>
                  {questionType?.question}
                </h2>
                <div className="relative z-0 mb-6 w-full group">
                  <input
                    type="text"
                    name="answer"
                    id="answer"
                    maxLength={500}
                    className="block py-4 px-3 w-full password-sm text-gray-900 bg-transparent border-2 rounded-lg border-[#DFDFDF] appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0  peer"
                    {...register("answer", {
                      required: "Answer is required.",
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

                  <label
                    for="answer"
                    className="peer-focus:font-normal absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 left-3 bg-white p-2 z-10 origin-[2] peer-focus:left-0 peer-focus:text-[#A5A5A5] peer-focus:text-lg peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-8"
                  >
                    Answer
                  </label>
                  <ErrorMessage message={errors?.answer?.message} />
                </div>
              </div>
            )}
            <div className="relative z-0 mb-6 w-full group">
              <input
                type={icon ? "password" : "text"}
                name="password"
                id="password"
                onInput={(e) => preventMaxInput(e, 16)}
                className="block py-4 px-3 w-full password-sm text-gray-900 bg-transparent border-2 rounded-lg border-[#DFDFDF] appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0  peer"
                {...register("password", {
                  required: "Password is required.",
                  pattern: {
                    value: validationRules.password,
                    message: "Password must contain lowercase,uppercase characters, numbers, special character and at least 8 character long.",
                  },
                })}
              />

              <label
                for="password"
                className="peer-focus:font-normal absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 left-3 bg-white p-2 z-10 origin-[2] peer-focus:left-0 peer-focus:text-[#A5A5A5] peer-focus:text-lg peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-8"
              >
                {t("O_PASSWORD")}
              </label>
              {icon ? (
                <span className="password_view cursor-pointer absolute top-[18px] right-[20px]" onClick={() => setIcon(!icon)}>
                  <AiFillEyeInvisible />
                </span>
              ) : (
                <span className="password_view cursor-pointer absolute top-[18px] right-[20px]" onClick={() => setIcon(!icon)}>
                  <AiFillEye />
                </span>
              )}
              <ErrorMessage message={errors?.password?.message} />
            </div>

            <div className="relative z-0 mb-6 w-full group">
              <input
                type={icon2 ? "password" : "text"}
                name="confirm_password"
                id="confirm_password"
                onInput={(e) => preventMaxInput(e, 16)}
                className="block py-4 px-3 w-full password-sm text-gray-900 bg-transparent border-2 rounded-lg border-[#DFDFDF] appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0  peer"
                {...register("confirm_password", {
                  required: "Confirm password is required.",
                  validate: (val) => {
                    if (watch("password") !== val) {
                      return "Confirm Password field is not matching with new password field.";
                    }
                  },
                })}
              />

              <label
                for="confirm_password"
                className="peer-focus:font-normal absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 left-3 bg-white p-2 z-10 origin-[2] peer-focus:left-0 peer-focus:text-[#A5A5A5] peer-focus:text-lg peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-8"
              >
                {t("O_CONFIRM_PASSWORD")}
              </label>
              {icon2 ? (
                <span className="password_view cursor-pointer absolute top-[18px] right-[20px]" onClick={() => setIcon2(!icon2)}>
                  <AiFillEyeInvisible />
                </span>
              ) : (
                <span className="password_view cursor-pointer absolute top-[18px] right-[20px]" onClick={() => setIcon2(!icon2)}>
                  <AiFillEye />
                </span>
              )}
              <ErrorMessage message={errors?.confirm_password?.message} />
            </div>

            <div className="text-center mt-8">
              <OButton disabled={!isDirty} label={<>{t("O_SUBMIT")}</>} type="submit" loading={resetPasswordLoading} />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
