import * as React from 'react'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { TextField } from '@mui/material'

export default function BasicDatePicker ({
  value,
  label,
  handelDateChange,
  min
}) {
  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DesktopDatePicker
          label={label ?? ''}
          value={value}
          inputFormat='DD-MM-YYYY'
          className='block py-4 px-3 w-full text-sm text-gray-900 bg-transparent border-2 rounded-lg border-[#DFDFDF] appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0  peer'
          onChange={(newValue, w, d) => {
            handelDateChange(newValue)
          }}
          renderInput={(params) => <TextField {...params} />}
          minDate={min}
        />
      </LocalizationProvider>
    </>
  )
}
