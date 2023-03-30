import React from 'react';
import * as styles from './NotificationsList.css';
import HoneyToggle from '../HoneyToggle/HoneyToggle';
import NotificationCard from '../NotificationCard/NotificationCard';
import { NotificationListProps } from './types';

const NotificationsList = (props: NotificationListProps) => {
	const { notifications } = props;

	return (
		<div className={styles.notificationList}>
			<div className={styles.notification}>
				<div className={styles.notificationTitle}>Notification</div>

				{/* <div className={styles.notificationToggle}>
					<HoneyToggle />
					<span>Only important</span>
				</div> */}
			</div>

			{notifications.map((item, index) => (
				<div className={styles.hasBorder} key={index}>
					<NotificationCard notification={item} />
				</div>
			))}
		</div>
	);
};

export default NotificationsList;
