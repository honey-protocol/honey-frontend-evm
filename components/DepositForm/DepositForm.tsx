import React, { FC, useState, useEffect, useContext } from 'react';
import Image from 'next/image';
import { InfoBlock } from '../InfoBlock/InfoBlock';
import { InputsBlock } from '../InputsBlock/InputsBlock';
import { HoneySlider } from '../HoneySlider/HoneySlider';
import * as styles from './DepositForm.css';
import { formatNumber } from '../../helpers/format';
import HoneyButton from 'components/HoneyButton/HoneyButton';
import HexaBoxContainer from '../HexaBoxContainer/HexaBoxContainer';
import SidebarScroll from '../SidebarScroll/SidebarScroll';
import { DepositFormProps } from './types';
import { questionIcon } from 'styles/icons.css';
import { hAlign } from 'styles/common.css';
import useToast from 'hooks/useToast';
import { getContractsByHTokenAddr } from '../../helpers/generalHelper';
import {
	useGetTotalUnderlyingBalance,
	useGetUnderlyingPriceInUSD,
	useGetUserUnderlyingBalance
} from '../../hooks/useHtokenHelper';
import useDisplayStore from '../../store/displayStore';
import { UserContext } from '../../contexts/userContext2';
import { useMutation, useQueryClient } from 'react-query';
import { LendWorkFlowType } from '../../types/workflows';
import useLendFlowStore from '../../store/lendFlowStore';
import {
	getUnlimitedApproval,
	useCheckUnlimitedApproval,
	useGetUserBalance
} from '../../hooks/useERC20';
import { depositUnderlying, useGetTotalBorrow } from '../../hooks/useHerc20';
import { queryKeys } from '../../helpers/queryHelper';

const {
	format: f,
	formatPercent: fp,
	formatERC20: fs,
	parse: p,
	formatShortName: fsn
} = formatNumber;

