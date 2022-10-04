import type { NextPage } from 'next';
import LayoutRedesign from '../../components/LayoutRedesign/LayoutRedesign';
import HoneyTable from '../../components/HoneyTable/HoneyTable';
import { ColumnType } from 'antd/lib/table';
import * as style from '../../styles/markets.css';
import useLoanFlowStore from "../../store/loanFlowStore";
import { HoneyTableColumnType, MarketTableRow } from "../../types/markets";
import { ChangeEvent, useCallback, useMemo, useState } from "react";
import _ from "lodash";
import SearchInput from "../../components/SearchInput/SearchInput";
import Image from 'next/image';
import honeyEyes from '/public/nfts/honeyEyes.png';
import HoneyButton from "../../components/HoneyButton/HoneyButton";
import classNames from 'classnames';
import HexaBoxContainer from "../../components/HexaBoxContainer/HexaBoxContainer";
import { getColumnSortStatus } from "../../helpers/tableUtils";
import { ColumnTitleProps } from "antd/lib/table/interface";
import useWindowSize from "../../hooks/useWindowSize";
import { TABLET_BP } from "../../constants/breakpoints";
import { formatNumber } from "../../helpers/format";

const {formatPercent: fp, formatERC20: fs} = formatNumber
const Markets: NextPage = () => {
  const [tableData, setTableData] = useState<MarketTableRow[]>([]);
  const [isMyCollectionsFilterEnabled, setIsMyCollectionsFilterEnabled] = useState(false);
  const {width: windowWidth} = useWindowSize();
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
  /*    End filter function         */
  const MyCollectionsToggle = () => {
  }
  // <div className={style.toggle}>
  //   <HoneyToggle
  //     checked={isMyCollectionsFilterEnabled}
  //     onChange={handleToggle}
  //   />
  //   <span className={style.toggleText}>my collections</span>
  // </div>


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
          dataIndex: 'name',
          key: 'name',
          render: (name: string) => {
            return (
              <div className={style.nameCell}>
                <div className={style.logoWrapper}>
                  <div className={style.collectionLogo}>
                    <HexaBoxContainer>
                      <Image src={honeyEyes}/>
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


  return (
    <LayoutRedesign>
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
        />
      </div>

    </LayoutRedesign>
  );
};

export default Markets;
