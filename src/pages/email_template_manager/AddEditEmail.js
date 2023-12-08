import React, { useState } from "react";
import { apiPost, apiPut } from "../../utils/apiFetch";
import apiPath from "../../utils/apiPath";
import { useForm, Controller } from "react-hook-form";
import useToastContext from "hooks/useToastContext";
import { useTranslation } from "react-i18next";
import OInputField from "components/reusable/OInputField";
import { preventMaxInput } from "utils/validations";
import formValidation from "../../utils/formValidation";
import OButton from "components/reusable/OButton";
import { Link } from "react-router-dom";
import ReactQuill from "react-quill";
import { useLocation, useNavigate } from "react-router";
import ErrorMessage from "components/ErrorMessage";

export default function AddEditEmail() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const editItem = location?.state?.item;
  const type = location?.state?.type;
  const notification = useToastContext();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    shouldFocusError: true,
    defaultValues: {
      title: editItem?.title,
      subject: editItem?.subject,
      // signature: editItem?.signature
    },
  });

  const handleSubmitForm = async (data) => {
    try {
      setIsLoading(true);
      let path;
      let result;
      const paylod = { ...data };
      if (location?.pathname === "/email-manager/add") {
        path = apiPath.emailTemplate;
        result = await apiPost(path, paylod);
      } else if (location?.pathname === "/email-manager/edit") {
        path = apiPath.emailTemplate + "/" + editItem._id;
        result = await apiPut(path, paylod);
      }

      if (result.data.success) {
        notification.success(result?.data.message);
        navigate("/email-manager");
      } else {
        notification.error(result?.data.message);
      }
    } catch (error) {
      console.error("error in get all users list==>>>>", error);
      notification.error(error.message);
    }
    setIsLoading(false);
  };

  return (
    <>
      <form onSubmit={handleSubmit(handleSubmitForm)} method="post">
        <div className="outer-boarder">
          <div className="headerForm  bg-[#2f2f31]">
            {type === "edit" ? "Edit" : "View"} an Email Template
          </div>
          <div className="relative p-6  pb-0 flex-auto">
            <div className="grid grid-cols-2">
              <div className="md:py-4 sm:py-3 px-2">
                <OInputField
                  wrapperClassName="relative z-0  w-full group"
                  name="title"
                  inputLabel={
                    <>
                      Template Name<span className="text-red-500">*</span>
                    </>
                  }
                  type="text"
                  autoFocus
                  maxLength={500}
                  onInput={(e) => preventMaxInput(e, 500)}
                  register={register("title", formValidation.title)}
                  errors={errors}
                  disable={type === "view"}
                />
              </div>
              <div className="md:py-4 sm:py-3 px-2">
                <OInputField
                  wrapperClassName="relative z-0   w-full group"
                  name="subject"
                  inputLabel={
                    <>
                      Subject<span className="text-red-500">*</span>
                    </>
                  }
                  type="text"
                  maxLength={500}
                  onInput={(e) => preventMaxInput(e, 500)}
                  register={register("subject", formValidation.subject)}
                  errors={errors}
                  disable={type === "view"}
                />
              </div>
            </div>
          </div>
          <div className="md:py-4 sm:px-2 sm:py-3 md:px-7 px-2">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Content<span className="text-red-500">*</span>
            </label>
            <Controller
              name="description"
              control={control}
              defaultValue={editItem?.description}
              disable={type === "view"}
              rules={{ required: "Content is required" }}
              render={({ field }) => (
                <ReactQuill
                  modules={{
                    toolbar: [
                      [{ header: "1" }, { header: "2" }, { font: [] }],
                      [{ size: [] }],
                      ["bold", "italic", "underline", "strike", "blockquote"],
                      [
                        { list: "ordered" },
                        { list: "bullet" },
                        { indent: "-1" },
                        { indent: "+1" },
                      ],
                      ["link", "image", "video"],
                      ["clean"],
                    ],
                  }}
                  theme="snow"
                  placeholder="Write something..."
                  {...field}
                  readOnly={type === "view"}
                />
              )}
            />

            <ErrorMessage message={errors?.description?.message} />
          </div>
          <div className="md:py-4 sm:px-2 sm:py-3 md:px-7 px-2">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Keyword
            </label>
            <Controller
              name="keyword"
              control={control}
              defaultValue={editItem?.keyword}
              // rules={{ required: 'Keyword is required' }}
              render={({ field }) => (
                <ReactQuill
                  modules={{
                    toolbar: [
                      [{ header: "1" }, { header: "2" }, { font: [] }],
                      [{ size: [] }],
                      ["bold", "italic", "underline", "strike", "blockquote"],
                      [
                        { list: "ordered" },
                        { list: "bullet" },
                        { indent: "-1" },
                        { indent: "+1" },
                      ],
                      ["link", "image", "video"],
                      ["clean"],
                    ],
                  }}
                  theme="snow"
                  placeholder="Write something..."
                  {...field}
                  readOnly={type === "view"}
                />
              )}
            />
            {/* <ErrorMessage message={errors?.keyword?.message} /> */}
          </div>
          <div className="flex items-center justify-center p-3 mt-3 border bg-[#cbd5e13a]  rounded-b">
            <Link to="/email-manager">
              <button
                className="text-black bg-[#E1E1E1] font-normal px-12 py-2.5 text-sm outline-none focus:outline-none rounded mr-6  ease-linear transition-all duration-150"
                type="button"
              >
                {t("O_BACK")}
              </button>
            </Link>

            {type === "view" ? null : isLoading ? (
              <div className="spinner-container bg-LightBlue text-white active:bg-emerald-600 font-normal text-sm px-8 py-2.5 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1  ease-linear transition-all duration-150">
                <div className="loading-spinner" />
              </div>
            ) : (
              <OButton
                label={
                  location?.pathname === "/email-manager/edit" ? "Edit" : "Add"
                }
                type="submit"
                loading={isLoading}
              />
            )}
          </div>
        </div>
      </form>
    </>
  );
}