const DepositForm = (props: DepositFormProps) => {
	const {} = props;
	const setIsSidebarVisibleInMobile = useDisplayStore((state) => state.setIsSidebarVisibleInMobile);
	const { walletAddress } = useContext(UserContext);
	const queryClient = useQueryClient();
	const HERC20ContractAddress = useLendFlowStore((state) => state.HERC20ContractAddr);

	const {
		htokenHelperContractAddress,
		ERC20ContractAddress,
		erc20Name,
		erc20Icon,
		name,
		icon,
		unit
	} = getContractsByHTokenAddr(HERC20ContractAddress);
	const setWorkflow = useLendFlowStore((state) => state.setWorkflow);
	const [underlyingPrice, isLoadingUnderlyingPrice] = useGetUnderlyingPriceInUSD(
		htokenHelperContractAddress,
		HERC20ContractAddress
	);
	const [userBalance, isLoadingUserBalance] = useGetUserBalance(
		ERC20ContractAddress,
		walletAddress,
		unit
	);
	const [approval, isLoadingApproval] = useCheckUnlimitedApproval(
		ERC20ContractAddress,
		HERC20ContractAddress,
		walletAddress
	);
	const [userUnderlyingBalance, isLoadingUserUnderlyingBalance] = useGetUserUnderlyingBalance(
		htokenHelperContractAddress,
		HERC20ContractAddress,
		walletAddress,
		unit
	);
	const [totalUnderlyingBalance, isLoadingTotalUnderlyingBalance] = useGetTotalUnderlyingBalance(
		htokenHelperContractAddress,
		HERC20ContractAddress,
		unit
	);
	const [totalBorrow, isLoadingTotalBorrow] = useGetTotalBorrow(HERC20ContractAddress, unit);

	const [valueUSD, setValueUSD] = useState<number>(0);
	const [valueUnderlying, setValueUnderlying] = useState<number>(0);
	const [sliderValue, setSliderValue] = useState(0);

	/* initial all financial value here */
	const { toast, ToastComponent } = useToast();
	const [depositState, setDepositState] = useState('WAIT_FOR_APPROVAL');
	const totalUnderlyingInMarket = parseFloat(totalUnderlyingBalance);
	const totalBorrowAmount = parseFloat(totalBorrow);
	const userTotalDeposits = parseFloat(userUnderlyingBalance);
	const utilizationRate = (totalBorrowAmount / (totalUnderlyingInMarket + totalBorrowAmount)) * 100;
	const maxValue = parseFloat(userBalance);
	/* end initial all  financial value here */

	useEffect(() => {
		if (
			isLoadingUnderlyingPrice ||
			isLoadingUserBalance ||
			isLoadingUserUnderlyingBalance ||
			isLoadingTotalUnderlyingBalance ||
			isLoadingTotalBorrow ||
			isLoadingApproval
		) {
			toast.processing();
		} else {
			getDepositState();
			toast.clear();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		isLoadingUnderlyingPrice,
		isLoadingUserBalance,
		isLoadingUserUnderlyingBalance,
		isLoadingTotalUnderlyingBalance,
		isLoadingTotalBorrow,
		isLoadingApproval
	]);

	// Put your validators here
	const isDepositButtonDisabled = () => {
		return false;
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
		if (depositState == 'WAIT_FOR_APPROVAL') return 'Approve';
		else if (depositState == 'WAIT_FOR_DEPOSIT') return 'Deposit';
	};

	const getDepositState = () => {
		if (approval) {
			setDepositState('WAIT_FOR_DEPOSIT');
		} else {
			setDepositState('WAIT_FOR_APPROVAL');
		}
	};

	const getApprovalMutation = useMutation(getUnlimitedApproval);
	const depositUnderlyingMutation = useMutation(depositUnderlying);
	const onClick = async () => {
		try {
			toast.processing();
			if (depositState == 'WAIT_FOR_APPROVAL') {
				await getApprovalMutation.mutateAsync({
					ERC20ContractAddress,
					contractAddress: HERC20ContractAddress
				});
				console.log('Approval succeed');
				await queryClient.invalidateQueries(
					queryKeys.userApproval(walletAddress, ERC20ContractAddress, HERC20ContractAddress)
				);
			} else if (depositState == 'WAIT_FOR_DEPOSIT') {
				await depositUnderlyingMutation.mutateAsync({
					HERC20ContractAddress,
					amount: valueUnderlying.toFixed(18).toString(),
					unit
				});
				await queryClient.invalidateQueries(queryKeys.totalSupply(HERC20ContractAddress));
				await queryClient.invalidateQueries(
					queryKeys.userTotalSupply(walletAddress, HERC20ContractAddress)
				);
				await queryClient.invalidateQueries(
					queryKeys.userBalance(walletAddress, ERC20ContractAddress)
				);
				console.log('deposit succeed');
			}
			toast.success('Successful! Transaction complete');
		} catch (err) {
			console.error(err);
			toast.error('Sorry! Transaction failed');
		}
	};

	const onCancel = () => {
		setIsSidebarVisibleInMobile(false);
		setWorkflow(LendWorkFlowType.none);
		document.body.classList.remove('disable-scroll');
	};

	return (
		<SidebarScroll
			footer={
				toast?.state ? (
					<ToastComponent />
				) : (
					<div className={styles.buttons}>
						<div className={styles.smallCol}>
							<HoneyButton variant="secondary" onClick={() => onCancel()}>
								Cancel
							</HoneyButton>
						</div>
						<div className={styles.bigCol}>
							<HoneyButton
								variant="primary"
								disabled={isDepositButtonDisabled()}
								isFluid={true}
								onClick={onClick}
							>
								<>{buttonTitle()}</>
							</HoneyButton>
						</div>
					</div>
				)
			}
		>
			<div className={styles.depositForm}>
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
							value={fsn(userTotalDeposits)}
							valueSize="big"
							footer={<span>Your Deposits</span>}
						/>
					</div>
					<div className={styles.col}>
						<InfoBlock
							value={fp()}
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
							value={fp(utilizationRate)}
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
						firstInputValue={p(f(valueUSD))}
						secondInputValue={p(f(valueUnderlying))}
						onChangeFirstInput={handleUsdInputChange}
						onChangeSecondInput={handleUnderlyingInputChange}
						maxValue={maxValue}
						firstInputAddon={erc20Name}
					/>
				</div>

				<HoneySlider
					currentValue={sliderValue}
					maxValue={maxValue}
					minAvailableValue={0}
					onChange={handleSliderChange}
				/>
			</div>
		</SidebarScroll>
	);
};

export default DepositForm;
