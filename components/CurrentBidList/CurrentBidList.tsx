import BidListItem from 'components/BidListItem/BidListItem';
import React from 'react';
import { Bid } from '../../types/liquidate';

type CurrentBidListProps = {
	bids: Bid[];
	underlyingPrice: number;
	unit: Unit;
	formatDecimals: number;
};

const CurrentBidList = (props: CurrentBidListProps) => {
	const { bids, underlyingPrice, unit, formatDecimals } = props;

	return (
		<>
			{bids &&
				bids.map((bid, index) => (
					<div key={index}>
						<BidListItem
							bid={bid}
							underlyingPrice={underlyingPrice}
							hasBorder={index !== bids.length - 1}
							unit={unit}
							formatDecimals={formatDecimals}
						/>
					</div>
				))}
		</>
	);
};

export default CurrentBidList;
