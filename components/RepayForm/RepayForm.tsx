import React, { FC, useContext, useEffect, useState } from 'react';
import Image from 'next/image';
import { InfoBlock } from '../InfoBlock/InfoBlock';
import { InputsBlock } from '../InputsBlock/InputsBlock';
import { HoneySlider } from '../HoneySlider/HoneySlider';
import * as styles from './RepayForm.css';
import { formatNumber } from '../../helpers/format';
import HoneyButton from 'components/HoneyButton/HoneyButton';
import HexaBoxContainer from '../HexaBoxContainer/HexaBoxContainer';
import { RepayProps } from './types';
import SidebarScroll from '../SidebarScroll/SidebarScroll';
import { hAlign } from 'styles/common.css';
import { questionIcon } from 'styles/icons.css';
import cs from 'classnames';
import useToast from 'hooks/useToast';
import { LoanWorkFlowType } from '../../types/workflows';
import useDisplayStore from '../../store/displayStore';
import { UserContext } from '../../contexts/userContext';
import { useMutation, useQueryClient } from 'react-query';
import useLoanFlowStore from '../../store/loanFlowStore';
import { getContractsByHTokenAddr } from '../../helpers/generalHelper';
import { useGetMetaDataFromNFTId } from '../../hooks/useNFT';
import { useGetNFTPrice, useGetUnderlyingPriceInUSD } from '../../hooks/useHtokenHelper';
import { useGetBorrowAmount } from '../../hooks/useCoupon';
import { useGetCollateralFactor, useGetMaxBorrowAmountFromNFT } from '../../hooks/useHivemind';
import {
	getUnlimitedApproval,
	useCheckUnlimitedApproval,
	useGetUserBalance
} from '../../hooks/useERC20';
import { withdrawCollateral } from '../../hooks/useHerc20';
import { queryKeys } from '../../helpers/queryHelper';
import { repayBorrowHelper } from '../../helpers/repayHelper';
import { usePositions } from '../../hooks/useCollection';
import { fetchAllowance } from '../../helpers/utils';

const {
	format: f,
	formatPercent: fp,
	formatERC20: fs,
	parse: p,
	formatShortName: fsn
} = formatNumber;

