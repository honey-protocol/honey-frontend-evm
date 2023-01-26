import { defaultNFTImage } from '../constants/constant';

export const getImageUrlFromMetaData = (metaData: string) => {
	try {
		const json = JSON.parse(metaData);
		const imageURL = json['image'];
		const image = imageURL ? imageURL : defaultNFTImage;
		return image;
	} catch (e) {
		return defaultNFTImage;
	}
};
