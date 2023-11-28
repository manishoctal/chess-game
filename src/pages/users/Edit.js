import React, { useState } from "react";
import { apiPut } from "../../utils/apiFetch";
import apiPath from "../../utils/apiPath";
import { useForm } from "react-hook-form";
import useToastContext from "hooks/useToastContext";
import ErrorMessage from "components/ErrorMessage";
import { validationRules } from "utils/constants";
import { useTranslation } from "react-i18next";
import OInputField from "components/reusable/OInputField";
import { preventMaxInput } from "utils/validations";
import formValidation from "../../utils/formValidation";

const UserEdit = ({ setEditShowModal, getAllUser, item }) => {
  const { t } = useTranslation();
  const notification = useToastContext();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    shouldFocusError: true,
    defaultValues: {
      first_name: item?.first_name,
      last_name: item?.last_name,
      mobile: item?.mobile,
      email: item?.email,
      country_code: item?.country_code,
    },
  });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const path = apiPath.updateUser + "/" + item._id;
      const result = await apiPut(path, data);
      if (result.data.success) {
        getAllUser();
        setEditShowModal(false);
        notification.success(result?.data.message);
      } else {
        notification.error(result?.data.message);
      }
    } catch (error) {
      console.log("error in get all users list==>>>>", error);
      notification.error(error.message);
    }
    setIsLoading(false);
  };
  const codeValue = watch("email") ? watch("email") : "";
  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative w-auto my-6 mx-auto max-w-3xl">
          <div className="md:py-4 sm:px-2 sm:py-8 px-7">
            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none lg:min-w-[762px]">
              <div className="flex items-center justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                <h3 className="text-xl font-semibold">{t("O_EDIT_USER")}</h3>
                <button
                  className=" ml-auto flex items-center justify-center  text-black border-2 rounded-full  h-8 w-8 float-right text-3xl leading-none font-extralight outline-none focus:outline-none"
                  onClick={() => setEditShowModal(false)}
                >
                  <span className=" text-[#B8BBBF]  text-4xl " title="Close">
                    ×
                  </span>
                </button>
              </div>
              <div className="relative p-6 flex-auto">
                <div className="grid grid-cols-2">
                  <div className="md:py-4 sm:px-2 sm:py-3 md:px-7 px-2">
                    <OInputField
                      wrapperClassName="relative z-0  w-full group"
                      name="first_name"
                      inputLabel={
                        <>
                          {t("MERCHANT_FIRST_NAME")}
                          <span className="text-red-500">*</span>
                        </>
                      }
                      type="text"
                      autoFocus
                      maxLength={15}
                      onInput={(e) => preventMaxInput(e, 15)}
                      register={register(
                        "first_name",
                        formValidation["first_name"]
                      )}
                      errors={errors}
                    />
                  </div>
                  <div className="md:py-4 sm:px-2 sm:py-3 md:px-7 px-2">
                    <OInputField
                      wrapperClassName="relative z-0   w-full group"
                      name="last_name"
                      inputLabel={
                        <>
                          {t("MERCHANT_LAST_NAME")}
                          <span className="text-red-500">*</span>
                        </>
                      }
                      type="text"
                      maxLength={15}
                      onInput={(e) => preventMaxInput(e, 15)}
                      register={register(
                        "last_name",
                        formValidation["last_name"]
                      )}
                      errors={errors}
                    />
                  </div>
                  <div className="md:py-4 sm:px-2 sm:py-3 md:px-7 px-2">
                    <OInputField
                      wrapperClassName="relative z-0   w-full group"
                      name="country_code"
                      inputLabel={<>{t("O_COUNTRY_CODE")}</>}
                      errors={errors}
                      type="select"
                      register={register("country_code", {
                        // required: 'Please select country code.'
                      })}
                      selectOptions={[
                        <option value="" key="select_code">
                          {t("O_SELECT_CODE")}
                        </option>,
                        <option value="234" key="234">
                          +234
                        </option>,
                      ]}
                    />
                  </div>
                  <div className="md:py-4 sm:px-2 sm:py-3 md:px-7 px-2">
                    <OInputField
                      wrapperClassName="relative z-0   w-full group"
                      type="number"
                      name="mobile"
                      id="mobile"
                      inputLabel={
                        <>
                          {t("O_MOBILE_NUMBER")}
                          <span className="text-red-500">*</span>
                        </>
                      }
                      min={0}
                      onKeyDown={(e) => {
                        if (["-", "+", "e"].includes(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      onInput={(e) => preventMaxInput(e, 9)}
                      register={register("mobile", formValidation["mobile"])}
                      errors={errors}
                    />
                  </div>
                  <div className="md:py-4 sm:px-2 sm:py-3 md:px-7 px-2">
                    <OInputField
                      wrapperClassName="relative z-0   w-full group"
                      type="text"
                      name="email"
                      id="email"
                      inputLabel={
                        <>
                          {t("O_EMAIL_ID")}
                          <span className="text-red-500">*</span>
                        </>
                      }
                      value={codeValue.toLowerCase()}
                      maxLength={50}
                      autoComplete="off"
                      onInput={(e) => preventMaxInput(e, 50)}
                      register={register("email", formValidation["email"])}
                      errors={errors}
                    />
                  </div>
                  {/* <div className='relative z-0   w-full group'>
                        <div className='block py-3 h-14 px-3 w-full text-sm text-gray-900 bg-transparent border-2 rounded-lg border-[#DFDFDF] appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0  peer'>
                            <input
                                type='file'
                                name='identity_card'
                                placeholder='Identity Card '
                                className='form-control'
                                accept='image/*'

                                {...register('identity_card', {
                                    required: true,
                                })}
                            />
                        </div>
                        <label
                            for='floating_file'
                            className='peer-focus:font-normal absolute text-sm text-[#A5A5A5] dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 left-3 bg-white p-2 z-10 origin-[2] peer-focus:left-0 peer-focus:text-[#A5A5A5] peer-focus:text-lg peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-8'
                        >
                            Identity Card
                        </label>
                    </div> */}
                  {/* <div className='relative z-0   w-full group'>
                        <div className='block py-3 h-14 px-3 w-full text-sm text-gray-900 bg-transparent border-2 rounded-lg border-[#DFDFDF] appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0  peer'>
                            <input
                                type='file'
                                name='passport'
                                placeholder='passport'
                                className='form-control'
                                accept='image/*'
                                // onChange={(e) => setPassport(e.target.files[0])}
                                {...register('passport', {
                                    required: true,
                                })}
                            />
                            <img src={item?.passport} />
                            <svg
                                xmlns='http://www.w3.org/2000/svg'
                                fill='none'
                                viewBox='0 0 24 24'
                                strokeWidth={1.5}
                                stroke='currentColor'
                                className='w-6 h-6 ml-auto absolute right-3 top-1 transform translate-y-1/2 text-[#A5A5A5]'
                            >
                                <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    d='M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3'
                                />
                            </svg>
                        </div>
                        <label
                            for='floating_file'
                            className='peer-focus:font-normal absolute text-sm text-[#A5A5A5] dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 left-3 bg-white p-2 z-10 origin-[2] peer-focus:left-0 peer-focus:text-[#A5A5A5] peer-focus:text-lg peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-8'
                        >
                            Passport
                        </label>
                    </div> */}
                </div>
              </div>
              <div className="flex items-center justify-center p-6 border-t border-solid border-slate-200 rounded-b">
                <button
                  className="text-black bg-[#E1E1E1] font-normal px-12 py-2.5 text-sm outline-none focus:outline-none rounded mr-6  ease-linear transition-all duration-150"
                  type="button"
                  onClick={() => setEditShowModal(false)}
                >
                  {t("O_BACK")}
                </button>

                {isLoading ? (
                  <div className="spinner-container bg-LightBlue text-white active:bg-emerald-600 font-normal text-sm px-8 py-2.5 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1  ease-linear transition-all duration-150">
                    <div className="loading-spinner"></div>
                  </div>
                ) : (
                  <button
                    className="bg-LightBlue text-white active:bg-emerald-600 font-normal text-sm px-8 py-2.5 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1  ease-linear transition-all duration-150"
                    type="submit"
                    onClick={handleSubmit(onSubmit)}
                  >
                    {t("O_EDIT")}
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

export default UserEdit;
