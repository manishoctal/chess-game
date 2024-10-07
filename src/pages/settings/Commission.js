import ErrorMessage from 'components/ErrorMessage';
import OButton from 'components/reusable/OButton';
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
        watch,
        trigger,
        formState: { isDirty, errors },
    } = useForm({
        mode: 'onChange',
        shouldFocusError: true,
      defaultValues: {
      moneyStake1: saveSettingData?.commissions?.[0]?.amount || "",
      moneyStake2: saveSettingData?.commissions?.[1]?.amount || "",
    },

    });

    const { t } = useTranslation();
    const { user } = useContext(AuthContext);
    const manager = user?.permission?.find((e) => e.manager === 'settings') ?? {};
    const notification = useToastContext();
    const [settingChangeLoading, setSettingChangeLoading] = useState(false);


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
    
            // Trigger validation after setting values to reflect in isDirty
            trigger(); // This will trigger validation on all fields and update form state
        }
    }, [saveSettingData, setValue, trigger]);
    
    // console.log("isDirty:", isDirty); // Log the value of isDirty to verify if it's changing


    return (
        <div>
            <div>
                {/* Commission Type 1 */}

                <h2 className='text-2xl mb-6 font-medium'>Commission</h2>

                <div className="mb-4">
                    <div className="flex ">
                        <div className='mr-3'>
                            <h3 className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                                Set commission type
                            </h3>

                            <select
                                id="countries"
                                type="password"
                                name="firstCommission"
                                className="block p-2 h-[43px] w-full text-sm text-[#A5A5A5] bg-transparent border-2 rounded-lg border-[#DFDFDF]  dark:text-[#A5A5A5] focus:outline-none focus:ring-0  peer"
                                placeholder=" "
                                {...register('firstCommission', {
                                    required: 'Please select a commission type',
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
                            <input
                                disabled={!watch("firstCommission")}
                                type="number"
                                name="adminCommisionfirst"
                                placeholder="Set Admin Commission"
                                onInput={watch("firstCommission") === 'percentage' ? preventMaxHundred : null}
                                onKeyDown={watch("firstCommission") === 'percentage' ? handleKeyDownCashIn : null}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                {...register('adminCommisionfirst', {
                                    required: 'Please enter admin commission.',
                                    min: {
                                        value: 0.01,
                                        message: 'Minimum value must is 0.01.'
                                    },

                                })}
                            />
                            {errors.adminCommisionfirst && <ErrorMessage message={errors.adminCommisionfirst?.message} />}
                        </div>

                        <div>
                            <h3 className="mb-2 h-[20px] block text-sm font-medium text-gray-900 dark:text-white">
                            </h3>
                            <div className='flex items-center border border-gray-300 rounded-lg overflow-hidden'>
                                <h3 className="block text-sm font-medium text-gray-900 dark:text-white">
                                    <div className="bg-[#EFEFEF] border-r text-[#686868] text-sm  focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    >
                                        If money stake &lt;
                                    </div>
                                </h3>
                                <input type="number"
                                    id="moneyStake1"
                                    placeholder='Enter Money Stake'
                                    className='pl-3 pr-3 outline-none'
                                    {...register("moneyStake1")}
                                    onKeyDown={handleKeyDownCashIn}
                                    onChange={(e) => {
                                        setValue("moneyStake2", e?.target?.value)
                                    }}
                                />
                            </div>
                            {/* {errors.moneyStake1 && (
                                <ErrorMessage message={errors.moneyStake1.message} />
                            )} */}
                        </div>
                    </div>
                </div>



                <div className="mb-4">
                    <div className="flex">
                        <div className='mr-3'>
                            <h3 className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                                Set commission type
                            </h3>

                            <select
                                id="countries"
                                type="password"
                                name="secondCommision"
                                className="block p-2  h-[43px] w-full text-sm text-[#A5A5A5] bg-transparent border-2 rounded-lg border-[#DFDFDF]  dark:text-[#A5A5A5] focus:outline-none focus:ring-0  peer"
                                placeholder=" "
                                {...register('secondCommision', {
                                    required: 'Please select a commission type',
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
                            <input
                                disabled={!watch("secondCommision")}
                                type="number"
                                name="adminCommission3"
                                placeholder="Set Admin Commission"
                                onInput={watch("secondCommision") === 'percentage' ? preventMaxHundred : null}
                                onKeyDown={watch("secondCommision") === 'percentage' ? handleKeyDownCashIn : null}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                {...register('adminCommission3', {
                                    required: 'Please enter admin commission.',
                                    min: {
                                        value: 0.01,
                                        message: 'Minimum value must is 0.01.'
                                    },

                                })}
                            />
                            {errors.adminCommission3 && <ErrorMessage message={errors.adminCommission3?.message} />}
                        </div>

                        <div>
                            <h3 className="mb-2 h-[20px] block text-sm font-medium text-gray-900 dark:text-white">
                            </h3>
                            <div className='flex items-center border border-gray-300 rounded-lg overflow-hidden'>
                                <h3 className="block text-sm font-medium text-gray-900 dark:text-white">
                                    <div className="bg-[#EFEFEF] border-r text-[#686868] text-sm  focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    >
                                        If money stake &gt;
                                    </div>
                                </h3>

                                <input
                                    type="number"
                                    className='pl-3 pr-3 outline-none'
                                    id="moneyStake2"
                                    placeholder='Enter Money Stake'
                                    {...register("moneyStake2")}
                                    onKeyDown={handleKeyDownCashIn}
                                    onChange={(e) => {
                                        setValue("moneyStake1", e.target.value);
                                    }}
                                />
                            </div>
                            {/* {errors.moneyStake2 && <ErrorMessage message={errors.moneyStake2?.message} />} */}

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
    );
};

export default Commission;
