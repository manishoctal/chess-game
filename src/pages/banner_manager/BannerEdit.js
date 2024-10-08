import { useForm } from "react-hook-form";
import { apiGet, apiPut } from "../../utils/apiFetch";
import apiPath from "../../utils/apiPath";
import useToastContext from "hooks/useToastContext";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import helpers from "utils/helpers";
import OImage from "components/reusable/OImage";
import ImageUploader from "components/reusable/ImageUploader";
import { FaEdit } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { isEmpty } from "lodash";
import axios from "axios";

const BannerEdit = ({ setEditShowModal, getAllFAQ, item, viewType }) => {
  const { t } = useTranslation();
  const { handleSubmit } = useForm({ mode: "onChange", shouldFocusError: true, defaultValues: {} });
  const [loader, setLoader] = useState(false);
  const [picture, setPicture] = useState();
  const notification = useToastContext();
  const [imageError, setImageError] = useState("");
  const [bannerImgPath, setBannerImgPath] = useState({});
  const [bannerImage, setBannerImage] = useState("");

  // edit banner function start

  const handleSubmitForm = async (data) => {
    if (!picture?.file) {
      setImageError("Please choose image.");
      return;
    }

    try {
      setLoader(true);
      if (!isEmpty(bannerImgPath)) {
        const uploadImageToS3 = () => {
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsArrayBuffer(bannerImgPath?.file);
            reader.onloadend = async () => {
              const binaryData = reader.result;
              try {
                await axios.put(bannerImgPath?.data?.url, binaryData, {
                  headers: { "Content-Type": "application/octet-stream" },
                });
                console.log("image uploaded at s3-----------");
                resolve();
              } catch (uploadError) {
                reject(uploadError);
              }
            };
            reader.onerror = (error) => reject(error);
          });
        };

        await uploadImageToS3();
      }
      const payloadPre = {
        image: helpers.orOperator(bannerImgPath?.data?.key, null),
      };
      const path = `${apiPath.bannerEdit}/${item?._id}`;
      const result = await apiPut(path, payloadPre);

      if (result?.data?.success === true) {
        notification.success(result?.data?.message);
        getAllFAQ();
        setEditShowModal(false);
      } else {
        notification.error(result?.data?.message);
      }
    } catch (error) {
      console.error("error:", error.message);
    } finally {
      setLoader(false);
    }
  };

  const handleFileChange = async (e) => {
    if (!e) {
      setPicture();
      return;
    }
    try {
      const payloadPre = {
        contentType: e?.type,
      };
      const path = apiPath.getImageBanner;

      const result = await apiGet(path, payloadPre);
      if (result?.data?.success) {
        setBannerImgPath({ data: result?.data?.results, file: e });
        const urls = URL.createObjectURL(e);
        setPicture({ file: e, url: urls });
      }
    } catch (error) {
      console.error("error in get banner list==>>>>", error.message);
    }

    const url = URL?.createObjectURL(e);
    setBannerImage(url);
  };

  // change file function end

  useEffect(() => {
    setPicture({ file: [item?.image], url: item?.image });
  }, []);
  return (
    <>
      <div className="justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <form onSubmit={handleSubmit(handleSubmitForm)} method="post">
          <div className={`relative w-auto my-6 mx-auto max-w-lg`}>
            <div className="overflow-hidden border border-white dark:border-[#ffffff38] rounded-lg shadow-lg relative flex flex-col  bg-white outline-none focus:outline-none">
              <div className="dark:bg-gray-900 flex items-center justify-between p-5 border-b dark:border-[#ffffff38] border-solid border-slate-200 rounded-t dark:bg-slate-900">
                <h3 className="text-xl font-semibold dark:text-white">{viewType == "edit" ? t("EDIT_BANNER") : t("VIEW_BANNER")}</h3>
                <button className=" ml-auto flex items-center justify-center  text-black border-2 rounded-full  h-8 w-8 float-right text-3xl leading-none font-extralight outline-none focus:outline-none" onClick={() => setEditShowModal(false)}>
                  <button type="button" title={t("CLOSE")} className="hover:text-blue-700 transition duration-150 ease-in-out" data-bs-toggle="tooltip">
                    <span className=" text-[#B8BBBF]  text-4xl ">×</span>
                  </button>
                </button>
              </div>
              {viewType == "edit" && (
                <div className="flex justify-center mt-5">
                  <ImageUploader onFileChange={handleFileChange} defaultImage={item?.image} imageSrc={bannerImage} />
                </div>
              )}
              {helpers.andOperator(imageError, <small className="text-red-500 text-center">{imageError}</small>)}

              {helpers.andOperator(
                viewType == "view",
                <>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mt-4 mx-4 ">Banner Image (16:9 Aspect Ratio):</label>
                  <div className="h-[300px] flex justify-center">
                    <OImage src={picture?.url ? picture?.url : null} fallbackUrl="/images/user.png" className={`p-4 h-[300px] 'w-[600px]`} alt="" />
                  </div>{" "}
                </>
              )}
              <div className="dark:border-[#ffffff38] dark:bg-slate-900 flex items-center justify-center p-6 border-t border-solid border-slate-200 rounded-b">
                <button
                  className="text-black bg-[#E1E1E1] font-normal px-6 flex gap-2 py-2.5 text-sm outline-none focus:outline-none rounded mr-6  ease-linear transition-all duration-150"
                  type="button"
                  title={t("CLOSE")}
                  onClick={() => setEditShowModal(false)}
                >
                  <IoClose size={19} /> {t("CLOSE")}
                </button>
                {viewType !== "view" &&
                  helpers.ternaryCondition(
                    loader,
                    <button className="bg-gradientTo text-white active:bg-emerald-600 font-normal text-sm px-8 py-2.5 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1  ease-linear transition-all duration-150">
                      <div className="spinner-container">
                        <div className="loading-spinner" />
                      </div>
                    </button>,
                    <button
                      className="bg-gradientTo flex gap-2  text-white active:bg-emerald-600 font-normal text-sm px-8 py-2.5 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1  ease-linear transition-all duration-150"
                      type="submit"
                      title={t("O_EDIT")}
                    >
                      <FaEdit size={16} />
                      {t("O_EDIT")}
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

export default BannerEdit;
