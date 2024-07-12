import { apiPost, apiPut } from "../../utils/apiFetch";
import apiPath from "../../utils/apiPath";
import { useForm } from "react-hook-form";
import ErrorMessage from "components/ErrorMessage";
import useToastContext from "hooks/useToastContext";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import helpers from "utils/helpers";
import { FaEdit } from "react-icons/fa";

const EditFAQ = ({ setEditShowModal, getAllFAQ, item, viewType }) => {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    shouldFocusError: true,
    defaultValues: {
      title: item?.title,
      content: item?.content,
    },
  });
  const notification = useToastContext();
  const [loader, setLoader] = useState(false)


  // edit faq function start
  const onSubmit = async (data) => {
    try {
      setLoader(true)
      const path = helpers.ternaryCondition(viewType == 'add', apiPath.getFAQs, apiPath.getFAQs + "/" + item?._id);
      const apiFunction = helpers.ternaryCondition(viewType === 'add', apiPost, apiPut);
      const result = await apiFunction(path, data);
      if (result?.status === 200) {
        notification.success(result?.data?.message);
        getAllFAQ();
        setEditShowModal(false);
      }
    } catch (error) {
      console.error("error in get all faqs list==>>>>", error.message);
    } finally {
      setLoader(false)
    }
  };
  // edit faq function end

  return (
    <>
      <div className="justify-center  items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative w-auto my-6 mx-auto max-w-3xl">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="sm:py-4 sm:px-2 py-8 px-7"
          >
            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none min-w-[502px]">
              <div className="dark:bg-gray-900 flex items-center justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                <h3 className="text-xl font-semibold dark:text-white">
                  {viewType == "add" ? t('FAQS_ADD_FAQS') : helpers.ternaryCondition(viewType == "view" , "View FAQs" , t("FAQS_EDIT_FAQS"))}
                </h3>
                <button type='button'
                  className=" ml-auto flex items-center justify-center  text-black border-2 rounded-full  h-8 w-8 float-right text-3xl leading-none font-extralight outline-none focus:outline-none"
                  onClick={() => setEditShowModal(false)}
                >
                  <span className=" text-[#B8BBBF]  text-4xl ">×</span>
                </button>
              </div>
              <div className="relative p-6 flex-auto dark:bg-gray-800">
                <div className="grid grid-cols-1">
                  <div className="relative z-0 mb-6 w-full ">
                    <input
                      type="text"
                      name="title"
                      id="title"
                      autoFocus
                      className=" py-4 px-3 w-full text-sm text-gray-900 bg-transparent border-2 rounded-lg border-[#DFDFDF] appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0  peer"
                      placeholder=" "
                      maxLength={100}
                      {...register("title", {
                        required: t('PLEASE_ENTER_TITLE'),
                        minLength: {
                          value: 2,
                          message: t('MINIMUM_LENGTH_MUST_BE_2'),
                        },
                        validate: {
                          whiteSpace: (value) => value.trim() ? true : t('WHITE_SPACES_NOT_ALLOWED')
                        },
                      })}
                      disabled={helpers.ternaryCondition(viewType === "view",true , null)}
                    />
                    <label
                      htmlFor="title"
                      maxLength={200}
                      className="peer-focus:font-normal absolute text-sm text-[#A5A5A5] dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 left-3 bg-white p-2 z-10 origin-[2] peer-focus:left-0 peer-focus:text-[#A5A5A5] peer-focus:text-lg peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-8 dark:bg-gray-800"
                    >
                      {t("FAQS_TITLE")}
                      <span className="text-red-500">*</span>
                    </label>
                    <ErrorMessage message={errors?.title?.message} />
                  </div>
                  <div className="relative z-0 mb-6 w-full group">
                    <textarea
                      type="textarea"
                      name="content"
                      id="content"
                      maxLength={200}
                      className="block py-4 px-3 w-full text-sm text-gray-900 bg-transparent border-2 rounded-lg border-[#DFDFDF] appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0  peer"
                      placeholder=" "
                      {...register("content", {
                        required: t('PLEASE_ENTER_CONTENT'),
                        validate: {
                          whiteSpace: (value) => value.trim() ? true : t('WHITE_SPACES_NOT_ALLOWED')
                        },
                      })}
                      disabled={helpers.ternaryCondition(viewType === "view",true , null)}
                    />
                    <label
                      htmlFor="content"
                      className="peer-focus:font-normal absolute text-sm text-[#A5A5A5] dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 left-3 bg-white p-2 z-10 origin-[2] peer-focus:left-0 peer-focus:text-[#A5A5A5] peer-focus:text-lg peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-8 dark:bg-gray-800"
                    >
                      {t("FAQS_CONTENT")}
                      <span className="text-red-500">*</span>
                    </label>
                    <ErrorMessage message={errors?.content?.message} />
                  </div>
                </div>
              </div>
              <div className="dark:bg-gray-900 flex items-center justify-center p-6 border-t border-solid border-slate-200 rounded-b">
                <button
                  className="text-black bg-[#E1E1E1] font-normal px-12 py-2.5 text-sm outline-none focus:outline-none rounded mr-6  ease-linear transition-all duration-150"
                  type="button"
                  title={t("CLOSE")}
                  onClick={() => setEditShowModal(false)} >
                  {t("CLOSE")}
                </button>

                {helpers.ternaryCondition(loader, <button className="bg-gradientTo text-white active:bg-emerald-600 font-normal text-sm px-8 py-2.5 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1  ease-linear transition-all duration-150">
                  <div className="spinner-container">
                    <div className="loading-spinner" />
                  </div>
                </button>, helpers.ternaryCondition(viewType === "view" , null , (
                  <button
                    className="bg-gradientTo text-white active:bg-emerald-600 font-normal text-sm px-6 flex gap-2 py-2.5 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1  ease-linear transition-all duration-150"
                    type="submit"
                    title={helpers.ternaryCondition(viewType == "add" , t("O_ADD") , t("O_EDIT"))}>
                  {helpers.ternaryCondition(viewType == "add" , t("O_ADD") , <><FaEdit size={16} />{t("O_EDIT")}</>)}
                  </button>
                )))}
              </div>
            </div>
          </form>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black" />
    </>
  );
};

export default EditFAQ;
