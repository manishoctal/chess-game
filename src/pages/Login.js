import ErrorMessage from "components/ErrorMessage";
import OButton from "components/reusable/OButton";
import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { validationRules } from "utils/constants";
import AuthContext from "../context/AuthContext";
import Loader from "../layout/Loader";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useTranslation } from "react-i18next";
import logoImage from "../assets/images/Vector.png";
import formValidation from "utils/formValidation";
function Login() {
  const { t } = useTranslation();
  const [icon, setIcon] = useState(true);

  const navigate = useNavigate();
  const { loginUser, user } = useContext(AuthContext);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ mode: "onBlur", shouldFocusError: true, defaultValues: {} });
  const [rememberMe, setRememberMe] = useState(
    window?.localStorage.getItem("rememberMe") === "true"
  );

  const handleRememberMe = (e) => {
    window?.localStorage.setItem("rememberMe", e.target.checked);
    setRememberMe(e.target.checked);
  };

  useEffect(() => {
    if (rememberMe) {
      reset({
        email: window?.localStorage.getItem("email"),
        password: window?.localStorage.getItem("password"),
      });
    }
  }, []);

  const onSubmit = (data) => {
    if (rememberMe) {
      window?.localStorage.setItem("email", data.email);
      window?.localStorage.setItem("password", data.password);
    } else {
      window?.localStorage.removeItem("email");
      window?.localStorage.removeItem("password");
    }
    loginUser(data);
  };
  useEffect(() => {
    if (user !== null) {
      navigate("/dashboard");
    }
  }, [user]);

  function changeIcon() {
    setIcon(!icon);
  }

  const preventSpace = (e) => {
    if (e?.which === 32) {
      e.preventDefault();
    }
  };

  return (
    <div className="bg-gradient-to-r from-gradientFrom to-gradientTo h-screen">
      <Loader />
      <div className="p-4">
        <div className="login-form bg-white max-w-lg m-auto mt-10 sm:mt-16 md:mt-28 rounded-[20px] overflow-hidden">
          <form
            className="sm:py-12 sm:px-11 py-8 px-7 dark:bg-slate-900"
            onSubmit={handleSubmit(onSubmit)}
            method="post"
          >
            <img src={logoImage} alt="logoImage" className="m-auto py-2 max-w-[267px]" />
            <h1 className="text-center text-[40px] font-bold dark:text-white">
              {t("LOGIN_LETS_START")}!
            </h1>
            <h2 className="text-center text-lg text-[#A5A5A5] sm:mb-12 mb-6">
              {t("LOGIN_ONLY_FEW_MINUTES")}
            </h2>
            <div className="relative z-0 mb-6 w-full group">
              <input
                type="text"
                id="email"
                className=" dark:text-white block py-4 px-3 w-full text-sm text-gray-900 bg-transparent border-2 rounded-lg border-[#DFDFDF] appearance-none dark:text-black dark:border-[#DFDFDF]  focus:outline-none focus:ring-0  peer"
                placeholder=" "
                onKeyDown={(e) => preventSpace(e)}
                // autoFocus
                {...register("email", formValidation.email)}
              />

              <label
                htmlFor="email"
                className=" dark:text-white peer-focus:font-normal absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 left-3 bg-white dark:bg-slate-900 p-2 z-10 origin-[2] peer-focus:left-0 peer-focus:text-[#A5A5A5] peer-focus:text-lg  peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-8"
              >
                {t("O_EMAIL_ID")}
                <span className="text-red-500">*</span>
              </label>
              <ErrorMessage message={errors?.email?.message} />
            </div>
            <div className="relative z-0 mb-6 w-full group">
              <input
                type={icon ? "password" : "text"}
                name="password"
                id="password"
                maxLength={40}
                className="dark:text-white block py-4 px-3 w-full text-sm text-gray-900 bg-transparent border-2 rounded-lg border-[#DFDFDF] appearance-none dark:text-black dark:border-[#DFDFDF]  focus:outline-none focus:ring-0  peer"
                placeholder=" "
                autoComplete="new-password"
                {...register("password", {
                  required: "Please enter password.",
                  validate: {
                    whiteSpace: (value) => value.trim() ? true : t('WHITE_SPACES_NOT_ALLOWED')
                  },
                  pattern: {
                    value: validationRules.password,
                    message:
                      "Password must contain lowercase,uppercase characters, numbers, special character and must be 8 character long.",
                  },
                })}
              />
              <label
                htmlFor="password"
                className="dark:bg-slate-900 dark:text-white peer-focus:font-normal absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 left-3 bg-white p-2 z-10 origin-[2] peer-focus:left-0 peer-focus:text-[#A5A5A5] peer-focus:text-lg  peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-8"
              >
                {t("O_PASSWORD")}
                <span className="text-red-500">*</span>
              </label>
              {icon ? (
                <span
                  className="dark:text-white password_view cursor-pointer absolute top-[18px] right-[20px]"
                  onClick={() => changeIcon()}
                >
                  <AiFillEyeInvisible />
                </span>
              ) : (
                <span
                  className="dark:text-white password_view absolute top-[18px] right-[20px]"
                  onClick={() => changeIcon()}
                >
                  <AiFillEye />
                </span>
              )}
              <ErrorMessage message={errors?.password?.message} />
            </div>
            <div className="flex items-start mb-8">
              <div className="flex items-center h-5">
                <div>
                  <input
                    id="remember"
                    type="checkbox"
                    checked={!!rememberMe}
                    className="w-4 h-4 bg-gray-50 rounded border border-[#DFDFDF] focus:ring-3 focus:ring-[#DFDFDF]"
                    onChange={(e) => handleRememberMe(e)}
                  />
                </div>
                <label
                  htmlFor="remember"
                  className="ml-2 text-sm text-black dark:text-white"
                >
                  {t("LOGIN_REMEMBER_ME")}
                </label>
              </div>
              <Link
                to="/forgot-password"
                className="ml-auto text-[#6236FF] hover:text-[#9D36FF] hover:underline text-sm font-medium"
              >
                {t("LOGIN_FORGOT_PASSWORD")}?
              </Link>
            </div>
            <div className="text-center mt-8">
              <OButton label={<>{t("LOGIN_LOGIN")}</>} type="submit" />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
