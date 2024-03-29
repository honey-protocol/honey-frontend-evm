import { FC, useContext, useEffect, useState } from 'react';
import Image from 'next/image';
import { InfoBlock } from '../InfoBlock/InfoBlock';
import { InputsBlock } from '../InputsBlock/InputsBlock';
import { HoneySlider } from '../HoneySlider/HoneySlider';
import * as styles from './BidCollateralForm.css';
import { formatNumber } from '../../helpers/format';
import HoneyButton from 'components/HoneyButton/HoneyButton';
import HexaBoxContainer from '../HexaBoxContainer/HexaBoxContainer';
import HoneyWarning from '../HoneyWarning/HoneyWarning';
import CurrentBid from '../CurrentBid/CurrentBid';
import SidebarScroll from '../SidebarScroll/SidebarScroll';
import { BidCollateralFormProps } from './types';
import { hAlign } from 'styles/common.css';
import { questionIcon } from 'styles/icons.css';
import useToast from 'hooks/useToast';
import useDisplayStore from 'store/displayStore';
import { UserContext } from '../../contexts/userContext';
import { useMutation, useQueryClient } from 'react-query';
import useLiquidationFlowStore from '../../store/liquidationFlowStore';
import { getContractsByHTokenAddr } from '../../helpers/generalHelper';
import { LiquidationWorkFlowType } from '../../types/workflows';
import { useGetUnderlyingPriceInUSD } from '../../hooks/useHtokenHelper';
import { getUnlimitedApproval, useCheckApproval, useGetUserBalance } from '../../hooks/useERC20';
import {
	bidCollateral,
	cancelCollateralBid,
	increaseCollateralBid,
	useGetAvailableRefund,
	useGetCollateralBids,
	useGetCollateralMinimumBid,
	withdrawRefund
} from '../../hooks/useMarketPlace';
import { queryKeys } from '../../helpers/queryHelper';
import {
	getIncreaseAmount,
	getMinimumBid,
	hasBid,
	hasRefund,
	isHighestBid,
	userBid,
	userRefund,
	weiToDecimal
} from '../../helpers/liquidationHelper';
import { fromWei } from 'web3-utils';

const {
	format: f,
	formatPercent: fp,
	formatUsd: fu,
	formatERC20: fs,
	parse: p,
	formatRoundDown: frd
} = formatNumber;

