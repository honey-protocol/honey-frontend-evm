import { blackHole, defaultNFTImage } from '../constants/constant';
import getDepositNFTApproval, { getNFTApproved } from '../hooks/useERC721';

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
