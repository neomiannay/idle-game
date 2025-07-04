import React from 'react'

import styles from './Droplet.module.scss'

type TDroplet = {
  active?: boolean;
  width?: string;
  height?: string;
  props?: React.SVGProps<SVGSVGElement>;
};

const Droplet = ({ active, ...props }: TDroplet) => {
  return (
    <div { ...props } className={ styles.droplet }>
      <svg
        viewBox='0 0 24 24'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
        style={{ opacity: active ? 1 : 0.5 }}
      >
        <path
          d='M11.9999 2.68994L17.6599 8.34994C18.7792 9.46855 19.5417 10.894 19.8508 12.446C20.1599 13.998 20.0018 15.6068 19.3964 17.0689C18.7911 18.531 17.7657 19.7808 16.45 20.66C15.1343 21.5393 13.5874 22.0086 12.0049 22.0086C10.4224 22.0086 8.87549 21.5393 7.55978 20.66C6.24407 19.7808 5.2187 18.531 4.61335 17.0689C4.008 15.6068 3.84988 13.998 4.15899 12.446C4.46809 10.894 5.23054 9.46855 6.34989 8.34994L11.9999 2.68994Z'
          fill='#AE0909'
        />
      </svg>
      { active && (
        <svg
          viewBox='0 0 24 24'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
          className={ styles.backdrop }
        >
          <path
            d='M11.9999 2.68994L17.6599 8.34994C18.7792 9.46855 19.5417 10.894 19.8508 12.446C20.1599 13.998 20.0018 15.6068 19.3964 17.0689C18.7911 18.531 17.7657 19.7808 16.45 20.66C15.1343 21.5393 13.5874 22.0086 12.0049 22.0086C10.4224 22.0086 8.87549 21.5393 7.55978 20.66C6.24407 19.7808 5.2187 18.531 4.61335 17.0689C4.008 15.6068 3.84988 13.998 4.15899 12.446C4.46809 10.894 5.23054 9.46855 6.34989 8.34994L11.9999 2.68994Z'
            fill='#AE0909'
          />
        </svg>
      ) }
    </div>
  )
}

export default Droplet
