import type { NextPage } from 'next';
import LayoutRedesign from '../../components/LayoutRedesign/LayoutRedesign';
import LendSidebar from '../../components/LendSidebar/LendSidebar';
import { LendTableRow } from '../../types/lend';
import React, { ChangeEvent, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import HoneyTable from '../../components/HoneyTable/HoneyTable';
import * as style from '../../styles/markets.css';
import c from 'classnames';
import { ColumnType } from 'antd/lib/table';
import HexaBoxContainer from '../../components/HexaBoxContainer/HexaBoxContainer';
import Image from 'next/image';
import HoneyButton from '../../components/HoneyButton/HoneyButton';
import { Key } from 'antd/lib/table/interface';
import { formatNumber } from '../../helpers/format';
import SearchInput from '../../components/SearchInput/SearchInput';
import { getColumnSortStatus } from '../../helpers/tableUtils';
import HoneySider from '../../components/HoneySider/HoneySider';
import HoneyContent from '../../components/HoneyContent/HoneyContent';
import { Typography } from 'antd';
import { pageDescription, pageTitle } from 'styles/common.css';
import HoneyTableNameCell from 'components/HoneyTable/HoneyTableNameCell/HoneyTableNameCell';
import HoneyTableRow from 'components/HoneyTable/HoneyTableRow/HoneyTableRow';
import _ from 'lodash';
import useDisplayStore from '../../store/displayStore';
import { useLend } from '../../hooks/useCollection';
import { collections } from '../../constants/NFTCollections';
import { UserContext } from '../../contexts/userContext';
import useLendFlowStore from '../../store/lendFlowStore';
import { LendWorkFlowType } from '../../types/workflows';

const { format: f, formatPercent: fp, formatERC20: fs } = formatNumber;

const Lend: NextPage = () => {
	const calculatedInterestRate = 0.1;
	const { currentUser, setCurrentUser } = useContext(UserContext);
	const [tableData, setTableData] = useState<LendTableRow[]>([]);
	const [expandedRowKeys, setExpandedRowKeys] = useState<readonly Key[]>([]);
	const [isMyCollectionsFilterEnabled, setIsMyCollectionsFilterEnabled] = useState(false);

	const setWorkFlow = useLendFlowStore((state) => state.setWorkflow);
	const setHERC20ContractAddr = useLendFlowStore((state) => state.setHERC20ContractAddr);
	const isSidebarVisibleInMobile = useDisplayStore((state) => state.isSidebarVisibleInMobile);
	const setIsSidebarVisibleInMobile = useDisplayStore((state) => state.setIsSidebarVisibleInMobile);

	/*    Begin insert data into table */
	const lendData = useLend(currentUser, collections);
	useEffect(() => {
		setTableData(lendData);
		setTableDataFiltered(lendData);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	/*   End insert data into table */

	/*    Begin filter function       */
	const [tableDataFiltered, setTableDataFiltered] = useState<LendTableRow[]>([]);
	const [searchQuery, setSearchQuery] = useState('');
	const onSearch = (searchTerm: string): LendTableRow[] => {
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
			setSearchQuery(value);
			debouncedSearch(value);
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[tableData]
	);
	/*    End filter function            */

	const initLendOrWithdrawFlow = (
		event: React.MouseEvent<Element, MouseEvent>,
		record: LendTableRow
	) => {
		setHERC20ContractAddr(record.key);
		setWorkFlow(LendWorkFlowType.lendOrWithdraw);
		setIsSidebarVisibleInMobile(true);
		document.body.classList.add('disable-scroll');
	};

	const handleToggle = (checked: boolean) => {
		setIsMyCollectionsFilterEnabled(checked);
	};

	const MyCollectionsToggle = () =>
		// <div className={style.toggle}>
		//   <HoneyToggle
		//     checked={isMyCollectionsFilterEnabled}
		//     onChange={handleToggle}
		//   />
		//   <span className={style.toggleText}>my collections</span>
		// </div>
		null;

	const SearchForm = () => {
		return (
			<SearchInput
				onChange={handleSearchInputChange}
				placeholder="Search by name"
				value={searchQuery}
			/>
		);
	};

	const columnsWidth: Array<number | string> = [240, 150, 150, 150, 150];

	const columns: ColumnType<LendTableRow>[] = useMemo(
		() => [
			{
				width: columnsWidth[0],
				title: SearchForm,
				dataIndex: ['name', 'icon', 'erc20Icon'],
				key: 'name',
				render: (text: string, row: LendTableRow) => {
					return (
						<div className={style.nameCell}>
							<div className={style.logoWrapper}>
								<div className={style.collectionLogo}>
									<HexaBoxContainer>
										<Image src={row['icon']} layout="fill" alt={'nft icon'} />
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
				title: ({ sortColumns }) => {
					const sortOrder = getColumnSortStatus(sortColumns, 'rate');
					return (
						<div className={style.headerCell[sortOrder === 'disabled' ? 'disabled' : 'active']}>
							<span>Interest rate</span>
							<div className={style.sortIcon[sortOrder]} />
						</div>
					);
				},
				dataIndex: 'rate',
				sorter: (a, b) => a.interest - b.interest,
				render: (rate: number) => {
					return (
						<div className={c(style.rateCell, style.lendRate)}>{fp(calculatedInterestRate)}</div>
					);
				}
			},
			{
				width: columnsWidth[3],
				title: ({ sortColumns }) => {
					const sortOrder = getColumnSortStatus(sortColumns, 'value');
					return (
						<div className={style.headerCell[sortOrder === 'disabled' ? 'disabled' : 'active']}>
							<span>Supplied</span>
							<div className={style.sortIcon[sortOrder]} />
						</div>
					);
				},
				dataIndex: 'value',
				sorter: (a, b) => a.value - b.value,
				render: (value: number) => {
					return <div className={style.valueCell}>{fs(value)}</div>;
				}
			},
			{
				width: columnsWidth[2],
				title: ({ sortColumns }) => {
					const sortOrder = getColumnSortStatus(sortColumns, 'available');
					return (
						<div className={style.headerCell[sortOrder === 'disabled' ? 'disabled' : 'active']}>
							<span>Available</span>
							<div className={style.sortIcon[sortOrder]} />
						</div>
					);
				},
				dataIndex: 'available',
				sorter: (a, b) => a.available - b.available,
				render: (available: number) => {
					return <div className={style.availableCell}>{fs(available)}</div>;
				}
			},
			{
				width: columnsWidth[4],
				title: MyCollectionsToggle,
				render: (_: null, row: LendTableRow) => {
					return (
						<div className={style.buttonsCell}>
							<HoneyButton variant="text">
								Manage <div className={style.arrowRightIcon} />
							</HoneyButton>
						</div>
					);
				}
			}
		],
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[tableData, isMyCollectionsFilterEnabled, searchQuery]
	);

	const columnsMobile: ColumnType<LendTableRow>[] = useMemo(
		() => [
			{
				width: columnsWidth[0],
				dataIndex: ['name', 'icon', 'erc20Icon'],
				key: 'name',
				render: (text: string, row: LendTableRow) => {
					return (
						<>
							<HoneyTableNameCell
								leftSide={
									<>
										<div className={style.logoWrapper}>
											<div className={style.collectionLogo}>
												<HexaBoxContainer>
													<Image src={row['icon']} layout="fill" alt={'collection logo'} />
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
											Manage <div className={style.arrowRightIcon} />
										</HoneyButton>
									</div>
								}
							/>

							<HoneyTableRow>
								<div className={c(style.rateCell, style.lendRate)}>
									{fp(calculatedInterestRate)}
								</div>
								<div className={style.valueCell}>{fs(row.value)}</div>
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

	const lendSidebar = () => (
		<HoneySider isMobileSidebarVisible={isSidebarVisibleInMobile}>
			{/* lend withdraw module */}
			<LendSidebar />
		</HoneySider>
	);

	return (
		<LayoutRedesign>
			<HoneyContent sidebar={lendSidebar()}>
				<div>
					<Typography.Title className={pageTitle}>Lend</Typography.Title>
					<Typography.Text className={pageDescription}>
						Earn yield by depositing crypto into NFT markets.{' '}
						<span>
							<a target="_blank" href="https://buy.moonpay.com" rel="noreferrer">
								<HoneyButton style={{ display: 'inline' }} variant="text">
									Need crypto?
								</HoneyButton>
							</a>
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
						className={style.table}
						onRow={(record, rowIndex) => {
							return {
								onClick: (event) => initLendOrWithdrawFlow(event, record)
							};
						}}
						// TODO: uncomment when the chart has been replaced and implemented
						// expandable={{
						//   // we use our own custom expand column
						//   showExpandColumn: false,
						//   onExpand: (expanded, row) =>
						//     setExpandedRowKeys(expanded ? [row.key] : []),
						//   expandedRowKeys,
						//   expandedRowRender: record => {
						//     return (
						//       <div className={style.expandSection}>
						//         <div className={style.dashedDivider} />
						//         <HoneyChart title="Interest rate" data={record.stats} />
						//       </div>
						//   );
						// }
						// }}
					/>
				</div>
				<div className={style.showTablet}>
					<div className={c(style.mobileTableHeader, style.mobileSearchAndToggleContainer)}>
						<div className={style.mobileRow}>
							<SearchForm />
						</div>
						<div className={style.mobileRow}>
							<MyCollectionsToggle />
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
						className={style.table}
						onRow={(record, rowIndex) => {
							return {
								onClick: (event) => initLendOrWithdrawFlow(event, record)
							};
						}}
					/>
				</div>
			</HoneyContent>
		</LayoutRedesign>
	);
};

export default Lend;
