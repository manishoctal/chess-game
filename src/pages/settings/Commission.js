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
import { handleKeyDownCashIn, preventMaxHundred } from 'utils/reusableMethods';

const Commission = ({saveSettingData}) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { isDirty, errors },
    } = useForm({
        mode: 'onChange',
        shouldFocusError: true,
    
    });

    const { t } = useTranslation();
    const { user } = useContext(AuthContext);
    const manager = user?.permission?.find((e) => e.manager === 'settings') ?? {};
    const notification = useToastContext();
    const [commissionType, setCommissionType] = useState('');
    const [commissionType2, setCommissionType2] = useState('');
    const [moneyStack,setMoneyStack]=useState()

    const handleCommissionTypeChange1 = (e) => {
        setCommissionType(e.target.value);
        reset({ adminCommission2: '' });
    };

    const handleCommissionTypeChange2 = (e) => {
        setCommissionType2(e.target.value);
        reset({ adminCommission3: '' });
    };

    const handleSubmitForm = async (data) => {

        try {
            const commissionObject1 = {
                commissionType: commissionType,
                type: "lt",
                adminCommission: data.adminCommission2,
                amount: moneyStack,
            };
    
            const commissionObject2 = {
                commissionType: commissionType2, 
                type: "gt",                    
                adminCommission: data.adminCommission3,
                amount: moneyStack,          
            };
            const payload = {
                commissions: [commissionObject1, commissionObject2]
            };
            const path = `${apiPath.commissionSet}`;
            const result = await apiPut(path, payload);

            if (result?.status === 200) {
                notification.success(result?.data?.message);
            }
          } catch (error) {
            console.error("error in get all badges list==>>>>", error.message);
          }

    };

    return (
        <div>
            <form onSubmit={handleSubmit(handleSubmitForm)}>
                {/* Commission Type 1 */}
                <div className="mb-4">
                    <div className="flex items-center">
                        <div className='mr-3'>
                            <h3 className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                                Set commission type
                            </h3>

                            <select
                                id="countries"
                                type="password"
                                name="floating_password"
                                className="block p-2 w-full text-sm text-[#A5A5A5] bg-transparent border-2 rounded-lg border-[#DFDFDF]  dark:text-[#A5A5A5] focus:outline-none focus:ring-0  peer"
                                placeholder=" "
                                value={commissionType}
                                onChange={handleCommissionTypeChange1}
                            >
                                <option value="">Select Commission Type</option>
                                <option value="percentage">Percentage</option>
                                <option value="fixed">Fixed</option>
                            </select>


                        </div>

                        <div className="mr-3">
                            <h3 className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                                Set Admin commission if money stake &lt;
                            </h3>
                            <input
                                disabled={!commissionType}
                                type="number"
                                value={saveSettingData?.adminCommission}
                                placeholder="Set Admin Commission"
                                onInput={commissionType === 'percentage' ? preventMaxHundred : null}
                                onKeyDown={commissionType === 'percentage' ? handleKeyDownCashIn : null}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                {...register('adminCommission2', {
                                    required: 'Admin commission is required',
                                    min: {
                                        value: 0.01,
                                        message: 'Minimum value must is 0.01.'
                                    },

                                })}
                            />
                            {errors.adminCommission2 && <ErrorMessage message={errors.adminCommission2?.message} />}
                        </div>

                        <div>
                            <input
                               value={moneyStack}
                                onChange={(e)=>setMoneyStack(e.target.value)}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                type="number"
                                id="moneyStake2"
                            />
                        </div>
                    </div>
                </div>



                <div className="mb-4">
                    <div className="flex items-center">
                        <div className='mr-3'>
                            <h3 className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                                Set commission type
                            </h3>

                            <select
                                id="countries"
                                type="password"
                                name="floating_password"
                                className="block p-2 w-full text-sm text-[#A5A5A5] bg-transparent border-2 rounded-lg border-[#DFDFDF]  dark:text-[#A5A5A5] focus:outline-none focus:ring-0  peer"
                                placeholder=" "
                                value={commissionType2}
                                onChange={handleCommissionTypeChange2}
                            >
                                <option value="">Select Commission Type</option>
                                <option value="percentage">Percentage</option>
                                <option value="fixed">Fixed</option>
                            </select>


                        </div>

                        <div className="mr-3">
                            <h3 className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                                Set Admin commission if money stake &gt;
                            </h3>
                            <input
                                disabled={!commissionType2}
                                type="number"
                                placeholder="Set Admin Commission"
                                onInput={commissionType2 === 'percentage' ? preventMaxHundred : null}
                                onKeyDown={commissionType2 === 'percentage' ? handleKeyDownCashIn : null}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                {...register('adminCommission3', {
                                    required: 'Admin commission is required',
                                    min: {
                                        value: 0.01,
                                        message: 'Minimum value must is 0.01.'
                                    },

                                })}
                            />
                            {errors.adminCommission3 && <ErrorMessage message={errors.adminCommission3?.message} />}
                        </div>

                        <div>
                            <input
                             value={moneyStack}
                             onChange={(e)=>setMoneyStack(e.target.value)}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                type="number"
                                id="moneyStake2"
                            />
                        </div>
                    </div>
                </div>

              

                {(manager?.add || user?.role === 'admin') && (
                    <div className="text-center mt-8">
                        <OButton
                            // disabled={!isDirty}
                            label={
                                <>
                                    <GrUpdate size={16} className="mr-2" />
                                    {t('O_UPDATE')}
                                </>
                            }
                            type="submit"
                            title={t('O_UPDATE')}
                        />
                    </div>
                )}
            </form>
        </div>
    );
};

export default Commission;
