import type { NextPage } from 'next';
import HoneyContent from '../../components/HoneyContent/HoneyContent';
import LayoutRedesign from '../../components/LayoutRedesign/LayoutRedesign';
import React, { useEffect, useMemo, useState } from 'react';
import * as styles from '../../styles/dashboard.css';
import { HoneyPositionsSlider } from '../../components/HoneyPositionsSlider/HoneyPositionsSlider';
import { NotificationCardProps } from '../../components/NotificationCard/types';
import NotificationsList from '../../components/NotificationsList/NotificationsList';
import { CollectionPosition } from '../../components/HoneyPositionsSlider/types';
import HoneySider from '../../components/HoneySider/HoneySider';
import { HoneyCardsGrid } from '../../components/HoneyCardsGrid/HoneyCardsGrid';
import { BorrowUserPosition, LendUserPosition } from '../../components/HoneyCardsGrid/types';
import MarketsSidebar from '../../components/MarketsSidebar/MarketsSidebar';
import { generateMockHistoryData } from '../../helpers/chartUtils';
import { HoneyProfileChart } from '../../components/HoneyProfileChart/HoneyProfileChart';
import useWindowSize from '../../hooks/useWindowSize';
import { TABLET_BP } from '../../constants/breakpoints';
import LendSidebar from '../../components/LendSidebar/LendSidebar';
import { PositionType } from '../../types/dashboard';
import useDisplayStore from 'store/displayStore';

const MAX_LTV = 0.5;

const data: NotificationCardProps[] = [
	{
		title: 'Title of notification',
		description:
			'Lorem Ipsum is simply dummy text of the' + ' Lorem Ipsum is simply dummy text of the'
	},
	{
		title: 'Title of notification',
		description:
			'Lorem Ipsum is simply dummy text of the' + ' Lorem Ipsum is simply dummy text of the'
	},
	{
		title: 'Title of notification',
		description:
			'Lorem Ipsum is simply dummy text of the' + ' Lorem Ipsum is simply dummy text of the'
	},
	{
		title: 'Title of notification',
		description:
			'Lorem Ipsum is simply dummy text of the' + ' Lorem Ipsum is simply dummy text of the'
	},
	{
		title: 'Title of notification',
		description:
			'Lorem Ipsum is simply dummy text of the' + ' Lorem Ipsum is simply dummy text of the'
	},
	{
		title: 'Title of notification',
		description:
			'Lorem Ipsum is simply dummy text of the' + ' Lorem Ipsum is simply dummy text of the'
	},
	{
		title: 'Title of notification',
		description:
			'Lorem Ipsum is simply dummy text of the' + ' Lorem Ipsum is simply dummy text of the'
	}
];

const Dashboard: NextPage = () => {
	const isSidebarVisibleInMobile = useDisplayStore((state) => state.isSidebarVisibleInMobile);
	const [dataArray, setDataArray] = useState<NotificationCardProps[]>([]);
	const [positionType, setPositionType] = useState<PositionType>('borrow');
	const { width } = useWindowSize();

	useEffect(() => {
		if (width >= TABLET_BP) {
			setDataArray(data.slice(0, 3));
		} else {
			setDataArray(data.slice(0, 1));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [width, data]);

	//start generating mock data for borrow and lend positions
	const isMock = true;
	const userExposure = 4129.1;

	const getUserExposureData = () => {
		if (isMock) {
			const from = new Date().setFullYear(new Date().getFullYear() - 1).valueOf();
			const to = new Date().valueOf();
			return generateMockHistoryData(from, to, 10000);
		}
		return [];
	};

	const userExposureData = useMemo(
		() => getUserExposureData(),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[]
	);

	const getMockPriceDebtValue = () => {
		const price = Math.floor(Math.random() * 1000);
		const debt = Math.floor(Math.random() * (price - (price / 100) * MAX_LTV));
		return { price, debt };
	};

	const getBorrowUserPositionsMock = () => {
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
		return preparedPositions;
	};

	const getLendUserPositionsMock = () => {
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
		return preparedPositions;
	};

	const getMockPositions = () => {
		const mockData: CollectionPosition[] = [];

		for (let i = 0; i < 30; i++) {
			mockData.push({
				name: `Any name loooong #${i}`,
				value: Math.random() * 10000,
				difference: Math.random(),
				image: '/nfts/honeyEyes.png'
			});
		}
		return mockData;
	};

	const mockBorrowUserPositions = useMemo(
		() => getBorrowUserPositionsMock(),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[]
	);

	const mockLendUserPositions = useMemo(
		() => getLendUserPositionsMock(),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[]
	);
	// generate mock data end

	const dashboardSidebar = () => (
		<HoneySider isMobileSidebarVisible={isSidebarVisibleInMobile}>
			{positionType === 'borrow' ? <MarketsSidebar /> : <LendSidebar />}
		</HoneySider>
	);

	return (
		<LayoutRedesign>
			<HoneyContent className={styles.dashboard}>
				<div className={styles.pageHeader}>
					<div className={styles.chartContainer}>
						<HoneyProfileChart data={userExposureData} value={userExposure} />
					</div>
					<div className={styles.notificationsWrapper}>
						<NotificationsList data={dataArray} />
					</div>
				</div>
				<HoneyPositionsSlider positions={getMockPositions()} />
			</HoneyContent>
			<HoneyContent sidebar={dashboardSidebar()}>
				<div className={styles.pageContentElements}>
					<div className={styles.gridWrapper}>
						<HoneyCardsGrid
							borrowPositions={mockBorrowUserPositions}
							lendPositions={mockLendUserPositions}
							onChangePositionType={setPositionType}
							positionType={positionType}
						/>
					</div>
				</div>
			</HoneyContent>
		</LayoutRedesign>
	);
};

export default Dashboard;
