import React, { useState } from 'react';
import NftCard from '../NftCard/NftCard';
import * as style from './NftList.css';
import cs from 'classnames';

type NftListProps = {
  data: NFT[];
  selectNFT: (nft: NFT) => void;
  buttonText: string;
};

const NftList = (props: NftListProps) => {
  const {data, selectNFT, buttonText} = props;
  const [selectedNFTId, setSelectedNFTId] = useState<string | null>(null);

  function handleClick(nft: NFT) {
    setSelectedNFTId(nft.id)
    selectNFT(nft);
  }

  return (
    <div className={style.nftsListContainer}>
      {data &&
      data.map(
        (item, index) =>
          (
            <div
              className={cs(style.listItem, {
                [style.selectedListItem]: item.id === selectedNFTId
              })}
              key={item.id}
            >
              <NftCard
                id={item.id}
                onClick={() => handleClick(item)}
                nft={item}
                hasBorder={
                  index !== data.length - 1 || item.id === selectedNFTId
                }
                text={`${item.tokenId}`}
                buttonText={buttonText}
              />
            </div>
          )
      )}
    </div>
  );
};

export default NftList;
