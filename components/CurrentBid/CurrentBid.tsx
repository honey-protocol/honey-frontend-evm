import React from 'react';
import HoneyButton from '../HoneyButton/HoneyButton';
import { InfoBlock } from '../InfoBlock/InfoBlock';
import * as styles from './CurrentBid.css';
import { formatNumber } from '../../helpers/format';
import HoneyTooltip from 'components/HoneyTooltip/HoneyTooltip';

interface CurrentBidProps {
	title?: string;
	value: number;
	buttonText: string;
	disabled: boolean;
	onClick: () => void;
	unlockTime: number;
	formatDecimals: number;
}

const { formatERC20: fs } = formatNumber;

const CurrentBid = (props: CurrentBidProps) => {
	const { title, onClick, value, buttonText, disabled, unlockTime, formatDecimals } = props;
	const isLocked = unlockTime > Date.now() / 1000;
	return (
		<div className={styles.CurrentBidContainer}>
			<InfoBlock value={fs(value, formatDecimals)} valueSize="big" title={title || ''} />
			<HoneyTooltip label={isLocked ? 'Unlock time not reached yet' : ''}>
				<HoneyButton onClick={onClick} variant="secondary" disabled={disabled}>
					{buttonText}
				</HoneyButton>
			</HoneyTooltip>
		</div>
	);
};

export default CurrentBid;
