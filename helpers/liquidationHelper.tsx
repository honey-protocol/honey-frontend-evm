import { fromWei } from 'web3-utils';
import { Bid, BidInfo } from '../types/liquidate';
import { caseInsensitiveCompare } from './generalHelper';
import { BN } from 'bn.js';

export function sortBids(bids: Bid[]): Bid[] {
	const result = bids.sort((a, b) => {
		const bidA = new BN(a.bid);
		const bidB = new BN(b.bid);
		if (bidA.lt(bidB)) return 1;
		else if (bidA.eq(bidB)) return 0;
		else return -1;
	});
	return result;
}

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

export function hasRefund(refund: string) {
	return refund != '0';
}

export function userRefund(refund: string, unit: Unit) {
	return parseFloat(fromWei(refund, unit));
}
