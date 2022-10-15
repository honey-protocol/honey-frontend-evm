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
import { useGetNFTPrice, useGetUnderlyingPriceInUSD } from "../../hooks/useHtokenHelper";
import { useGetBorrowAmount } from "../../hooks/useCoupon";

const {format: f, formatPercent: fp, formatERC20: fs, parse: p} = formatNumber;

const BorrowForm = (props: BorrowProps) => {
  const {
    userAllowance,
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
  const [valueUnderlying, setValueUnderlying] = useState<number>(0);
  const [sliderValue, setSliderValue] = useState(0);
  const {toast, ToastComponent} = useToast();

  const [collateralFactor, isLoadingCollateralFactor] = useGetCollateralFactor(hivemindContractAddress, HERC20ContractAddress, unit)
  const [nft, isLoadingNFT] = useGetMetaDataFromNFTId(nftContractAddress, NFTId)
  const [nftPrice, isLoadingNFTPrice] = useGetNFTPrice(htokenHelperContractAddress, HERC20ContractAddress)
  const [underlyingPrice, isLoadingUnderlyingPrice] = useGetUnderlyingPriceInUSD(htokenHelperContractAddress, HERC20ContractAddress, unit)
  const [borrowAmount, isLoadingBorrowAmount] = useGetBorrowAmount(HERC20ContractAddress, NFTId, unit);

  // Only for test purposes
  const borrowedValue = parseFloat(borrowAmount)
  const loanToValue = borrowedValue / nftPrice
  const maxValue = userAllowance;
  const borrowFee = 0.015; // 1,5%

  const newAdditionalDebt = valueUnderlying * (1 + borrowFee);
  const newTotalDebt = newAdditionalDebt
    ? borrowedValue + newAdditionalDebt
    : borrowedValue;

  // Put your validators here
  const isBorrowButtonDisabled = () => {
    return userAllowance == 0 ? true : false;
  };

  useEffect(() => {
    if (isLoadingNFT || isLoadingCollateralFactor || isLoadingNFTPrice || isLoadingUnderlyingPrice || isLoadingBorrowAmount) {
      toast.processing()
    } else {
      toast.clear()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoadingNFT, isLoadingCollateralFactor, isLoadingNFTPrice, isLoadingUnderlyingPrice, isLoadingBorrowAmount]);

  const handleSliderChange = (value: number) => {
    if (userAllowance == 0) return;
    setSliderValue(value);
    setValueUSD(value * underlyingPrice);
    setValueUnderlying(value);
  };

  const handleUsdInputChange = (usdValue: number | undefined) => {
    if (userAllowance == 0) return;
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
    if (userAllowance == 0) return;
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

  const liqPercent =
    ((nftPrice - borrowedValue / collateralFactor) / nftPrice) * 100;

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
              value={`${fs(borrowedValue / collateralFactor)} ${
                borrowedValue ? `(-${liqPercent.toFixed(0)}%)` : ''
              }`}
              valueSize="normal"
              isDisabled={borrowedValue == 0 ? true : false}
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
              value={fp((borrowedValue + newAdditionalDebt / nftPrice) * 100)}
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
              value={fs(borrowedValue)}
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
                  : !valueUnderlying
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
                value={fs(valueUnderlying * borrowFee)}
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
            secondInputValue={p(f(valueUnderlying))}
            onChangeFirstInput={handleUsdInputChange}
            onChangeSecondInput={handleUnderlyingInputChange}
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
