import React, { useEffect, useState } from 'react';
import Droplet from 'components/icons/droplet/Droplet';
import { MotionValue } from 'motion/react';
import classNames from 'classnames';

import styles from './RabbitHp.module.scss';
import useMotionState from 'hooks/useMotionState';

type TRabbitHp = {
  life: MotionValue<number>;
  length: number;
  reduce?: boolean;
  className?: string;
};

const RabbitHp = ({ life, length, reduce = false, className }: TRabbitHp) => {
  const lifeValue = useMotionState(life, (v) => v);

  const totalDroplets = reduce ? lifeValue : length;

  return (
    <div className={classNames(styles.rabbitHp, className, {
      [styles.rabbitHpCard]: reduce
    })}>
      {Array.from({ length: totalDroplets }).map((_, index) => (
        <Droplet key={index} active={index < lifeValue} />
      ))}

      {!reduce && (
        <img
          src={`img/rabbit/hp_wire.svg`}
          className={styles.hpWire}
        />
      )}
    </div>
  );
};

export default RabbitHp;
