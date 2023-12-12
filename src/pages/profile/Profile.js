import React, { useContext, useRef, useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import FormData from 'form-data'
import AuthContext from 'context/AuthContext'
import OButton from 'components/reusable/OButton'
import { AiFillCamera } from 'react-icons/ai'
import OImage from 'components/reusable/OImage'
import { useTranslation } from 'react-i18next'
import { preventMaxInput } from 'utils/validations'
import formValidation from '../../utils/formValidation'
import OInputField from 'components/reusable/OInputField'
import AvatarEditor from 'react-avatar-editor'
import { Slider } from '@mui/material'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'

const Profile = () => {
  const { t } = useTranslation()
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty, dirtyFields }
  } = useForm({ mode: 'onChange', shouldFocusError: true, defaultValues: {} })
  const [open, setOpen] = useState(false)
  const [updateProfileLoading, setUpdateProfileLoading] = useState(false)
  const { updateProfile, user, updatePageName } = useContext(AuthContext)
  const profilePicRef = useRef()

  useEffect(() => {
    reset({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      profilePic: user.profilePic
    })
  }, [user])

  let editor = ''
  const [picture, setPicture] = useState({
    cropperOpen: false,
    img: null,
    zoom: 2,
    croppedImg: user?.profilePic
  })

  const handleSlider = (event, value) => {
    setPicture({
      ...picture,
      zoom: value
    })
  }

  const handleCancel = () => {
    setPicture({
      ...picture,
      cropperOpen: false
    })
    setOpen(false)
  }

  const setEditorRef = ed => {
    editor = ed
  }

  const handleSave = e => {
    if (setEditorRef) {
      const canvasScaled = editor.getImageScaledToCanvas()
      const croppedImg = canvasScaled.toDataURL()
      setPicture({
        ...picture,
        img: null,
        cropperOpen: false,
        croppedImg
      })
    }
    setOpen(false)
  }

  const handleFileChange = e => {
    const url = URL.createObjectURL(e.target.files[0])
    setPicture({
      ...picture,
      img: url,
      cropperOpen: true,
      imageName: e.target.files[0].name
    })
    setOpen(true)
  }

  const handleSubmitForm = async data => {
    try {
      setUpdateProfileLoading(true)
      const formData = new FormData()
      if (dirtyFields.firstName) {
        formData.append('firstName', data.firstName)
      }
      if (dirtyFields.lastName) {
        formData.append('lastName', data.lastName)
      }
      if (dirtyFields.email) {
        formData.append('email', data.email)
      }
      if (picture.imageName) {
        const response = await fetch(picture?.croppedImg)
        const newData = await response.blob()
        const metadata = {
          type: 'image/jpeg'
        }
        const file = new File([newData], picture.imageName, metadata)
        formData.append('profilePic', file)
      }
      reset()

      updateProfile(formData)
    } catch (err) {
      console.error('err:', err)
    } finally {
      setUpdateProfileLoading(false)
    }
  }

  useEffect(() => {
    updatePageName(t('EDIT_PROFILE'))
  }, [])

  const codeValue = watch('email') ? watch('email') : ''


  return (
    <div className='bg-[#F9F9F9] dark:bg-slate-900'>
      <div className='px-3 py-4'>
        <div className='bg-white border border-[#E9EDF9] dark:border-[#E9EDF9] rounded-lg py-4 dark:bg-slate-800 '>
          <form onSubmit={handleSubmit(handleSubmitForm)} method='post'>
            <div className='grid lg:grid-cols-3 sm:grid-cols-2'>
              <div className='py-4 px-4 md:px-8'>
                <div className='relative'>
                  <OInputField
                    wrapperClassName='relative z-0 mb-6 w-full group'
                    name='firstName'
                    inputLabel={
                      <>
                        {t('ADMIN_FIRST_NAME')}
                        <span className='text-red-500'>*</span>
                      </>
                    }
                    type='text'
                    autoFocus
                    maxLength={15}
                    onInput={e => preventMaxInput(e, 15)}
                    register={register(
                      'firstName',
                      formValidation.subAdminName
                    )}
                    errors={errors}
                  />
                </div>
              </div>
              <div className='py-4 px-4 md:px-8'>
                <div className='relative'>
                  <OInputField
                    wrapperClassName='relative z-0 mb-6 w-full group'
                    name='lastName'
                    inputLabel={
                      <>
                        {t('ADMIN_LAST_NAME')}
                        <span className='text-red-500'>*</span>
                      </>
                    }
                    type='text'
                    maxLength={15}
                    onInput={e => preventMaxInput(e, 15)}
                    register={register('lastName', formValidation.subAdminName)}
                    errors={errors}
                  />
                </div>
              </div>
              <div className='py-4 px-4 md:px-8'>
                <div className='relative'>
                  <OInputField
                    wrapperClassName='relative z-0  mb-6 w-full group'
                    type='text'
                    name='email'
                    id='email'
                    value={codeValue.toLowerCase()}
                    inputLabel={
                      <>
                        {t('O_EMAIL_ID')}
                        <span className='text-red-500'>*</span>
                      </>
                    }
                    maxLength={50}
                    autoComplete='off'
                    onInput={e => preventMaxInput(e, 50)}
                    register={register('email', formValidation.email)}
                    errors={errors}
                  />
                </div>
              </div>
              <div>
                <div className='py-4 px-4 md:px-8'>
                  <div className='relative w-24 h-24 '>
                    <label className='block mb-2 text-sm font-medium text-gray-900 dark:text-white w-28'>
                      {t('PROFILE_PICTURE')}
                    </label>
                    <input
                      type='file'
                      accept='image/png, image/jpg, image/jpeg'
                      name='profilePic'
                      ref={profilePicRef}
                      onChange={handleFileChange}
                      className='hidden'
                    />
                    <OImage
                      src={
                        picture.croppedImg
                          ? picture.croppedImg
                          : user?.profilePic
                      }
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
                      onClick={() => profilePicRef?.current?.click()}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className='flex justify-center mt-4'>
              <OButton
                disabled={!isDirty && picture.croppedImg == null}
                label='Submit'
                type='submit'
                loading={updateProfileLoading}
              />
            </div>
          </form>
        </div>
      </div>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            {picture.cropperOpen && (
              <div className='pb-0 bg-white shadow-lg mt-[30px]'>
                <AvatarEditor
                  ref={setEditorRef}
                  image={picture.img}
                  width={200}
                  height={200}
                  border={50}
                  color={[255, 255, 255, 0.6]}
                  rotate={0}
                  scale={picture.zoom}
                  sc
                  className='m-auto mb-4'
                />
                <Slider
                  aria-label='raceSlider'
                  value={picture.zoom}
                  min={1}
                  max={10}
                  step={0.1}
                  onChange={handleSlider}
                />
                <div className='flex items-center justify-center p-6 border-t border-solid border-slate-200 rounded-b'>
                  <button
                    className='text-black bg-[#E1E1E1] font-normal   px-12 py-2.5 text-sm outline-none focus:outline-none rounded mr-6  ease-linear transition-all duration-150'
                    type='button'
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                  <button
                    className=' bg-gradientTo cursor-pointer  text-white active:bg-emerald-600 font-normal text-sm px-8 py-2.5 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1  ease-linear transition-all duration-150'
                    type='submit'
                    onClick={handleSave}
                  >
                    Save
                  </button>
                </div>
              </div>
            )}
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Profile
