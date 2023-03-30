import { HoneyNotification } from '../types/dashboard';

const mockNotifications: HoneyNotification[] = [
	{
		title: 'Arbitrum beta launch',
		description: 'xyz'
	},
	{
		title: 'New Markets',
		description: 'Oreochads, xyz'
	}
	// {
	// 	title: 'Title of notification',
	// 	description:
	// 		'Lorem Ipsum is simply dummy text of the' + ' Lorem Ipsum is simply dummy text of the'
	// }
];
export function useNotification(): [HoneyNotification[], boolean] {
	return [mockNotifications, false];
}
