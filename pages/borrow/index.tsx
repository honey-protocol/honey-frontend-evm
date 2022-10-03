import type { NextPage } from 'next';
import LayoutRedesign from '../../components/LayoutRedesign/LayoutRedesign';
import HoneyTable from '../../components/HoneyTable/HoneyTable';
import { ColumnType } from 'antd/lib/table';
import * as style from '../../styles/markets.css';
import useLoanFlowStore from "../../store/loanFlowStore";
import { MarketTableRow } from "../../types/markets";
import { ChangeEvent, useCallback, useState } from "react";
import _ from "lodash";


const Markets: NextPage = () => {
  const [tableData, setTableData] = useState<MarketTableRow[]>([]);
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
    }, 500),
    [])

  const handleSearchInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      debouncedSearch(value);
    },
    []
  );


  return (
    <LayoutRedesign>

    </LayoutRedesign>
  );
};

export default Markets;
