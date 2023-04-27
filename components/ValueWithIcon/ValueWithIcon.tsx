import Image from 'next/image';
import * as styles from './ValueWithIcon.css';
import { formatNumber } from 'helpers/format';

const { formatERC20: fs } = formatNumber;

const ValueWithIcon = (props: {
	value: number;
	erc20Icon: string;
	erc20Name: string;
	formatDecimals: number | undefined;
}) => {
	return (
		<div className={styles.valueWithIcon}>
			{fs(props.value, props.formatDecimals)}
			<Image
				src={props.erc20Icon}
				alt={props.erc20Name}
				layout="fixed"
				width="16px"
				height="16px"
			/>
		</div>
	);
};

export default ValueWithIcon;
