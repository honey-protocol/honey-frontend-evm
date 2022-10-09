import React, { FC, useEffect, useState } from 'react';
import Image from 'next/image';

import * as styles from './DepositNFTForm.css';
import { formatNumber } from '../../helpers/format';
import HoneyButton from 'components/HoneyButton/HoneyButton';
import HexaBoxContainer from 'components/HexaBoxContainer/HexaBoxContainer';
import NftList from '../NftList/NftList';
import { DepositNFTProps } from './types';
import { toastResponse } from 'helpers/loanHelpers';
import imagePlaceholder from 'public/images/imagePlaceholder.png';
import { hAlign } from 'styles/common.css';
import { questionIcon } from 'styles/icons.css';
import useToast from 'hooks/useToast';
import cs from 'classnames';
import useDisplayStore from "../../store/displayStore";
import SidebarScroll from "../SidebarScroll/SidebarScroll";
import useLoanFlowStore from "../../store/loanFlowStore";
import { LoanWorkFlowType } from "../../types/workflows";

const {format: f, formatPercent: fp, formatERC20: fs, parse: p} = formatNumber;

const DepositNFTForm = (props: DepositNFTProps) => {
  const setIsSidebarVisibleInMobile = useDisplayStore((state) => state.setIsSidebarVisibleInMobile)
  const setWorkflow = useLoanFlowStore((state) => state.setWorkflow)
  const [isNftSelected, setIsNftSelected] = useState(false);
  const [selectedNft, setSelectedNft] = useState<NFT | null>(null);
  const {toast, ToastComponent} = useToast();


  // set selection state and render (or not) detail nft
  const selectNFT = (nft: NFT) => {
    setSelectedNft(nft);
  };


  const handleDepositNFT = async () => {
    // if (selectedNft && selectedNft.mint.length < 1)
    //   return toastResponse('ERROR', 'Please select an NFT', 'ERROR');
    // if (selectedNft && selectedNft.mint.length > 1)
    //   await executeDepositNFT(selectedNft.mint, toast);
  };

  const availableNFTs: Array<NFT> = [
    {
      id: "1",
      name: "abc",
      image: "/nfts/bayc.jpg",
      tokenId: "1",
      contractAddress: "xx"

    },
    {
      id: "2",
      name: "eye",
      image: "/nfts/bayc.jpg",
      tokenId: "3",
      contractAddress: "xx"
    }
  ]


  const renderContent = () => {
    return (
      <>
        <div className={styles.newBorrowingTitle}>Choose NFT</div>
        <NftList
          nftPrice={100}
          data={availableNFTs}
          selectNFT={selectNFT}
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
          <HoneyButton
            variant="secondary"
            onClick={handleCancel}
            isFluid
          >
            Cancel
          </HoneyButton>
        </div>
        <div className={styles.bigCol}>
          <HoneyButton
            variant="primary" isFluid
            disabled={selectedNft == null}
            onClick={handleDepositNFT}>
            Deposit NFT
          </HoneyButton>
        </div>
      </div>
    );
  };

  return (
    <SidebarScroll footer={renderFooter()}>
      <div className={styles.depositNFTForm}>{renderContent()}</div>
    </SidebarScroll>
  );
};

export default DepositNFTForm;
