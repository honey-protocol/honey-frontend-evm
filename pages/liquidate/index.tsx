import type { NextPage } from 'next';
import LayoutRedesign from '../../components/LayoutRedesign/LayoutRedesign';
import LiquidateSidebar from '../../components/LiquidateSidebar/LiquidateSidebar';
import HoneyTable from '../../components/HoneyTable/HoneyTable';
import classNames from 'classnames';
import * as style from '../../styles/markets.css';
import EmptyStateDetails from '../../components/EmptyStateDetails/EmptyStateDetails';
import React, { ChangeEvent, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Key } from 'antd/lib/table/interface';
import debounce from 'lodash/debounce';
import SearchInput from '../../components/SearchInput/SearchInput';
import { ColumnType } from 'antd/lib/table';
import HexaBoxContainer from '../../components/HexaBoxContainer/HexaBoxContainer';
import Image from 'next/image';
import { getColumnSortStatus } from '../../helpers/tableUtils';
import HoneyButton from '../../components/HoneyButton/HoneyButton';
import { formatNumber } from '../../helpers/format';
import { LiquidateExpandTable } from '../../components/LiquidateExpandTable/LiquidateExpandTable';
import { LiquidateTableRow } from '../../types/liquidate';
import HoneySider from 'components/HoneySider/HoneySider';
import HoneyContent from 'components/HoneyContent/HoneyContent';
import { hideTablet, showTablet, table } from 'styles/markets.css';
import { pageDescription, pageTitle } from 'styles/common.css';
import { Typography } from 'antd';
import HoneyTableRow from 'components/HoneyTable/HoneyTableRow/HoneyTableRow';
import HoneyTableNameCell from 'components/HoneyTable/HoneyTableNameCell/HoneyTableNameCell';
import LiquidateExpandTableMobile from 'components/LiquidateExpandTable/LiquidateExpandTableMobile';
import useDisplayStore from 'store/displayStore';
import { useLiquidation, useLiquidationPositions } from '../../hooks/useCollection';
import { UserContext } from '../../contexts/userContext';
import { collections } from '../../constants/NFTCollections';
import useLiquidationFlowStore from '../../store/liquidationFlowStore';
import { LiquidationWorkFlowType } from '../../types/workflows';
import { getContractsByHTokenAddr } from '../../helpers/generalHelper';

