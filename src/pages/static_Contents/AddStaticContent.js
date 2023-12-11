import React, { useState, useEffect, useContext } from "react";
import useToastContext from "hooks/useToastContext";
import { useForm } from "react-hook-form";
import { apiPost } from "../../utils/apiFetch";
import apiPath from "../../utils/apiPath";
import { useTranslation } from "react-i18next";
import OInputField from "components/reusable/OInputField";
import formValidation from "utils/formValidation";
import { useNavigate } from "react-router-dom";
import AuthContext from "context/AuthContext";
import ReactQuill from "react-quill";
import { isEmpty } from "lodash";
import OImage from "components/reusable/OImage";
import noImageFound from "../../assets/images/No-image-found.jpg";

const AddStaticContent = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    shouldFocusError: true,
  });
  const notification = useToastContext();
  const [content, setContent] = useState("");
  const [photo, setPhoto] = useState("");

  const { updatePageName } = useContext(AuthContext);

  const onSubmit = async (data) => {
    try {
      if (!isEmpty(content)) {
        const formData = new FormData();
        formData.append("title", data?.title);
        formData.append("description", content);
        formData.append("StaticContentImage", photo);
        const res = await apiPost(apiPath.getStaticContent, formData);
        if (res?.data?.success === true) {
          navigate("/static-content");
          notification.success(res.data?.message);
        } else {
          notification.error(res?.data?.message);
        }
      } else {
        notification.error("Please enter description");
      }
    } catch (err) {
      console.error("err:", err);
    }
  };

  useEffect(() => {
    updatePageName(t("ADD_STATIC_CONTENT"));
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
              <div className="flex   pl-5 pt-4">
                <strong className="dark:text-white">
                  {t("O_ADMIN_BLOG_IMAGE_SIZE_SUGGESTION")}
                </strong>
              </div>
              <div className="pl-5 pt-4 flex">
                <label className="mb-2 block pr-1 dark:text-white">
                  <strong>{t("UPLOAD_IMAGE")}</strong>
                </label>
                <input
                  type="file"
                  name="photo"
                  placeholder="Photo "
                  className="form-control dark:text-white"
                  accept="image/png,image/jpeg,image/jpg"
                  onChange={(event) => {
                    setPhoto(event?.target?.files[0]);
                  }}
                />
              </div>

              <div className="pl-5 pt-4 ">
                <OImage
                  src={
                    typeof photo === "object"
                      ? URL.createObjectURL(photo)
                      : photo
                  }
                  fallbackUrl={noImageFound}
                />
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
                <div p-5>
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

        <button
          className="bg-gradientTo text-white active:bg-emerald-600 font-normal text-sm px-8 py-2.5 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1  ease-linear transition-all duration-150"
          type="submit"
          onClick={handleSubmit(onSubmit)}
        >
          {t("O_ADD")}
        </button>
      </div>
    </>
  );
};

export default AddStaticContent;
