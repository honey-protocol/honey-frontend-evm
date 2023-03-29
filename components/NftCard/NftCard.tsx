import React, { useCallback } from 'react';
import * as styles from './NftCard.css';
import HexaBoxContainer from '../HexaBoxContainer/HexaBoxContainer';
import HoneyButton from '../HoneyButton/HoneyButton';
import { NftCardProps } from './types';
import c from 'classnames';
import Image from 'next/image';
import imagePlaceholder from 'public/images/imagePlaceholder.png';

const NftCard = (props: NftCardProps) => {
	const { onClick, nft, text, hint, buttonText, hasBorder = true, isSelected = false } = props;

	const _onClick = useCallback(() => {
		if (typeof onClick === 'function') {
			onClick(nft);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [nft]);

	return (
		<div
			className={c(styles.nftCard, { [styles.hasBorder]: hasBorder && !isSelected })}
			onClick={_onClick}
		>
			<div className={styles.nftImage}>
				<HexaBoxContainer>
					<Image
						src={`https://res.cloudinary.com/${process.env.CLOUDINARY_URI}/image/fetch/${
							nft.image || imagePlaceholder
						}`}
						alt={'user nft'}
						layout="fill"
					/>
				</HexaBoxContainer>
			</div>
			<div className={styles.nftRight}>
				<div className={styles.nftDescription}>
					<div className={styles.nftName}>
						{nft.name} #{text}
					</div>
					{/* <div className={styles.nftLabel}>
            {text} {hint && <span className={styles.hint}>{hint}</span>}
          </div> */}
				</div>
				<HoneyButton variant="text">
					Up to {buttonText}
					<div className={styles.arrowRight} />
				</HoneyButton>
			</div>
		</div>
	);
};

export default NftCard;
