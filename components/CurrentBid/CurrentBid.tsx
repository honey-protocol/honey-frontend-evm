import React from 'react';
import HoneyButton from '../HoneyButton/HoneyButton';
import { InfoBlock } from '../InfoBlock/InfoBlock';
import * as styles from './CurrentBid.css';
import { formatNumber } from '../../helpers/format';

interface CurrentBidProps {
	title?: string;
	value: number;
	disabled: boolean;
	handleRevokeBid: () => void;
}

const { formatERC20: fs } = formatNumber;

const CurrentBid = (props: CurrentBidProps) => {
	const { title, handleRevokeBid, value, disabled } = props;
	return (
		<div className={styles.CurrentBidContainer}>
			<InfoBlock value={fs(value)} valueSize="big" title={title || ''} />
			<HoneyButton onClick={handleRevokeBid} variant="secondary" disabled={disabled}>
				Cancel
			</HoneyButton>
		</div>
	);
};

export default CurrentBid;
