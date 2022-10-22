import type { NextPage } from 'next';
import LayoutRedesign from '../../components/LayoutRedesign/LayoutRedesign';
// import LendSidebar from '../../components/LendSidebar/LendSidebar';
import { LendTableRow } from '../../types/lend';
import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react';
import HoneyTable from '../../components/HoneyTable/HoneyTable';
import * as style from '../../styles/markets.css';
import c from 'classnames';
import { ColumnType } from 'antd/lib/table';
import HexaBoxContainer from '../../components/HexaBoxContainer/HexaBoxContainer';
import Image from 'next/image';
import honeyGenesisBee from '/public/images/imagePlaceholder.png';
import HoneyButton from '../../components/HoneyButton/HoneyButton';
import { Key } from 'antd/lib/table/interface';
import { formatNumber } from '../../helpers/format';
import SearchInput from '../../components/SearchInput/SearchInput';
import debounce from 'lodash/debounce';
import { getColumnSortStatus } from '../../helpers/tableUtils';
import { generateMockHistoryData } from '../../helpers/chartUtils';
import { HoneyChart } from '../../components/HoneyChart/HoneyChart';
import HoneySider from '../../components/HoneySider/HoneySider';
import HoneyContent from '../../components/HoneyContent/HoneyContent';

import HoneyToggle from 'components/HoneyToggle/HoneyToggle';

import { ToastProps } from 'hooks/useToast';
import { RoundHalfDown } from 'helpers/utils';
import { Typography } from 'antd';
import { pageDescription, pageTitle } from 'styles/common.css';
import HoneyTableNameCell from 'components/HoneyTable/HoneyTableNameCell/HoneyTableNameCell';
import HoneyTableRow from 'components/HoneyTable/HoneyTableRow/HoneyTableRow';



const { format: f, formatPercent: fp, formatERC20: fs } = formatNumber;

const Lend: NextPage = () => {
  const calculatedInterestRate = 0.1


  const [marketPositions, setMarketPositions] = useState(0);
  const [totalMarketDebt, setTotalMarketDebt] = useState(0);
  const [nftPrice, setNftPrice] = useState(0);


  const isMock = true;
  const [tableData, setTableData] = useState<LendTableRow[]>([]);
  const [tableDataFiltered, setTableDataFiltered] = useState<LendTableRow[]>(
    []
  );
  const [expandedRowKeys, setExpandedRowKeys] = useState<readonly Key[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMyCollectionsFilterEnabled, setIsMyCollectionsFilterEnabled] =
    useState(false);

  const [isMobileSidebarVisible, setShowMobileSidebar] = useState(false);

  const showMobileSidebar = () => {
    setShowMobileSidebar(true);
    document.body.classList.add('disable-scroll');
  };

  const hideMobileSidebar = () => {
    setShowMobileSidebar(false);
    document.body.classList.remove('disable-scroll');
  };

  const getPositionData = () => {
    if (isMock) {
      const from = new Date()
        .setFullYear(new Date().getFullYear() - 1)
        .valueOf();
      const to = new Date().valueOf();
      return generateMockHistoryData(from, to);
    }
    return [];
  };

  const onSearch = (searchTerm: string): LendTableRow[] => {
    if (!searchTerm) {
      return [...tableData];
    }
    const r = new RegExp(searchTerm, 'gmi');
    return [...tableData].filter(row => {
      return r.test(row.name);
    });
  };

  const debouncedSearch = useCallback(
    debounce(searchQuery => {
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
    [tableData]
  );

  // Apply search if initial lend list changed
  useEffect(() => {
    debouncedSearch(searchQuery);
  }, [tableData]);

  useEffect(() => {
    const mockData: LendTableRow[] = [
      {
        key: '0',
        name: 'Honey Genesis Bee',
        interest: 1,
        // validated available to be totalMarketDeposits
        available: 0,
        // validated value to be totalMarkDeposits + totalMarketDebt
        value: 0,
        stats: getPositionData()
      }
    ];
    setTableData(mockData);
    setTableDataFiltered(mockData);
  }, []);

  const handleRowClick = (
    event: React.MouseEvent<Element, MouseEvent>,
    record: LendTableRow
  ) => {
    // setSelectedMarketId(record.id);
    showMobileSidebar();
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
        dataIndex: 'name',
        key: 'name',
        render: (name: string) => {
          return (
            <div className={style.nameCell}>
              <div className={style.logoWrapper}>
                <div className={style.collectionLogo}>
                  <HexaBoxContainer>
                    <Image src={honeyGenesisBee} />
                  </HexaBoxContainer>
                </div>
              </div>
              <div className={style.collectionName}>{name}</div>
            </div>
          );
        }
      },
      {
        width: columnsWidth[1],
        title: ({ sortColumns }) => {
          const sortOrder = getColumnSortStatus(sortColumns, 'rate');
          return (
            <div
              className={
                style.headerCell[
                  sortOrder === 'disabled' ? 'disabled' : 'active'
                ]
              }
            >
              <span>Interest rate</span>{' '}
              <div className={style.sortIcon[sortOrder]} />
            </div>
          );
        },
        dataIndex: 'rate',
        sorter: (a, b) => a.interest - b.interest,
        render: (rate: number) => {
          return (
            <div className={c(style.rateCell, style.lendRate)}>
              {fp(calculatedInterestRate)}
            </div>
          );
        }
      },
      {
        width: columnsWidth[3],
        title: ({ sortColumns }) => {
          const sortOrder = getColumnSortStatus(sortColumns, 'value');
          return (
            <div
              className={
                style.headerCell[
                  sortOrder === 'disabled' ? 'disabled' : 'active'
                ]
              }
            >
              <span>Supplied</span>{' '}
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
            <div
              className={
                style.headerCell[
                  sortOrder === 'disabled' ? 'disabled' : 'active'
                ]
              }
            >
              <span>Available</span>{' '}
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
    [tableData, isMyCollectionsFilterEnabled, searchQuery]
  );

  const columnsMobile: ColumnType<LendTableRow>[] = useMemo(
    () => [
      {
        width: columnsWidth[0],
        dataIndex: 'name',
        key: 'name',
        render: (name: string, row: LendTableRow) => {
          return (
            <>
              <HoneyTableNameCell
                leftSide={
                  <>
                    <div className={style.logoWrapper}>
                      <div className={style.collectionLogo}>
                        <HexaBoxContainer>
                          <Image src={honeyGenesisBee} />
                        </HexaBoxContainer>
                      </div>
                    </div>
                    <div className={style.nameCellMobile}>
                      <div className={style.collectionName}>{name}</div>
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
    [isMyCollectionsFilterEnabled, tableData, searchQuery]
  );

  const lendSidebar = () => (
    <HoneySider isMobileSidebarVisible={isMobileSidebarVisible}>

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
              <a
                target="_blank"
                href="https://buy.moonpay.com"
                rel="noreferrer"
              >
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
                onClick: event => handleRowClick(event, record)
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
          <div
            className={c(
              style.mobileTableHeader,
              style.mobileSearchAndToggleContainer
            )}
          >
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
                onClick: event => handleRowClick(event, record)
              };
            }}
          />
        </div>
      </HoneyContent>
    </LayoutRedesign>
  );
};

export default Lend;
