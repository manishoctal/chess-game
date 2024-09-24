import { useTranslation } from "react-i18next";
import { IoClose } from "react-icons/io5";


const ReviewRatingPopup = ({ handleShorReviewToggle }) => {
    const { t } = useTranslation();
    return (
        <>
            <div className="justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">

                <div className={`relative w-auto my-6 mx-auto max-w-[500px]`}>
                    <div className="overflow-hidden border border-white dark:border-[#ffffff38] rounded-lg shadow-lg relative flex flex-col  bg-white outline-none focus:outline-none">
                        <div className="dark:bg-gray-900 flex items-center justify-between p-5 border-b dark:border-[#ffffff38] border-solid border-slate-200 rounded-t dark:bg-slate-900">
                            <h3 className="text-xl font-semibold dark:text-white">{t("REVIEW_AND_RATING")}</h3>
                            <button className=" ml-auto flex items-center justify-center  text-black border-2 rounded-full  h-8 w-8 float-right text-3xl leading-none font-extralight outline-none focus:outline-none" onClick={() => handleShorReviewToggle()}>
                                <button type="button" title={t("CLOSE")} className="hover:text-blue-700 transition duration-150 ease-in-out" data-bs-toggle="tooltip">
                                    <span className=" text-[#B8BBBF]  text-4xl ">×</span>
                                </button>
                            </button>
                        </div>

                        <div className="px-[20px] py-10">
                            <ul className="list-disc pl-5 space-y-2">
                                <li className="text-gray-800 font-semibold">Date:</li>
                                <li className="text-gray-800 font-semibold">Average rating to platform : </li>
                                <li className="text-gray-800 font-semibold">Review rating:</li>
                                <li className="text-gray-800 font-semibold">Feedback:</li>
                            </ul>

                        </div>

                        <div className="dark:border-[#ffffff38] dark:bg-slate-900 flex items-center justify-center p-6 border-t border-solid border-slate-200 rounded-b">
                            <button
                                className="text-black bg-[#E1E1E1] font-normal px-6 flex gap-2 py-2.5 text-sm outline-none focus:outline-none rounded mr-6  ease-linear transition-all duration-150"
                                type="button"
                                onClick={() => handleShorReviewToggle()}
                                title={t("CLOSE")}
                            >
                                <IoClose size={19} /> {t("CLOSE")}
                            </button>
                        </div>
                    </div>
                </div>

            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black" />
        </>
    );
};

export default ReviewRatingPopup;
