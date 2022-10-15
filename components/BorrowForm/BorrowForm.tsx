import React, { FC, useContext, useEffect, useState } from 'react';
import Image from 'next/image';
import { InfoBlock } from '../InfoBlock/InfoBlock';
import { InputsBlock } from '../InputsBlock/InputsBlock';
import { HoneySlider } from '../HoneySlider/HoneySlider';
import * as styles from './BorrowForm.css';
import { formatNumber } from '../../helpers/format';
import HoneyButton from 'components/HoneyButton/HoneyButton';
import HexaBoxContainer from 'components/HexaBoxContainer/HexaBoxContainer';
import NftList from '../NftList/NftList';
import { NftCardProps } from '../NftCard/types';
import { MAX_LTV } from '../../constants/loan';
import { usdcAmount } from '../HoneyButton/HoneyButton.css';
import { BorrowProps } from './types';
import SidebarScroll from '../SidebarScroll/SidebarScroll';
import imagePlaceholder from 'public/images/imagePlaceholder.png';
import * as stylesBorrow from '../BorrowForm/BorrowForm.css';
import { hAlign } from 'styles/common.css';
import { questionIcon } from 'styles/icons.css';
import useToast from 'hooks/useToast';
import cs from 'classnames';
import useDisplayStore from "../../store/displayStore";
import { UserContext } from "../../contexts/userContext";
import { useQueryClient } from "react-query";
import useLoanFlowStore from "../../store/loanFlowStore";
import { getContractsByHTokenAddr } from "../../helpers/generalHelper";
import { LoanWorkFlowType } from "../../types/workflows";
import { useGetCollateralFactor } from "../../hooks/useHivemind";
import { useGetMetaDataFromNFTId } from "../../hooks/useNFT";

const {format: f, formatPercent: fp, formatERC20: fs, parse: p} = formatNumber;

interface NFT {
  name: string;
  img: string;
  mint: string;
}

