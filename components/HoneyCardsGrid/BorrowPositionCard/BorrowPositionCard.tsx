import { FC } from 'react';
import { BorrowPositionCardProps } from '../types';
import * as styles from './BorrowPositionCard.css';
import HexaBoxContainer from '../../HexaBoxContainer/HexaBoxContainer';
import Image from 'next/image';
import { InfoBlock } from '../../InfoBlock/InfoBlock';
import { formatNumber, formatNFTName as fnn } from '../../../helpers/format';
import c from 'classnames';
import HoneyTooltip from '../../HoneyTooltip/HoneyTooltip';
import { BorrowPositionCardSlider } from '../../BorrowPositionCardSlider/BorrowPositionCardSlider';
import useLoanFlowStore from 'store/loanFlowStore';
import { useGetMaxBorrowableAmount, useGetNFTPrice } from 'hooks/useHtokenHelper';
import { getContractsByHTokenAddr } from 'helpers/generalHelper';

const { formatShortName: fsn, formatPercent: fp } = formatNumber;

const LIQUIDATION_THRESHOLD = 0.65;

export const BorrowPositionCard: FC<BorrowPositionCardProps> = ({ position, onSelect }) => {
	const selectedNFTId = useLoanFlowStore((state) => state.NFTId);

	const {
		nftContractAddress,
		htokenHelperContractAddress,
		hivemindContractAddress,
		erc20Name,
		unit
	} = getContractsByHTokenAddr(position.HERC20ContractAddr);
	const [nftPrice, isLoadingNFTPrice] = useGetNFTPrice(
		htokenHelperContractAddress,
		position.HERC20ContractAddr
	);
	const [maxBorrow, isLoadingMaxBorrow] = useGetMaxBorrowableAmount(
		htokenHelperContractAddress,
		position.HERC20ContractAddr,
		hivemindContractAddress
	);
	const nftValue = nftPrice.price;
	const MAX_LTV = maxBorrow / nftValue;

	return (
		<div
			className={c(styles.positionCard, {
				[styles.activeCard]: selectedNFTId === position.tokenId
			})}
			onClick={() => onSelect(position.HERC20ContractAddr, position.tokenId, position.couponId)}
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
				<InfoBlock title="Floor price" value={`${fsn(position.value)} ${position.erc20Name}`} />
				<InfoBlock title="Debt" value={`${fsn(parseFloat(position.debt))} ${position.erc20Name}`} />
				<InfoBlock title="IR" value={fp((position.riskLvl ?? 0) * 100)} />
			</div>
			<div className={styles.divider} />
			<BorrowPositionCardSlider
				debt={parseFloat(position.debt)}
				collateralValue={position.value ?? 0}
				liquidationThreshold={LIQUIDATION_THRESHOLD}
				maxLoanToValue={MAX_LTV}
			/>
		</div>
	);
};
