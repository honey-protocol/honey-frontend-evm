import React from 'react';
import CurrentBidCard from '../CurrentBidCard/CurrentBidCard';
import { CurrentBidCardProps } from '../CurrentBidCard/types';

type CurrentBidListProps = {
  data: CurrentBidCardProps[];
  fetchedTokenPrice: number;
};

const CurrentBidList = (props: CurrentBidListProps) => {
  const { data, fetchedTokenPrice } = props;

  return (
    <>
      {data &&
        data.map((item, index) => (
          <div key={index}>
            <CurrentBidCard
              {...item}
              fetchedTokenPrice={fetchedTokenPrice}
              hasBorder={index !== data.length - 1}
            />
          </div>
        ))}
    </>
  );
};

export default CurrentBidList;
