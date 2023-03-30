import React from 'react';
import * as styles from './BidListItem.css';
import c from 'classnames';
import { dateFromTimestamp, formatNumber } from '../../helpers/format';
import { bidToFloat } from '../../helpers/liquidationHelper';
import { Bid } from '../../types/liquidate';
import { formatAddress } from 'helpers/utils';

const { format: f, formatPercent: fp, formatUsd: fu, formatERC20: fs } = formatNumber;

type BidListItemProps = {
	hasBorder?: boolean;
	bid: Bid;
	underlyingPrice: number;
	unit: Unit;
};

const BidListItem = (props: BidListItemProps) => {
	const { bid, underlyingPrice, unit, hasBorder = true } = props;
	return (
		<div className={c(styles.bidCard, { [styles.hasBorder]: hasBorder })}>
			<div className={styles.bidCardLeft}>
				<div className={styles.bidCardCopy}>
					<p className={styles.bidCardAddress}>{formatAddress(bid.bidder)}</p>
					<p className={styles.bidCardDate}>{dateFromTimestamp(bid.unlockTimeStamp * 1000)}</p>
				</div>

				<div
					onClick={() => navigator.clipboard.writeText(bid.bidder)}
					className={styles.bidCardCopyIcon}
				/>
			</div>
			<div className={styles.bidCardRight}>
				<p className={styles.bidCardPrice}>{fs(bidToFloat(bid.bid, unit))}</p>
				<p className={styles.bidCardUsdcCounts}>
					{f(underlyingPrice * bidToFloat(bid.bid, unit))} USD
				</p>
			</div>
		</div>
	);
};

export default BidListItem;
