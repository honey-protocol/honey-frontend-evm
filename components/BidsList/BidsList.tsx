import * as styles from './BidsList.css';
import SidebarScroll from '../SidebarScroll/SidebarScroll';
import CurrentBidList from '../CurrentBidList/CurrentBidList';
import useLiquidationFlowStore from '../../store/liquidationFlowStore';
import { useGetUnderlyingPriceInUSD } from '../../hooks/useHtokenHelper';
import { getContractsByHTokenAddr } from '../../helpers/generalHelper';
import { useGetCollectionBids } from '../../hooks/useMarketPlace';

const BidsList = () => {
	const HERC20ContractAddress = useLiquidationFlowStore((state) => state.HERC20ContractAddr);
	const { htokenHelperContractAddress, marketContractAddress, unit } =
		getContractsByHTokenAddr(HERC20ContractAddress);
	const [underlyingPrice, isLoadingUnderlyingPrice] = useGetUnderlyingPriceInUSD(
		htokenHelperContractAddress,
		HERC20ContractAddress
	);
	const [bidInfo, isLoadingBidInfo] = useGetCollectionBids(
		marketContractAddress,
		HERC20ContractAddress
	);

	return (
		<SidebarScroll>
			<div className={styles.bidsList}>
				<CurrentBidList bids={bidInfo.bids} underlyingPrice={underlyingPrice} unit={unit} />
			</div>
		</SidebarScroll>
	);
};

export default BidsList;
