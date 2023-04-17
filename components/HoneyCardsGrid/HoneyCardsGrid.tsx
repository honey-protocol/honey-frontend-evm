import React, { ChangeEvent, FC, useCallback, useEffect, useMemo, useState } from 'react';
import * as styles from './HoneyCardsGrid.css';
import c from 'classnames';
import { BorrowUserPosition, HoneyCardGridProps, LendUserPosition } from './types';
import { BorrowPositionCard } from './BorrowPositionCard/BorrowPositionCard';
import { HoneyButtonTabs } from '../HoneyButtonTabs/HoneyButtonTabs';
import SearchInput from '../SearchInput/SearchInput';
import { LendPositionCard } from './LendPositionCard/LendPositionCard';
import { PositionType } from '../../types/dashboard';
import { LendWorkFlowType, LoanWorkFlowType } from 'types/workflows';
import useDisplayStore from 'store/displayStore';
import useLendFlowStore from 'store/lendFlowStore';
import useLoanFlowStore from 'store/loanFlowStore';
import _ from 'lodash';

type borrowPositionByValue = 'riskLvl' | 'debt';
type lendPositionByValue = 'rate' | 'deposit';
export const HoneyCardsGrid: FC<HoneyCardGridProps> = ({
	borrowPositions,
	lendPositions,
	positionType,
	onChangePositionType
}) => {
	const [borrowPositionByValue, setBorrowPositionByValue] =
		useState<borrowPositionByValue>('riskLvl');
	const [lendPositionByValue, setLendPositionByValue] = useState<lendPositionByValue>('rate');

	/*    Begin filter function       */
	const [searchValue, setSearchValue] = useState<string | undefined>();
	const [displayedBorrowPositions, setDisplayedBorrowPositions] = useState<BorrowUserPosition[]>(
		[]
	);
	const [displayedLendPositions, setDisplayedLendPositions] = useState<LendUserPosition[]>([]);

	const displayedData = useMemo(
		() => (positionType === 'borrow' ? borrowPositions : lendPositions),
		[positionType, borrowPositions, lendPositions]
	);

	const onSearch = (searchTerm: string): any[] => {
		if (!searchTerm) {
			return [...displayedData];
		}
		const r = new RegExp(searchTerm, 'gmi');
		return [...displayedData].filter((row) => {
			return r.test(row.name);
		});
	};

	const debouncedSearch = (criteria: string) => {
		setSearchValue(criteria);
		if (positionType == 'borrow') {
			setDisplayedBorrowPositions(onSearch(criteria));
		} else if (positionType === 'lend') {
			setDisplayedLendPositions(onSearch(criteria));
		}
	};

	const handleSearchInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		debouncedSearch(value);
	};

	useEffect(() => {
		setDisplayedBorrowPositions(borrowPositions);
		setDisplayedLendPositions(lendPositions); // eslint-disable-next-line react-hooks/exhaustive-deps
	}, [borrowPositions, lendPositions]);

	const sortBorrowPositions = (sortValue: borrowPositionByValue) => {
		setSearchValue(undefined);
		if (sortValue === 'riskLvl') {
			let sortedResult = borrowPositions.sort((a, b) => {
				return Number(b.debt) / b.value - Number(a.debt) / a.value;
			});
			console.log({ sortedResult }, '@www');
			setDisplayedBorrowPositions(sortedResult);
		} else {
			let sortedResult = borrowPositions.sort(
				(a, b) => Number(b[sortValue]) - Number(a[sortValue])
			);
			console.log({ sortedResult }, '@www');
			setDisplayedBorrowPositions(sortedResult);
		}
	};

	const sortLendPositions = (sortValue: lendPositionByValue) => {
		setSearchValue(undefined);
		let sortedResult = lendPositions.sort((a, b) => Number(b[sortValue]) - Number(a[sortValue]));
		console.log({ sortedResult }, '@www');
		setDisplayedLendPositions(sortedResult);
	};

	/*    End filter function  */

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

	const borrowedPositions = displayedBorrowPositions.filter((position) => position.debt !== '0');
	const debtFreeBorrowedPositions = displayedBorrowPositions.filter(
		(position) => position.debt === '0'
	);

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

				{positionType === 'borrow' ? (
					<HoneyButtonTabs
						items={[
							{ name: 'High risk', slug: 'riskLvl' },
							{ name: 'High Debt', slug: 'debt' }
						]}
						isFullWidth
						activeItemSlug={borrowPositionByValue}
						onClick={(slug) => {
							setBorrowPositionByValue(slug as borrowPositionByValue);
							sortBorrowPositions(slug as borrowPositionByValue);
						}}
					/>
				) : (
					<HoneyButtonTabs
						items={[
							{ name: 'High IR', slug: 'rate' },
							{ name: 'High deposit', slug: 'deposit' }
						]}
						isFullWidth
						activeItemSlug={lendPositionByValue}
						onClick={(slug) => {
							setLendPositionByValue(slug as lendPositionByValue);
							sortLendPositions(slug as lendPositionByValue);
						}}
					/>
				)}
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
						: displayedLendPositions.map((position) => (
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
