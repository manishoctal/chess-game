import React from 'react'

const LoaderButton = () => {
    return (
        <>
            <button className="bg-gradientTo text-white active:bg-emerald-600 font-normal text-sm px-8 py-2.5 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1  ease-linear transition-all duration-150">
                <div className="spinner-container">
                    <div className="loading-spinner" />
                </div>
            </button>
        </>
    )
}

export default LoaderButton