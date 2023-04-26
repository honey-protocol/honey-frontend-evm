import { HoneyButtonTabs } from '../HoneyButtonTabs/HoneyButtonTabs';
import HoneyTable from '../HoneyTable/HoneyTable';
import * as sharedStyles from '../../styles/markets.css';
import * as styles from './LiquidateExpandTable.css';
import React, { FC, useContext, useMemo, useState } from 'react';
import { ColumnType } from 'antd/lib/table';
import { LiquidateTablePosition } from '../../types/liquidate';
import HexaBoxContainer from '../HexaBoxContainer/HexaBoxContainer';
import Image from 'next/image';
import honeyGenesisBee from '/public/images/imagePlaceholder.png';
import { InfoBlock } from '../InfoBlock/InfoBlock';
import { formatNumber, formatNFTName } from '../../helpers/format';
import HoneyTooltip from '../HoneyTooltip/HoneyTooltip';
import HealthLvl from 'components/HealthLvl/HealthLvl';
import HoneyButton from 'components/HoneyButton/HoneyButton';
import * as style from '../../styles/markets.css';
import useLiquidationFlowStore from '../../store/liquidationFlowStore';
import useDisplayStore from '../../store/displayStore';
import { LiquidationWorkFlowType } from '../../types/workflows';
import { Empty, Spin } from 'antd';
import { UserContext } from 'contexts/userContext';
import c from 'classnames';
import { spinner } from '../../styles/common.css';

const { formatPercent: fp, formatERC20: fs } = formatNumber;

export const LiquidateExpandTableMobile: FC<{
	data: LiquidateTablePosition[];
	isLoadingPositions: boolean;
	onBidCollection: Function;
	formatDecimals: number;
}> = ({ data, isLoadingPositions, onBidCollection, formatDecimals }) => {
	const { setWorkflow, setNFTId, setCouponId } = useLiquidationFlowStore((state) => state);
	const { currentUser, setCurrentUser } = useContext(UserContext);
	const setIsSidebarVisibleInMobile = useDisplayStore((state) => state.setIsSidebarVisibleInMobile);
	/*    begin sidebar interaction function          */
	const initCollateralBidFlow = (tokenId: string, couponId: string) => {
		setWorkflow(LiquidationWorkFlowType.none);
		setNFTId(tokenId);
		setCouponId(couponId);
		setWorkflow(LiquidationWorkFlowType.collateralBid);
		setIsSidebarVisibleInMobile(true);
		document.body.classList.add('disable-scroll');
	};
	/* end sidebar interaction function          */
	const expandColumnsMobile: ColumnType<LiquidateTablePosition>[] = [
		{
			dataIndex: ['name', 'image', 'tokenId', 'healthLvl'],
			key: 'tokenId',
			sortOrder: 'descend',
			sorter: (a, b) => b.healthLvl - a.healthLvl,
			render: (text: string, row: LiquidateTablePosition) => (
				<div className={sharedStyles.expandedRowNameCell}>
					<div className={sharedStyles.expandedRowIcon} />
					<div className={sharedStyles.collectionLogo}>
						<HexaBoxContainer>
							<Image src={row['image']} layout="fill" alt={'collection logo'} />
						</HexaBoxContainer>
					</div>
					<div className={sharedStyles.nameCellText}>
						<div className={sharedStyles.collectionNameMobile}>{row['name']}</div>
						<HealthLvl healthLvl={row['healthLvl']} />
					</div>
				</div>
			)
		},
		{
			dataIndex: 'untilLiquidation',
			render: (untilLiquidation) => (
				<div className={sharedStyles.expandedRowCell}>
					<InfoBlock title={'Until liquidation:'} value={fs(untilLiquidation, formatDecimals)} />
				</div>
			)
		},
		{
			dataIndex: ['tokenId', 'couponId'],
			key: 'tokenId',
			title: '',
			render: (text, row) => (
				<div className={style.buttonsCell}>
					<HoneyButton
						variant="text"
						onClick={(e) => initCollateralBidFlow(row['tokenId'], row['couponId'])}
					>
						Bid <div className={style.placeHolder} />
					</HoneyButton>
				</div>
			)
		}
	];
	return (
		<>
			<div className={styles.expandTableHeader}>
				<div className={styles.positionsCounterContainer}>
					<span className={styles.positionsCounterTitleMobile}>Open positions</span>
					<span className={styles.positionsCount}>{data.length}</span>
				</div>
				<HoneyButton variant="text" onClick={() => onBidCollection()}>
					Collection Bid <div className={sharedStyles.arrowRightIcon} />
				</HoneyButton>
			</div>
			<HoneyTable
				className={sharedStyles.expandContentTable}
				columns={expandColumnsMobile}
				dataSource={data}
				pagination={false}
				showHeader={false}
				locale={{
					emptyText: !isLoadingPositions ? (
						<Empty
							image={Empty.PRESENTED_IMAGE_SIMPLE}
							description={currentUser?.address ? 'No loan positions' : 'Connect wallet'}
						/>
					) : (
						<div className={c(style.emptyTableSpinner, spinner)}>
							<Spin />
						</div>
					)
				}}
			/>
		</>
	);
};

export default LiquidateExpandTableMobile;
