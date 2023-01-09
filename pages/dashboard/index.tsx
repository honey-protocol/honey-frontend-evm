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
import {
	useBorrowUserPositions,
	useGetSliderPositions,
	useGetUserExposure,
	useGetUserExposureData,
	useLendUserPositions
} from '../../hooks/useDashBoard';

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
	const [sliderPositions, isLoadingSliderPositions] = useGetSliderPositions();
	const [borrowUserPositions, isLoadingBorrowUserPositions] = useBorrowUserPositions();
	const [lendUserPositions, isLoadingLendUserPositions] = useLendUserPositions();
	const [userExposureData, isLoadingUserExposureData] = useGetUserExposureData();
	const [userExposure, isLoadingUserExposure] = useGetUserExposure();
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
				<HoneyPositionsSlider positions={sliderPositions} />
			</HoneyContent>
			<HoneyContent sidebar={dashboardSidebar()}>
				<div className={styles.pageContentElements}>
					<div className={styles.gridWrapper}>
						<HoneyCardsGrid
							borrowPositions={borrowUserPositions}
							lendPositions={lendUserPositions}
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
