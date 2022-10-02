import type { NextPage } from 'next';
import LayoutRedesign from '../../components/LayoutRedesign/LayoutRedesign';
import HoneyTable from '../../components/HoneyTable/HoneyTable';
import { ColumnType } from 'antd/lib/table';
import * as style from '../../styles/markets.css';
import debounce from 'lodash';
import useLoanFlowStore from "../../store/loanFlowStore";


const network = 'devnet'; // change to dynamic value


const Markets: NextPage = () => {


  return (
    <LayoutRedesign>

    </LayoutRedesign>
  );
};

export default Markets;
