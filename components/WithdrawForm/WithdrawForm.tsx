import React, { FC, useState, useEffect, useContext } from 'react';
import Image from 'next/image';
import { InfoBlock } from '../InfoBlock/InfoBlock';
import { InputsBlock } from '../InputsBlock/InputsBlock';
import { HoneySlider } from '../HoneySlider/HoneySlider';
import * as styles from './WithdrawForm.css';
import { formatNumber } from '../../helpers/format';
import HoneyButton from 'components/HoneyButton/HoneyButton';
import HexaBoxContainer from '../HexaBoxContainer/HexaBoxContainer';
import SidebarScroll from '../SidebarScroll/SidebarScroll';
import { WithdrawFormProps } from './types';
import { questionIcon } from 'styles/icons.css';
import { hAlign } from 'styles/common.css';
import useToast from 'hooks/useToast';
import { LendWorkFlowType } from '../../types/workflows';
import useDisplayStore from '../../store/displayStore';
import { UserContext } from '../../contexts/userContext';
import { useMutation, useQueryClient } from 'react-query';
import useLendFlowStore from '../../store/lendFlowStore';
import { getContractsByHTokenAddr } from '../../helpers/generalHelper';
import {
	useGetTotalUnderlyingBalance,
	useGetUnderlyingPriceInUSD,
	useGetUserUnderlyingBalance
} from '../../hooks/useHtokenHelper';
import { useGetTotalBorrow } from '../../hooks/useHerc20';
import { withdrawUnderlyingHelper } from '../../helpers/repayHelper';
import { queryKeys } from '../../helpers/queryHelper';
import { useLend } from '../../hooks/useCollection';
import { collections } from '../../constants/NFTCollections';
import { fetchInterestRate } from '../../helpers/utils';

const {
	format: f,
	formatPercent: fp,
	formatERC20: fs,
	parse: p,
	formatShortName: fsn
} = formatNumber;

