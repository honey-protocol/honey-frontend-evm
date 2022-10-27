import { FC, useEffect, useState } from 'react';
import * as styles from './BidsList.css';
import SidebarScroll from '../SidebarScroll/SidebarScroll';
import { CurrentBidCardProps } from '../CurrentBidCard/types';
import CurrentBidList from '../CurrentBidList/CurrentBidList';
import { BidListProps } from './types';

const BidsList = (props: BidListProps) => {
  const { biddingArray } = props;
  const fetchedTokenPrice = 5;
  const [convertedBiddingArray, setConvertedBiddingArray] = useState([]);

  async function handleConvertion(bArray: any) {
    let converted = await bArray.map((bid: any, index: number) => {
      return {
        id: index,
        date: 1663663018156,
        walletAddress: bid.bidder,
        usdValue: bid.bidLimit,
        tokenAmount: bid.bidLimit
      };
    });

    setConvertedBiddingArray(converted);
  }

  useEffect(() => {
    if (biddingArray.length) handleConvertion(biddingArray);
  }, [biddingArray]);

  const currentBidCardData: CurrentBidCardProps[] = convertedBiddingArray;

  return (
    <SidebarScroll>
      <div className={styles.bidsList}>
        <CurrentBidList
          data={currentBidCardData}
          fetchedTokenPrice={fetchedTokenPrice}
        />
      </div>
    </SidebarScroll>
  );
};

export default BidsList;
