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
import { MAX_LTV } from 'constants/loan';
import { LoanWorkFlowType } from "../../types/workflows";
import useDisplayStore from "../../store/displayStore";
import { UserContext } from "../../contexts/userContext";
import { useQueryClient } from "react-query";
import useLoanFlowStore from "../../store/loanFlowStore";
import { getContractsByHTokenAddr } from "../../helpers/generalHelper";
import { useGetMetaDataFromNFTId } from "../../hooks/useNFT";

const {format: f, formatPercent: fp, formatERC20: fs, parse: p} = formatNumber;

const RepayForm = (props: RepayProps) => {
  const {
    userDebt
  } = props;
  const setIsSidebarVisibleInMobile = useDisplayStore((state) => state.setIsSidebarVisibleInMobile)
  const {currentUser, setCurrentUser} = useContext(UserContext);
  const queryClient = useQueryClient();
  const walletPublicKey: string = currentUser?.get("ethAddress") || ""
  const HERC20ContractAddress = useLoanFlowStore((state) => state.HERC20ContractAddr)
  const NFTId = useLoanFlowStore((state) => state.NFTId)
  const {
    nftContractAddress,
    htokenHelperContractAddress,
    hivemindContractAddress,
    erc20Icon,
    erc20Name,
    unit,
  } = getContractsByHTokenAddr(HERC20ContractAddress)
  const setWorkflow = useLoanFlowStore((state) => state.setWorkflow)
  const [nft, isLoadingNFT] = useGetMetaDataFromNFTId(nftContractAddress, NFTId)

  const [valueUSD, setValueUSD] = useState<number>();
  const [valueUnderlying, setValueUnderlying] = useState<number>();
  const [sliderValue, setSliderValue] = useState(0);
  const {toast, ToastComponent} = useToast();

  const loanToValue = 0.1
  const userUSDCBalance = 0.5
  const nftPrice = 1
  const userAllowance = 0.6

  const maxValue = userDebt != 0 ? userDebt : userAllowance;
  const solPrice = 32;
  const liquidationThreshold = 0.75;
  const SOLBalance = 100;

  const newDebt = userDebt - (valueUnderlying ? valueUnderlying : 0);

  const borrowedValue = userDebt;

  // Put your validators here
  const isRepayButtonDisabled = () => {
    return false;
  };

  const handleSliderChange = (value: number) => {
    setSliderValue(value);
    setValueUSD(value * solPrice);
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
    setValueUnderlying(usdValue / solPrice);
    setSliderValue(usdValue);
  };

  const handleUnderlyingInputChange = (solValue: number | undefined) => {
    if (!solValue) {
      setValueUSD(0);
      setValueUnderlying(0);
      setSliderValue(0);
      return;
    }

    setValueUSD(solValue * solPrice);
    setValueUnderlying(solValue);
    setSliderValue(solValue * solPrice);
  };

  const onRepay = async (event: any) => {
    // if (userDebt == 0 && openPositions[0]) {
    //   await executeWithdrawNFT(openPositions[0].mint, toast);
    //   if (changeTab) {
    //     changeTab('borrow');
    //   }
    // } else {
    //   await executeRepay(valueUnderlying || 0, toast);
    //   handleSliderChange(0);
    // }
  };

  const handleCancel = () => {
    setIsSidebarVisibleInMobile(false)
    setWorkflow(LoanWorkFlowType.none)
    document.body.classList.remove('disable-scroll');
  };


  const liqPercent = nftPrice
    ? ((nftPrice - userDebt / liquidationThreshold) / nftPrice) * 100
    : 0;

  const renderContent = () => {
    return (
      <>
        <div className={styles.nftInfo}>
          <div className={styles.nftImage}>
            <HexaBoxContainer>
              <Image src={nft.image} layout="fill"/>
            </HexaBoxContainer>
          </div>
          <div className={styles.nftName}>{nft.name}</div>
        </div>
        <div className={styles.row}>
          <div className={styles.col}>
            <InfoBlock
              value={fs(nftPrice)}
              valueSize="big"
              title={
                <span className={hAlign}>
                  Estimated value <div className={questionIcon}/>
                </span>
              }
              toolTipLabel={
                <span>
                  The worth of your collateral according to the market’s oracle.
                  Learn more about this market’s{' '}
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
              value={`${fs(userDebt / liquidationThreshold)} ${
                userDebt ? `(-${liqPercent.toFixed(0)}%)` : ''
              }`}
              valueSize="normal"
              isDisabled={userDebt == 0}
              title={
                <span className={hAlign}>
                  Liquidation price
                  <div className={questionIcon}/>
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
                  Risk level <div className={questionIcon}/>
                </span>
              }
            />

            <HoneySlider
              currentValue={0}
              maxValue={nftPrice || 0}
              minAvailableValue={borrowedValue}
              maxSafePosition={0.3 - borrowedValue / 1000}
              dangerPosition={0.45 - borrowedValue / 1000}
              maxAvailablePosition={MAX_LTV}
              isReadonly
            />
          </div>
          <div className={styles.col}>
            <InfoBlock
              title={
                <span className={hAlign}>
                  New risk level
                  <div className={questionIcon}/>
                </span>
              }
              value={fp((newDebt / (nftPrice || 0)) * 100)}
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
              maxValue={nftPrice || 0}
              minAvailableValue={newDebt}
              maxSafePosition={0.3 - borrowedValue / 1000}
              dangerPosition={0.45 - borrowedValue / 1000}
              maxAvailablePosition={MAX_LTV}
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
                  <div className={questionIcon}/>
                </span>
              }
              value={fs(userDebt)}
              toolTipLabel={
                <span>
                  Value borrowed from the lending pool, upon which interest
                  accrues.{' '}
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
                  <div className={questionIcon}/>
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
              value={fs(userAllowance)}
              title={
                <span className={hAlign}>
                  Allowance <div className={questionIcon}/>
                </span>
              }
              toolTipLabel={`Allowance determines how much debt is available to a borrower. This market supports no more than ${fp(
                60
              )}`}
            />
          </div>
          <div className={styles.col}>
            <InfoBlock
              isDisabled
              title={
                <span className={hAlign}>
                  New allowance
                  <div className={questionIcon}/>
                </span>
              }
              value={fs(userAllowance + 0.9 * (valueUnderlying ?? 0))}
              toolTipLabel={
                <span>
                  Estimated{' '}
                  <a
                    className={styles.extLink}
                    target="blank"
                    href="https://docs.honey.finance/learn/defi-lending#allowance"
                  >
                    allowance{' '}
                  </a>
                  after the requested changes to the loan are approved.
                </span>
              }
            />
          </div>
        </div>

        <div className={styles.inputs}>
          <div className={styles.row}>
            <div className={cs(styles.balance, styles.col)}>
              <InfoBlock
                title={'Your SOL balance'}
                value={fs(SOLBalance)}
              />
            </div>
            <div className={cs(styles.balance, styles.col)}>
              <InfoBlock
                isDisabled
                title={'NEW SOL balance'}
                value={fs(SOLBalance - (valueUnderlying || 0))}
              />
            </div>
          </div>
          <InputsBlock
            firstInputValue={p(f(valueUSD))}
            secondInputValue={p(f(valueUnderlying))}
            onChangeFirstInput={handleUsdInputChange}
            onChangeSecondInput={handleUnderlyingInputChange}
          />
        </div>

        <HoneySlider
          currentValue={sliderValue}
          maxValue={maxValue}
          minAvailableValue={0}
          onChange={handleSliderChange}
        />
      </>
    )
  }

  const renderFooter = () => {
    return toast?.state ? (
      <ToastComponent/>
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
            onClick={onRepay}
          >
            {userDebt > 0 ? 'Repay' : 'Claim NFT'}
          </HoneyButton>
        </div>
      </div>
    )
  }

  return (
    <SidebarScroll footer={renderFooter()}>
      <div className={styles.repayForm}>{renderContent()}</div>
    </SidebarScroll>
  );
};

export default RepayForm;
