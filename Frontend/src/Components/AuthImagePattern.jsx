import React from 'react'

export const AuthImagePattern = () => {
  return (
    <div className="h-screen flex justify-center items-center bg-cover bg-center"
          style={{ backgroundImage: 'url("background-image.jpg")' }}
        >
      <div className="max-w-md mx-auto p-4 text-center">
        <h1 className="text-5xl font-bold pb-3 text-white animate-spin">
              Dialogue X
        </h1>
        <p className="text-lg text-gray-200">
              " Connecting to your fun world "
        </p>
      </div>
    </div>
  )
}
