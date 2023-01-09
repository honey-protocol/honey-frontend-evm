import MoralisType from 'moralis-v1';
import { TimestampPoint } from '../components/HoneyChart/types';
import { generateMockHistoryData } from '../helpers/chartUtils';
import { CollectionPosition } from '../components/HoneyPositionsSlider/types';
import { BorrowUserPosition, LendUserPosition } from '../components/HoneyCardsGrid/types';

//todo implement later
export function useGetSliderPositions(): [Array<CollectionPosition>, boolean] {
	const mockData: CollectionPosition[] = [];

	for (let i = 0; i < 30; i++) {
		mockData.push({
			name: `Any name loooong #${i}`,
			value: Math.random() * 10000,
			difference: Math.random(),
			image: '/nfts/honeyEyes.png'
		});
	}
	return [mockData, false];
}

//todo implement later
export function useBorrowUserPositions(): [Array<BorrowUserPosition>, boolean] {
	const getMockPriceDebtValue = () => {
		const MAX_LTV = 0.5;
		const price = Math.floor(Math.random() * 1000);
		const debt = Math.floor(Math.random() * (price - (price / 100) * MAX_LTV));
		return { price, debt };
	};
	const preparedPositions: BorrowUserPosition[] = [];
	for (let i = 0; i < 20; i++) {
		preparedPositions.push({
			name: `Any user position #${i + 1000}`,
			value: getMockPriceDebtValue().price,
			debt: getMockPriceDebtValue().debt,
			image: '/nfts/azuki.jpg',
			tokenId: i.toString() + '_borrow',
			available: 90,
			couponId: ''
		});
	}
	for (let j = 0; j < 5; j++) {
		preparedPositions.push({
			name: 'Any user position',
			value: getMockPriceDebtValue().price,
			debt: 0,
			image: '/nfts/azuki.jpg',
			tokenId: j.toString() + '_borrow_nodebt',
			available: 90,
			couponId: ''
		});
	}
	return [preparedPositions, false];
}

//todo implement later
export function useLendUserPositions(): [Array<LendUserPosition>, boolean] {
	const preparedPositions: LendUserPosition[] = [];
	for (let i = 0; i < 20; i++) {
		preparedPositions.push({
			name: `Any user position #${i + 1000}`,
			deposit: Math.random() * 1000,
			value: Math.random() * 1000,
			ir: Math.random(),
			available: Math.random() * 1000,
			imageUrl: '/nfts/gecko.jpg',
			id: i.toString() + '_lend'
		});
	}
	return [preparedPositions, false];
}

//todo implement later
export function useGetUserExposureData(): [Array<TimestampPoint>, boolean] {
	const from = new Date().setFullYear(new Date().getFullYear() - 1).valueOf();
	const to = new Date().valueOf();
	return [generateMockHistoryData(from, to, 10000), false];
}

//todo implement later
export function useGetUserExposure(): [number, boolean] {
	const userExposure = 4129.1;
	return [userExposure, false];
}
