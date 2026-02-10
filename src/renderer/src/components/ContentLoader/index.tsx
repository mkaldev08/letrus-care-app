import React from 'react'
import { ThreeCircles } from 'react-loader-spinner'

export const ContentLoader: React.FC = () => {
  return (
    <div className="flex items-center justify-center gap-1 p-2">
      <ThreeCircles
        visible={true}
        height="20"
        width="20"
        color="#c2410c"
        ariaLabel="three-circles-loading"
        wrapperStyle={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: '9999',
          backgroundColor: 'black'
        }}
        wrapperClass=""
      />
    </div>
  )
}
