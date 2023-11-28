import React from 'react'
import Select from 'react-select'

const OMultiSelect = props => {
  const {
    wrapperClassName,
    placeholder,
    value,
    onChange,
    options
  } = props

  return (
    <div className={wrapperClassName ?? 'relative z-10 mb-6 w-full group'}>
      <Select
        isMulti
        name='referenceLink '
        options={options}
        placeholder={placeholder}
        className='basic-multi-select'
        classNamePrefix='select'
        value={value}
        onChange={item => {
          onChange(item)
        }}
      />
    </div>
  )
}

export default OMultiSelect