const BorrowForm = (props: BorrowProps) => {
  const {
    userAllowance,
    userDebt,
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
    unit,
  } = getContractsByHTokenAddr(HERC20ContractAddress)
  const setWorkflow = useLoanFlowStore((state) => state.setWorkflow)

  const [valueUSD, setValueUSD] = useState<number>(0);
  const [valueSOL, setValueSOL] = useState<number>(0);
  const [sliderValue, setSliderValue] = useState(0);
  const {toast, ToastComponent} = useToast();

  const [collateralFactor, isLoadingCollateralFactor] = useGetCollateralFactor(hivemindContractAddress, HERC20ContractAddress, unit)
  const [nft, isLoadingNFT] = useGetMetaDataFromNFTId(nftContractAddress, NFTId)

  // Only for test purposes
  const nftPrice = 1000
  const loanToValue = 0.7

  const borrowedValue = userDebt;
  const maxValue = userAllowance;
  const solPrice = 32;
  const liquidationThreshold = 0.75;
  const borrowFee = 0.015; // 1,5%

  const newAdditionalDebt = valueSOL * (1 + borrowFee);
  const newTotalDebt = newAdditionalDebt
    ? userDebt + newAdditionalDebt
    : userDebt;

  // Put your validators here
  const isBorrowButtonDisabled = () => {
    return userAllowance == 0 ? true : false;
  };

  useEffect(() => {
    if (isLoadingNFT || isLoadingCollateralFactor) {
      toast.processing()
    } else {
      toast.clear()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoadingNFT, isLoadingCollateralFactor]);

  const handleSliderChange = (value: number) => {
    if (userAllowance == 0) return;
    setSliderValue(value);
    setValueUSD(value * solPrice);
    setValueSOL(value);
  };

  const handleUsdInputChange = (usdValue: number | undefined) => {
    if (userAllowance == 0) return;
    if (!usdValue) {
      setValueUSD(0);
      setValueSOL(0);
      setSliderValue(0);
      return;
    }
    setValueUSD(usdValue);
    setValueSOL(usdValue / solPrice);
    setSliderValue(usdValue / solPrice);
  };

  const handleSolInputChange = (solValue: number | undefined) => {
    if (userAllowance == 0) return;
    if (!solValue) {
      setValueUSD(0);
      setValueSOL(0);
      setSliderValue(0);
      return;
    }

    setValueUSD(solValue * solPrice);
    setValueSOL(solValue);
    setSliderValue(solValue);
  };


  const handleDepositNFT = async () => {
    // if (selectedNft && selectedNft.mint.length < 1)
    //   return toastResponse('ERROR', 'Please select an NFT', 'ERROR');
    // if (selectedNft && selectedNft.mint.length > 1)
    //   await executeDepositNFT(selectedNft.mint, toast);
    handleSliderChange(0);
  };


  const liqPercent =
    ((nftPrice - userDebt / liquidationThreshold) / nftPrice) * 100;

  const renderContent = () => {


    return (
      <>
        <div className={styles.nftInfo}>
          <div className={styles.nftImage}>
            <HexaBoxContainer>
              <Image
                src={nft.image || imagePlaceholder}
                alt={nft.name}
                layout="fill"
              />
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
              isDisabled={userDebt == 0 ? true : false}
              title={
                <span className={hAlign}>
                  Liquidation price <div className={questionIcon}/>
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
              maxValue={nftPrice}
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
                  New risk level <div className={questionIcon}/>
                </span>
              }
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
              value={fp((loanToValue + newAdditionalDebt / nftPrice) * 100)}
              isDisabled={true}
            />
            <HoneySlider
              currentValue={sliderValue * 1.1}
              maxValue={nftPrice}
              minAvailableValue={borrowedValue}
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
                  Debt <div className={questionIcon}/>
                </span>
              }
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
              value={fs(userDebt)}
            />
          </div>
          <div className={styles.col}>
            <InfoBlock
              title={
                <span className={hAlign}>
                  New debt + fees <div className={questionIcon}/>
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
              isDisabled={true}
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
                  New allowance <div className={questionIcon}/>
                </span>
              }
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
              value={fs(
                userAllowance - newAdditionalDebt < 0
                  ? 0
                  : !valueSOL
                    ? userAllowance
                    : userAllowance - newAdditionalDebt
              )}
            />
          </div>
        </div>
        <div className={styles.inputs}>
          <div className={styles.row}>
            <div className={cs(stylesBorrow.balance, styles.col)}>
              <InfoBlock
                title={
                  <span className={hAlign}>
                    Interest Rate <div className={questionIcon}/>
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
                value={fp(10)}
              />
            </div>
            <div className={cs(stylesBorrow.balance, styles.col)}>
              <InfoBlock
                isDisabled
                title={
                  <span className={hAlign}>
                    Borrow Fee <div className={questionIcon}/>
                  </span>
                }
                value={fs(valueSOL * borrowFee)}
                //TODO: add link to docs
                toolTipLabel={
                  <span>
                    Borrow Fee is a{' '}
                    <a className={styles.extLink} target="blank" href=" ">
                      protocol fee{' '}
                    </a>
                    that is charged upon borrowing. For now it is set at 0,00%.
                  </span>
                }
              />
            </div>
          </div>
          <InputsBlock
            firstInputValue={p(f(valueUSD))}
            secondInputValue={p(f(valueSOL))}
            onChangeFirstInput={handleUsdInputChange}
            onChangeSecondInput={handleSolInputChange}
            maxValue={maxValue}
          />
        </div>

        <HoneySlider
          currentValue={sliderValue}
          maxValue={nftPrice}
          minAvailableValue={borrowedValue}
          maxSafePosition={0.3 - borrowedValue / 1000}
          dangerPosition={0.45 - borrowedValue / 1000}
          maxAvailablePosition={MAX_LTV}
          onChange={handleSliderChange}
        />
      </>
    );
  };

  const handleCancel = () => {
    setIsSidebarVisibleInMobile(false)
    setWorkflow(LoanWorkFlowType.none)
    document.body.classList.remove('disable-scroll');
  };

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
            disabled={isBorrowButtonDisabled()}
            isFluid
            onClick={e => {
            }}
          >
            Borrow
          </HoneyButton>
        </div>
      </div>
    )
  };

  return (
    <SidebarScroll footer={renderFooter()}>
      <div className={styles.borrowForm}>{renderContent()}</div>
    </SidebarScroll>
  );
};

export default BorrowForm;