const BidCollateralForm = (props: BidCollateralFormProps) => {
	const {} = props;
	const setIsSidebarVisibleInMobile = useDisplayStore((state) => state.setIsSidebarVisibleInMobile);
	const { currentUser } = useContext(UserContext);
	const queryClient = useQueryClient();
	const walletPublicKey: string = currentUser?.address || '';
	const HERC20ContractAddress = useLiquidationFlowStore((state) => state.HERC20ContractAddr);
	const NFTId = useLiquidationFlowStore((state) => state.NFTId);

	const {
		marketContractAddress,
		htokenHelperContractAddress,
		ERC20ContractAddress,
		name,
		icon,
		erc20Name,
		unit,
		formatDecimals
	} = getContractsByHTokenAddr(HERC20ContractAddress);
	const setWorkflow = useLiquidationFlowStore((state) => state.setWorkflow);
	const [underlyingPrice, isLoadingUnderlyingPrice] = useGetUnderlyingPriceInUSD(
		htokenHelperContractAddress,
		HERC20ContractAddress
	);
	const [userBalance, isLoadingUserBalance] = useGetUserBalance(
		ERC20ContractAddress,
		currentUser,
		unit
	);
	const [bidInfo, isLoadingBidInfo] = useGetCollateralBids(
		marketContractAddress,
		HERC20ContractAddress,
		NFTId
	);
	const [minimumBid, isLoadingMinimumBid] = useGetCollateralMinimumBid(
		marketContractAddress,
		HERC20ContractAddress,
		NFTId
	);
	const [availableRefund, isLoadingAvailableRefund] = useGetAvailableRefund(
		marketContractAddress,
		ERC20ContractAddress,
		walletPublicKey
	);

	const [valueUSD, setValueUSD] = useState<number>(0);
	const [valueUnderlying, setValueUnderlying] = useState<number>(0);
	const [sliderValue, setSliderValue] = useState(0);
	const { toast: fetchToast, ToastComponent: FetchToastComponent } = useToast();
	const { toast: transactionToast, ToastComponent: TransactionToastComponent } = useToast();
	const [bidState, setBidState] = useState('WAIT_FOR_APPROVAL');
	const [isButtonDisable, setIsButtonDisable] = useState(true);
	const minBid = getMinimumBid(minimumBid, userBid(walletPublicKey, bidInfo, unit).value, unit);

	const [approval, isLoadingApproval] = useCheckApproval(
		ERC20ContractAddress,
		marketContractAddress,
		currentUser,
		valueUnderlying,
		unit
	);
	useEffect(() => {
		if (
			isLoadingUnderlyingPrice ||
			isLoadingUserBalance ||
			isLoadingApproval ||
			isLoadingBidInfo ||
			isLoadingMinimumBid ||
			isLoadingAvailableRefund
		) {
			fetchToast.processing('Fetching bid details');
			setIsButtonDisable(true);
		} else {
			getBidState();
			fetchToast.clear(0);
			setIsButtonDisable(false);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		isLoadingUnderlyingPrice,
		isLoadingUserBalance,
		isLoadingApproval,
		isLoadingBidInfo,
		isLoadingMinimumBid,
		isLoadingAvailableRefund,
		HERC20ContractAddress,
		NFTId,
		approval
	]);

	// Put your validators here
	const isSubmitButtonDisabled = () => {
		if (bidState == 'WAIT_FOR_BID') return p(f(valueUnderlying)) < minBid;
		else if (bidState == 'WAIT_FOR_INCREASE_BID')
			return p(f(valueUnderlying)) + userBid(walletPublicKey, bidInfo, unit).value < minBid;
		else return false;
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

	/*  begin handling bid text and text */
	const buttonTitle = () => {
		if (bidState == 'WAIT_FOR_APPROVAL') return 'Approve';
		else if (bidState == 'WAIT_FOR_INCREASE_BID') return 'Increase Bid';
		else return 'Place Bid';
	};

	const getBidState = () => {
		if (!approval) {
			setBidState('WAIT_FOR_APPROVAL');
		} else if (hasBid(walletPublicKey, bidInfo)) {
			setBidState('WAIT_FOR_INCREASE_BID');
		} else {
			setBidState('WAIT_FOR_BID');
		}
	};

	const getApprovalMutation = useMutation(getUnlimitedApproval);
	const cancelBidMutation = useMutation(cancelCollateralBid);
	const withdrawRefundMutation = useMutation(withdrawRefund);
	const bidMutation = useMutation(bidCollateral);
	const increaseBidMutation = useMutation(increaseCollateralBid);
	/*  end handling bid text and state */

	/* Begin handling refund or cancel bid function */
	const handleCurrentBid = async () => {
		try {
			transactionToast.processing();
			setIsButtonDisable(true);
			if (hasRefund(availableRefund)) {
				await withdrawRefundMutation.mutateAsync({ marketContractAddress, ERC20ContractAddress });
				console.log('Withdraw bid succeed');
				await queryClient.invalidateQueries(
					queryKeys.userBalance(walletPublicKey, ERC20ContractAddress)
				);
				await queryClient.invalidateQueries(
					queryKeys.userRefund(walletPublicKey, ERC20ContractAddress)
				);
			} else {
				await cancelBidMutation.mutateAsync({
					marketContractAddress,
					HERC20ContractAddress,
					NFTTokenId: NFTId
				});
				console.log('Cancel bid succeed');
				await queryClient.invalidateQueries(
					queryKeys.listCollateralBids(marketContractAddress, HERC20ContractAddress, NFTId)
				);
				await queryClient.invalidateQueries(
					queryKeys.userRefund(walletPublicKey, ERC20ContractAddress)
				);
			}
			transactionToast.success('Successful! Transaction complete');
		} catch (err) {
			console.error(err);
			transactionToast.error('Sorry! Transaction failed');
		} finally {
			setIsButtonDisable(false);
		}
	};

	const currentBidTile = () => {
		if (hasRefund(availableRefund)) {
			return 'you have refund' as string;
		} else if (isHighestBid(walletPublicKey, bidInfo)) {
			return 'Your bid is #1' as string;
		} else {
			return 'Your bid is:' as string;
		}
	};

	const currentBid = () => {
		if (hasRefund(availableRefund)) {
			const refund = userRefund(availableRefund, unit);
			return { value: refund, unlockTime: 0 };
		} else {
			return userBid(walletPublicKey, bidInfo, unit);
		}
	};

	const currentBidButtonText = () => {
		if (hasRefund(availableRefund)) {
			return 'Claim Refund' as string;
		} else {
			return 'Cancel' as string;
		}
	};

	/* End handling refund or cancel bid function */

	const onClick = async () => {
		try {
			transactionToast.processing();
			setIsButtonDisable(true);
			if (bidState == 'WAIT_FOR_BID') {
				await bidMutation.mutateAsync({
					marketContractAddress,
					HERC20ContractAddress,
					amount: p(f(valueUnderlying)).toString(),
					NFTTokenId: NFTId,
					unit
				});
				console.log('Collateral bid succeed');
				await queryClient.invalidateQueries(
					queryKeys.listCollateralBids(marketContractAddress, HERC20ContractAddress, NFTId)
				);
				await queryClient.invalidateQueries(
					queryKeys.userBalance(walletPublicKey, ERC20ContractAddress)
				);
			} else if (bidState == 'WAIT_FOR_APPROVAL') {
				await getApprovalMutation.mutateAsync({
					ERC20ContractAddress,
					contractAddress: marketContractAddress
				});
				console.log('Approval succeed');
				await queryClient.invalidateQueries(
					queryKeys.userApproval(walletPublicKey, ERC20ContractAddress, marketContractAddress)
				);
				handleSliderChange(0);
			} else if (bidState == 'WAIT_FOR_INCREASE_BID') {
				await increaseBidMutation.mutateAsync({
					marketContractAddress,
					HERC20ContractAddress,
					increaseAmount: p(f(valueUnderlying)).toString(),
					NFTTokenId: NFTId,
					unit
				});
				console.log('Increase Collateral Bid succeed');
				await queryClient.invalidateQueries(
					queryKeys.listCollateralBids(marketContractAddress, HERC20ContractAddress, NFTId)
				);
				await queryClient.invalidateQueries(
					queryKeys.userBalance(walletPublicKey, ERC20ContractAddress)
				);
				handleSliderChange(0);
			}
			transactionToast.success('Successful! Transaction complete');
		} catch (err) {
			console.error(err);
			transactionToast.error('Sorry! Transaction failed');
		} finally {
			setIsButtonDisable(false);
		}
	};

	const onCancel = () => {
		setIsSidebarVisibleInMobile(false);
		setWorkflow(LiquidationWorkFlowType.none);
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
								disabled={isSubmitButtonDisabled()}
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
							<Image src={icon} layout="fill" alt={'collection logo'} />
						</HexaBoxContainer>
					</div>
					<div className={styles.nftName}>{name}</div>
				</div>
				<div className={styles.row}>
					<div className={styles.col}>
						<HoneyWarning
							message="Want to learn more about liquidations ?"
							link="https://docs.honey.finance/learn/liquidations"
						/>
					</div>
				</div>
				{(hasBid(walletPublicKey, bidInfo) || hasRefund(availableRefund)) && (
					<div className={styles.row}>
						<div className={styles.col}>
							<CurrentBid
								disabled={isButtonDisable}
								formatDecimals={formatDecimals ?? 0}
								value={currentBid().value}
								title={currentBidTile()}
								buttonText={currentBidButtonText()}
								onClick={() => handleCurrentBid()}
								unlockTime={currentBid().unlockTime}
							/>
						</div>
					</div>
				)}
				<div className={styles.row}>
					<div className={styles.col}>
						<InfoBlock
							value={fs(parseFloat(fromWei(bidInfo.highestBid, unit)), formatDecimals)}
							valueSize="big"
							title={
								<span className={hAlign}>
									Highest bid <div className={questionIcon} />
								</span>
							}
						/>
					</div>
					<div className={styles.col}>
						<InfoBlock
							title={
								<span className={hAlign}>
									Minimal bid <div className={questionIcon} />
								</span>
							}
							value={fs(minBid, formatDecimals)}
							valueSize="big"
						/>
					</div>
				</div>
				<div className={styles.row}>
					<div className={styles.col}>
						<InfoBlock
							value={fs(parseFloat(userBalance), formatDecimals)}
							valueSize="big"
							title="Your token balance"
						/>
					</div>
				</div>

				<div className={styles.inputs}>
					<InputsBlock
						firstInputValue={p(f(valueUnderlying))}
						secondInputValue={p(f(valueUSD))}
						onChangeFirstInput={handleUnderlyingInputChange}
						onChangeSecondInput={handleUsdInputChange}
						maxValue={parseFloat(userBalance)}
						firstInputAddon={erc20Name}
					/>
				</div>

				<HoneySlider
					currentValue={sliderValue}
					maxValue={parseFloat(userBalance)}
					minAvailableValue={0}
					onChange={handleSliderChange}
				/>
			</div>
		</SidebarScroll>
	);
};

export default BidCollateralForm;
