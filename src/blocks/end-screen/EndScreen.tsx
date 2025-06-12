import React, { PropsWithChildren, useMemo } from 'react'

import classNames from 'classnames'
import styles from './EndScreen.module.scss'
import { motion } from 'motion/react'
import AdaptativeText from 'components/adaptative-text/AdaptativeText'
import { baseVariants, fadeAppear } from 'core/animation'

type EndScreenProps = PropsWithChildren<{
	className?: string
}>

const EndScreen = ({ className, ...props }: EndScreenProps) => {


	return (
		<div className={classNames(className)} {...props}>
			<motion.div { ...baseVariants }
			 {...fadeAppear()}>
				<AdaptativeText
					className={classNames(styles.congrats)}
				>
					Félicitations
				</AdaptativeText>
			</motion.div>
		</div>
	)
}

export default EndScreen