const { formatPercent: fp, formatERC20: fs, formatRoundDown: fd } = formatNumber;
const Liquidate: NextPage = () => {
	/**
	 * @description declare state
	 * @params none
	 * @returns open positions | bidding data | userbid | user position
	 */
	const isSidebarVisibleInMobile = useDisplayStore((state) => state.isSidebarVisibleInMobile);
	const setIsSidebarVisibleInMobile = useDisplayStore((state) => state.setIsSidebarVisibleInMobile);

	const showMobileSidebar = () => {
		setIsSidebarVisibleInMobile(true);
		document.body.classList.add('disable-scroll');
	};

	const { currentUser, setCurrentUser } = useContext(UserContext);
	const [tableData, setTableData] = useState<LiquidateTableRow[]>([]);
	const [tableDataFiltered, setTableDataFiltered] = useState<LiquidateTableRow[]>([]);
	const [expandedRowKeys, setExpandedRowKeys] = useState<readonly Key[]>([]);
	const [isMyBidsFilterEnabled, setIsMyBidsFilterEnabled] = useState(false);
	const {
		HERC20ContractAddr: HERC20ContractAddress,
		setHERC20ContractAddr,
		setWorkflow,
		setNFTId,
		setCouponId
	} = useLiquidationFlowStore((state) => state);
	const { htokenHelperContractAddress, hivemindContractAddress, unit } =
		getContractsByHTokenAddr(HERC20ContractAddress);

	/*    Begin insert data into table */
	const [liquidateData, isLoadingLiquidateData] = useLiquidation(
		currentUser,
		collections,
		htokenHelperContractAddress
	);
	useEffect(() => {
		setTableData(liquidateData);
		setTableDataFiltered(liquidateData);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isLoadingLiquidateData]);

	const [positions, isLoadingPositions] = useLiquidationPositions(
		htokenHelperContractAddress,
		hivemindContractAddress,
		HERC20ContractAddress,
		unit
	);
	/*   End insert data into table */

	const handleToggle = (checked: boolean) => {
		setIsMyBidsFilterEnabled(checked);
	};

	/*    Begin filter function       */
	const [searchQuery, setSearchQuery] = useState('');
	const onSearch = (searchTerm: string): LiquidateTableRow[] => {
		if (!searchTerm) {
			return [...tableData];
		}
		const r = new RegExp(searchTerm, 'gmi');
		return [...tableData].filter((row) => {
			return r.test(row.name);
		});
	};

	const debouncedSearch = useCallback(
		debounce((searchQuery) => {
			setTableDataFiltered(onSearch(searchQuery));
		}, 500),
		[tableData]
	);
	const handleSearchInputChange = useCallback(
		(e: ChangeEvent<HTMLInputElement>) => {
			const value = e.target.value;
			setSearchQuery(value);
			debouncedSearch(value);
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[tableData]
	);
	/*    End filter function            */
	/*    begin sidebar interaction function          */
	const initCollectionBidFlow = (HERC20ContractAddress: string) => {
		setWorkflow(LiquidationWorkFlowType.none);
		setHERC20ContractAddr(HERC20ContractAddress);
		setNFTId('');
		setCouponId('');
		setWorkflow(LiquidationWorkFlowType.collectionBid);
		setIsSidebarVisibleInMobile(true);
		document.body.classList.add('disable-scroll');
	};
	/* end sidebar interaction function          */

	const SearchForm = () => {
		return (
			<SearchInput
				onChange={handleSearchInputChange}
				placeholder="Search by name"
				value={searchQuery}
			/>
		);
	};

	const columnsWidth: Array<number | string> = [200, 100, 150, 150, 100, 70];

	const columns: ColumnType<LiquidateTableRow>[] = useMemo(
		() => [
			{
				width: columnsWidth[0],
				title: SearchForm,
				dataIndex: ['name', 'icon', 'erc20Icon'],
				key: 'name',
				render: (text: string, row: LiquidateTableRow) => {
					return (
						<div className={style.nameCell}>
							<div className={style.logoWrapper}>
								<div className={style.collectionLogo}>
									<HexaBoxContainer>
										<Image src={row['icon']} layout="fill" alt="nft icon" />
									</HexaBoxContainer>
								</div>
								<div className={classNames(style.collectionLogo, style.secondaryLogo)}>
									<HexaBoxContainer>
										<Image src={row.erc20Icon} layout="fill" alt="nft icon" />
									</HexaBoxContainer>
								</div>
							</div>
							<div className={style.collectionName}>{row['name']}</div>
						</div>
					);
				}
			},
			// {
			// 	width: columnsWidth[1],
			// 	title: ({ sortColumns }) => {
			// 		const sortOrder = getColumnSortStatus(sortColumns, 'risk');
			// 		return (
			// 			<div className={style.headerCell[sortOrder === 'disabled' ? 'disabled' : 'active']}>
			// 				<span>Risk</span>
			// 				<div className={style.sortIcon[sortOrder]} />
			// 			</div>
			// 		);
			// 	},
			// 	dataIndex: 'risk',
			// 	sorter: (a, b) => a.risk - b.risk,
			// 	render: (rate: number) => {
			// 		return <div className={style.rateCell}>{fp(rate * 100)}</div>;
			// 	}
			// },
			{
				width: columnsWidth[2],
				title: ({ sortColumns }) => {
					const sortOrder = getColumnSortStatus(sortColumns, 'liqThreshold');
					return (
						<div className={style.headerCell[sortOrder === 'disabled' ? 'disabled' : 'active']}>
							<span>Liq %</span>
							<div className={style.sortIcon[sortOrder]} />
						</div>
					);
				},
				dataIndex: 'liqThreshold',
				sorter: (a, b) => a.liqThreshold - b.liqThreshold,
				render: (rate: number) => {
					return <div className={style.rateCell}>{fp(rate * 100)}</div>;
				}
			},
			{
				width: columnsWidth[3],
				title: ({ sortColumns }) => {
					const sortOrder = getColumnSortStatus(sortColumns, 'totalDebt');
					return (
						<div className={style.headerCell[sortOrder === 'disabled' ? 'disabled' : 'active']}>
							<span>Total Debt</span>
							<div className={style.sortIcon[sortOrder]} />
						</div>
					);
				},
				dataIndex: 'totalDebt',
				sorter: (a, b) => a.totalDebt - b.totalDebt,
				render: (available: number) => {
					return <div className={style.availableCell}>{fs(available)}</div>;
				}
			},
			{
				width: columnsWidth[4],
				title: ({ sortColumns }) => {
					const sortOrder = getColumnSortStatus(sortColumns, 'tvl');
					return (
						<div className={style.headerCell[sortOrder === 'disabled' ? 'disabled' : 'active']}>
							<span>TVL</span>
							<div className={style.sortIcon[sortOrder]} />
						</div>
					);
				},
				dataIndex: 'tvl',
				sorter: (a, b) => a.tvl - b.tvl,
				render: (value: number) => {
					return <div className={style.valueCell}>{fs(value)}</div>;
				}
			},
			{
				width: columnsWidth[5],
				// TODO: add toggle back when its functional
				// title: (
				//   // <div className={style.toggle}>
				//   //   <HoneyToggle
				//   //     checked={isMyBidsFilterEnabled}
				//   //     onChange={handleToggle}
				//   //   />
				//   //   <span className={style.toggleText}>my bids</span>
				//   // </div>
				// ),
				render: (_: null, row: LiquidateTableRow) => {
					return (
						<div className={style.buttonsCell}>
							<HoneyButton variant="text">
								View <div className={style.arrowIcon} />
							</HoneyButton>
						</div>
					);
				}
			}
		],
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[isMyBidsFilterEnabled, tableData, searchQuery]
	);

	const columnsMobile: ColumnType<LiquidateTableRow>[] = useMemo(
		() => [
			{
				width: columnsWidth[0],
				dataIndex: ['name', 'icon', 'erc20Icon'],
				key: 'name',
				render: (text: string, row: LiquidateTableRow) => {
					return (
						<>
							<HoneyTableNameCell
								leftSide={
									<>
										<div className={style.logoWrapper}>
											<div className={style.collectionLogo}>
												<HexaBoxContainer>
													<Image src={row['icon']} layout="fill" alt="nft icon" />
												</HexaBoxContainer>
											</div>
											<div className={classNames(style.collectionLogo, style.secondaryLogo)}>
												<HexaBoxContainer>
													<Image src={row.erc20Icon} layout="fill" alt="nft icon" />
												</HexaBoxContainer>
											</div>
										</div>
										<div className={style.nameCellMobile}>
											<div className={style.collectionName}>{row['name']}</div>
										</div>
									</>
								}
								rightSide={
									<div className={style.buttonsCell}>
										<HoneyButton variant="text">
											View <div className={style.arrowIcon} />
										</HoneyButton>
									</div>
								}
							/>

							<HoneyTableRow>
								<div className={style.rateCell}>{fp(row.risk * 100)}</div>
								<div className={style.rateCell}>{fs(row.totalDebt)}</div>
								<div className={style.availableCell}>{fs(row.tvl)}</div>
							</HoneyTableRow>
						</>
					);
				}
			}
		],
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[isMyBidsFilterEnabled, tableData, searchQuery]
	);

	const liquidateSidebar = () => (
		<HoneySider isMobileSidebarVisible={isSidebarVisibleInMobile}>
			<LiquidateSidebar />
		</HoneySider>
	);

	return (
		<LayoutRedesign>
			<HoneyContent sidebar={liquidateSidebar()}>
				<div>
					<Typography.Title className={pageTitle}>Liquidation</Typography.Title>
					<Typography.Text className={pageDescription}>
						Bid on discounted NFTs from borrowers{' '}
					</Typography.Text>
				</div>
				<div className={hideTablet}>
					<HoneyTable
						hasRowsShadow={true}
						tableLayout="fixed"
						columns={columns}
						dataSource={tableDataFiltered}
						pagination={false}
						className={classNames(style.table, {
							[style.emptyTable]: !tableDataFiltered.length
						})}
						expandable={{
							// we use our own custom expand column
							showExpandColumn: false,
							onExpand: (expanded, row) => {
								initCollectionBidFlow(row.key);
								setExpandedRowKeys(expanded ? [row.key] : []);
							},
							expandedRowKeys,
							expandedRowRender: (record) => {
								return (
									<div className={style.expandSection}>
										<div className={style.dashedDivider} />
										<LiquidateExpandTable data={positions} />
									</div>
								);
							}
						}}
					/>
				</div>
				<div className={showTablet}>
					<div className={classNames(style.mobileSearchAndToggleContainer)}>
						<div className={style.mobileRow}>
							<SearchForm />
						</div>
					</div>

					<div className={style.mobileTableHeader}>
						<div className={style.tableCell}>Risk</div>
						<div className={style.tableCell}>Debt</div>
						<div className={style.tableCell}>TVL</div>
					</div>
					<HoneyTable
						hasRowsShadow={true}
						tableLayout="fixed"
						columns={columnsMobile}
						dataSource={tableDataFiltered}
						pagination={false}
						showHeader={false}
						className={classNames(style.table, {
							[style.emptyTable]: !tableDataFiltered.length
						})}
						expandable={{
							// we use our own custom expand column
							showExpandColumn: false,
							onExpand: (expanded, row) => {
								initCollectionBidFlow(row.key);
								setExpandedRowKeys(expanded ? [row.key] : []);
							},
							expandedRowKeys,
							expandedRowRender: (record) => {
								return (
									<div className={style.expandSection} onClick={showMobileSidebar}>
										<div className={style.dashedDivider} />
										<LiquidateExpandTableMobile data={positions} onPlaceBid={showMobileSidebar} />
									</div>
								);
							}
						}}
					/>
				</div>
				{!tableDataFiltered.length &&
					(isMyBidsFilterEnabled ? (
						<div className={style.emptyStateContainer}>
							<EmptyStateDetails
								icon={<div className={style.docIcon} />}
								title="You didn’t use any collections yet"
								description="Turn off the filter my collection and choose any collection to borrow money"
							/>
						</div>
					) : (
						<div className={style.emptyStateContainer}>
							<EmptyStateDetails
								icon={<div className={style.docIcon} />}
								title="No collections to display"
								description="Turn off all filters and clear search inputs"
							/>
						</div>
					))}
			</HoneyContent>
		</LayoutRedesign>
	);
};

export default Liquidate;
