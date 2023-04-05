import React, { FC, useContext, useEffect, useState } from 'react';
import Image from 'next/image';
import { InfoBlock } from '../InfoBlock/InfoBlock';
import { InputsBlock } from '../InputsBlock/InputsBlock';
import { HoneySlider } from '../HoneySlider/HoneySlider';
import * as styles from './BorrowForm.css';
import { formatNumber } from '../../helpers/format';
import HoneyButton from 'components/HoneyButton/HoneyButton';
import HexaBoxContainer from 'components/HexaBoxContainer/HexaBoxContainer';
import { BorrowProps } from './types';
import SidebarScroll from '../SidebarScroll/SidebarScroll';
import imagePlaceholder from 'public/images/imagePlaceholder.png';
import * as stylesBorrow from '../BorrowForm/BorrowForm.css';
import { hAlign } from 'styles/common.css';
import { questionIcon } from 'styles/icons.css';
import useToast from 'hooks/useToast';
import cs from 'classnames';
import useDisplayStore from '../../store/displayStore';
import { UserContext } from '../../contexts/userContext';
import { useMutation, useQueryClient } from 'react-query';
import useLoanFlowStore from '../../store/loanFlowStore';
import { getContractsByHTokenAddr } from '../../helpers/generalHelper';
import { LoanWorkFlowType } from '../../types/workflows';
import { useGetCollateralFactor } from '../../hooks/useHivemind';
import { useGetMetaDataFromNFTId } from '../../hooks/useNFT';
import {
	useGetMarketBorrowFee,
	useGetMaxBorrowableAmount,
	useGetNFTPrice,
	useGetUnderlyingPriceInUSD
} from '../../hooks/useHtokenHelper';
import { useGetBorrowAmount } from '../../hooks/useCoupon';
import { borrow } from '../../hooks/useHerc20';
import { queryKeys } from '../../helpers/queryHelper';
import { usePositions } from '../../hooks/useCollection';
import { fetchAllowance } from 'helpers/utils';

const {
	format: f,
	formatPercent: fp,
	formatERC20: fs,
	parse: p,
	formatShortName: fsn
} = formatNumber;

