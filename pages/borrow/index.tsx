import type { NextPage } from 'next';
import LayoutRedesign from '../../components/LayoutRedesign/LayoutRedesign';
import HoneyTable from '../../components/HoneyTable/HoneyTable';
import { ColumnType } from 'antd/lib/table';
import * as style from '../../styles/markets.css';
import useLoanFlowStore from "../../store/loanFlowStore";
import { HoneyTableColumnType, MarketTablePosition, MarketTableRow } from "../../types/markets";
import {
  ChangeEvent,
  ReactChild,
  ReactFragment,
  ReactPortal,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import _ from "lodash";
import SearchInput from "../../components/SearchInput/SearchInput";
import Image from 'next/image';
import HoneyButton from "../../components/HoneyButton/HoneyButton";
import classNames from 'classnames';
import HexaBoxContainer from "../../components/HexaBoxContainer/HexaBoxContainer";
import { getColumnSortStatus } from "../../helpers/tableUtils";
import { ColumnTitleProps, Key as antdKey } from 'antd/lib/table/interface';
import useWindowSize from "../../hooks/useWindowSize";
import { TABLET_BP } from "../../constants/breakpoints";
import { formatNumber } from "../../helpers/format";
import HoneyTableNameCell from "../../components/HoneyTable/HoneyTableNameCell/HoneyTableNameCell";
import HoneyTableRow from "../../components/HoneyTable/HoneyTableRow/HoneyTableRow";
import { InfoBlock } from "../../components/InfoBlock/InfoBlock";
import { Typography } from 'antd';
import { pageDescription, pageTitle } from "../../styles/common.css";
import HoneyContent from "../../components/HoneyContent/HoneyContent";
import EmptyStateDetails from "../../components/EmptyStateDetails/EmptyStateDetails";
import { UserContext } from "../../contexts/userContext";
import { useMarket, usePositions } from "../../hooks/useCollection";
import { collections } from "../../constants/NFTCollections";
import HoneySider from "../../components/HoneySider/HoneySider";
import { LoanWorkFlowType } from "../../types/workflows";
import MarketsSidebar from "../../components/MarketsSidebar/MarketsSidebar";
import useDisplayStore from "../../store/displayStore";
import { getContractsByHTokenAddr } from "../../helpers/generalHelper";

const {formatPercent: fp, formatERC20: fs} = formatNumber
const Markets: NextPage = () => {
  const {currentUser, setCurrentUser} = useContext(UserContext);
  const [tableData, setTableData] = useState<MarketTableRow[]>([]);
  const [isMyCollectionsFilterEnabled, setIsMyCollectionsFilterEnabled] = useState(false);
  const [expandedRowKeys, setExpandedRowKeys] = useState<readonly antdKey[]>([]);
  const HERC20ContractAddress = useLoanFlowStore((state) => state.HERC20ContractAddr)
  const setHERC20ContractAddr = useLoanFlowStore((state) => state.setHERC20ContractAddr)
  const setWorkflow = useLoanFlowStore((state) => state.setWorkflow)
  const setNFTId = useLoanFlowStore((state) => state.setNFTId)
  const isSidebarVisibleInMobile = useDisplayStore((state) => state.isSidebarVisibleInMobile)
  const setIsSidebarVisibleInMobile = useDisplayStore((state) => state.setIsSidebarVisibleInMobile)
  const {width: windowWidth} = useWindowSize();
  const {nftContractAddress, unit} = getContractsByHTokenAddr(HERC20ContractAddress)

  /*    Begin insert data into table */
  const marketData = useMarket(currentUser, collections)
  useEffect(() => {
    setTableData(marketData);
    setTableDataFiltered(marketData);
  }, []);

  const [positions, isLoadingPositions] = usePositions(HERC20ContractAddress, nftContractAddress, currentUser, unit)

  /*   End insert data into table */
  /*    Begin filter function       */
  const [searchQuery, setSearchQuery] = useState('');
  const [tableDataFiltered, setTableDataFiltered] = useState<MarketTableRow[]>(
    []
  );
  const onSearch = (searchTerm: string): MarketTableRow[] => {
    if (!searchTerm) {
      return [...tableData];
    }
    const r = new RegExp(searchTerm, 'gmi');
    return [...tableData].filter(row => {
      return r.test(row.name);
    });
  };

  const debouncedSearch = useCallback(
    _.debounce((criteria: string) => {
      setTableDataFiltered(onSearch(criteria))
      setSearchQuery(criteria);
    }, 500),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tableData]
  )

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
  const [isMobileSidebarVisible, setShowMobileSidebar] = useState(false);
  const initDepositNFTFlow = () => {
    setWorkflow(LoanWorkFlowType.depositNFT)
    setIsSidebarVisibleInMobile(true)
    document.body.classList.add('disable-scroll');
  }

  const initLoanOrBorrowFlow = (tokenId: string) => {
    setNFTId(tokenId)
    setWorkflow(LoanWorkFlowType.loanOrBorrow)
    setIsSidebarVisibleInMobile(true)
    document.body.classList.add('disable-scroll');
  }

  /* end sidebar interaction function          */
  //todo finish toggle
  const MyCollectionsToggle = () => null
  // <div className={style.toggle}>
  //   <HoneyToggle
  //     checked={isMyCollectionsFilterEnabled}
  //     onChange={handleToggle}
  //   />
  //   <span className={style.toggleText}>my collections</span>
  // </div>

  /* being table components         */
  const SearchForm = () => {
    return (
      <SearchInput
        onChange={handleSearchInputChange}
        placeholder="Search by name"
      />
    );
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
                      <Image src={row['icon']} layout='fill' alt='nft icon'/>
                    </HexaBoxContainer>
                  </div>
                </div>
                <div className={style.logoWrapper}>
                  <div className={style.collectionLogo}>
                    <HexaBoxContainer>
                      <Image src={row['erc20Icon']} layout='fill' alt='nft icon'/>
                    </HexaBoxContainer>
                  </div>
                </div>
                <div className={style.collectionName}>{row["name"]}</div>
              </div>
            );
          }
        },
        {
          width: columnsWidth[1],
          title: ({sortColumns}: ColumnTitleProps<MarketTableRow>) => {
            const sortOrder = getColumnSortStatus(sortColumns, 'rate');
            return (
              <div
                className={
                  style.headerCell[
                    sortOrder === 'disabled' ? 'disabled' : 'active'
                    ]
                }
              >
                <span>Interest rate</span>
                <div className={style.sortIcon[sortOrder]}/>
              </div>
            );
          },
          dataIndex: 'rate',
          hidden: windowWidth < TABLET_BP,
          sorter: (a: MarketTableRow, b: MarketTableRow) => a.rate - b.rate,
          render: (rate: number) => {
            return <div className={style.rateCell}>{fp(rate * 100)}</div>;
          }
        },
        {
          width: columnsWidth[2],
          title: ({sortColumns}: ColumnTitleProps<MarketTableRow>) => {
            const sortOrder = getColumnSortStatus(sortColumns, 'available');
            return (
              <div
                className={
                  style.headerCell[
                    sortOrder === 'disabled' ? 'disabled' : 'active'
                    ]
                }
              >
                <span>Available</span>{' '}
                <div className={style.sortIcon[sortOrder]}/>
              </div>
            );
          },
          dataIndex: 'available',
          hidden: windowWidth < TABLET_BP,
          sorter: (a: MarketTableRow, b: MarketTableRow) =>
            a.available - b.available,
          render: (available: number) => {
            return <div className={style.availableCell}>{fs(available)}</div>;
          }
        },
        {
          width: columnsWidth[3],
          title: ({sortColumns}: ColumnTitleProps<MarketTableRow>) => {
            const sortOrder = getColumnSortStatus(sortColumns, 'value');
            return (
              <div
                className={
                  style.headerCell[
                    sortOrder === 'disabled' ? 'disabled' : 'active'
                    ]
                }
              >
                <span>TVL</span>
                <div className={style.sortIcon[sortOrder]}/>
              </div>
            );
          },
          dataIndex: 'value',
          sorter: (a: MarketTableRow, b: MarketTableRow) => a.value - b.value,
          render: (value: number) => {
            return <div className={style.valueCell}>{fs(value)}</div>;
          }
        },
        {
          width: columnsWidth[4],
          title: MyCollectionsToggle,
          render: (_: null, row: MarketTableRow) => {
            return (
              <div className={style.buttonsCell}>
                <HoneyButton variant="text">
                  View <div className={style.arrowIcon}/>
                </HoneyButton>
              </div>
            );
          }
        }
      ].filter(column => !column.hidden),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isMyCollectionsFilterEnabled, tableData, searchQuery, windowWidth]
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
                          <Image src={row['icon']} layout='fill' alt='nft icon'/>
                        </HexaBoxContainer>
                      </div>
                    </div>
                    <div className={style.logoWrapper}>
                      <div className={style.collectionLogo}>
                        <HexaBoxContainer>
                          <Image src={row['erc20Icon']} layout='fill' alt='nft icon'/>
                        </HexaBoxContainer>
                      </div>
                    </div>
                    <div className={style.nameCellMobile}>
                      <div className={style.collectionName}>{row['name']}</div>
                      <div className={style.rateCellMobile}>
                        {fp(row.rate * 100)}
                      </div>
                    </div>
                  </>
                }
                rightSide={
                  <div className={style.buttonsCell}>
                    <HoneyButton variant="text">
                      View <div className={style.arrowIcon}/>
                    </HoneyButton>
                  </div>
                }
              />

              <HoneyTableRow>
                <div className={style.rateCell}>{fp(row.rate * 100)}</div>
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
          <div className={style.expandedRowIcon}/>
          <div className={style.collectionLogo}>
            <HexaBoxContainer>
              <Image src={row['image']} layout='fill' alt='nft icon'/>
            </HexaBoxContainer>
          </div>
          <div className={style.nameCellText}>
            <div className={style.collectionName}>{row['name']}</div>
            <div className={style.risk.safe}>
              <span className={style.valueCell}>{"0"}</span>{' '}
              <span className={style.riskText}>Risk lvl</span>
            </div>
          </div>
        </div>
      )
    },
    {
      dataIndex: 'debt',
      width: columnsWidth[1],
      render: debt => (
        <div className={style.expandedRowCell}>
          <InfoBlock title={'Debt:'} value={fs(debt)}/>
        </div>
      )
    },
    {
      dataIndex: 'allowance',
      width: columnsWidth[2],
      render: allowance => (
        <div className={style.expandedRowCell}>
          <InfoBlock title={'Allowance:'} value={fs(allowance)}/>
        </div>
      )
    },
    {
      dataIndex: 'value',
      width: columnsWidth[3],
      render: value => (
        <div className={style.expandedRowCell}>
          <InfoBlock title={'Value:'} value={'0'}/>
        </div>
      )
    },
    {
      dataIndex: 'tokenId',
      width: columnsWidth[4],
      title: '',
      render: tokenId => (
        <div className={style.buttonsCell}>
          <HoneyButton
            variant="text"
            onClick={e => initLoanOrBorrowFlow(tokenId)}
          >
            Manage <div className={style.arrowRightIcon}/>
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
          <div className={style.expandedRowIcon}/>
          <div className={style.collectionLogo}>
            <HexaBoxContainer>
              <Image src={row['image']} layout='fill' alt='nft icon'/>
            </HexaBoxContainer>
          </div>
          <div className={style.nameCellText}>
            <div className={style.collectionNameMobile}>{row['name']}</div>
            <div className={style.risk.safe}>
              <span className={style.valueCell}>{0}</span>
            </div>
          </div>
        </div>
      )
    },
    {
      dataIndex: 'debt',
      render: debt => (
        <div className={style.expandedRowCell}>
          <InfoBlock title={'Debt:'} value={'0'}/>
        </div>
      )
    },
    {
      dataIndex: 'available',
      render: available => (
        <div className={style.expandedRowCell}>
          <InfoBlock title={'Allowance:'} value={'0'}/>
        </div>
      )
    },
    {
      dataIndex: 'tokenId',
      title: '',
      width: '50px',
      render: tokenId => (
        <div className={style.buttonsCell}>
          <HoneyButton
            variant="text"
            onClick={e => initLoanOrBorrowFlow(tokenId)}
          >
            {'Manage'}
            <div className={style.arrowRightIcon}/>
          </HoneyButton>
        </div>
      )
    }
  ];

  const ExpandedTableFooter = () => (
    <div className={style.expandedSection}>
      <div className={style.expandedSectionFooter}>
        <div className={style.expandedRowIcon}/>
        <div className={style.collectionLogo}>
          <HexaBoxContainer variant="gray">
            <div className={style.lampIconStyle}/>
          </HexaBoxContainer>
        </div>
        <div className={style.footerText}>
          <span className={style.footerTitle}>
            You can add one more NFT to this market
          </span>
          <span className={style.footerDescription}>
            Choose another NFT from same collection
          </span>
        </div>
      </div>
      <div className={style.footerButton}>
        <HoneyButton
          onClick={initDepositNFTFlow}
          className={style.mobileConnectButton}
          variant="secondary"
          isFluid={windowWidth < TABLET_BP}
        >
          <div className={style.swapWalletIcon}/>
          Choose Another NFT
        </HoneyButton>
      </div>
    </div>
  );
  /* end table components              */


  return (
    <LayoutRedesign>
      <div>
        <Typography.Title className={pageTitle}>Borrow</Typography.Title>
        <Typography.Text className={pageDescription}>
          Get instant liquidity using your NFTs as collateral
          {' '}
        </Typography.Text>
      </div>
      <HoneyContent>
        <div className={style.mobileTableHeader}>
          <div className={style.mobileRow}>
            <SearchForm/>
          </div>
          <div className={style.mobileRow}>
            <MyCollectionsToggle/>
          </div>
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
                setHERC20ContractAddr(row.key)
                setWorkflow(LoanWorkFlowType.none)
                setExpandedRowKeys(expanded ? [row.key] : [])
              },
              expandedRowKeys,
              expandedRowRender: record => {
                return (
                  <>
                    <div>
                      <div
                        className={style.expandSection}
                      >
                        <div className={style.dashedDivider}/>
                        <HoneyTable
                          tableLayout="fixed"
                          className={style.expandContentTable}
                          columns={expandColumns}
                          dataSource={positions}
                          pagination={false}
                          showHeader={false}
                          footer={ExpandedTableFooter}
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
                setHERC20ContractAddr(row.key)
                setWorkflow(LoanWorkFlowType.none)
                setExpandedRowKeys(expanded ? [row.key] : [])
              },
              expandedRowKeys,
              expandedRowRender: record => {
                return (
                  <>
                    <div>
                      <div
                        className={style.expandSection}
                      >
                        <div className={style.dashedDivider}/>
                        <HoneyTable
                          className={style.expandContentTable}
                          columns={expandColumnsMobile}
                          dataSource={positions}
                          pagination={false}
                          showHeader={false}
                          footer={ExpandedTableFooter}
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
              icon={<div className={style.docIcon}/>}
              title="You didn’t use any collections yet"
              description="Turn off the filter my collection and choose any collection to borrow money"
            />
          </div>
        ) : (
          <div className={style.emptyStateContainer}>
            <EmptyStateDetails
              icon={<div className={style.docIcon}/>}
              title="No collections to display"
              description="Turn off all filters and clear search inputs"
            />
          </div>
        ))}
      </HoneyContent>
      <HoneySider isMobileSidebarVisible={isSidebarVisibleInMobile}>
        {/* borrow repay module */}
        <MarketsSidebar
        />

      </HoneySider>

    </LayoutRedesign>
  );
};

export default Markets;
