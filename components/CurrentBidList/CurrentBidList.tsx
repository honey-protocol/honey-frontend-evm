import React from 'react';
import CurrentBidCard from '../CurrentBidCard/CurrentBidCard';
import { Bid } from '../../types/liquidate';

type CurrentBidListProps = {
	bids: Bid[];
	underlyingPrice: number;
	unit: Unit;
};

const CurrentBidList = (props: CurrentBidListProps) => {
	const { bids, underlyingPrice, unit } = props;

	return (
		<>
			{bids &&
				bids.map((bid, index) => (
					<div key={index}>
						<CurrentBidCard
							bid={bid}
							underlyingPrice={underlyingPrice}
							hasBorder={index !== bids.length - 1}
							unit={unit}
						/>
					</div>
				))}
		</>
	);
};

export default CurrentBidList;