const BorrowForm = (props: BorrowProps) => {
	const {} = props;

	const setIsSidebarVisibleInMobile = useDisplayStore((state) => state.setIsSidebarVisibleInMobile);
	const { currentUser } = useContext(UserContext);
	const queryClient = useQueryClient();
	const walletPublicKey: string = currentUser?.address || '';

	const {
		HERC20ContractAddr: HERC20ContractAddress,
		setWorkflow,
		NFTId,
		couponId
	} = useLoanFlowStore((state) => state);
	const {
		nftContractAddress,
		htokenHelperContractAddress,
		hivemindContractAddress,
		erc20Name,
		unit
	} = getContractsByHTokenAddr(HERC20ContractAddress);

	const [valueUSD, setValueUSD] = useState<number>(0);
	const [valueUnderlying, setValueUnderlying] = useState<number>(0);
	const [sliderValue, setSliderValue] = useState(0);
	const { toast: fetchToast, ToastComponent: FetchToastComponent } = useToast();
	const { toast: transactionToast, ToastComponent: TransactionToastComponent } = useToast();

	const [positions, isLoadingPositions] = usePositions(
		htokenHelperContractAddress,
		HERC20ContractAddress,
		nftContractAddress,
		hivemindContractAddress,
		currentUser,
		unit
	);
	const [collateralFactor, isLoadingCollateralFactor] = useGetCollateralFactor(
		hivemindContractAddress,
		HERC20ContractAddress,
		unit
	);
	const [nft, isLoadingNFT] = useGetMetaDataFromNFTId(nftContractAddress, NFTId);
	const [nftPrice, isLoadingNFTPrice] = useGetNFTPrice(
		htokenHelperContractAddress,
		HERC20ContractAddress
	);
	const [underlyingPrice, isLoadingUnderlyingPrice] = useGetUnderlyingPriceInUSD(
		htokenHelperContractAddress,
		HERC20ContractAddress
	);
	const [borrowAmount, isLoadingBorrowAmount] = useGetBorrowAmount(
		HERC20ContractAddress,
		NFTId,
		unit
	);

	const [maxBorrow, isLoadingMaxBorrow] = useGetMaxBorrowableAmount(
		htokenHelperContractAddress,
		HERC20ContractAddress,
		hivemindContractAddress
	);
	/* initial all financial value here */
	const nftValue = nftPrice.price;
	const borrowedValue = parseFloat(borrowAmount);
	const loanToValue = borrowedValue / nftValue;
	const userAllowance = fetchAllowance(positions, NFTId);
	//todo use data from blockchain
	const [borrowFee, isLoadingBorrowFee] = useGetMarketBorrowFee(
		htokenHelperContractAddress,
		HERC20ContractAddress,
		unit
	);
	const newAdditionalDebt = valueUnderlying * (1 + borrowFee);
	const newTotalDebt = newAdditionalDebt ? borrowedValue + newAdditionalDebt : borrowedValue;
	/* end initial all  financial value here */

	const isBorrowButtonDisabled = () => {
		if (!sliderValue || sliderValue < 0) return true;
		return userAllowance <= 0;
	};

	useEffect(() => {
		if (
			isLoadingNFT ||
			isLoadingCollateralFactor ||
			isLoadingNFTPrice ||
			isLoadingUnderlyingPrice ||
			isLoadingBorrowAmount ||
			isLoadingBorrowFee ||
			isLoadingPositions ||
			isLoadingMaxBorrow
		) {
			fetchToast.processing('Loading');
		} else {
			fetchToast.clear(0);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		isLoadingNFT,
		isLoadingCollateralFactor,
		isLoadingNFTPrice,
		isLoadingUnderlyingPrice,
		isLoadingBorrowAmount,
		isLoadingPositions,
		isLoadingMaxBorrow,
		isLoadingBorrowFee
	]);

	/*   Begin handle slider function  */
	const handleSliderChange = (value: number) => {
		if (userAllowance <= 0) return;
		setSliderValue(value);
		setValueUSD(value * underlyingPrice);
		setValueUnderlying(value);
	};

	const handleUsdInputChange = (usdValue: number | undefined) => {
		if (userAllowance <= 0) return;
		if (!usdValue) {
			setValueUSD(0);
			setValueUnderlying(0);
			setSliderValue(0);
			return;
		}
		setValueUSD(usdValue);
		setValueUnderlying(usdValue / underlyingPrice);
		setSliderValue(usdValue / underlyingPrice);
	};

	const handleUnderlyingInputChange = (UnderlyingValue: number | undefined) => {
		if (userAllowance <= 0) return;
		if (!UnderlyingValue) {
			setValueUSD(0);
			setValueUnderlying(0);
			setSliderValue(0);
			return;
		}

		setValueUSD(UnderlyingValue * underlyingPrice);
		setValueUnderlying(UnderlyingValue);
		setSliderValue(UnderlyingValue);
	};
	/*  end handle slider function   */
	/*  begin handling borrow function */
	const borrowMutation = useMutation(borrow);
	const doBorrow = async () => {
		try {
			transactionToast.processing();
			await borrowMutation.mutateAsync({
				HERC20ContractAddress,
				NFTTokenId: nft.tokenId,
				amount: valueUnderlying.toString(),
				unit
			});
			console.log('borrow succeed');
			await queryClient.invalidateQueries(queryKeys.couponData(HERC20ContractAddress, couponId));
			await queryClient.invalidateQueries(
				queryKeys.borrowAmount(HERC20ContractAddress, nft.tokenId)
			);
			await queryClient.invalidateQueries(queryKeys.listUserCollateral(walletPublicKey));
			transactionToast.success('Successful! Transaction complete');
			handleSliderChange(0);
		} catch (err: any) {
			console.error(err);
			transactionToast.error('Sorry! Transaction failed');
		}
	};
	/*  end handling borrow function */

	const liquidationPrice = borrowedValue / collateralFactor;
	const newLiquidationPrice = newTotalDebt / collateralFactor;
	const liqPercent = nftPrice ? ((nftValue - liquidationPrice) / nftValue) * 100 : 0;
	const newLiqPercent = nftPrice ? ((nftValue - newLiquidationPrice) / nftValue) * 100 : 0;

	const renderContent = () => {
		return (
			<>
				<div className={styles.nftInfo}>
					<div className={styles.nftImage}>
						<HexaBoxContainer>
							<Image src={nft.image ? nft.image : imagePlaceholder} alt={nft.name} layout="fill" />
						</HexaBoxContainer>
					</div>
					<div className={styles.nftName}>
						{nft.name} #{NFTId}
					</div>
				</div>
				<div className={styles.row}>
					<div className={styles.col}>
						<InfoBlock
							value={fsn(nftValue)}
							valueSize="big"
							title={
								<span className={hAlign}>
									Estimated value <div className={questionIcon} />
								</span>
							}
							toolTipLabel={
								<span>
									The worth of your collateral according to the market’s oracle. Learn more about
									this market’s{' '}
									<a
										className={styles.extLink}
										target="blank"
										href="https://switchboard.xyz/explorer"
									>
										Switchboard data-feed.
									</a>
								</span>
							}
						/>
					</div>

					<div className={styles.col}>
						<InfoBlock
							value={fs(userAllowance)}
							title={
								<span className={hAlign}>
									Allowance <div className={questionIcon} />
								</span>
							}
							toolTipLabel={`Allowance determines how much debt is available to a borrower. This market supports no more than ${fp(
								40
							)}`}
						/>
					</div>
				</div>

				<div className={styles.row}>
					<div className={styles.col}>
						<InfoBlock
							title={
								<span className={hAlign}>
									LTV %<div className={questionIcon} />
								</span>
							}
							toolTipLabel={
								<span>
									New{' '}
									<a
										className={styles.extLink}
										target="blank"
										href="https://docs.honey.finance/learn/defi-lending#loan-to-value-ratio"
									>
										Loan-to-value ratio{' '}
									</a>
									after the requested changes to the loan are approved.
								</span>
							}
							value={fp(((borrowedValue + newAdditionalDebt) / nftValue) * 100)}
							isDisabled={newTotalDebt > 0 ? false : true}
						/>
						<HoneySlider
							currentValue={sliderValue * 1.1}
							maxValue={nftValue}
							minAvailableValue={borrowedValue}
							maxSafePosition={0.3 - borrowedValue / 1000}
							dangerPosition={0.45 - borrowedValue / 1000}
							maxAvailablePosition={maxBorrow / nftValue}
							isReadonly
						/>
					</div>
				</div>

				<div className={styles.row}>
					<div className={styles.col}>
						<InfoBlock
							title={
								<span className={hAlign}>
									Debt + fees <div className={questionIcon} />
								</span>
							}
							toolTipLabel={
								<span>
									Estimated{' '}
									<a
										className={styles.extLink}
										target="blank"
										href="https://docs.honey.finance/learn/defi-lending#debt"
									>
										debt{' '}
									</a>
									after the requested changes to the loan are approved.
								</span>
							}
							value={fs(newTotalDebt < 0 ? 0 : newTotalDebt)}
							isDisabled={newTotalDebt > 0 ? false : true}
						/>
					</div>
					<div className={styles.col}>
						<InfoBlock
							title={
								<span className={hAlign}>
									Liquidation price <div className={questionIcon} />
								</span>
							}
							toolTipLabel={
								<span>
									Estimated{' '}
									<a
										className={styles.extLink}
										target="blank"
										href=" " //TODO: add link to docs
									>
										liquidation Price
									</a>{' '}
									after the requested changes to the loan are approved.
								</span>
							}
							value={`${fs(newLiquidationPrice)} ${
								borrowedValue ? `(-${newLiqPercent.toFixed(0)}%)` : ''
							}`}
							valueSize="normal"
							isDisabled={borrowedValue == 0}
						/>
					</div>
				</div>
				<div className={styles.row}></div>
				<div className={styles.inputs}>
					<div className={styles.row}>
						<div className={cs(stylesBorrow.balance, styles.col)}>
							<InfoBlock
								title={
									<span className={hAlign}>
										Interest Rate
										<div className={questionIcon} />
									</span>
								}
								toolTipLabel={
									<span>
										Variable interest rate, based on Utilization rate.{' '}
										<a
											className={styles.extLink}
											target="blank"
											href=" " //TODO: add link to docs
										>
											Learn more.
										</a>
									</span>
								}
								value={fp(5)}
							/>
						</div>
						<div className={cs(stylesBorrow.balance, styles.col)}>
							<InfoBlock
								title={
									<span className={hAlign}>
										Borrow Fee <div className={questionIcon} />
									</span>
								}
								value={fs(valueUnderlying * borrowFee)}
								//TODO: add link to docs
								toolTipLabel={
									<span>
										Borrow Fee is a{' '}
										<a className={styles.extLink} target="blank" href=" ">
											protocol fee{' '}
										</a>
										that is charged upon borrowing. For now it is set at 2,00%.
									</span>
								}
							/>
						</div>
					</div>
					<InputsBlock
						firstInputValue={p(f(valueUnderlying))}
						secondInputValue={p(f(valueUSD))}
						onChangeFirstInput={handleUnderlyingInputChange}
						onChangeSecondInput={handleUsdInputChange}
						maxValue={userAllowance}
						firstInputAddon={erc20Name}
					/>
				</div>

				<HoneySlider
					currentValue={sliderValue}
					maxValue={nftValue}
					minAvailableValue={borrowedValue}
					maxSafePosition={0.3 - borrowedValue / 1000}
					dangerPosition={0.45 - borrowedValue / 1000}
					maxAvailablePosition={maxBorrow / nftValue}
					onChange={handleSliderChange}
				/>
			</>
		);
	};

	const handleCancel = () => {
		setIsSidebarVisibleInMobile(false);
		setWorkflow(LoanWorkFlowType.none);
		document.body.classList.remove('disable-scroll');
	};

	const ToastComponent = transactionToast.state ? TransactionToastComponent : FetchToastComponent;

	const renderFooter = () => {
		return fetchToast?.state || transactionToast.state ? (
			ToastComponent
		) : (
			<div className={styles.buttons}>
				<div className={styles.smallCol}>
					<HoneyButton variant="secondary" onClick={handleCancel}>
						Cancel
					</HoneyButton>
				</div>
				<div className={styles.bigCol}>
					<HoneyButton
						variant="primary"
						disabled={isBorrowButtonDisabled()}
						isFluid
						onClick={doBorrow}
					>
						Borrow
					</HoneyButton>
				</div>
			</div>
		);
	};

	return (
		<SidebarScroll footer={renderFooter()}>
			<div className={styles.borrowForm}>{renderContent()}</div>
		</SidebarScroll>
	);
};

export default BorrowForm;
