import React, { useState, useEffect, useContext, useRef } from 'react'
import useToastContext from 'hooks/useToastContext'
import { useForm, Controller } from 'react-hook-form'
import { apiPost, apiPut } from '../../utils/apiFetch'
import apiPath from '../../utils/apiPath'
import Permission from './Permission'
import { useTranslation } from 'react-i18next'
import OInputField from 'components/reusable/OInputField'
import FormValidation from 'utils/formValidation'
import { useLocation, useNavigate } from 'react-router-dom'
import AuthContext from 'context/AuthContext'
import PhoneInput from 'react-phone-input-2'
import ErrorMessage from 'components/ErrorMessage'
import DynamicLabel from 'utils/DynamicLabel'
import helpers from 'utils/helpers'
import { preventMaxInput } from 'utils/validations'
const { startCase, capitalize } = require('lodash')

const SubAdd = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const inputRef = useRef(null)
  const [loader, setLoader] = useState(false)
  const item = location.state
  const {
    register,
    handleSubmit,
    control,
    getValues,
    formState: { errors }
  } = useForm({
    mode: 'onChange',
    shouldFocusError: true,
    defaultValues: {
      firstName: item?.item?.firstName,
      lastName: item?.item?.lastName,
      email: item?.item?.email,
      mobile: helpers.ternaryCondition(
        item?.item?.countryCode,
        item?.item?.countryCode + item?.item?.mobile,
        'na'
      ),
      address: item?.item?.address,
      permission: item?.item?.permission
    }
  })
  const notification = useToastContext()
  const [permissionJons, setPermission] = useState(
    helpers.ternaryCondition(item?.type, getValues('permission'), Permission)
  )
  const formValidation = FormValidation()

  const { updatePageName } = useContext(AuthContext)
  const [countryCode] = useState('in')
  const [isSelectAll, setIsSelectAll] = useState(false)
  const [isCheckAll, setIsCheckAll] = useState(false)

  useEffect(() => {
    updatePageTitle();
    initializePermissions();
  }, []);

  const updatePageTitle = () => {
    if (item?.type === 'add') {
      updatePageName(t('ADD_SUB_ADMIN'));
    } else if (item?.type === 'edit') {
      updatePageName(t('EDIT_SUB_ADMIN'));
    } else if (item?.type === 'view') {
      updatePageName(t('VIEW_SUB_ADMIN'));
    }
  };

  const initializePermissions = () => {
    const permissionData = getValues('permission');
    if (permissionData?.length > 0 && permissionData[0]?.manager === 'dashboard' && (item?.type === 'edit' || item?.type === 'view')) {
      permissionData.shift();
      setPermission(permissionData);
    }
  };

  const onChange = (event) => {
    const { checked, id, name } = event.target;
    if (!checked) setIsSelectAll(false);

    setPermission(current => current.map(obj => {
      if (obj.manager === name) {
        let newPermissions = { ...obj, [id]: checked };
        if (id === 'add' || id === 'edit') newPermissions.view = checked;
        if (id === 'view' && !checked) newPermissions = { ...obj, add: false, edit: false, view: false };
        return newPermissions;
      }
      return obj;
    }));
  };

  const selectAll = (event) => {
    const checked = event.target.checked;
    setIsSelectAll(checked);
    setIsCheckAll(checked);
    setPermission(current => current.map(obj => ({
      ...obj,
      add: checked,
      view: checked,
      delete: checked,
    })));
  };

  const checkAll = (event) => {
    const checked = event.target.checked;
    setPermission(current => current.map(obj => {
      if (obj.manager === event.target.name) {
        return { ...obj, add: checked, view: checked, delete: checked };
      }
      return obj;
    }));
  };

  const onSubmit = async (data) => {
    data.mobile = data?.mobile?.substring(
      inputRef?.current?.state.selectedCountry?.countryCode?.length,
      data?.mobile?.toString()?.length
    );
    data.countryCode = inputRef?.current?.state.selectedCountry?.countryCode;
    const myData = { ...data };

    try {
      setLoader(true);
      let result;
      if (item?.type === 'edit') {
        result = await handleEditSubmit(myData);
      } else {
        result = await handleAddSubmit(myData);
      }
      handleApiResponse(result);
    } catch (error) {
      console.error('error in get all sub admin list==>>>>', error.message);
    } finally {
      setLoader(false);
    }
  };

  const handleEditSubmit = async (myData) => {
    const permission = JSON.stringify([...permissionJons]);
    const editSendData = {
      ...myData,
      permission,
      name: myData.firstName + myData.lastName,
    };
    const path = apiPath.editSubAdmin + '/' + item?.item?._id;
    return await apiPut(path, editSendData);
  };

  const handleAddSubmit = async (myData) => {
    const permission = JSON.stringify([{ manager: 'dashboard', add: true, edit: true, view: true }, ...permissionJons]);
    const sendData = {
      ...myData,
      permission,
      name: myData.firstName + myData.lastName,
    };
    const path = apiPath.getSubAdmin;
    return await apiPost(path, sendData);
  };

  const handleApiResponse = (result) => {
    if (result?.data?.success) {
      navigate('/sub-admin-manager');
      notification.success(result?.data.message);
    } else {
      notification.error(result?.data.message);
    }
  };


  let itemType = helpers.ternaryCondition(
    item?.type === 'edit',
    t('O_EDIT'),
    t('O_ADD')
  )

  const renderInputField = (
    autoFocus,
    name,
    label,
    maxLength,
    validation,
    disable
  ) => (
    <OInputField
      wrapperClassName='relative z-0 mb-6 w-full group'
      name={name}
      inputLabel={
        <>
          {label}
          <span className='text-red-500'>*</span>
        </>
      }
      type='text'
      autoFocus={autoFocus}
      maxLength={maxLength}
      onInput={e => preventMaxInput(e, maxLength)}
      register={register(name, validation)}
      errors={errors}
      disable={disable}
    />
  )
  return (
    <>
      <div className='relative p-6 flex-auto'>
        <div className=''>
          <div className=''>
            <div className='grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
              <div className='px-2'>
                {renderInputField(
                  true,
                  'firstName',
                  t('O_FIRST_NAME'),
                  15,
                  formValidation['subAdminName'],
                  item?.type === 'view'
                )}
              </div>
              <div className='px-2'>
                {renderInputField(
                  false,
                  'lastName',
                  t('O_LAST_NAME'),
                  15,
                  formValidation['subAdminLastName'],
                  item?.type === 'view'
                )}
              </div>

              <div className='px-2'>
                {renderInputField(
                  false,
                  'email',
                  t('O_EMAIL_ID'),
                  50,
                  formValidation['email'],
                  item?.type === 'view'
                )}
              </div>

              <div className='px-2'>
                <DynamicLabel
                  name={t('O_MOBILE')}
                  type={true}
                  htmlFor={countryCode}
                />

                <DynamicLabel />
                <Controller
                  control={control}
                  name='mobile'
                  rules={{
                    required: 'Please enter mobile no.',
                    validate: value => {
                      const inputValue = value
                        ?.toString()
                        ?.slice(
                          inputRef?.current?.state?.selectedCountry?.countryCode
                            ?.length,
                          value?.length
                        )
                      if (inputValue?.length < 8) {
                        return 'Mobile no. must be 8 digit'
                      } else if (inputValue?.length > 12) {
                        return 'Mobile no. should be not exceed 12 digits'
                      }
                    }
                  }}
                  render={({ field: { ref, ...field } }) => (
                    <PhoneInput
                      {...field}
                      inputExtraProps={{
                        ref,
                        required: true,
                        autoFocus: true
                      }}
                      ref={inputRef}
                      inputStyle={{
                        width: '100%',
                        height: '42px'
                      }}
                      style={{ borderRadius: '20px' }}
                      country={countryCode}
                      enableSearch
                      onlyCountries={['in']}
                      countryCodeEditable={false}
                      disabled={item?.type === 'view'}
                    />
                  )}
                />
                <ErrorMessage message={errors?.mobile?.message} />
              </div>

              <div className='px-2'>
                <OInputField
                  wrapperClassName='relative z-0 mb-6 w-full group'
                  name='address'
                  inputLabel={t('ADDRESS')}
                  labelType={true}
                  type='textarea'
                  register={register('address', formValidation.address)}
                  errors={errors}
                  disable={item?.type === 'view'}
                />
              </div>
            </div>
          </div>
          <div className=''>
            <div className='overflow-x-auto  overflow-y-auto relative rounded-lg border'>
              <table className='w-full text-xs text-left text-[#A5A5A5] dark:text-gray-400 '>
                <thead className='text-xs text-gray-900 border  border-[#E1E6EE] bg-[#E1E6EE] dark:bg-gray-700 dark:text-gray-400'>
                  <tr>
                    <th scope='col' className='py-3 px-6 '>
                      {t('SUB_ADMIN_MODULES')}
                    </th>
                    <th scope='col' className='py-3 px-6 '>
                      {t('O_VIEW')}
                    </th>
                    <th scope='col' className='py-3 px-6 '>
                      {t('SUB_ADMIN_ADD_EDIT')}
                    </th>
                  
                    <th scope='col' className='py-3 px-6'>
                      <div className='flex items-center justify-between '>
                        {t('O_ALL')}
                        <input
                          type='checkbox'
                          id='all'
                          checked={isSelectAll}
                          className='h-4 w-4'
                          onChange={selectAll}
                          disabled={item?.type === 'view'}
                        />
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {permissionJons?.map((data, i) => (
                    <tr
                      key={i}
                      className='bg-white border-b  dark:bg-gray-800 dark:border-gray-700'
                    >
                      <td className='py-2 px-4 border-r dark:border-[#ffffff38] '>
                        {helpers.ternaryCondition(
                          data.manager === 'FAQ',
                          'FAQ',
                          capitalize(startCase(data.manager))
                        )}
                      </td>
                      <td className='py-2 px-4 border-r dark:border-[#ffffff38] '>
                        {helpers.andOperator(
                          data?.shownView,
                          <input
                            type='checkbox'
                            name={data?.manager}
                            id='view'
                            checked={data.view}
                            onChange={onChange}
                            disabled={item?.type === 'view'}
                          />
                        )}
                      </td>
                      <td className='py-2 px-4 border-r dark:border-[#ffffff38] '>
                        {helpers.andOperator(
                          data?.shownAdd,
                          <input
                            type='checkbox'
                            name={data?.manager}
                            id='add'
                            checked={data.add}
                            onChange={onChange}
                            disabled={item?.type === 'view'}
                          />
                        )}
                      </td>
                      <td className='py-2 px-4 border-r dark:border-[#ffffff38] '>
                        {helpers.andOperator(
                          data?.shownAll,
                          <input
                            type='checkbox'
                            id='all'
                            name={data?.manager}
                            onChange={checkAll}
                            checked={isCheckAll || (data.add && data.view)}
                            disabled={item?.type === 'view'}
                          />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div className='flex items-center justify-center p-6 border-t border-solid border-slate-200 rounded-b'>
        <button
          className='text-black bg-[#E1E1E1] font-normal px-12 py-2.5 text-sm outline-none focus:outline-none rounded mr-6  ease-linear transition-all duration-150'
          type='button'
          onClick={() => navigate('/sub-admin-manager')}
        >
          {t('O_BACK')}
        </button>

        {loader ? <button className="bg-gradientTo text-white active:bg-emerald-600 font-normal text-sm px-8 py-2.5 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1  ease-linear transition-all duration-150">
          <div className="spinner-container">
            <div className="loading-spinner" />
          </div>
        </button> : helpers.ternaryCondition(
          item?.type !== 'view',
          <button
            className='bg-gradientTo text-white active:bg-emerald-600 font-normal text-sm px-8 py-2.5 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1  ease-linear transition-all duration-150'
            type='submit'
            onClick={handleSubmit(onSubmit)}
          >
            {itemType}
          </button>,
          null
        )}
      </div>
    </>
  )
}

export default SubAdd
