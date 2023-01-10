import type { NextPage } from 'next';
import HoneyContent from '../../components/HoneyContent/HoneyContent';
import LayoutRedesign from '../../components/LayoutRedesign/LayoutRedesign';
import React, { useEffect, useMemo, useState } from 'react';
import * as styles from '../../styles/dashboard.css';
import { HoneyPositionsSlider } from '../../components/HoneyPositionsSlider/HoneyPositionsSlider';
import NotificationsList from '../../components/NotificationsList/NotificationsList';
import HoneySider from '../../components/HoneySider/HoneySider';
import { HoneyCardsGrid } from '../../components/HoneyCardsGrid/HoneyCardsGrid';
import MarketsSidebar from '../../components/MarketsSidebar/MarketsSidebar';
import { HoneyProfileChart } from '../../components/HoneyProfileChart/HoneyProfileChart';
import useWindowSize from '../../hooks/useWindowSize';
import { TABLET_BP } from '../../constants/breakpoints';
import LendSidebar from '../../components/LendSidebar/LendSidebar';
import { HoneyNotification, PositionType } from '../../types/dashboard';
import useDisplayStore from 'store/displayStore';
import {
	useBorrowUserPositions,
	useGetSliderPositions,
	useGetUserExposure,
	useGetUserExposureData,
	useLendUserPositions
} from '../../hooks/useDashBoard';
import { useNotification } from '../../hooks/useNotification';

const Dashboard: NextPage = () => {
	const [sliderPositions, isLoadingSliderPositions] = useGetSliderPositions();
	const [borrowUserPositions, isLoadingBorrowUserPositions] = useBorrowUserPositions();
	const [lendUserPositions, isLoadingLendUserPositions] = useLendUserPositions();
	const [userExposureData, isLoadingUserExposureData] = useGetUserExposureData();
	const [userExposure, isLoadingUserExposure] = useGetUserExposure();
	const [notifications, isLoadingNotification] = useNotification();
	const [notificationList, setNotificationList] = useState<HoneyNotification[]>([]);
	const isSidebarVisibleInMobile = useDisplayStore((state) => state.isSidebarVisibleInMobile);
	const [positionType, setPositionType] = useState<PositionType>('borrow');
	const { width } = useWindowSize();

	useEffect(() => {
		if (width >= TABLET_BP) {
			setNotificationList(notifications.slice(0, 3));
		} else {
			setNotificationList(notifications.slice(0, 1));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [notifications]);

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
						<NotificationsList notifications={notificationList} />
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
