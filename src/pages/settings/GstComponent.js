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
import { handleKeyDownCashIn, preventMaxHundred } from 'utils/reusableMethods';

const GstComponent = ({saveSettingData}) => {
    const { t } = useTranslation();
    const {
        register,
        setValue,
        handleSubmit,
        formState: { isDirty, errors },
    } = useForm({
        mode: "onChange",
        shouldFocusError: true,
        defaultValues: {},
    });
    const { user } = useContext(AuthContext);
    const manager = user?.permission?.find((e) => e.manager === "settings") ?? {};
    const validationFields = {
        gstTimeDeposit: {
            required: { value: true, message: t("PLEASE_ENTER_GST") },
            min: {
                value: 0.01,
                message: "Minimum value must is 0.01.",
            },
        },
        tds: {
            required: { value: true, message: t("PLEASE_ENTER_TDS"), },
            min: {
              value: 0.01,
              message: 'Minimum value must is 0.01.'
            }
          },
    };

    const countries = ["India", "Canada", "Australia", "USA", "UK"];
    const [settingChangeLoading, setSettingChangeLoading] = useState(false);
    const notification = useToastContext();
    
    const handleSubmitForm = async (data) => {
        try {
            setSettingChangeLoading(true);
            const countryObject1 = {
                    india: data.indiaCountry,
                    canada: data.canadaCountry,
                    australia:data?.australiaCountry,
                    usa:data?.usaCountry,
                    uk:data?.ukCountry,
                    type:"gstDeposit"
            };

            const countryObject2 = {
                india: data.indiaCountryTds,
                canada: data.canadaCountryTds,
                australia:data?.australiaCountryTds,
                usa:data?.usaCountryTds,
                uk:data?.ukCountryTds,
                type:"tdsWithdrawal"
        };

        const payload = {
            gstTds: [countryObject1, countryObject2]
        };

            const response = await apiPut(apiPath?.tdsDeposit, payload);
            if (response?.status === 200) {
                notification.success(response?.data?.message);
                setSettingChangeLoading(false);
            }
        } catch (error) {
            console.error("Error submitting data:", error.message);
        }
    };


    useEffect(() => {
        setValue("indiaCountry", saveSettingData?.gstTds?.[0]?.india)
        setValue("canadaCountry", saveSettingData?.gstTds?.[0]?.canada)
        setValue("australiaCountry", saveSettingData?.gstTds?.[0]?.australia)
        setValue("usaCountry", saveSettingData?.gstTds?.[0]?.usa)
        setValue("ukCountry", saveSettingData?.gstTds?.[0]?.uk)
        setValue("indiaCountryTds", saveSettingData?.gstTds?.[1]?.india)
        setValue("canadaCountryTds", saveSettingData?.gstTds?.[1]?.canada)
        setValue("australiaCountryTds", saveSettingData?.gstTds?.[1]?.australia)
        setValue("usaCountryTds", saveSettingData?.gstTds?.[1]?.usa)
        setValue("ukCountryTds", saveSettingData?.gstTds?.[1]?.uk)

    }, [saveSettingData])


    return (
        <form onSubmit={handleSubmit(handleSubmitForm)} className='mb-5'>
          
          <div className='grid grid-cols-2 gap-x-5'>

          <div className="border rounded-md p-5">
                <h2 className="text-center mb-5 text-2xl font-medium">
                    {t("GST_TIME_OF_DEPOSIT")}
                </h2>

                {countries.map((country) => (
                    <div className="flex" key={country}>
                        <span className="mr-5 mt-3 w-[150px]">{country}</span>
                        <ReusableInputField
                            id={`${country.toLowerCase()}Country`}
                            register={register}
                            errors={errors}
                            disable={manager?.add === false}
                            validationRules={validationFields?.gstTimeDeposit}
                        />
                    </div>
                ))}


            </div>

       
            <div className="border rounded-md p-5">
                <h2 className="text-center mb-5 text-2xl font-medium">
                    {t("TDS_TIME_OF_DEPOSIT")}
                </h2>


            {countries.map((country) => (
                    <div className="flex" key={country}>
                        <span className="mr-5 mt-3 w-[150px]">{country}</span>
                        <ReusableInputField
                            id={`${country.toLowerCase()}CountryTds`}
                            register={register}
                            disable={manager?.add === false}
                            errors={errors}
                            validationRules={validationFields?.tds}
                        />
                    </div>
                ))}

            </div>
          </div>
          {(manager?.add || user?.role === 'admin') && (
            <div className="text-center mt-8">
                <OButton
                    disabled={!isDirty}
                    label={
                        <>
                            <GrUpdate size={16} className="mr-2" />
                            {t('O_UPDATE')}
                        </>
                    }
                    loading={settingChangeLoading}
                    type="submit"
                    title={t('O_UPDATE')}
                />
            </div>
             )}
        </form>
    );
};

export default GstComponent;

const ReusableInputField = ({
    label,
    id,
    register,
    errors,
    disable,
    validationRules,
    onInput = preventMaxHundred,
    onKeyDown = handleKeyDownCashIn,
    labelType = false,
}) => (
    <div className="relative z-0 mb-6 w-full group">
        <OInputField
            type="number"
            wrapperClassName="relative z-0 w-full group"
            labelType={labelType}
            inputLabel={<>{label}</>}
            id={id}
            disable={disable}
            onInput={onInput}
            onKeyDown={onKeyDown}
            register={register(id, validationRules)}
            placeholder=" "
            />
        <ErrorMessage message={errors?.[id]?.message} />
    </div>
);
