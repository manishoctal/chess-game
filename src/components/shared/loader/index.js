import React from 'react'

const Loader = ({ height = '20px', width = '20px', className }) => {
    return (
        <div
            className={
                className ? `loader ${className}` : `loader`
            }
            style={{
                height: height,
                width: width
                //  margin: 'auto'
            }}
        ></div>
    )
}

export default Loader
