import ErrorMessage from "components/ErrorMessage";
import { useForm } from "react-hook-form";
import { apiPost } from "../../utils/apiFetch";
import apiPath from "../../utils/apiPath";
import useToastContext from "hooks/useToastContext";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import OInputField from "components/reusable/OInputField";
import { IoIosAddCircleOutline } from "react-icons/io";

const AddFaq = ({ setShowModal, getAllFAQ }) => {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onChange", shouldFocusError: true, defaultValues: {} });

  const notification = useToastContext();
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmitForm = async (data) => {
    try {
      setIsLoading(true);
      const path = apiPath.getFAQs;
      const result = await apiPost(path, data);
      if (result?.data?.success === true) {
        notification.success(result?.data?.message);
        getAllFAQ();
        setShowModal(false);
      } else {
        notification.error(result?.data?.message);
      }
    } catch (error) {
      console.error("error:", error.message);
    }
    setIsLoading(false);
  };

  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <form onSubmit={handleSubmit(handleSubmitForm)} method="post">
          <div className="relative w-auto my-6 mx-auto max-w-3xl">
            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none min-w-[762px]">
              <div className="flex items-center justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                <h3 className="text-xl font-semibold">{t("FAQS_ADD_FAQS")}</h3>
                <button
                  className=" ml-auto flex items-center justify-center  text-black border-2 rounded-full  h-8 w-8 float-right text-3xl leading-none font-extralight outline-none focus:outline-none"
                  onClick={() => setShowModal(false)}
                >
                  <a
                    title="Close"
                    className="hover:text-blue-700 transition duration-150 ease-in-out"
                    data-bs-toggle="tooltip"
                  >
                    {" "}
                    <span className=" text-[#B8BBBF]  text-4xl ">×</span>
                  </a>
                </button>
              </div>
              <div className="relative p-6 flex-auto">
                <div className="grid grid-cols-1">
                  <div className="w-full">
                    <div
                      onSubmit={handleSubmit(handleSubmitForm)}
                      method="post"
                      className="w-full"
                    >
                      <div className="relative z-0 mb-6 w-full ">
                        <OInputField
                          type="text"
                          name="title"
                          id="title"
                          inputLabel={
                            <>
                              Title<span className="text-red-500">*</span>
                            </>
                          }
                          autoFocus
                          wrapperClassName="relative z-0  w-full group"
                          placeholder=" "
                          maxLength={500}
                          register={register("title", {
                            required: t('PLEASE_ENTER_TITLE'),
                            minLength: {
                              value: 2,
                              message: t('MINIMUM_LENGTH_MUST_BE_2'),
                            },
                            maxLength: {
                              value: 500,
                              message: "Minimum length must be 500.",
                            },
                            validate: {
                              whiteSpace: (value) => value.trim() ? true : t('WHITE_SPACES_NOT_ALLOWED')
                            },
                          })}
                        />
                        <ErrorMessage message={errors?.title?.message} />
                      </div>
                      <div className="relative z-0 mb-6 w-full group">
                        <textarea
                          type="textarea"
                          name="content"
                          id="content"
                          maxLength={5000}
                          className="block py-4 px-3 w-full text-sm text-gray-900 bg-transparent border-2 rounded-lg border-[#DFDFDF] appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0  peer"
                          placeholder=" "
                          {...register("content", {
                            required: t('PLEASE_ENTER_CONTENT'),
                            validate: {
                              whiteSpace: (value) => value.trim() ? true : t('WHITE_SPACES_NOT_ALLOWED')
                            },
                            minLength: {
                              value: 2,
                              message: t('MINIMUM_LENGTH_MUST_BE_2'),
                            },
                            maxLength: {
                              value: 5000,
                              message: "Minimum length must be 5000.",
                            },
                          })}
                        />
                        <label
                          for="content"
                          className="peer-focus:font-normal absolute text-sm text-[#A5A5A5] dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 left-3 bg-white p-2 z-10 origin-[2] peer-focus:left-0 peer-focus:text-[#A5A5A5] peer-focus:text-lg peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-8"
                        >
                          {t("FAQS_CONTENT")}
                          <span className="text-red-500">*</span>
                        </label>
                        <ErrorMessage message={errors?.content?.message} />
                      </div>
                    </div>
                  </div>
                  <div />
                </div>
              </div>
              <div className="flex items-center justify-center p-6 border-t border-solid border-slate-200 rounded-b">
                <button
                  className="text-black bg-[#E1E1E1] font-normal px-12 py-2.5 text-sm outline-none focus:outline-none rounded mr-6  ease-linear transition-all duration-150"
                  type="button"
                  onClick={() => setShowModal(false)}
                >
                  {t("CLOSE")}
                </button>
                {isLoading ? (
                  <div className="spinner-container bg-LightBlue text-white active:bg-emerald-600 font-normal text-sm px-8 py-2.5 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1  ease-linear transition-all duration-150">
                    <div className="loading-spinner" />
                  </div>
                ) : (
                  <button
                    className="bg-LightBlue text-white active:bg-emerald-600 font-normal text-sm px-4 flex gap-2 py-2.5 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1  ease-linear transition-all duration-150"
                    type="submit"
                  >
                   <IoIosAddCircleOutline size={18}/> Add FAQ
                  </button>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black" />
    </>
  );
};

export default AddFaq;
