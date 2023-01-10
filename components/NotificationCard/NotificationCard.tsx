import React from 'react';
import * as styles from './NotificationCard.css';
import { NotificationCardProps } from './types';

const NotificationCard = (props: NotificationCardProps) => {
	const { notification } = props;
	return (
		<div className={styles.notificationCard}>
			<div className={styles.notificationTitle}>{notification.title}</div>

			<div className={styles.notificationDescription}>
				<p className={styles.notificationText}>{notification.description}</p>

				<span className={styles.notificationShow}>more</span>
			</div>

			<div className={styles.important} />
		</div>
	);
};

export default NotificationCard;
