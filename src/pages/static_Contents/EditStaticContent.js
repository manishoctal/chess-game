import React, { useState, useEffect, useContext } from "react";
import useToastContext from "hooks/useToastContext";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { apiPut } from "../../utils/apiFetch";
import apiPath from "../../utils/apiPath";
import { useTranslation } from "react-i18next";
import OInputField from "components/reusable/OInputField";
import formValidation from "utils/formValidation";
import AuthContext from "context/AuthContext";
import ReactQuill from "react-quill"; 
import helpers from "utils/helpers";

const EditStaticContent = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    shouldFocusError: true,
  });
  const notification = useToastContext();
  const [content, setContent] = useState(location?.state?.content);
const[loading,setLoading]=useState(false)
  const { updatePageName } = useContext(AuthContext);

  const onSubmit = async (data) => {
    try {
      setLoading(true)
      if (content !== "<p><br></p>") {
        const formData = new FormData();
        formData.append("title", data?.title);
        formData.append("content", content);
        formData.append("metaTitle", data?.metaTitle);
        formData.append("metaKeyword", data?.metaKeyword);
        formData.append("metaDescription", data?.metaDescription);
        const path = apiPath.getStaticContent + "/" + location?.state?._id;
        const result = await apiPut(path, formData);
        if (result.data.success) {
          navigate("/static-content");
          notification.success(result?.data.message);
        } else {
          notification.error(result?.data.message);
        }
      } else {
        notification.error("Please enter description");
      }
    } catch (error) {
      console.error("error in get all users list==>>>>", error);
      notification.error(error.message);
    } finally{
      setLoading(false)
    }
  };

  useEffect(() => {
    updatePageName(t("Edit Static Content"));
  }, []);

  useEffect(() => {
    reset(location?.state);
  }, []);
  return (
    <>
      <div>
        <div className="bg-[#F9F9F9] dark:bg-slate-900">
          <div className="px-3 py-4">
            <div className="bg-white border border-[#E9EDF9] rounded-lg dark:bg-slate-800 dark:border-[#ffffff38]">
              <div className=" border-b-[#E3E3E3] grid 2xl:grid-cols-3 xl:grid-cols-2 lg:grid lg:grid-cols-1 gap-2 px-4 ">
                <div className="col-span-3 flex flex-wrap  items-center" />
              </div>
             
              <div className="p-5 shadow-md">
                <OInputField
                  wrapperClassName="relative z-0 mb-6 w-full group"
                  name="title"
                  inputLabel={
                    <>
                      {t("TITLE")}
                      <span className="text-red-500">*</span>
                    </>
                  }
                  type="text"
                  autoFocus
                  register={register("title", formValidation.title)}
                  errors={errors}
                />

                <div className="max-h-[540px] overflow-y-auto">
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                   
                    {t("DESCRIPTION")}
                  </label>
                  <ReactQuill value={content} onChange={setContent} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    
      <div className="flex items-center justify-center p-6 border-t border-solid border-slate-200 rounded-b">
        <button
          className="text-black bg-[#E1E1E1] font-normal px-12 py-2.5 text-sm outline-none focus:outline-none rounded mr-6  ease-linear transition-all duration-150"
          type="button"
          onClick={() => navigate("/static-content")}
        >
          {t("O_BACK")}
        </button>

        {helpers.ternaryCondition(loading,<button className="bg-gradientTo text-white active:bg-emerald-600 font-normal text-sm px-8 py-2.5 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1  ease-linear transition-all duration-150">
          <div className="spinner-container">
            <div className="loading-spinner" />
          </div>
        </button>,
         <button
          className="bg-gradientTo text-white active:bg-emerald-600 font-normal text-sm px-8 py-2.5 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1  ease-linear transition-all duration-150"
          type="submit"
          onClick={handleSubmit(onSubmit)}
        >
          {t("O_UPDATE")}
        </button>)}

       
      </div>
    </>
  );
};

export default EditStaticContent;
