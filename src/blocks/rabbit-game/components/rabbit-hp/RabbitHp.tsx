import React, { useEffect, useState } from 'react';
import Droplet from 'components/icons/droplet/Droplet';
import { MotionValue } from 'motion/react';
import classNames from 'classnames';

import styles from './RabbitHp.module.scss';

type TRabbitHp = {
  life: MotionValue<number>;
  length: number;
  reduce?: boolean;
  className?: string;
};

const RabbitHp = ({ life, length, reduce = false, className }: TRabbitHp) => {
  const [lifeValue, setLifeValue] = useState<number>(life.get());

  useEffect(() => {
    const unsubscribe = life.on('change', (value) => {
      setLifeValue(value);
    });

    return () => {
      unsubscribe();
    };
  }, [life]);

  const totalDroplets = reduce ? Math.floor(lifeValue) : length;

  return (
    <div className={classNames(styles.rabbitHp, className)}>
      {Array.from({ length: totalDroplets }).map((_, index) => (
        <Droplet key={index} active={index < lifeValue} />
      ))}
    </div>
  );
};

export default RabbitHp;
