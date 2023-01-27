import { PositionType } from '../../types/dashboard';

export type BorrowUserPosition = {
	name: string;
	HERC20ContractAddr: string;
	erc20Name: string;
	tokenId: string;
	couponId: string;
	image: string;
	riskLvl?: number;
	debt: string;
	available?: number;
	value: number;
};

export type LendUserPosition = {
	name: string;
	deposit: string;
	value: number;
	available: number;
	ir: number;
	imageUrl: string;
	id: string;
};

export interface HoneyCardGridProps {
	borrowPositions: BorrowUserPosition[];
	lendPositions: LendUserPosition[];
	onChangePositionType: (value: PositionType) => void;
	positionType: PositionType;
}

export interface BorrowPositionCardProps {
	position: BorrowUserPosition;
	onSelect: (HERC20ContractAddr: string, tokenId: string, couponId: string) => void;
}

export interface LendPositionCardProps {
	position: LendUserPosition;
	onSelect: (id: string) => void;
}
