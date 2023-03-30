import { HoneyNotification } from '../types/dashboard';

const mockNotifications: HoneyNotification[] = [
	{
		title: 'Polygon Alpha Launch',
		description: 'Alpha testing now live for Polygon!'
	}
	{
		title: 'New Arbitrum Markets',
		description: 'Lost Donkeys, Oreochads, Blueberry Club, Primapes'
	},
	{
		title: 'Arbitrum Alpha Launch',
		description: 'Alpha testing now live for Arbitrum!'
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
