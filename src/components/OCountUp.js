import React from 'react'
import CountUp from 'react-countup'

const OCountUp = ({ value }) => {
  return <CountUp duration={0.6} end={value ?? 0} />
}

export default OCountUp
