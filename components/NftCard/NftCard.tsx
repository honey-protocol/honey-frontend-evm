import React, { useCallback } from 'react';
import * as styles from './NftCard.css';
import HexaBoxContainer from '../HexaBoxContainer/HexaBoxContainer';
import HoneyButton from '../HoneyButton/HoneyButton';
import { NftCardProps } from './types';
import c from 'classnames';
import Image from 'next/image';

const NftCard = (props: NftCardProps) => {
	const { onClick, nft, text, hint, buttonText, hasBorder = true } = props;

	const _onClick = useCallback(() => {
		if (typeof onClick === 'function') {
			onClick(nft);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [nft]);

	return (
		<div className={c(styles.nftCard, { [styles.hasBorder]: hasBorder })} onClick={_onClick}>
			<div className={styles.nftImage}>
				<HexaBoxContainer>
					<Image src={nft.image} alt={'user nft'} layout="fill" />
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
