import { HoneyNotification } from '../types/dashboard';

const mockNotifications: HoneyNotification[] = [
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
export function useNotification(): [HoneyNotification[], boolean] {
	return [mockNotifications, false];
}
