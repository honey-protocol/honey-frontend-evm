import { FC, useContext, useEffect, useState } from 'react';
import Image from 'next/image';
import { InfoBlock } from '../InfoBlock/InfoBlock';
import { InputsBlock } from '../InputsBlock/InputsBlock';
import { HoneySlider } from '../HoneySlider/HoneySlider';
import * as styles from './BidForm.css';
import { formatNumber } from '../../helpers/format';
import HoneyButton from 'components/HoneyButton/HoneyButton';
import HexaBoxContainer from '../HexaBoxContainer/HexaBoxContainer';
import HoneyWarning from '../HoneyWarning/HoneyWarning';
import CurrentBid from '../CurrentBid/CurrentBid';
import SidebarScroll from '../SidebarScroll/SidebarScroll';
import { BidFormProps } from './types';
import { hAlign } from 'styles/common.css';
import { questionIcon } from 'styles/icons.css';
import useToast from 'hooks/useToast';
import useDisplayStore from 'store/displayStore';
import { UserContext } from '../../contexts/userContext';
import { useQueryClient } from 'react-query';
import useLiquidationFlowStore from '../../store/liquidationFlowStore';
import { getContractsByHTokenAddr } from '../../helpers/generalHelper';
import { LiquidationWorkFlowType } from '../../types/workflows';
import { useGetUnderlyingPriceInUSD } from '../../hooks/useHtokenHelper';

const {
	format: f,
	formatPercent: fp,
	formatUsd: fu,
	formatERC20: fs,
	parse: p,
	formatRoundDown: frd
} = formatNumber;

const BidForm = (props: BidFormProps) => {
	const { userBalance, highestBiddingValue, currentUserBid } = {
		userBalance: 5,
		highestBiddingValue: 4,
		currentUserBid: 3
	};
	const maxValue = 1000;
	const setIsSidebarVisibleInMobile = useDisplayStore((state) => state.setIsSidebarVisibleInMobile);
	const { currentUser, setCurrentUser } = useContext(UserContext);
	const queryClient = useQueryClient();
	const walletPublicKey: string = currentUser?.get('ethAddress') || '';
	const HERC20ContractAddress = useLiquidationFlowStore((state) => state.HERC20ContractAddr);

	const {
		htokenHelperContractAddress,
		ERC20ContractAddress,
		name,
		icon,
		erc20Name,
		erc20Icon,
		unit
	} = getContractsByHTokenAddr(HERC20ContractAddress);
	const setWorkflow = useLiquidationFlowStore((state) => state.setWorkflow);
	const [underlyingPrice, isLoadingUnderlyingPrice] = useGetUnderlyingPriceInUSD(
		htokenHelperContractAddress,
		HERC20ContractAddress
	);

	const [valueUSD, setValueUSD] = useState<number>(0);
	const [valueUnderlying, setValueUnderlying] = useState<number>(0);
	const [sliderValue, setSliderValue] = useState(0);
	const { toast, ToastComponent } = useToast();

	// Put your validators here
	const isSubmitButtonDisabled = () => {
		return true;
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

	const handlePlaceBid = () => {};
	const handleIncreaseBid = () => {};
	const handleRevokeBid = () => {};

	function triggerIndicator() {
		currentUserBid != 0 ? handlePlaceBid() : handleIncreaseBid();
	}

	const onCancel = () => {
		setIsSidebarVisibleInMobile(false);
		setWorkflow(LiquidationWorkFlowType.none);
		document.body.classList.remove('disable-scroll');
	};

	return (
		<SidebarScroll
			footer={
				toast.state ? (
					<ToastComponent />
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
								onClick={triggerIndicator}
							>
								{currentUserBid != 0 ? 'Increase Bid' : 'Place Bid'}
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
						></HoneyWarning>
					</div>
				</div>
				{currentUserBid && (
					<div className={styles.row}>
						<div className={styles.col}>
							<CurrentBid
								value={currentUserBid}
								title={currentUserBid == highestBiddingValue ? 'Your bid is #1' : 'Your bid is:'}
								handleRevokeBid={() => handleRevokeBid()}
							/>
						</div>
					</div>
				)}
				<div className={styles.row}>
					<div className={styles.col}>
						<InfoBlock
							value={fs(highestBiddingValue)}
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
							value={fs(highestBiddingValue * 1.1)}
							valueSize="big"
						/>
					</div>
				</div>
				<div className={styles.row}>
					<div className={styles.col}>
						<InfoBlock value={fs(userBalance)} valueSize="big" title="Your token balance" />
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
					maxValue={Number(frd(userBalance))}
					minAvailableValue={0}
					onChange={handleSliderChange}
				/>
			</div>
		</SidebarScroll>
	);
};

export default BidForm;
