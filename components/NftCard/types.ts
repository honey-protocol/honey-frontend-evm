export type NftCardProps = {
	id: string;
	nft: NFT;
	onClick?: (nft: NFT) => void;
	text: string;
	hint?: string;
	buttonText: string;
	hasBorder?: boolean;
	isSelected?: boolean;
};
