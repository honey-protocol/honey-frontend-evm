import { defaultNFTImage } from '../constants/constant';

export const getImageUrlFromMetaData = (metaData: string) => {
	try {
		const json = JSON.parse(metaData);
		const imageURL = json['image'];
		let image = imageURL ? imageURL : defaultNFTImage;
		if (imageURL.includes('ipfs://')) {
			image = imageURL.replace('ipfs://', 'https://ipfs.io/ipfs/');
		}
		return image;
	} catch (e) {
		return defaultNFTImage;
	}
};
