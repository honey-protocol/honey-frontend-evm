import { FC } from 'react';
import { LendPositionCardProps } from '../types';
import * as styles from './LendPositionCard.css';
import HexaBoxContainer from '../../HexaBoxContainer/HexaBoxContainer';
import Image from 'next/image';
import { InfoBlock } from '../../InfoBlock/InfoBlock';
import { formatNumber, formatNFTName as fnn } from '../../../helpers/format';
import c from 'classnames';
import HoneyTooltip from '../../HoneyTooltip/HoneyTooltip';
import useLendFlowStore from 'store/lendFlowStore';

const { formatShortName: fsn, formatPercent: fp } = formatNumber;

export const LendPositionCard: FC<LendPositionCardProps> = ({ position, onSelect }) => {
	const selectedMarket = useLendFlowStore((state) => state.HERC20ContractAddr);
	return (
		<div
			className={c(styles.positionCard, {
				[styles.activeCard]: selectedMarket === position.id
			})}
			onClick={() => onSelect(position.id)}
		>
			<div className={styles.collectionIcon}>
				<HexaBoxContainer>
					<Image width={46} height={46} src={position.image} alt={'collection Icon'} />
				</HexaBoxContainer>
			</div>
			<div className={styles.positionName}>
				<HoneyTooltip label={position.name}>{fnn(position.name)}</HoneyTooltip>
				<div className={styles.arrowIcon} />
			</div>
			<div className={styles.positionValues}>
				<InfoBlock
					title="IR"
					value={<span className={styles.irValue}>{fp(position.rate * 100)}</span>}
				/>
				<InfoBlock title="Your Deposit" value={fsn(parseFloat(position.deposit))} />
				<InfoBlock title="Supplied" value={fsn(position.supplied)} />
				<InfoBlock title="Available" value={fsn(position.available)} />
			</div>
		</div>
	);
};
