import React, { useState } from 'react';
import NftCard from '../NftCard/NftCard';
import * as style from './NftList.css';
import cs from 'classnames';
import EmptyStateDetails from 'components/EmptyStateDetails/EmptyStateDetails';
import { Empty } from 'antd';
import { collections } from 'constants/NFTCollections';

const yootsContractAddress = collections.find(
	(collection) => collection.name === 'Y00TS'
)?.HERC20ContractAddress;

type NftListProps = {
	data: NFT[];
	selectNFT: (nft: NFT) => void;
	buttonText: string;
	HERC20ContractAddress: string;
};

const NftList = (props: NftListProps) => {
	const { data, selectNFT, buttonText, HERC20ContractAddress } = props;
	const [selectedNFTId, setSelectedNFTId] = useState<string | null>(null);

	function handleClick(nft: NFT) {
		setSelectedNFTId(nft.id);
		selectNFT(nft);
	}
	return (
		<div className={style.nftsListContainer}>
			{data && data.length
				? data.map((item, index) => (
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
								hasBorder={index !== data.length - 1 || item.id === selectedNFTId}
								text={`${item.tokenId}`}
								buttonText={buttonText}
								isSelected={selectedNFTId === item.id}
							/>
						</div>
				  ))
				: HERC20ContractAddress === yootsContractAddress && (
						<EmptyStateDetails
							title=""
							icon={Empty.PRESENTED_IMAGE_SIMPLE}
							description="Can't see your y00ts ? You can unstake them here"
							buttons={[
								{
									title: 'Unstake here',
									variant: 'secondary',
									onClick: () => window.open('https://www.y00ts.com/staking')
								}
							]}
						/>
				  )}
		</div>
	);
};

export default NftList;
