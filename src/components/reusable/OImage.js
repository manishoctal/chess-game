import React from 'react'
import errorIcon from 'assets/icons/error.svg'
import classNames from 'classnames'
const OImage = ({ src, fallbackUrl, ...rest }) => {
  return (
    <>
      <img
        src={src}
        onError={({ currentTarget }) => {
          currentTarget.onerror = null // prevents looping
          currentTarget.src = fallbackUrl || errorIcon
        }}
        {...rest}

      />
    </>
  )
}

export default OImage
