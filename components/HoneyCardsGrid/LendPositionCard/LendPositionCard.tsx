import { FC, useContext } from 'react';
import { LendPositionCardProps } from '../types';
import * as styles from './LendPositionCard.css';
import HexaBoxContainer from '../../HexaBoxContainer/HexaBoxContainer';
import Image from 'next/image';
import { InfoBlock } from '../../InfoBlock/InfoBlock';
import { formatNumber, formatNFTName as fnn } from '../../../helpers/format';
import c from 'classnames';
import HoneyTooltip from '../../HoneyTooltip/HoneyTooltip';
import useLendFlowStore from 'store/lendFlowStore';
import { getContractsByHTokenAddr } from 'helpers/generalHelper';
import { useGetUserUnderlyingBalance } from 'hooks/useHtokenHelper';
import { UserContext } from 'contexts/userContext';

const { formatShortName: fsn, formatPercent: fp } = formatNumber;

export const LendPositionCard: FC<LendPositionCardProps> = ({ position, onSelect }) => {
	const selectedMarket = useLendFlowStore((state) => state.HERC20ContractAddr);

	const { currentUser, setCurrentUser } = useContext(UserContext);

	const {
		erc20Name,
		erc20Icon,
		formatDecimals,
		htokenHelperContractAddress,
		unit,
		ERC20ContractAddress
	} = getContractsByHTokenAddr(position.id);

	const [userUnderlyingBalance, isLoadingUserUnderlyingBalance] = useGetUserUnderlyingBalance(
		htokenHelperContractAddress,
		position.id,
		currentUser,
		unit
	);

	const userTotalDeposits = parseFloat(userUnderlyingBalance);

	if (!ERC20ContractAddress) return null;
	return (
		<div
			className={c(styles.positionCard, {
				[styles.activeCard]: selectedMarket === position.id
			})}
			onClick={() => onSelect(position.id)}
		>
			<div className={styles.collectionIcon}>
				<HexaBoxContainer>
					<Image
						width={46}
						height={46}
						src={`https://res.cloudinary.com/${process.env.CLOUDINARY_URI}/image/fetch/${position.image}`}
						alt={'collection Icon'}
					/>
				</HexaBoxContainer>
			</div>
			<div className={styles.positionName}>
				<HoneyTooltip label={position.name}>{fnn(position.name)}</HoneyTooltip>
				<div className={styles.arrowIcon} />
			</div>
			<div className={styles.positionValues}>
				<InfoBlock
					title="IR"
					value={<span className={styles.irValue}>{fp(position.rate, 2)}</span>}
				/>
				<InfoBlock
					title="Your Deposit"
					value={fsn(userTotalDeposits < 0 ? 0 : userTotalDeposits, formatDecimals)}
				/>
				<InfoBlock
					title="Supplied"
					value={
						<div className={styles.infoRow}>
							{fsn(position.supplied, formatDecimals)}
							<Image src={erc20Icon} alt={erc20Name} layout="fixed" width="16px" height="16px" />
						</div>
					}
				/>
				<InfoBlock
					title="Available"
					value={
						<div className={styles.infoRow}>
							{fsn(position.available, formatDecimals)}
							<Image src={erc20Icon} alt={erc20Name} layout="fixed" width="16px" height="16px" />
						</div>
					}
				/>
			</div>
		</div>
	);
};
