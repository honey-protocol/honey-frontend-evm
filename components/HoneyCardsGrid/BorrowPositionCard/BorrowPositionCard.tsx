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
import { useGetCollateralFactor } from 'hooks/useHivemind';
import { useGetBorrowAmount } from 'hooks/useCoupon';

const { formatShortName: fsn, formatPercent: fp } = formatNumber;

export const BorrowPositionCard: FC<BorrowPositionCardProps> = ({ position, onSelect }) => {
	const selectedNFTId = useLoanFlowStore((state) => state.NFTId);

	const {
		nftContractAddress,
		htokenHelperContractAddress,
		hivemindContractAddress,
		erc20Name,
		erc20Icon,
		formatDecimals,
		unit
	} = getContractsByHTokenAddr(position.HERC20ContractAddr);

	const [collateralFactor, isLoadingCollateralFactor] = useGetCollateralFactor(
		hivemindContractAddress,
		position.HERC20ContractAddr,
		unit
	);
	const [nftPrice, isLoadingNFTPrice] = useGetNFTPrice(
		htokenHelperContractAddress,
		position.HERC20ContractAddr
	);

	const [borrowAmount, isLoadingBorrowAmount] = useGetBorrowAmount(
		position.HERC20ContractAddr,
		position.tokenId,
		unit
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
				<InfoBlock
					title="Floor price"
					value={
						<div className={styles.infoRow}>
							{fsn(position.value, formatDecimals)}
							<Image
								src={erc20Icon}
								alt={position.erc20Name}
								layout="fixed"
								width="20px"
								height="20px"
							/>
						</div>
					}
				/>
				<InfoBlock
					title="Debt"
					value={
						<div className={styles.infoRow}>
							{fsn(parseFloat(borrowAmount), formatDecimals)}
							<Image
								src={erc20Icon}
								alt={position.erc20Name}
								layout="fixed"
								width="20px"
								height="20px"
							/>
						</div>
					}
				/>
				<InfoBlock title="IR" value={fp(5, 2)} />
			</div>
			<div className={styles.divider} />
			<BorrowPositionCardSlider
				debt={parseFloat(borrowAmount)}
				collateralValue={position.value ?? 0}
				liquidationThreshold={collateralFactor}
				maxLoanToValue={MAX_LTV}
			/>
		</div>
	);
};
