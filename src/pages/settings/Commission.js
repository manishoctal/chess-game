import ErrorMessage from 'components/ErrorMessage';
import OButton from 'components/reusable/OButton';
import OInputField from 'components/reusable/OInputField';
import AuthContext from 'context/AuthContext';
import useToastContext from 'hooks/useToastContext';
import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { GrUpdate } from 'react-icons/gr';
import { apiPut } from 'utils/apiFetch';
import apiPath from 'utils/apiPath';
import helpers from 'utils/helpers';
import { handleKeyDownCashIn, preventMaxHundred } from 'utils/reusableMethods';

const Commission = ({ saveSettingData }) => {
    const {
        register,
        handleSubmit,
        setValue,
        setError,
        watch,
        trigger, clearErrors,
        formState: { isDirty, errors },
    } = useForm({
        mode: 'onChange',
        shouldFocusError: true,
        defaultValues: {
        },

    });

    const { t } = useTranslation();
    const { user } = useContext(AuthContext);
    const manager = user?.permission?.find((e) => e.manager === 'settings') ?? {};
    const notification = useToastContext();
    const [settingChangeLoading, setSettingChangeLoading] = useState(false);

    const validationFields = {

        adminCommisionfirst: {
            required: {
                value: true,
                message: "Please enter admin commission.",
            },
            min: {
                value: 0.01,
                message: 'Minimum value must be 0.01.',
            },
            valueAsNumber: true,
            validate: (value) => {
                if (watch("firstCommission") === 'fixed') {
                    return value < watch('moneyStake1') || t("MIN_VALUE_MUST_BE_LESS_THAN_MONEY_STACK");
                }
                return true;
            },
        },

        moneyStake1: {
            required: {
                value: true,
                message: "Please enter money stake.",
            },
            min: {
                value: 0.01,
                message: 'Minimum value must is 0.01.'
            },

        },

        adminCommisionSecond: {
            required: {
                value: true,
                message: "Please enter admin commission.",
            },
            min: {
                value: 0.01,
                message: 'Minimum value must is 0.01.'
            },
            valueAsNumber: true,
            validate: (value) => {
                if (watch("secondCommision") === 'fixed') {
                    return value < watch('moneyStake2') || t("MIN_VALUE_MUST_BE_LESS_THAN_MONEY_STACK");
                }
                return true;
            },

        },

    }

    const handleSubmitForm = async (data) => {
        try {
            setSettingChangeLoading(true);

            const commissionObject1 = {
                commissionType: data?.firstCommission,
                type: "lt",
                adminCommission: data.adminCommisionfirst,
                amount: data?.moneyStake1,
            };

            const commissionObject2 = {
                commissionType: data?.secondCommision,
                type: "gt",
                adminCommission: data.adminCommission3,
                amount: data?.moneyStake2,
            };
            const payload = {
                commissions: [commissionObject1, commissionObject2]
            };
            const path = `${apiPath.commissionSet}`;
            const result = await apiPut(path, payload);

            if (result?.status === 200) {
                notification.success(result?.data?.message);
                setSettingChangeLoading(false);

            }
        } catch (error) {
            console.error("error in get all badges list==>>>>", error.message);
            setSettingChangeLoading(false);

        }

    };

    useEffect(() => {
        if (saveSettingData) {
            setValue("firstCommission", saveSettingData?.commissions?.[0]?.commissionType);
            setValue("secondCommision", saveSettingData?.commissions?.[1]?.commissionType);
            setValue("adminCommisionfirst", saveSettingData?.commissions?.[0]?.adminCommission);
            setValue("adminCommission3", saveSettingData?.commissions?.[1]?.adminCommission);
            setValue("moneyStake1", saveSettingData?.commissions?.[0]?.amount);
            setValue("moneyStake2", saveSettingData?.commissions?.[1]?.amount);

            trigger();
        }
    }, [saveSettingData, setValue, trigger]);



    useEffect(() => {
        if (watch("moneyStake2")) {
            setError("moneyStake1", "");
        }
    }, [])


    return (
        <div>
            <div>
                {/* Commission Type 1 */}

                <h2 className="mb-2 text-lg font-medium p-3 border-b py-7">Commission</h2>
                <div className='p-4'>

                    <div className="mb-10">
                        <div className="grid grid-cols-3">
                            <div className='mr-3'>
                                <h3 className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                                    Set Commission Type
                                </h3>

                                <select
                                    disabled={manager?.add === false}
                                    id="countries"
                                    type="password"
                                    name="firstCommission"
                                    className="block p-2 h-[43px] w-full text-sm text-[#A5A5A5] bg-transparent border-2 rounded-lg border-[#DFDFDF]  dark:text-[#A5A5A5] focus:outline-none focus:ring-0  peer"
                                    placeholder=" "
                                    {...register('firstCommission', {
                                        required: 'Please select a commission type',
                                        onChange: (e) => { setValue("adminCommisionfirst", ""); clearErrors("adminCommisionfirst") }
                                    })}
                                >
                                    <option value="">Select Commission Type</option>
                                    <option value="percentage">Percentage</option>
                                    <option value="fixed">Fixed</option>
                                </select>

                                {errors.firstCommission && (
                                    <ErrorMessage message={errors.firstCommission.message} />
                                )}
                            </div>

                            <div className="mr-3">
                                <h3 className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                                    Enter {helpers?.ternaryCondition(watch("firstCommission") === 'percentage', "Percentage", "Fixed Amount")}
                                </h3>
                                <OInputField
                                    disable={!watch("firstCommission") || manager?.add === false}
                                    wrapperClassName="relative z-0  w-full group"
                                    type="number"
                                    id="adminCommisionfirst"
                                    register={register("adminCommisionfirst", validationFields?.adminCommisionfirst)}
                                    // placeholder="Set Admin Commission"
                                    onInput={watch("firstCommission") === 'percentage' ? preventMaxHundred : null}
                                    onKeyDown={handleKeyDownCashIn} />

                                <ErrorMessage message={errors?.adminCommisionfirst?.message} />
                            </div>

                            <div>
                                <h3 className="mb-2 h-[20px] block text-sm font-medium text-gray-900 dark:text-white">
                                </h3>
                                <div className='flex items-center border border-gray-300 rounded-lg overflow-hidden money-stack-input'>
                                    <h3 className="block text-sm font-medium text-gray-900 dark:text-white w-[400px]">
                                        <div className="bg-[#EFEFEF] border-r text-[#686868] text-[13px]  focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        >
                                            If Money Stake &lt;
                                        </div>
                                    </h3>


                                    <OInputField
                                        wrapperClassName="relative z-0 w-full group pl-2 pr-2 outline-none"
                                        type="number"
                                        id="moneyStake1"
                                        disable={manager?.add === false}
                                        register={register("moneyStake1", {
                                            ...validationFields?.moneyStake1,
                                            onChange: (e) => {
                                                setValue("moneyStake2", e.target.value, {
                                                    shouldDirty: true,
                                                });
                                                setError("moneyStake2", "");
                                            },
                                        })}
                                        // placeholder='Enter Money Stake'
                                        onKeyDown={handleKeyDownCashIn}
                                    />

                                </div>
                                <ErrorMessage message={errors?.moneyStake1?.message} />
                            </div>
                        </div>
                    </div>



                    <div className="mb-4">
                        <div className="grid grid-cols-3">
                            <div className='mr-3'>
                                <h3 className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                                    Set Commission Type
                                </h3>

                                <select
                                    disabled={manager?.add === false}
                                    id="countries"
                                    type="password"
                                    name="secondCommision"
                                    className="block p-2  h-[43px] w-full text-sm text-[#A5A5A5] bg-transparent border-2 rounded-lg border-[#DFDFDF]  dark:text-[#A5A5A5] focus:outline-none focus:ring-0  peer"
                                    placeholder=" "
                                    {...register('secondCommision', {
                                        required: 'Please select a commission type',
                                        onChange: (e) => { setValue("adminCommission3", ""); clearErrors("adminCommission3") }
                                    })}
                                >
                                    <option value="">Select Commission Type</option>
                                    <option value="percentage">Percentage</option>
                                    <option value="fixed">Fixed</option>
                                </select>

                                {errors.secondCommision && (
                                    <ErrorMessage message={errors.secondCommision.message} />
                                )}

                            </div>

                            <div className="mr-3">
                                <h3 className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                                    Enter {helpers?.ternaryCondition(watch("secondCommision") === 'percentage', "Percentage", "Fixed Amount")}
                                </h3>

                                <OInputField
                                    disable={!watch("secondCommision") || manager?.add === false}
                                    wrapperClassName="relative z-0  w-full group"
                                    type="number"
                                    id="adminCommission3"
                                    register={register("adminCommission3", validationFields?.adminCommisionSecond)}
                                    // placeholder="Set Admin Commission"
                                    onInput={watch("secondCommision") === 'percentage' ? preventMaxHundred : null}
                                    onKeyDown={handleKeyDownCashIn}
                                />

                                <ErrorMessage message={errors?.adminCommission3?.message} />
                            </div>

                            <div>
                                <h3 className="mb-2 h-[20px] block text-sm font-medium text-gray-900 dark:text-white">
                                </h3>
                                <div className='flex items-center border border-gray-300 rounded-lg overflow-hidden money-stack-input'>
                                    <h3 className="block text-sm font-medium text-gray-900 dark:text-white  w-[400px]">
                                        <div className="bg-[#EFEFEF] border-r text-[#686868] text-[13px]  focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        >
                                            If money stake &gt;
                                        </div>
                                    </h3>


                                    <OInputField
                                        wrapperClassName="relative z-0 w-full group pl-2 pr-2 outline-none"
                                        type="number"
                                        id="moneyStake2"
                                        disable={manager?.add === false}
                                        register={register("moneyStake2", {
                                            ...validationFields?.moneyStake1,
                                            onChange: (e) => {
                                                setValue("moneyStake1", e.target.value, {
                                                    shouldDirty: true,
                                                });
                                                setError("moneyStake1", "");
                                            },
                                        })}
                                        // placeholder='Enter Money Stake'
                                        onKeyDown={handleKeyDownCashIn}
                                    />

                                </div>
                                <ErrorMessage message={errors?.moneyStake2?.message} />


                            </div>
                        </div>
                    </div>



                    {(manager?.add || user?.role === 'admin') && (
                        <div className="text-center mt-8">
                            <OButton
                                disabled={!isDirty}
                                label={<><GrUpdate size={16} className="mr-2" />{t("O_UPDATE")}</>}
                                type="submit"
                                onClick={handleSubmit(handleSubmitForm)}
                                loading={settingChangeLoading}
                                title={t("O_UPDATE")}
                            />
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default Commission;
