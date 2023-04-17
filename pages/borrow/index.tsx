import type { NextPage } from 'next';
import LayoutRedesign from '../../components/LayoutRedesign/LayoutRedesign';
import HoneyTable from '../../components/HoneyTable/HoneyTable';
import { ColumnType } from 'antd/lib/table';
import * as style from '../../styles/markets.css';
import useLoanFlowStore from '../../store/loanFlowStore';
import { HoneyTableColumnType, MarketTablePosition, MarketTableRow } from '../../types/markets';
import React, { ChangeEvent, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import _ from 'lodash';
import SearchInput from '../../components/SearchInput/SearchInput';
import Image from 'next/image';
import HoneyButton from '../../components/HoneyButton/HoneyButton';
import HoneyToggle from 'components/HoneyToggle/HoneyToggle';
import classNames from 'classnames';
import HexaBoxContainer from '../../components/HexaBoxContainer/HexaBoxContainer';
import { getColumnSortStatus } from '../../helpers/tableUtils';
import { ColumnTitleProps, Key as antdKey } from 'antd/lib/table/interface';
import useWindowSize from '../../hooks/useWindowSize';
import { TABLET_BP } from '../../constants/breakpoints';
import { formatNumber } from '../../helpers/format';
import HoneyTableNameCell from '../../components/HoneyTable/HoneyTableNameCell/HoneyTableNameCell';
import HoneyTableRow from '../../components/HoneyTable/HoneyTableRow/HoneyTableRow';
import { InfoBlock } from '../../components/InfoBlock/InfoBlock';
import { Typography, Space, Empty, Spin } from 'antd';
import { pageDescription, pageTitle, spinner } from '../../styles/common.css';
import HoneyContent from '../../components/HoneyContent/HoneyContent';
import EmptyStateDetails from '../../components/EmptyStateDetails/EmptyStateDetails';
import { UserContext } from '../../contexts/userContext';
import { useMarket, usePositions } from '../../hooks/useCollection';
import { collections } from '../../constants/NFTCollections';
import HoneySider from '../../components/HoneySider/HoneySider';
import { LoanWorkFlowType } from '../../types/workflows';
import MarketsSidebar from '../../components/MarketsSidebar/MarketsSidebar';
import useDisplayStore from '../../store/displayStore';
import { getContractsByHTokenAddr } from '../../helpers/generalHelper';
import HealthLvl from 'components/HealthLvl/HealthLvl';
import c from 'classnames';
import { useNetwork } from 'wagmi';

const { formatPercent: fp, formatERC20: fs } = formatNumber;
const Markets: NextPage = () => {
	const { currentUser, setCurrentUser } = useContext(UserContext);
	const [showWeeklyRates, setShowWeeklyRates] = useState(true);
	const [tableData, setTableData] = useState<MarketTableRow[]>([]);
	const [isMyCollectionsFilterEnabled, setIsMyCollectionsFilterEnabled] = useState(true);
	const [expandedRowKeys, setExpandedRowKeys] = useState<readonly antdKey[]>([]);
	const {
		HERC20ContractAddr: HERC20ContractAddress,
		setHERC20ContractAddr,
		setWorkflow,
		setNFTId,
		setCouponId
	} = useLoanFlowStore((state) => state);
	const isSidebarVisibleInMobile = useDisplayStore((state) => state.isSidebarVisibleInMobile);
	const setIsSidebarVisibleInMobile = useDisplayStore((state) => state.setIsSidebarVisibleInMobile);
	const { width: windowWidth } = useWindowSize();
	const { htokenHelperContractAddress, controllerContractAddress, nftContractAddress, unit } =
		getContractsByHTokenAddr(HERC20ContractAddress);

	const { chain } = useNetwork();

	/*    Begin insert data into table */
	const [marketData, isLoadingMarketData] = useMarket(
		currentUser,
		collections,
		htokenHelperContractAddress
	);
	useEffect(() => {
		setTableData(marketData);
		setTableDataFiltered(marketData); // eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isLoadingMarketData]);

	const [positions, isLoadingPositions] = usePositions(
		htokenHelperContractAddress,
		HERC20ContractAddress,
		nftContractAddress,
		controllerContractAddress,
		currentUser,
		unit
	);

	/*   End insert data into table */
	/*    Begin filter function       */
	const [searchQuery, setSearchQuery] = useState('');
	const [tableDataFiltered, setTableDataFiltered] = useState<MarketTableRow[]>([]);
	const onSearch = (searchTerm: string): MarketTableRow[] => {
		if (!searchTerm) {
			return [...tableData];
		}
		const r = new RegExp(searchTerm, 'gmi');
		return [...tableData].filter((row) => {
			return r.test(row.name);
		});
	};

	const debouncedSearch = useCallback(
		_.debounce((criteria: string) => {
			setTableDataFiltered(onSearch(criteria));
			setSearchQuery(criteria);
		}, 500),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[tableData]
	);

	const handleSearchInputChange = useCallback(
		(e: ChangeEvent<HTMLInputElement>) => {
			const value = e.target.value;
			debouncedSearch(value);
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[tableData]
	);
	/*    End filter function            */
	/*    begin sidebar interaction function          */
	const initDepositNFTFlow = () => {
		setWorkflow(LoanWorkFlowType.depositNFT);
		setIsSidebarVisibleInMobile(true);
		document.body.classList.add('disable-scroll');
	};

	const initLoanOrBorrowFlow = (tokenId: string, couponId: string) => {
		setNFTId(tokenId);
		setCouponId(couponId);
		setWorkflow(LoanWorkFlowType.loanOrBorrow);
		setIsSidebarVisibleInMobile(true);
		document.body.classList.add('disable-scroll');
	};

	/* end sidebar interaction function          */
	//todo finish toggle
	const MyCollectionsToggle = () => null;
	// <div className={style.toggle}>
	//   <HoneyToggle
	//     checked={isMyCollectionsFilterEnabled}
	//     onChange={handleToggle}
	//   />
	//   <span className={style.toggleText}>my collections</span>
	// </div>

	/* being table components         */

	const WeeklyToggle = () => (
		<div className={style.headerCell['disabled']}>
			<Space direction="horizontal">
				<HoneyToggle
					onChange={(value) => setShowWeeklyRates(value)}
					title="Weekly"
					checked={showWeeklyRates}
				/>{' '}
				WEEKLY
			</Space>
		</div>
	);

	const SearchForm = () => {
		return <SearchInput onChange={handleSearchInputChange} placeholder="Search by name" />;
	};

	const columnsWidth: Array<number | string> = [240, 150, 150, 150, 150];

	const columns: HoneyTableColumnType<MarketTableRow>[] = useMemo(
		() =>
			[
				{
					width: columnsWidth[0],
					title: SearchForm,
					dataIndex: ['name', 'icon', 'erc20Icon'],
					key: 'name',
					render: (text: string, row: MarketTableRow) => {
						return (
							<div className={style.nameCell}>
								<div className={style.logoWrapper}>
									<div className={style.collectionLogo}>
										<HexaBoxContainer>
											<Image src={row['icon']} layout="fill" alt="nft icon" />
										</HexaBoxContainer>
									</div>
									<div className={c(style.collectionLogo, style.secondaryLogo)}>
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
				{
					width: columnsWidth[1],
					title: ({ sortColumns }: ColumnTitleProps<MarketTableRow>) => {
						const sortOrder = getColumnSortStatus(sortColumns, 'rate');
						return (
							<div className={style.headerCell[sortOrder === 'disabled' ? 'disabled' : 'active']}>
								{showWeeklyRates ? <span>Weekly Rate</span> : <span>Yearly Rate</span>}
								<div className={style.sortIcon[sortOrder]} />
							</div>
						);
					},
					dataIndex: 'rate',
					hidden: windowWidth < TABLET_BP,
					sorter: (a: MarketTableRow, b: MarketTableRow) => a.rate - b.rate,
					render: (rate: number) => {
						return (
							<div className={c(style.rateCell, style.lendRate)}>
								{fp(rate / (showWeeklyRates ? 52 : 1))}
							</div>
						);
					}
				},

				{
					width: columnsWidth[3],
					title: ({ sortColumns }: ColumnTitleProps<MarketTableRow>) => {
						const sortOrder = getColumnSortStatus(sortColumns, 'value');
						return (
							<div className={style.headerCell[sortOrder === 'disabled' ? 'disabled' : 'active']}>
								<span>SUPPLIED</span>
								<div className={style.sortIcon[sortOrder]} />
							</div>
						);
					},
					dataIndex: 'supplied',
					sorter: (a: MarketTableRow, b: MarketTableRow) => a.supplied - b.supplied,
					render: (supplied: number) => {
						return <div className={style.valueCell}>{fs(supplied)}</div>;
					}
				},
				{
					width: columnsWidth[2],
					title: ({ sortColumns }: ColumnTitleProps<MarketTableRow>) => {
						const sortOrder = getColumnSortStatus(sortColumns, 'available');
						return (
							<div className={style.headerCell[sortOrder === 'disabled' ? 'disabled' : 'active']}>
								<span>Available</span>
								<div className={style.sortIcon[sortOrder]} />
							</div>
						);
					},
					dataIndex: 'available',
					hidden: windowWidth < TABLET_BP,
					sorter: (a: MarketTableRow, b: MarketTableRow) => a.available - b.available,
					render: (available: number) => {
						return <div className={style.availableCell}>{fs(available)}</div>;
					}
				},
				{
					width: columnsWidth[4],
					title: WeeklyToggle,
					render: (_: null, row: MarketTableRow) => {
						return (
							<div className={style.buttonsCell}>
								<HoneyButton variant="text">
									View <div className={style.arrowIcon} />
								</HoneyButton>
							</div>
						);
					}
				}
			].filter((column) => !column.hidden),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[isMyCollectionsFilterEnabled, tableData, searchQuery, windowWidth, showWeeklyRates]
	);

	const columnsMobile: ColumnType<MarketTableRow>[] = useMemo(
		() => [
			{
				width: columnsWidth[0],
				dataIndex: ['name', 'icon', 'erc20Icon'],
				key: 'name',
				render: (text: string, row: MarketTableRow) => {
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
											<div className={c(style.collectionLogo, style.secondaryLogo)}>
												<HexaBoxContainer>
													<Image src={row.erc20Icon} layout="fill" alt="nft icon" />
												</HexaBoxContainer>
											</div>
										</div>
										<div className={style.nameCellMobile}>
											<div className={style.collectionName}>{row['name']}</div>
											<div className={style.rateCellMobile}>{fp(row.rate)}</div>
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
								<div className={style.rateCell}>{fp(row.rate)}</div>
								<div className={style.availableCell}>{fs(row.supplied)}</div>
								<div className={style.availableCell}>{fs(row.available)}</div>
							</HoneyTableRow>
						</>
					);
				}
			}
		],
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[isMyCollectionsFilterEnabled, tableData, searchQuery]
	);

	const expandColumns: ColumnType<MarketTablePosition>[] = [
		{
			dataIndex: ['name', 'image', 'tokenId'],
			key: 'tokenId',
			width: columnsWidth[0],
			render: (text: string, row) => (
				<div className={style.expandedRowNameCell}>
					<div className={style.expandedRowIcon} />
					<div className={style.collectionLogo}>
						<HexaBoxContainer>
							<Image src={row['image']} layout="fill" alt="nft icon" />
						</HexaBoxContainer>
					</div>
					<div className={style.nameCellText}>
						<div className={style.collectionName}>{`${row['name']} #${row['tokenId']}`}</div>
						<HealthLvl healthLvl={row['healthLvl']} />
					</div>
				</div>
			)
		},
		{
			dataIndex: 'debt',
			width: columnsWidth[1],
			render: (debt) => (
				<div className={style.expandedRowCell}>
					<InfoBlock title={'Debt:'} value={fs(debt)} />
				</div>
			)
		},
		{
			dataIndex: 'allowance',
			width: columnsWidth[2],
			render: (allowance) => (
				<div className={style.expandedRowCell}>
					<InfoBlock title={'Allowance:'} value={fs(allowance)} />
				</div>
			)
		},
		{
			dataIndex: 'value',
			width: columnsWidth[3],
			render: (value) => (
				<div className={style.expandedRowCell}>
					<InfoBlock title={'Value:'} value={fs(value)} />
				</div>
			)
		},
		{
			dataIndex: ['tokenId', 'couponId'],
			key: 'tokenId',
			width: columnsWidth[4],
			title: '',
			render: (text, row) => (
				<div className={style.buttonsCell}>
					<HoneyButton
						variant="text"
						onClick={(e) => initLoanOrBorrowFlow(row['tokenId'], row['couponId'])}
					>
						Manage <div className={style.arrowRightIcon} />
					</HoneyButton>
				</div>
			)
		}
	];

	const expandColumnsMobile: ColumnType<MarketTablePosition>[] = [
		{
			dataIndex: ['name', 'image', 'tokenId'],
			key: 'tokenId',
			render: (text, row) => (
				<div className={style.expandedRowNameCell}>
					<div className={style.expandedRowIcon} />
					<div className={style.collectionLogo}>
						<HexaBoxContainer>
							<Image src={row['image']} layout="fill" alt="nft icon" />
						</HexaBoxContainer>
					</div>
					<div className={style.nameCellText}>
						<div className={style.collectionName}>{`${row['name']} #${row['tokenId']}`}</div>
						<HealthLvl healthLvl={row.healthLvl || 0} />
					</div>
				</div>
			)
		},
		{
			dataIndex: ['tokenId', 'couponId'],
			key: 'tokenId',
			title: '',
			width: '50px',
			render: (text, row) => (
				<div className={c(style.expandedRowCell, style.buttonsCell)}>
					<HoneyButton
						variant="text"
						onClick={(e) => initLoanOrBorrowFlow(row['tokenId'], row['couponId'])}
					>
						{'Manage'}
						<div className={style.arrowRightIcon} />
					</HoneyButton>
				</div>
			)
		}
	];

	const ExpandedTableFooter = () => (
		<div className={style.expandedSection}>
			<div className={style.expandedSectionFooter}>
				<div className={style.expandedRowIcon} />
				<div className={style.collectionLogo}>
					<HexaBoxContainer variant="gray">
						<div className={style.lampIconStyle} />
					</HexaBoxContainer>
				</div>
				<div className={style.footerText}>
					<span className={style.footerTitle}>
						{positions.length
							? 'You can add more NFTs to this market'
							: 'Create positions by selecting an NFT from this collection'}
					</span>
					<span className={style.footerDescription}>{`Choose ${
						positions.length ? 'another' : ''
					} NFT from same collection`}</span>
				</div>
			</div>
			<div className={style.footerButton}>
				<HoneyButton
					onClick={initDepositNFTFlow}
					className={style.mobileConnectButton}
					variant="secondary"
					isFluid={windowWidth < TABLET_BP}
				>
					<div className={style.swapWalletIcon} />
					{`
					Choose ${positions.length ? 'another' : 'YOUR'} NFT`}
				</HoneyButton>
			</div>
		</div>
	);

	const marketSidebar = () => (
		<HoneySider isMobileSidebarVisible={isSidebarVisibleInMobile}>
			{/* borrow repay module */}
			<MarketsSidebar />
		</HoneySider>
	);
	/* end table components              */

	return (
		<LayoutRedesign>
			<HoneyContent sidebar={marketSidebar()}>
				<div>
					<Typography.Title className={pageTitle}>Borrow</Typography.Title>
					<Typography.Text className={pageDescription}>
						Get instant liquidity using your NFTs as collateral.{'   '}
						<span style={{ marginLeft: '5px' }}>
							{chain?.network === 'arbitrum' && (
								<a target="_blank" href="https://bridge.arbitrum.io/" rel="noreferrer">
									<HoneyButton style={{ display: 'inline' }} variant="text">
										Bridge to Arbitrum
									</HoneyButton>
								</a>
							)}
						</span>
					</Typography.Text>
				</div>
				<div className={style.hideTablet}>
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
								setWorkflow(LoanWorkFlowType.none);
								setHERC20ContractAddr(row.key);
								setExpandedRowKeys(expanded ? [row.key] : []);
							},
							expandedRowKeys,
							expandedRowRender: (record) => {
								return (
									<>
										<div>
											<div className={style.expandSection}>
												<div className={style.dashedDivider} />
												<HoneyTable
													tableLayout="fixed"
													className={style.expandContentTable}
													columns={expandColumns}
													dataSource={positions}
													pagination={false}
													showHeader={false}
													footer={ExpandedTableFooter}
													locale={{
														emptyText: !isLoadingPositions ? (
															<Empty
																image={Empty.PRESENTED_IMAGE_SIMPLE}
																description={
																	currentUser?.address ? 'No loan positions' : 'Connect wallet'
																}
															/>
														) : (
															<div className={c(style.emptyTableSpinner, spinner)}>
																<Spin />
															</div>
														)
													}}
												/>
											</div>
										</div>
									</>
								);
							}
						}}
					/>
				</div>

				<div className={style.showTablet}>
					<div className={c(style.mobileTableHeader, style.mobileSearchAndToggleContainer)}>
						<div className={style.mobileRow}>
							<SearchForm />
						</div>
						<div className={style.mobileRow}>
							<WeeklyToggle />
						</div>
					</div>
					<div className={c(style.mobileTableHeader)}>
						<div className={style.tableCell}>Interest</div>
						<div className={style.tableCell}>Supplied</div>
						<div className={style.tableCell}>Available</div>
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
								setWorkflow(LoanWorkFlowType.none);
								setHERC20ContractAddr(row.key);
								setExpandedRowKeys(expanded ? [row.key] : []);
							},
							expandedRowKeys,
							expandedRowRender: (record) => {
								return (
									<>
										<div>
											<div className={style.expandSection}>
												<div className={style.dashedDivider} />
												<HoneyTable
													className={style.expandContentTable}
													columns={expandColumnsMobile}
													dataSource={positions}
													pagination={false}
													showHeader={false}
													footer={ExpandedTableFooter}
													locale={{
														emptyText: !isLoadingPositions ? (
															<Empty
																image={Empty.PRESENTED_IMAGE_SIMPLE}
																description={
																	currentUser?.address ? 'No loan positions' : 'Connect wallet'
																}
															/>
														) : (
															<div className={c(style.emptyTableSpinner, spinner)}>
																<Spin />
															</div>
														)
													}}
												/>
											</div>
										</div>
									</>
								);
							}
						}}
					/>
				</div>
				{!tableDataFiltered.length &&
					(isMyCollectionsFilterEnabled ? (
						<div className={style.emptyStateContainer}>
							<EmptyStateDetails
								icon={<div className={style.docIcon} />}
								title="You didn’t use any collections yet"
								description="Turn off the filter my collection and choose any collection to borrow tokens"
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

export default Markets;
