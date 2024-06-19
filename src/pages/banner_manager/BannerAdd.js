import { useForm } from "react-hook-form";
import { apiPost } from "../../utils/apiFetch";
import apiPath from "../../utils/apiPath";
import useToastContext from "hooks/useToastContext";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import helpers from "utils/helpers";
import OImage from "components/reusable/OImage";

const BannerAdd = ({ setShowModal, getAllFAQ }) => {
  const { t } = useTranslation();
  const {
    handleSubmit,
  } = useForm({ mode: "onChange", shouldFocusError: true, defaultValues: {} });
  const [loader, setLoader] = useState(false)
  const [picture, setPicture] = useState()
  const notification = useToastContext();
  const [imageError, setImageError] = useState('')
  const handleSubmitForm = async (data) => {
    if (!picture?.file) {
      setImageError('Please choose image.')
      return
    }
    try {
      setLoader(true)
      const path = apiPath.bannerAdd;
      let formData=new FormData()
      formData.append('image',picture?.file[0])
      const result = await apiPost(path, formData);
      if (result?.data?.success === true) {
        notification.success(result?.data?.message);
        getAllFAQ();
        setShowModal(false);
      } else {
        notification.error(result?.data?.message);
      }
    } catch (error) {
      console.error("error:", error.message);
    } finally {
      setLoader(false)

    }
  };

  const handleFileChange = e => {
    const url = URL.createObjectURL(e?.target?.files[0])
    setPicture({ file: e?.target?.files, url: url })
    setImageError('')

  }
  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <form onSubmit={handleSubmit(handleSubmitForm)} method="post">
          <div className="relative w-auto my-6 mx-auto max-w-3xl">
            <div className="overflow-hidden border border-white dark:border-[#ffffff38] rounded-lg shadow-lg relative flex flex-col min-w-[502px] bg-white outline-none focus:outline-none">
              <div className="dark:bg-gray-900 flex items-center justify-between p-5 border-b dark:border-[#ffffff38] border-solid border-slate-200 rounded-t dark:bg-slate-900">
                <h3 className="text-xl font-semibold dark:text-white">
                  {t("ADD_BANNER")}
                </h3>
                <button
                  className=" ml-auto flex items-center justify-center  text-black border-2 rounded-full  h-8 w-8 float-right text-3xl leading-none font-extralight outline-none focus:outline-none"
                  onClick={() => setShowModal(false)}
                >
                  <button type="button"
                    title={t("CLOSE")}
                    className="hover:text-blue-700 transition duration-150 ease-in-out"
                    data-bs-toggle="tooltip"
                  >
                    {" "}
                    <span className=" text-[#B8BBBF]  text-4xl ">×</span>
                  </button>
                </button>
              </div>
              <div className="flex justify-center mt-5">
                <input
                  type='file'
                  accept='image/png, image/jpg, image/jpeg'
                  name='profilePic'
                  onChange={handleFileChange}
                  style={{ width: '35%' }}
                />
              </div>
              {imageError && <small className="text-red-500 text-center w-[86%]">{imageError}</small>}

              <label className="block text-sm font-medium text-gray-900 dark:text-white mt-4 mx-4 ">Banner Image:</label>
              <div className="h-[300px] ">
                <OImage
                  src={
                    picture?.url
                      ? picture?.url
                      : null
                  }
                  fallbackUrl='/images/user.png'
                  className='p-4 h-[300px]  w-[600px]'
                  alt=''
                />
              </div>
              <div className="dark:border-[#ffffff38] dark:bg-slate-900 flex items-center justify-center p-6 border-t border-solid border-slate-200 rounded-b">
                <button
                  className="text-black bg-[#E1E1E1] font-normal px-12 py-2.5 text-sm outline-none focus:outline-none rounded mr-6  ease-linear transition-all duration-150"
                  type="button"
                  onClick={() => setShowModal(false)}
                >
                  {t("CLOSE")}
                </button>

                {helpers.ternaryCondition(loader, <button className="bg-gradientTo text-white active:bg-emerald-600 font-normal text-sm px-8 py-2.5 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1  ease-linear transition-all duration-150">
                  <div className="spinner-container">
                    <div className="loading-spinner" />
                  </div>
                </button>, <button
                  className="bg-gradientTo text-white active:bg-emerald-600 font-normal text-sm px-8 py-2.5 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1  ease-linear transition-all duration-150"
                  type="submit"
                >
                  {t("O_ADD")}
                </button>)}

              </div>
            </div>
          </div>
        </form>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black" />
    </>
  );
};

export default BannerAdd;
