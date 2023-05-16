import * as styles from './NFTBidsList.css';
import SidebarScroll from '../SidebarScroll/SidebarScroll';
import CurrentBidList from '../CurrentBidList/CurrentBidList';
import useLiquidationFlowStore from '../../store/liquidationFlowStore';
import { useGetUnderlyingPriceInUSD } from '../../hooks/useHtokenHelper';
import { getContractsByHTokenAddr } from '../../helpers/generalHelper';
import { useGetCollateralBids, useGetCollectionBids } from '../../hooks/useMarketPlace';
import { sortBids } from '../../helpers/liquidationHelper';

const NFTBidsList = () => {
	const { HERC20ContractAddr: HERC20ContractAddress, NFTId } = useLiquidationFlowStore(
		(state) => state
	);
	const { htokenHelperContractAddress, marketContractAddress, unit, formatDecimals } =
		getContractsByHTokenAddr(HERC20ContractAddress);
	const [underlyingPrice, isLoadingUnderlyingPrice] = useGetUnderlyingPriceInUSD(
		htokenHelperContractAddress,
		HERC20ContractAddress
	);
	const [bidInfo, isLoadingBidInfo] = useGetCollateralBids(
		marketContractAddress,
		HERC20ContractAddress,
		NFTId
	);

	return (
		<SidebarScroll>
			<div className={styles.bidsList}>
				<CurrentBidList
					bids={sortBids(bidInfo.bids)}
					underlyingPrice={underlyingPrice}
					unit={unit}
					formatDecimals={formatDecimals ?? 0}
				/>
			</div>
		</SidebarScroll>
	);
};

export default NFTBidsList;
