import React from 'react';
import * as styles from './CurrentBidCard.css';
import c from 'classnames';
import { CurrentBidCardProps } from './types';
import { dateFromTimestamp, formatNumber } from '../../helpers/format';

const {
  format: f,
  formatPercent: fp,
  formatUsd: fu,
  formatERC20: fs
} = formatNumber;

const CurrentBidCard = (props: CurrentBidCardProps) => {
  const {
    fetchedTokenPrice,
    date,
    usdValue,
    tokenAmount,
    walletAddress,
    hasBorder = true
  } = props;
  // TODO: add SOL/USDC conversion?
  return (
    <div className={c(styles.bidCard, { [styles.hasBorder]: hasBorder })}>
      <div className={styles.bidCardLeft}>
        <div className={styles.bidCardCopy}>
          <p className={styles.bidCardAddress}>{walletAddress}</p>
          <p className={styles.bidCardDate}>{dateFromTimestamp(date)}</p>
        </div>

        <div
          onClick={() => navigator.clipboard.writeText(walletAddress)}
          className={styles.bidCardCopyIcon}
        />
      </div>
      <div className={styles.bidCardRight}>
        <p className={styles.bidCardPrice}>{fs(tokenAmount)}</p>
        <p className={styles.bidCardUsdcCounts}>
          {f(usdValue * fetchedTokenPrice)} USD
        </p>
      </div>
    </div>
  );
};

export default CurrentBidCard;
