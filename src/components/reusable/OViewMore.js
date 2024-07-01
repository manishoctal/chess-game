import React from "react";
import { useTranslation } from "react-i18next";
import PropTypes from 'prop-types';

const OViewMore = ({ onClose, item,type }) => {
  const { t } = useTranslation();
  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative w-auto my-6 mx-auto min-w-[400px]">
          <div className="md:py-3 sm:px-2 sm:py-8 px-7 ">
            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
              <div className="flex items-center justify-between p-4 border-b border-solid border-slate-200 rounded-t">
                <h3 className="text-xl font-semibold text-black ">
                  {t(type)}
                </h3>
                <button
                  className=" ml-auto flex items-center justify-center  text-black border-2 rounded-full  h-8 w-8 float-right text-3xl leading-none font-extralight outline-none focus:outline-none"
                  onClick={onClose}>
                  <span className=" text-[#B8BBBF]  text-4xl " title="Close">
                    ×
                  </span>
                </button>
              </div>
              <div className="p-4 text-sm text-center text-slate-600 font-bold ">
                {item}
              </div>
              <div className="flex items-center justify-center p-2 border-t border-solid border-slate-200  rounded-b">
                <button
                  className="text-black bg-[#E1E1E1] font-normal px-4 py-2 text-sm outline-none focus:outline-none rounded   ease-linear transition-all duration-150"
                  type="button"
                  onClick={onClose} title={t('O_CLOSE')}>
                  {t("O_CLOSE")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black" />
    </>
  );
};

export default OViewMore;
OViewMore.propTypes = {
  item: PropTypes.any,
  onClose: PropTypes.func,
};