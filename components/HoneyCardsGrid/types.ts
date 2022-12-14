import { PositionType } from '../../types/dashboard';

// export type BorrowUserPosition = {
//   name: string;
//   price: number;
//   debt: number;
//   ir: number;
//   imageUrl: string;
//   id: string;
// };

export type BorrowUserPosition = {
	name: string;
	tokenId: string;
	couponId: string;
	image: string;
	riskLvl?: number;
	debt?: number;
	available?: number;
	value?: number;
};

export type LendUserPosition = {
	name: string;
	deposit: number;
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
	onSelect: (tokenId: string, couponId: string) => void;
}

export interface LendPositionCardProps {
	position: LendUserPosition;
	onSelect: (id: string) => void;
}
