import React from 'react';
import HoneyButton from '../HoneyButton/HoneyButton';
import { InfoBlock } from '../InfoBlock/InfoBlock';
import * as styles from './CurrentBid.css';
import { formatNumber } from '../../helpers/format';

interface CurrentBidProps {
	title?: string;
	value: number;
	handleRevokeBid: () => void;
}

const { formatERC20: fs } = formatNumber;

const CurrentBid = (props: CurrentBidProps) => {
	const { title, handleRevokeBid, value } = props;
	return (
		<div className={styles.CurrentBidContainer}>
			<InfoBlock value={fs(value)} valueSize="big" title={title || ''} />
			<HoneyButton onClick={handleRevokeBid} variant="secondary">
				Cancel
			</HoneyButton>
		</div>
	);
};

export default CurrentBid;
