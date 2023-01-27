import React, { ChangeEvent, FC, useCallback, useMemo, useState } from 'react';
import * as styles from './HoneyCardsGrid.css';
import c from 'classnames';
import { HoneyCardGridProps } from './types';
import { BorrowPositionCard } from './BorrowPositionCard/BorrowPositionCard';
import { HoneyButtonTabs } from '../HoneyButtonTabs/HoneyButtonTabs';
import SearchInput from '../SearchInput/SearchInput';
import { LendPositionCard } from './LendPositionCard/LendPositionCard';
import { PositionType } from '../../types/dashboard';
import { LendWorkFlowType, LoanWorkFlowType } from 'types/workflows';
import useDisplayStore from 'store/displayStore';
import useLendFlowStore from 'store/lendFlowStore';
import useLoanFlowStore from 'store/loanFlowStore';

export const HoneyCardsGrid: FC<HoneyCardGridProps> = ({
	borrowPositions,
	lendPositions,
	positionType,
	onChangePositionType
}) => {
	type PositionByValue = 'high_risk' | 'high_ir' | 'high_debt';
	const [positionByValue, setPositionByValue] = useState<PositionByValue>('high_risk');

	const [searchValue, setSearchValue] = useState<string | undefined>();

	const handleSearchInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setSearchValue(value);
	}, []);
	const { setWorkflow, setNFTId, setHERC20ContractAddr, setCouponId } = useLoanFlowStore(
		(state) => state
	);
	const { setWorkflow: setLendWorkflow, setHERC20ContractAddr: setLendHERC20ContractAddr } =
		useLendFlowStore((state) => state);
	const setIsSidebarVisibleInMobile = useDisplayStore((state) => state.setIsSidebarVisibleInMobile);

	const initLoanOrBorrowFlow = (HERC20ContractAddr: string, tokenId: string, couponId: string) => {
		setHERC20ContractAddr(HERC20ContractAddr);
		setNFTId(tokenId);
		setCouponId(couponId);
		setWorkflow(LoanWorkFlowType.loanOrBorrow);
		setIsSidebarVisibleInMobile(true);
		document.body.classList.add('disable-scroll');
	};

	const initLendFlow = (HERC20ContractAddr: string) => {
		setLendHERC20ContractAddr(HERC20ContractAddr);
		setLendWorkflow(LendWorkFlowType.lendOrWithdraw);
		setIsSidebarVisibleInMobile(true);
		document.body.classList.add('disable-scroll');
	};

	const borrowedPositions = borrowPositions.filter((position) => position.debt !== '0');
	const debtFreeBorrowedPositions = borrowPositions.filter((position) => position.debt === '0');

	return (
		<div className={styles.honeyCardsGrid}>
			<div className={c(styles.pageTitle, styles.hideMobile)}>My assets</div>
			<div className={styles.gridFilters}>
				<div className={styles.mobilePageTitle}>
					<div className={c(styles.pageTitle, styles.showMobile)}>My assets</div>

					<HoneyButtonTabs
						items={[
							{ name: 'Borrow', slug: 'borrow' },
							{ name: 'Lend', slug: 'lend' }
						]}
						activeItemSlug={positionType}
						onClick={(slug) => onChangePositionType(slug as PositionType)}
					/>
				</div>

				<div className={styles.searchInputWrapper}>
					<SearchInput
						value={searchValue}
						onChange={handleSearchInputChange}
						placeholder="Search by name"
					/>
				</div>

				<HoneyButtonTabs
					items={[
						{ name: 'High risk', slug: 'high_risk' },
						{ name: 'High IR', slug: 'high_ir' },
						{ name: 'High Debt', slug: 'high_debt' }
					]}
					isFullWidth
					activeItemSlug={positionByValue}
					onClick={(slug) => setPositionByValue(slug as PositionByValue)}
				/>
			</div>
			<div className={styles.gridContent}>
				<div className={styles.cardsGrid}>
					{positionType === 'borrow'
						? borrowedPositions.map((position) => {
								return (
									<BorrowPositionCard
										position={position}
										key={position.name}
										onSelect={initLoanOrBorrowFlow}
									/>
								);
						  })
						: lendPositions.map((position) => (
								<LendPositionCard position={position} key={position.id} onSelect={initLendFlow} />
						  ))}
				</div>
				{Boolean(debtFreeBorrowedPositions.length) && positionType === 'borrow' && (
					<>
						<div className={styles.cardsDivider}>
							<div className={styles.divider} />
							<span className={styles.dividerText}>Your not borrowed NFTs</span>
							<div className={styles.divider} />
						</div>
						<div className={styles.cardsGrid}>
							{debtFreeBorrowedPositions.map((position) => (
								<BorrowPositionCard
									position={position}
									key={position.name}
									onSelect={initLoanOrBorrowFlow}
								/>
							))}
						</div>
					</>
				)}
			</div>
		</div>
	);
};
