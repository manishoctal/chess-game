import OImage from "components/reusable/OImage";
import { apiGet } from "../../utils/apiFetch";
import apiPath from "../../utils/apiPath";
import image from "../../assets/images/No-image-found.jpg";
import dayjs from "dayjs";
import { startCase } from "lodash";
import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const CoinPurchaseView = ({ onHide, viewData }) => {
    const [purchaseView, setpurchaseView] = useState({});

    const coinPurchase = async () => {
        try {
            const path = `${apiPath.coinPurchaseListing}/${viewData?._id}`;
            const result = await apiGet(path);
            const response = result?.data?.results;
            setpurchaseView(response)
        } catch (error) {
            console.log("error in get all sub admin list==>>>>", error.message);
        }
    };
    useEffect(() => {
        coinPurchase();
    }, []);
    const { t } = useTranslation();
  return (
    <div>
      <>
        <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
          <div className="relative my-6  w-full max-w-[700px] mx-auto">
            <div className="sm:py-4 sm:px-2 py-8 px-7 ">
              <div className="overflow-hidden border border-white dark:border-[#ffffff38] rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                <div className=" flex items-center justify-between p-5 border-b dark:border-[#ffffff38] border-solid border-slate-200 rounded-t dark:bg-slate-900">
                  <h3 className="text-xl font-semibold pl-3 dark:text-white">
                    {t("VIEW_POSTS")}
                  </h3>
                  <button
                    className=" ml-auto flex items-center justify-center  text-black border-2 rounded-full  h-8 w-8 float-right text-3xl leading-none font-extralight outline-none focus:outline-none"
                    onClick={() => onHide()}
                  >
                    <span className=" text-[#B8BBBF]  text-4xl " title="Close">
                      ×
                    </span>
                  </button>
                </div>

                <div className="p-4 dark:bg-slate-800 dark:text-white">
                  <div className="flex flex-col-reverse">
                    <div className="pl-4">
                      <ul className="columns-2">
                        <li className="mb-4">
                          <strong className="mr-2">{t("NICKNAME")}:</strong>
                          {startCase(purchaseView?.users?.nickName) || "N/A"}
                        </li>
                        <li className="mb-4">
                          <strong className="mr-2">{t("PACK_NAME")}:</strong>
                          {startCase(purchaseView?.package?.name) || "N/A"}
                        </li>
                        <li className="mb-4">
                          <strong className="mr-2">{t("O_MOBILE")}:</strong>
                          {purchaseView?.users?.mobile ?? "N/A"}
                        </li>
                        <li className="mb-4">
                          <strong className="mr-2">{t("USER_EMAIL_ID")}:</strong>
                          <span> {purchaseView?.users?.email || "N/A"}</span>
                        </li>
                        <li className="mb-4">
                          <strong className="mr-2">{t("FULL_NAME")}:</strong>
                          {purchaseView?.users?.full_name || "N/A"}
                        </li>
                        <li className="mb-4">
                          <strong className="mr-2">{t("USER_ID")}:</strong>
                          {purchaseView?.users?.userId || "N/A"}
                        </li>
                        <li className="mb-4">
                          <strong className="mr-2">{t("NO_OF_COINS")}:</strong>
                          {purchaseView?.package?.coins || "N/A"}
                        </li>
                        <li className="mb-4">
                          <strong className="mr-2">{t("PACK_PRICE")}:</strong>
                          {purchaseView?.package?.price || "N/A"}
                        </li>
                        <li className="mb-4">
                          <strong className="mr-2">{t("DESCRIPTION")}:</strong>
                          {purchaseView?.package?.description || "N/A"}
                        </li>
                      </ul>
                    </div>
                    <div className="mb-5">
                      <div className="w-[150px] h-[150px]  m-auto rounded-full overflow-hidden border-2">
                        <OImage
                          src={purchaseView?.package?.image || "N/A"}
                          className="w-full h-full object-cover inline"
                          alt=""
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="opacity-25 fixed inset-0 z-40 bg-black"
          onClick={() => onHide()}
        />
      </>
    </div>
  );
};

export default CoinPurchaseView;