const RepayForm = (props: RepayProps) => {
	const {} = props;
	const setIsSidebarVisibleInMobile = useDisplayStore((state) => state.setIsSidebarVisibleInMobile);
	const { currentUser, setCurrentUser } = useContext(UserContext);
	const queryClient = useQueryClient();
	const walletPublicKey: string = currentUser?.get('ethAddress') || '';
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
		ERC20ContractAddress,
		erc20Name,
		unit
	} = getContractsByHTokenAddr(HERC20ContractAddress);
	const [nft, isLoadingNFT] = useGetMetaDataFromNFTId(nftContractAddress, NFTId);
	const [collateralFactor, isLoadingCollateralFactor] = useGetCollateralFactor(
		hivemindContractAddress,
		HERC20ContractAddress,
		unit
	);
	const [nftPrice, isLoadingNFTPrice] = useGetNFTPrice(
		htokenHelperContractAddress,
		HERC20ContractAddress
	);
	const [borrowAmount, isLoadingBorrowAmount] = useGetBorrowAmount(
		HERC20ContractAddress,
		NFTId,
		unit
	);
	const [positions, isLoadingPositions] = usePositions(
		htokenHelperContractAddress,
		HERC20ContractAddress,
		nftContractAddress,
		hivemindContractAddress,
		currentUser,
		unit
	);
	const [underlyingPrice, isLoadingUnderlyingPrice] = useGetUnderlyingPriceInUSD(
		htokenHelperContractAddress,
		HERC20ContractAddress
	);
	const [userBalance, isLoadingUserBalance] = useGetUserBalance(
		ERC20ContractAddress,
		currentUser,
		unit
	);
	const [approval, isLoadingApproval] = useCheckUnlimitedApproval(
		ERC20ContractAddress,
		HERC20ContractAddress,
		currentUser
	);

	const [valueUSD, setValueUSD] = useState<number>();
	const [valueUnderlying, setValueUnderlying] = useState<number>();
	const [sliderValue, setSliderValue] = useState(0);
	const { toast, ToastComponent } = useToast();
	const [repayState, setRepayState] = useState('WAIT_FOR_APPROVAL');

	/* initial all financial value here */
	const nftValue = nftPrice.price;
	const userDebt = parseFloat(borrowAmount);
	const userAllowance = fetchAllowance(positions, NFTId);
	const loanToValue = userDebt / nftValue;
	const maxValue = userDebt != 0 ? userDebt : userAllowance;
	const underlyingBalance = parseFloat(userBalance);
	const newDebt = userDebt - (valueUnderlying ? valueUnderlying : 0);
	/* end initial all  financial value here */

	useEffect(() => {
		if (
			isLoadingNFT ||
			isLoadingNFTPrice ||
			isLoadingBorrowAmount ||
			isLoadingUnderlyingPrice ||
			isLoadingCollateralFactor ||
			isLoadingPositions ||
			isLoadingUserBalance ||
			isLoadingApproval
		) {
			toast.processing('Loading');
		} else {
			getRepayState();
			toast.clear();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		isLoadingNFT,
		isLoadingNFTPrice,
		isLoadingBorrowAmount,
		isLoadingUnderlyingPrice,
		isLoadingCollateralFactor,
		isLoadingPositions,
		isLoadingUserBalance,
		isLoadingApproval,
		nft
	]);

	// Put your validators here
	const isRepayButtonDisabled = () => {
		return repayState == 'DONE';
	};

	/*   Begin handle slider function  */
	const handleSliderChange = (value: number) => {
		setSliderValue(value);
		setValueUSD(value * underlyingPrice);
		setValueUnderlying(value);
	};

	const handleUsdInputChange = (usdValue: number | undefined) => {
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

	const handleUnderlyingInputChange = (underlyingValue: number | undefined) => {
		if (!underlyingValue) {
			setValueUSD(0);
			setValueUnderlying(0);
			setSliderValue(0);
			return;
		}

		setValueUSD(underlyingValue * underlyingPrice);
		setValueUnderlying(underlyingValue);
		setSliderValue(underlyingValue);
	};
	/*  end handle slider function   */

	/*  begin handling borrow function */
	const buttonTitle = () => {
		if (repayState == 'WAIT_FOR_APPROVAL') return 'Approve';
		else if (repayState == 'WAIT_FOR_REPAY') return 'Repay';
		else if (repayState == 'WAIT_FOR_WITHDRAW') return 'Claim NFT';
		else return 'Withdraw finished';
	};

	const getRepayState = () => {
		if (repayState == 'DONE') {
			return;
		} else if (borrowAmount == '0') {
			setRepayState('WAIT_FOR_WITHDRAW');
		} else if (approval) {
			setRepayState('WAIT_FOR_REPAY');
		} else {
			setRepayState('WAIT_FOR_APPROVAL');
		}
	};

	const repayLoan = async () => {
		await repayBorrowHelper(
			HERC20ContractAddress,
			nft.tokenId,
			userDebt,
			sliderValue,
			unit,
			borrowAmount
		);
	};

	const repayLoanMutation = useMutation(repayLoan);
	const withdrawMutation = useMutation(withdrawCollateral);
	const getApprovalMutation = useMutation(getUnlimitedApproval);
	const onClick = async () => {
		try {
			toast.processing();
			if (repayState == 'WAIT_FOR_WITHDRAW') {
				await withdrawMutation.mutateAsync({ HERC20ContractAddress, NFTTokenId: nft.tokenId });
				console.log('withdraw succeed');
				setRepayState('DONE');
				await queryClient.invalidateQueries(
					queryKeys.listUserCoupons(HERC20ContractAddress, walletPublicKey)
				);
				await queryClient.invalidateQueries(
					queryKeys.listUserNFTs(walletPublicKey, nftContractAddress)
				);
			} else if (repayState == 'WAIT_FOR_APPROVAL') {
				await getApprovalMutation.mutateAsync({
					ERC20ContractAddress,
					contractAddress: HERC20ContractAddress
				});
				console.log('Approval succeed');
				await queryClient.invalidateQueries(
					queryKeys.userApproval(walletPublicKey, ERC20ContractAddress, HERC20ContractAddress)
				);
			} else if (repayState == 'WAIT_FOR_REPAY') {
				await repayLoanMutation.mutateAsync();
				console.log('Repay Succeed');
				await queryClient.invalidateQueries(queryKeys.couponData(HERC20ContractAddress, couponId));
				await queryClient.invalidateQueries(
					queryKeys.borrowAmount(HERC20ContractAddress, nft.tokenId)
				);
				await queryClient.invalidateQueries(
					queryKeys.userBalance(walletPublicKey, ERC20ContractAddress)
				);
				await queryClient.invalidateQueries(queryKeys.listUserCollateral(walletPublicKey));
				handleSliderChange(0);
			}
			toast.success('Successful! Transaction complete');
		} catch (err) {
			console.error(err);
			toast.error('Sorry! Transaction failed');
		}
	};
	/*  end handling borrow function */

	const handleCancel = () => {
		setIsSidebarVisibleInMobile(false);
		setWorkflow(LoanWorkFlowType.none);
		document.body.classList.remove('disable-scroll');
	};

	const liquidationPrice = userDebt / collateralFactor;
	const newLiquidationPrice = newDebt / collateralFactor;
	const liqPercent = nftPrice ? ((nftValue - liquidationPrice) / nftValue) * 100 : 0;
	const newLiqPercent = nftPrice ? ((nftValue - newLiquidationPrice) / nftValue) * 100 : 0;

	const renderContent = () => {
		return (
			<>
				<div className={styles.nftInfo}>
					<div className={styles.nftImage}>
						<HexaBoxContainer>
							<Image src={nft.image} alt={nft.name} layout="fill" />
						</HexaBoxContainer>
					</div>
					<div className={styles.nftName}>
						{nft.name} #{NFTId}
					</div>
				</div>
				<div className={styles.row}>
					<div className={styles.col}>
						<InfoBlock
							value={fs(nftValue)}
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
							value={fsn(userAllowance)}
							title={
								<span className={hAlign}>
									Allowance <div className={questionIcon} />
								</span>
							}
							toolTipLabel={`Allowance determines how much debt is available to a borrower. This market supports no more than ${fp(
								60
							)}`}
						/>
					</div>
				</div>

				<div className={styles.row}>
					<div className={styles.col}>
						<InfoBlock
							value={fp(loanToValue * 100)}
							toolTipLabel={
								<span>
									Risk level is measured using the{' '}
									<a
										className={styles.extLink}
										target="blank"
										href="https://docs.honey.finance/learn/defi-lending#loan-to-value-ratio"
									>
										loan-to-value ratio
									</a>
									, and determines how close a position is to being liquidated.
								</span>
							}
							title={
								<span className={hAlign}>
									Risk level <div className={questionIcon} />
								</span>
							}
						/>

						<HoneySlider
							currentValue={0}
							maxValue={nftValue}
							minAvailableValue={userDebt}
							maxSafePosition={0.3 - userDebt / 1000}
							dangerPosition={0.45 - userDebt / 1000}
							maxAvailablePosition={collateralFactor}
							isReadonly
						/>
					</div>
					<div className={styles.col}>
						<InfoBlock
							title={
								<span className={hAlign}>
									New risk level
									<div className={questionIcon} />
								</span>
							}
							value={fp((newDebt / nftValue) * 100)}
							isDisabled={true}
							toolTipLabel={
								<span>
									Estimated{' '}
									<a
										className={styles.extLink}
										target="blank"
										href=" https://docs.honey.finance/lending-protocol/borrowing#risk-level"
									>
										risk level{' '}
									</a>
									after the requested changes to the loan are approved.
								</span>
							}
						/>

						<HoneySlider
							currentValue={0}
							maxValue={nftValue}
							minAvailableValue={newDebt}
							maxSafePosition={0.3 - userDebt / 1000}
							dangerPosition={0.45 - userDebt / 1000}
							maxAvailablePosition={collateralFactor}
							isReadonly
						/>
					</div>
				</div>

				<div className={styles.row}>
					<div className={styles.col}>
						<InfoBlock
							title={
								<span className={hAlign}>
									Debt
									<div className={questionIcon} />
								</span>
							}
							value={fs(userDebt)}
							toolTipLabel={
								<span>
									Value borrowed from the lending pool, upon which interest accrues.{' '}
									<a
										className={styles.extLink}
										target="blank"
										href="https://docs.honey.finance/learn/defi-lending#debt"
									>
										Learn more.
									</a>
								</span>
							}
						/>
					</div>
					<div className={styles.col}>
						<InfoBlock
							title={
								<span className={hAlign}>
									New debt
									<div className={questionIcon} />
								</span>
							}
							value={fs(newDebt < 0 ? 0 : newDebt)}
							isDisabled={true}
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
						/>
					</div>
				</div>

				<div className={styles.row}>
					<div className={styles.col}>
						<InfoBlock
							value={`${fs(liquidationPrice)} ${userDebt ? `(-${liqPercent.toFixed(0)}%)` : ''}`}
							valueSize="normal"
							title={
								<span className={hAlign}>
									Liquidation price
									<div className={questionIcon} />
								</span>
							}
							toolTipLabel={
								<span>
									Price at which the position (NFT) will be liquidated.{' '}
									<a
										className={styles.extLink}
										target="blank"
										href=" " //TODO: add link to docs
									>
										Learn more.
									</a>
								</span>
							}
						/>
					</div>
					<div className={styles.col}>
						<InfoBlock
							title={
								<span className={hAlign}>
									New Liquidation price <div className={questionIcon} />
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
								newDebt ? `(-${newLiqPercent.toFixed(0)}%)` : ''
							}`}
							valueSize="normal"
							isDisabled={newDebt == 0}
						/>
					</div>
				</div>

				<div className={styles.inputs}>
					<div className={styles.row}>
						<div className={cs(styles.balance, styles.col)}>
							<InfoBlock title={'Your underlying balance'} value={fs(underlyingBalance)} />
						</div>
						<div className={cs(styles.balance, styles.col)}>
							<InfoBlock
								isDisabled
								title={'NEW Underlying balance'}
								value={fs(underlyingBalance - (valueUnderlying || 0))}
							/>
						</div>
					</div>
					<InputsBlock
						firstInputValue={p(f(valueUSD))}
						secondInputValue={p(f(valueUnderlying))}
						onChangeFirstInput={handleUsdInputChange}
						onChangeSecondInput={handleUnderlyingInputChange}
						firstInputAddon={erc20Name}
					/>
				</div>

				<HoneySlider
					currentValue={sliderValue}
					maxValue={maxValue}
					minAvailableValue={0}
					onChange={handleSliderChange}
				/>
			</>
		);
	};

	const renderFooter = () => {
		return toast?.state ? (
			<ToastComponent />
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
						disabled={isRepayButtonDisabled()}
						isFluid={true}
						onClick={onClick}
					>
						<>{buttonTitle()}</>
					</HoneyButton>
				</div>
			</div>
		);
	};

	return (
		<SidebarScroll footer={renderFooter()}>
			<div className={styles.repayForm}>{renderContent()}</div>
		</SidebarScroll>
	);
};

export default RepayForm;
