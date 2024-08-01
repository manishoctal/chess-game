import React from 'react'
import Select from 'react-select'

const OReactSelect = props => {
  const {
    wrapperClassName,
    placeholder,
    value,
    onChange,
    options,
    inputValue,
    onInputChange,
    name,
    style,
    disable
  } = props

  const customStyles = {
    option: (provided) => ({
      ...provided,
      fontSize: '13px',
      zIndex: 999
    }),
    singleValue: (provided) => ({
      ...provided,
      fontSize: '14px',
    }),
    container: (provided) => ({
      ...provided,
      width: 200,
    }),
    control: (provided) => ({
      ...provided,
      height: 40,
      minHeight: 40,
    }),

  };


  return (
    <div className={wrapperClassName ?? 'flex items-center mb-3 ml-3'}>
      <Select
        name={name}
        inputValue={inputValue}
        onInputChange={onInputChange}
        options={options}
        placeholder={placeholder}
        className='border-1 rounded-lg border-[#DFDFDF]'
        value={value}
        onChange={item => {
          onChange(item)
        }}
        styles={style || customStyles}
        isDisabled={disable}
      />
    </div>
  )
}

export default OReactSelect