const WithdrawForm = (props: WithdrawFormProps) => {
	const {} = props;
	const setIsSidebarVisibleInMobile = useDisplayStore((state) => state.setIsSidebarVisibleInMobile);
	const { currentUser, setCurrentUser } = useContext(UserContext);
	const queryClient = useQueryClient();
	const walletPublicKey: string = currentUser?.address || '';
	const HERC20ContractAddress = useLendFlowStore((state) => state.HERC20ContractAddr);

	const {
		htokenHelperContractAddress,
		ERC20ContractAddress,
		name,
		icon,
		erc20Name,
		unit,
		formatDecimals
	} = getContractsByHTokenAddr(HERC20ContractAddress);
	const setWorkflow = useLendFlowStore((state) => state.setWorkflow);
	const [underlyingPrice, isLoadingUnderlyingPrice] = useGetUnderlyingPriceInUSD(
		htokenHelperContractAddress,
		HERC20ContractAddress
	);
	const [userUnderlyingBalance, isLoadingUserUnderlyingBalance] = useGetUserUnderlyingBalance(
		htokenHelperContractAddress,
		HERC20ContractAddress,
		currentUser,
		unit
	);
	const [totalUnderlyingBalance, isLoadingTotalUnderlyingBalance] = useGetTotalUnderlyingBalance(
		htokenHelperContractAddress,
		HERC20ContractAddress,
		unit
	);
	const [totalBorrow, isLoadingTotalBorrow] = useGetTotalBorrow(HERC20ContractAddress, unit);
	const [lendData, isLoadingLendData] = useLend(
		currentUser,
		collections,
		htokenHelperContractAddress
	);

	const [valueUSD, setValueUSD] = useState<number>(0);
	const [valueUnderlying, setValueUnderlying] = useState<number>(0);
	const [sliderValue, setSliderValue] = useState(0);
	const { toast: fetchToast, ToastComponent: FetchToastComponent } = useToast();
	const { toast: transactionToast, ToastComponent: TransactionToastComponent } = useToast();

	/* initial all financial value here */
	const userTotalDeposits = parseFloat(userUnderlyingBalance);
	const totalUnderlyingInMarket = parseFloat(totalUnderlyingBalance);
	const totalBorrowAmount = parseFloat(totalBorrow);
	const utilizationRate = (totalBorrowAmount / (totalUnderlyingInMarket + totalBorrowAmount)) * 100;
	/* end initial all  financial value here */

	useEffect(() => {
		if (
			isLoadingUnderlyingPrice ||
			isLoadingUserUnderlyingBalance ||
			isLoadingTotalUnderlyingBalance ||
			isLoadingTotalBorrow ||
			isLoadingLendData
		) {
			fetchToast.processing('Loading');
		} else {
			fetchToast.clear();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		isLoadingUnderlyingPrice,
		isLoadingUserUnderlyingBalance,
		isLoadingTotalUnderlyingBalance,
		isLoadingTotalBorrow,
		isLoadingLendData
	]);

	// Put your validators here
	const isWithdrawButtonDisabled = () => {
		if (userTotalDeposits === 0 || valueUnderlying > userTotalDeposits) return true;
		return false;
	};

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

	const withdraw = async () => {
		await withdrawUnderlyingHelper(
			HERC20ContractAddress,
			userTotalDeposits,
			sliderValue,
			unit,
			userUnderlyingBalance
		);
	};
	const withdrawMutation = useMutation(withdraw);

	const handleWithdraw = async () => {
		try {
			transactionToast.processing();
			await withdrawMutation.mutateAsync();
			console.log('Redeem Succeed');
			await queryClient.invalidateQueries(queryKeys.totalSupply(HERC20ContractAddress));
			await queryClient.invalidateQueries(
				queryKeys.userTotalSupply(walletPublicKey, HERC20ContractAddress)
			);
			await queryClient.invalidateQueries(
				queryKeys.userBalance(walletPublicKey, ERC20ContractAddress)
			);
			await queryClient.invalidateQueries(queryKeys.listUserUnderlying(walletPublicKey));
			await queryClient.invalidateQueries(queryKeys.lendData(HERC20ContractAddress));
			handleSliderChange(0);
			transactionToast.success('Successful! Transaction complete');
		} catch (err) {
			console.error(err);
			transactionToast.error('Sorry! Transaction failed');
		}
	};

	const onCancel = () => {
		setIsSidebarVisibleInMobile(false);
		setWorkflow(LendWorkFlowType.none);
		document.body.classList.remove('disable-scroll');
	};

	const ToastComponent = transactionToast.state ? TransactionToastComponent : FetchToastComponent;

	return (
		<SidebarScroll
			footer={
				fetchToast?.state || transactionToast.state ? (
					ToastComponent
				) : (
					<div className={styles.buttons}>
						<div className={styles.smallCol}>
							<HoneyButton variant="secondary" onClick={onCancel}>
								Cancel
							</HoneyButton>
						</div>
						<div className={styles.bigCol}>
							<HoneyButton
								variant="primary"
								disabled={isWithdrawButtonDisabled()}
								isFluid={true}
								onClick={handleWithdraw}
							>
								{userTotalDeposits === 0 || valueUnderlying > userTotalDeposits
									? 'Insufficient balance'
									: 'Withdraw'}
							</HoneyButton>
						</div>
					</div>
				)
			}
		>
			<div className={styles.withdrawForm}>
				<div className={styles.nftInfo}>
					<div className={styles.nftImage}>
						<HexaBoxContainer>
							<Image src={icon} alt={name} layout="fill" />
						</HexaBoxContainer>
					</div>
					<div className={styles.nftName}>{name}</div>
				</div>
				<div className={styles.row}>
					<div className={styles.col}>
						<InfoBlock
							value={fs(userTotalDeposits, formatDecimals)}
							valueSize="big"
							footer={<span>Your Deposits</span>}
						/>
					</div>
					<div className={styles.col}>
						<InfoBlock
							value={fp(fetchInterestRate(lendData, HERC20ContractAddress), 2)}
							valueSize="big"
							toolTipLabel="APY is measured by compounding the weekly interest rate"
							footer={
								<span className={hAlign}>
									Estimated APY <div className={questionIcon} />
								</span>
							}
						/>
					</div>
					<div className={styles.col}>
						<InfoBlock
							value={fp(utilizationRate, 2)}
							valueSize="big"
							toolTipLabel=" Amount of supplied liquidity currently being borrowed"
							footer={
								<span className={hAlign}>
									Utilization rate <div className={questionIcon} />
								</span>
							}
						/>
					</div>
				</div>

				<div className={styles.inputs}>
					<InputsBlock
						firstInputValue={p(f(valueUnderlying))}
						secondInputValue={p(f(valueUSD))}
						onChangeFirstInput={handleUnderlyingInputChange}
						onChangeSecondInput={handleUsdInputChange}
						maxValue={userTotalDeposits}
						firstInputAddon={erc20Name}
					/>
				</div>

				<HoneySlider
					currentValue={sliderValue}
					maxValue={userTotalDeposits}
					minAvailableValue={0}
					onChange={handleSliderChange}
				/>
			</div>
		</SidebarScroll>
	);
};

export default WithdrawForm;
