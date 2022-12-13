import React, { useContext } from 'react';
import HoneyButton from '../HoneyButton/HoneyButton';
import { InfoBlock } from '../InfoBlock/InfoBlock';
import * as styles from './CurrentBid.css';
import { formatNumber } from '../../helpers/format';
import MoralisAuthButton from 'components/MoralisAuthButton/MoralisAuthButton';
import { UserContext } from 'contexts/userContext2';

interface CurrentBidProps {
	title?: string;
	value: number;
	buttonText: string;
	disabled: boolean;
	onClick: () => void;
}

const { formatERC20: fs } = formatNumber;

const CurrentBid = (props: CurrentBidProps) => {
	const { title, onClick, value, buttonText, disabled } = props;
	const { isMoralisAuthenticated } = useContext(UserContext);
	return (
		<div className={styles.CurrentBidContainer}>
			<InfoBlock value={fs(value)} valueSize="big" title={title || ''} />
			{isMoralisAuthenticated ? (
				<HoneyButton onClick={onClick} variant="secondary" disabled={disabled}>
					{buttonText}
				</HoneyButton>
			) : (
				<MoralisAuthButton />
			)}
		</div>
	);
};

export default CurrentBid;
