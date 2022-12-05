import { fromWei } from 'web3-utils';
import { Bid, BidInfo } from '../types/liquidate';
import { caseInsensitiveCompare } from './generalHelper';
import { BN } from 'bn.js';
import Decimal from 'decimal.js';

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

//convert wei into decimal with 2 precisions round up
export function weiToDecimal(wei: string, unit: Unit) {
	const value = fromWei(wei, unit);
	const decimal = new Decimal(value).toFixed(2, Decimal.ROUND_UP);
	return parseFloat(decimal);
}

export function getMinimumBid(minimumBid: string, userBid: number, unit: Unit) {
	const minBid = weiToDecimal(minimumBid, unit);
	const userBidRoundDown = new Decimal(userBid).toFixed(2, Decimal.ROUND_DOWN);
	const userNewMinBid = parseFloat(userBidRoundDown) + 0.01;
	if (userNewMinBid >= minBid) return userNewMinBid;
	else return minBid;
}

export function getIncreaseAmount(userAddress: string, bidInfo: BidInfo, bid: number, unit: Unit) {
	const bids = bidInfo.bids.filter((bid) => caseInsensitiveCompare(bid.bidder, userAddress));
	const userBid = bids.length == 0 ? '0' : bids[0].bid;
	const increaseAmount = new Decimal(bid).sub(fromWei(userBid, unit));
	return increaseAmount.toFixed(20).replace(/\.?0+$/, '');
}
