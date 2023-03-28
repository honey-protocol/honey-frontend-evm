import { Select, Space } from 'antd';
import HoneyCardYellowShadow from 'components/HoneyCardYellowShadow/HoneyCardYellowShadow';
import ModalContainer from 'components/ModalContainer/ModalContainer';
import { hexValue } from 'ethers/lib/utils.js';
import { ArbitrumIcon } from 'icons/ArbitrumIcon';
import { DownIcon } from 'icons/DownIcon';
import { PolygonIcon } from 'icons/PolygonIcon';
import { SolanaCircleIcon } from 'icons/SolanaCircleIcon';
import React, { useContext } from 'react';
import { useNetwork } from 'wagmi';
import * as styles from './SettingsModal.css';

const supportedChains = [
	{
		name: 'Solana',
		icon: <SolanaCircleIcon />,
		value: 'solana',
		href: 'https://beta.honey.finance'
	},
	{
		name: 'Polygon',
		value: '0x89',
		icon: <PolygonIcon />,
		href: 'https://polygon.honey.finance'
	},
	{
		name: 'Arbitrum',
		value: '0xa4b1',
		icon: <ArbitrumIcon />,
		href: 'https://arbitrum.honey.finance'
	}
];

const SettingsModal = (props: { visible: boolean; onClose: Function }) => {
	const { chain } = useNetwork();

	return (
		<ModalContainer isVisible={props.visible} onClose={props.onClose}>
			<HoneyCardYellowShadow>
				<Space direction="vertical" size="middle" className={styles.settingsModalContent}>
					<div className={styles.modalTitle}>Settings</div>

					<div className={styles.divider} />
					<Space className={styles.row} size="large">
						<div className={styles.settingTitle}>Select chain</div>
						<Select
							value={chain ? hexValue(chain?.id) : ''}
							options={supportedChains.map((_chain) => ({
								value: _chain.value,
								label: (
									<Space align="center">
										{_chain.icon}
										<span>{_chain.name}</span>
									</Space>
								)
							}))}
							defaultValue="solana"
							onChange={(value) => {
								const href = supportedChains.find((_chain) => _chain.value === value)?.href;
								window.open(href);
							}}
							className={styles.dropdownSelect}
							popupClassName={styles.selectDropdownList}
							suffixIcon={<DownIcon fill={'black'} />}
						/>
					</Space>
					<Space className={styles.row}>
						<div className={styles.settingTitle}>Language</div>
						<Select
							options={[{ value: 'en', label: 'EN' }]}
							defaultValue="en"
							className={styles.dropdownSelect}
							popupClassName={styles.selectDropdownList}
							suffixIcon={<DownIcon fill={'black'} />}
						/>
					</Space>
				</Space>
			</HoneyCardYellowShadow>
		</ModalContainer>
	);
};

export default SettingsModal;
