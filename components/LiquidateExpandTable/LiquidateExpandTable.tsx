import { HoneyButtonTabs } from '../HoneyButtonTabs/HoneyButtonTabs';
import HoneyTable from '../HoneyTable/HoneyTable';
import * as sharedStyles from '../../styles/markets.css';
import * as styles from './LiquidateExpandTable.css';
import React, { FC, useMemo, useState } from 'react';
import { ColumnType } from 'antd/lib/table';
import { LiquidateTablePosition } from '../../types/liquidate';
import HexaBoxContainer from '../HexaBoxContainer/HexaBoxContainer';
import Image from 'next/image';
import { InfoBlock } from '../InfoBlock/InfoBlock';
import { formatNumber, formatNFTName } from '../../helpers/format';
import HoneyTooltip from '../HoneyTooltip/HoneyTooltip';
import HealthLvl from 'components/HealthLvl/HealthLvl';
import { LiquidationWorkFlowType } from '../../types/workflows';
import useLiquidationFlowStore from '../../store/liquidationFlowStore';
import useDisplayStore from '../../store/displayStore';
import * as style from '../../styles/markets.css';
import HoneyButton from '../HoneyButton/HoneyButton';

const { formatPercent: fp, formatERC20: fs } = formatNumber;

type FilterType = 'most_critical' | 'max_debt' | 'most_valuable';

export const LiquidateExpandTable: FC<{ data: LiquidateTablePosition[] }> = ({ data }) => {
	const { setWorkflow, setNFTId, setCouponId } = useLiquidationFlowStore((state) => state);
	const setIsSidebarVisibleInMobile = useDisplayStore((state) => state.setIsSidebarVisibleInMobile);
	const [filter, setFilter] = useState<FilterType>('most_critical');
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

	const expandColumns: ColumnType<LiquidateTablePosition>[] = useMemo(
		() => [
			{
				width: 250,
				dataIndex: ['name', 'image', 'tokenId', 'healthLvl'],
				key: 'tokenId',
				sortOrder: filter === 'most_critical' ? 'descend' : undefined,
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
							<HoneyTooltip label={row['name']}>
								<div className={sharedStyles.collectionName}>{formatNFTName(row['name'])}</div>
							</HoneyTooltip>
							<HealthLvl healthLvl={row['healthLvl']} />
						</div>
					</div>
				)
			},
			{
				dataIndex: 'untilLiquidation',
				render: (untilLiquidation) => (
					<div className={sharedStyles.expandedRowCell}>
						<InfoBlock title={'Until liquidation:'} value={fs(untilLiquidation)} />
					</div>
				)
			},
			{
				dataIndex: 'debt',
				sortOrder: filter === 'max_debt' ? 'descend' : undefined,
				sorter: (a, b) => a.debt - b.debt,
				render: (debt) => (
					<div className={sharedStyles.expandedRowCell}>
						<InfoBlock title={'Debt:'} value={fs(debt)} />
					</div>
				)
			},
			{
				dataIndex: 'estimatedValue',
				sortOrder: filter === 'most_valuable' ? 'descend' : undefined,
				sorter: (a, b) => a.estimatedValue - b.estimatedValue,
				render: (estimatedValue) => (
					<div className={sharedStyles.expandedRowCell}>
						<InfoBlock title={'Estimated value:'} value={fs(estimatedValue)} />
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
							Manage <div className={style.arrowRightIcon} />
						</HoneyButton>
					</div>
				)
			}
		],
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[filter]
	);

	return (
		<>
			<div className={styles.expandTableHeader}>
				<div className={styles.positionsCounterContainer}>
					<span className={styles.positionsCounterTitle}>Open positions</span>
					<span className={styles.positionsCount}>{data.length}</span>
				</div>
				<HoneyButtonTabs
					items={[
						{ name: 'most critical', slug: 'most_critical' },
						{ name: 'Maximum debt', slug: 'max_debt' },
						{ name: 'most valuable', slug: 'most_valuable' }
					]}
					activeItemSlug={filter}
					onClick={(itemSlug) => setFilter(itemSlug as FilterType)}
				/>
			</div>
			<HoneyTable
				tableLayout="fixed"
				className={sharedStyles.expandContentTable}
				columns={expandColumns}
				dataSource={data}
				pagination={false}
				showHeader={false}
			/>
		</>
	);
};
