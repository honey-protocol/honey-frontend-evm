import React, { ChangeEvent, FC, useCallback, useMemo, useState } from 'react';
import * as styles from './HoneyCardsGrid.css';
import c from 'classnames';
import { HoneyCardGridProps } from './types';
import { BorrowPositionCard } from './BorrowPositionCard/BorrowPositionCard';
import { HoneyButtonTabs } from '../HoneyButtonTabs/HoneyButtonTabs';
import SearchInput from '../SearchInput/SearchInput';
import { LendPositionCard } from './LendPositionCard/LendPositionCard';
import { PositionType } from '../../types/dashboard';
import { LoanWorkFlowType } from 'types/workflows';
import useDisplayStore from 'store/displayStore';
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

	const setWorkflow = useLoanFlowStore((state) => state.setWorkflow);
	const setNFTId = useLoanFlowStore((state) => state.setNFTId);
	const setCouponId = useLoanFlowStore((state) => state.setCouponId);

	const setIsSidebarVisibleInMobile = useDisplayStore((state) => state.setIsSidebarVisibleInMobile);

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

	const initLendFlow = () => {};

	//mock position generate

	const borrowedPositions = borrowPositions.filter((position) => position.debt !== 0);
	const notBorrowedPositions = borrowPositions.filter((position) => position.debt === 0);

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
						? borrowedPositions.map((position, index) => {
								return (
									<BorrowPositionCard
										position={position}
										key={index}
										onSelect={() => initLoanOrBorrowFlow(position.tokenId, position.couponId)}
									/>
								);
						  })
						: lendPositions.map((position, index) => (
								<LendPositionCard position={position} key={index} onSelect={initLendFlow} />
						  ))}
				</div>
				{Boolean(notBorrowedPositions.length) && positionType === 'borrow' && (
					<>
						<div className={styles.cardsDivider}>
							<div className={styles.divider} />
							<span className={styles.dividerText}>Your not borrowed NFTs</span>
							<div className={styles.divider} />
						</div>
						<div className={styles.cardsGrid}>
							{notBorrowedPositions.map((position, index) => (
								<BorrowPositionCard position={position} key={index} onSelect={initDepositNFTFlow} />
							))}
						</div>
					</>
				)}
			</div>
		</div>
	);
};
