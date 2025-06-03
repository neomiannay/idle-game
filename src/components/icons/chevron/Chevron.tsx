import React from 'react'

type TChevron = {
  direction: 'left' | 'right' | 'up' | 'down'
}

const Chevron = ({ direction, ...props }: TChevron) => {
  const transform = {
    left: 'rotate(180deg)',
    right: 'rotate(0deg)',
    up: 'rotate(90deg)',
    down: 'rotate(-90deg)'
  }

  return (
    <svg
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      style={{
        transform: transform[direction]
      }}
      { ...props }
    >
      <path
        d='M9 18L15 12L9 6'
        stroke='#88AA9A'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  )
}

export default Chevron
