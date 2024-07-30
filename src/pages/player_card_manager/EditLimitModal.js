import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import React, { useRef, useState } from "react";
import helpers from "utils/helpers";
import LoaderButton from "components/reusable/LoaderButton";
import OInputField from "components/reusable/OInputField";
import { FaEdit } from "react-icons/fa";
import ErrorMessage from "components/ErrorMessage";
import { IoClose } from "react-icons/io5";
import { AiFillCamera } from "react-icons/ai";
import OImage from "components/reusable/OImage";
import { apiPost, apiPut } from "utils/apiFetch";
import apiPath from "utils/apiPath";
import useToastContext from "hooks/useToastContext";
import { isEmpty } from "lodash";
import axios from "axios";

const EditLimitModal = ({ setEditShowLimitModal, cardLimitEdit, getAllPlayerCard }) => {
    const { t } = useTranslation();
    const notification = useToastContext();
    const playerImageRef = useRef()
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm({
        mode: "onBlur",
        shouldFocusError: true,
    });

    const [loader] = useState(false)
    const [playerImgPath, setPlayerImgPath] = useState({})

    // submit function start
    const handleUpdateLimit = async (e) => {
        try {
            if (!isEmpty(playerImgPath)) {
                const reader = new FileReader();
                reader.readAsArrayBuffer(playerImgPath?.file);
                reader.onloadend = async () => {
                    const binaryData = reader.result;
                    await axios.put(playerImgPath?.data?.url, binaryData, { headers: { "Content-Type": "application/octet-stream", }, });
                }
            }
            const payloadPre = { ...e, image: helpers.orOperator(playerImgPath?.data?.key, null) }
            const path = apiPath.setCardLimit + '/' + cardLimitEdit?._id
            const resultLimit = await apiPut(path, payloadPre)
            if (resultLimit?.data?.success) {
                notification.success(resultLimit?.data?.message)
                getAllPlayerCard()
                setEditShowLimitModal(false)
            }

        } catch (error) {
            console.error('error in get player limit edit list==>>>>', error.message)
        }
    };
    // submit function end

    const playerCardDetailsForLimit = (name) => {
        return <th scope="col" className="py-3 px-6 text-center">
            {t(name)}
        </th>
    }

    const getCardForLimit = (data) => {
        return <td className="py-2 px-4 dark:border-[#ffffff38] border  text-center font-bold">{data || 'N/A'}</td>
    }
    const [PlayerImag, setPlayerImage] = useState(cardLimitEdit?.playerImage)
    const handleFileChangePlayer = async (e) => {
        if(e?.target?.files){
        try {
            const payloadPre = {
                contentType: e?.target?.files[0]?.type,
                folderType: "player"
            }
            const path = apiPath.generatePreSignUrl
            const result = await apiPost(path, payloadPre)
            if (result?.data?.success) {
                setPlayerImgPath({ data: result?.data?.results, file: e?.target?.files[0] })
            }

        } catch (error) {
            console.error('error in get player limit edit list==>>>>', error.message)
        }

        const url = URL?.createObjectURL(e?.target?.files[0])
        setPlayerImage(url)
    }
    }


    return (
        <>
            <div className=" overflow-y-auto justify-center items-center overflow-x-hidden  fixed inset-0 z-50 outline-none focus:outline-none">
                <form onSubmit={handleSubmit(handleUpdateLimit)} method="post">
                    <div className="relative w-auto my-6 mx-auto max-w-xl">
                        <div className="overflow-hidden  dark:border-[#ffffff38] border border-white rounded-lg shadow-lg relative flex flex-col  bg-white outline-none focus:outline-none">
                            <div className=" flex items-center justify-between p-5 dark:bg-gray-900 border-b dark:border-[#ffffff38] border-solid border-slate-200 rounded-t dark:bg-slate-900">
                                <h3 className="text-xl font-semibold dark:text-white">
                                    {t("EDIT_CARD_LIMIT_IN_MARKET")}
                                </h3>
                                <button
                                    title={t("CLOSE")}
                                    className=" ml-auto flex items-center justify-center  text-black border-2 rounded-full  h-8 w-8 float-right text-3xl leading-none font-extralight outline-none focus:outline-none"
                                    onClick={() => setEditShowLimitModal(false)}>
                                    <span className=" text-[#B8BBBF]  text-4xl ">×</span>
                                </button>
                            </div>
                            <div className="p-5">
                                <label className="block text-gray-700 text-sm font-bold mb-2">{t('CARD_DETAILS')}:</label>
                                <div className="overflow-x-auto relative rounded-lg border">
                                    <table className="w-full text-xs text-left text-[#A5A5A5] dark:text-gray-400 ">
                                        <thead className="text-xs text-gray-900 border border-[#E1E6EE] bg-[#E1E6EE] dark:bg-gray-700 dark:text-gray-400 dark:border-[#ffffff38]">
                                            <tr>
                                                {playerCardDetailsForLimit('FORMAT_TYPE')}
                                                {playerCardDetailsForLimit('AVAILABLE_CARD')}
                                                {playerCardDetailsForLimit('PURCHASED_CARD')}
                                            </tr>

                                        </thead>
                                        <tbody>
                                            <tr>
                                                {getCardForLimit('T20')}
                                                {getCardForLimit(cardLimitEdit?.availableCardT20)}
                                                {getCardForLimit(cardLimitEdit?.purchasedCardT20)}
                                            </tr>
                                            <tr>
                                                {getCardForLimit('ODI')}
                                                {getCardForLimit(cardLimitEdit?.availableCardOdi)}
                                                {getCardForLimit(cardLimitEdit?.purchasedCardOdi)}
                                            </tr>
                                            <tr>
                                                {getCardForLimit('TEST')}
                                                {getCardForLimit(cardLimitEdit?.availableCardTests)}
                                                {getCardForLimit(cardLimitEdit?.purchasedCardTests)}
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>


                            <div className="m-4 p-4 bg-white shadow-md rounded-lg">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    {t('SET_LIMIT_OF_THE_CARD')}:
                                </label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">


                                    <div className='py-4 px-4 md:px-8 flex justify-center sm:block'>
                                        <div className='relative w-24 h-24 '>
                                            <label className='block mb-2 text-sm font-medium text-gray-900 dark:text-white w-28'>
                                                {t('PLAYER_IMAGE')}
                                            </label>
                                            <input
                                                type='file'
                                                accept='image/png, image/jpg, image/jpeg'
                                                name='profilePic'
                                                ref={playerImageRef}
                                                onChange={handleFileChangePlayer}
                                                className='hidden'
                                            />
                                            <OImage
                                                src={PlayerImag}
                                                fallbackUrl='/images/user.png'
                                                className='w-24 h-24'
                                                alt=''
                                                style={{ borderRadius: '50%' }}
                                            />
                                            <AiFillCamera
                                                className=' bg-gray-100  absolute w-4 rounded-xl cursor-pointer'
                                                style={{
                                                    width: '1.5rem',
                                                    height: '1.5rem',
                                                    bottom: '-23px',
                                                    right: 0,
                                                    background: '',
                                                    padding: '1px'
                                                }}
                                                onClick={() => playerImageRef?.current?.click()}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-col mt-4">
                                        <OInputField
                                            placeholder={t('ENTER_LIMIT')}
                                            type="number"
                                            maxLength={40}
                                            inputLabel={<>{t('T20_CARD_LIMIT')}</>}
                                            wrapperClassName="relative z-0 w-full group"
                                            id="availableCardT20"
                                            register={register("availableCardT20", {
                                                maxLength: {
                                                    value: 3,
                                                    message: t("MAX_LIMIT_IS_3_CHARACTERS"),
                                                },
                                                min: {
                                                    value: 1,
                                                    message: t("MINIMUM_VALUE_MUST_IS_1"),
                                                },
                                                valueAsNumber: true,
                                                validate: value => {
                                                    if (value <= cardLimitEdit?.purchasedCardT20) {
                                                        return t("CARD_LIMIT_MUST_BE_GREATER_THAN_T20_PURCHASE_CARD")
                                                    }
                                                }

                                            })}
                                        />
                                        <ErrorMessage message={errors?.availableCardT20?.message} />
                                    </div>
                                    <div className="flex flex-col mt-4">
                                        <OInputField
                                            placeholder={t('ENTER_LIMIT')}
                                            type="number"
                                            inputLabel={<>{t('ODI_CARD_LIMIT')}</>}
                                            maxLength={40}
                                            wrapperClassName="relative z-0 w-full group"
                                            id="availableCardOdi"
                                            register={register("availableCardOdi", {
                                                maxLength: {
                                                    value: 3,
                                                    message: t("MAX_LIMIT_IS_3_CHARACTERS"),
                                                },
                                                min: {
                                                    value: 1,
                                                    message: t("MINIMUM_VALUE_MUST_IS_1"),
                                                },
                                                valueAsNumber: true,
                                                validate: value => {
                                                    if (value <= cardLimitEdit?.purchasedCardOdi) {
                                                        return t("CARD_LIMIT_MUST_BE_GREATER_THAN_ODI_PURCHASE_CARD")
                                                    }
                                                }
                                            })}
                                        />
                                        <ErrorMessage message={errors?.availableCardOdi?.message} />
                                    </div>
                                    <div className="flex flex-col mt-4">
                                        <OInputField
                                            placeholder={t('ENTER_LIMIT')}
                                            type="number"
                                            inputLabel={<>{t('TEST_CARD_LIMIT')}</>}

                                            maxLength={40}
                                            wrapperClassName="relative z-0 w-full group"
                                            id="availableCardTests"
                                            register={register("availableCardTests", {
                                                maxLength: {
                                                    value: 3,
                                                    message: t("MAX_LIMIT_IS_3_CHARACTERS"),
                                                },
                                                min: {
                                                    value: 1,
                                                    message: t("MINIMUM_VALUE_MUST_IS_1"),
                                                },
                                                valueAsNumber: true,
                                                validate: value => {
                                                    if (value <= cardLimitEdit?.purchasedCardTests) {
                                                        return t("CARD_LIMIT_MUST_BE_GREATER_THAN_TEST_PURCHASE_CARD")
                                                    }
                                                }
                                            })}
                                        />
                                        <ErrorMessage message={errors?.availableCardTests?.message} />
                                    </div>
                                </div>
                            </div>


                            <div className="dark:border-[#ffffff38] dark:bg-slate-900 flex items-center justify-center p-6 border-t border-solid border-slate-200 rounded-b">
                                <button
                                    title={t("CLOSE")}
                                    className="text-black bg-[#E1E1E1] font-normal px-6 flex gap-2 py-2.5 text-sm outline-none focus:outline-none rounded mr-6  ease-linear transition-all duration-150"
                                    type="button"
                                    onClick={() => setEditShowLimitModal(false)}>
                                    <IoClose size={19} />{t("CLOSE")}
                                </button>
                                {helpers.ternaryCondition(loader,
                                    <LoaderButton />,
                                    <button className="bg-gradientTo text-white active:bg-emerald-600 font-normal text-sm px-8 flex gap-2 py-2.5 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1  ease-linear transition-all duration-150" type="submit"
                                        title={t("O_EDIT")} disabled={helpers.andOperator(helpers.andOperator(!watch('availableCardT20'), !watch('availableCardOdi')), helpers.andOperator(!watch('availableCardTests'), isEmpty(playerImgPath)))}> <FaEdit size={16} />{t("O_EDIT")} </button>)}
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            <div className="opacity-25 fixed inset-0 z-40 bg-black" />
        </>
    );
};

export default EditLimitModal;

