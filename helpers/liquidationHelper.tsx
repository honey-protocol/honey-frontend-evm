import { numberFormatter } from './format';
import { fromWei } from 'web3-utils';
import { BidInfo } from '../types/liquidate';
import { caseInsensitiveCompare } from './generalHelper';

export function bidToFloat(bid: string, unit: Unit): number {
	return parseFloat(fromWei(bid, unit));
}

export function hasBid(userAddress: string, bidInfo: BidInfo) {
	return bidInfo.bids.some((bid) => caseInsensitiveCompare(bid.bidder, userAddress));
}

export function userBid(userAddress: string, bidInfo: BidInfo, unit: Unit) {
	const bids = bidInfo.bids.filter((bid) => caseInsensitiveCompare(bid.bidder, userAddress));
	if (bids.length == 0) {
		return 0;
	} else {
		return parseFloat(fromWei(bids[0].bid, unit));
	}
}

export function isHighestBid(userAddress: string, bidInfo: BidInfo) {
	return caseInsensitiveCompare(bidInfo.highestBidder, userAddress);
}
