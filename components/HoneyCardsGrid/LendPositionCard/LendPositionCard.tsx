import { FC } from 'react';
import { LendPositionCardProps } from '../types';
import * as styles from './LendPositionCard.css';
import HexaBoxContainer from '../../HexaBoxContainer/HexaBoxContainer';
import Image from 'next/image';
import { InfoBlock } from '../../InfoBlock/InfoBlock';
import { formatNumber, formatNFTName as fnn } from '../../../helpers/format';
import c from 'classnames';
import HoneyTooltip from '../../HoneyTooltip/HoneyTooltip';
import useLoanFlowStore from 'store/loanFlowStore';

const { formatUsd: fu, formatPercent: fp } = formatNumber;

export const LendPositionCard: FC<LendPositionCardProps> = ({
  position,
  onSelect
}) => {
  const selectedNFTId = useLoanFlowStore(state => state.NFTId);
  return (
    <div
      className={c(styles.positionCard, {
        [styles.activeCard]: selectedNFTId === position.id
      })}
      onClick={() => onSelect(position.id)}
    >
      <div className={styles.collectionIcon}>
        <HexaBoxContainer>
          <Image width={46} height={46} src={position.imageUrl} />
        </HexaBoxContainer>
      </div>
      <div className={styles.positionName}>
        <HoneyTooltip label={position.name}>{fnn(position.name)}</HoneyTooltip>
        <div className={styles.arrowIcon} />
      </div>
      <div className={styles.positionValues}>
        <InfoBlock
          title="IR"
          value={
            <span className={styles.irValue}>{fp(position.ir * 100)}</span>
          }
        />
        <InfoBlock title="Your Deposit" value={fu(position.deposit)} />
        <InfoBlock title="Value" value={fu(position.value)} />
        <InfoBlock title="Available" value={fu(position.available)} />
      </div>
    </div>
  );
};
