import React, { FC, useContext, useEffect, useState } from 'react';

import * as styles from './DepositNFTForm.css';
import { formatNumber } from '../../helpers/format';
import HoneyButton from 'components/HoneyButton/HoneyButton';
import NftList from '../NftList/NftList';
import { DepositNFTProps } from './types';
import useToast from 'hooks/useToast';
import useDisplayStore from '../../store/displayStore';
import SidebarScroll from '../SidebarScroll/SidebarScroll';
import useLoanFlowStore from '../../store/loanFlowStore';
import { LoanWorkFlowType } from '../../types/workflows';
import { getContractsByHTokenAddr } from '../../helpers/generalHelper';
import { UserContext } from '../../contexts/userContext';
import { useMutation, useQueryClient } from 'react-query';
import { useFetchNFTByUserByCollection, useIsNFTApproved } from '../../hooks/useNFT';
import {
	useGetMaxBorrowableAmount,
	useGetNFTPrice,
	useGetNFTPriceInUSD
} from '../../hooks/useHtokenHelper';
import { depositNFTCollateral } from '../../hooks/useHerc20';
import { queryKeys } from '../../helpers/queryHelper';
import getDepositNFTApproval from '../../hooks/useERC721';

const {
	format: f,
	formatPercent: fp,
	formatERC20: fs,
	parse: p,
	formatShortName: fsn
} = formatNumber;

const DepositNFTForm = (props: DepositNFTProps) => {
	const setIsSidebarVisibleInMobile = useDisplayStore((state) => state.setIsSidebarVisibleInMobile);
	const { currentUser, setCurrentUser } = useContext(UserContext);
	const queryClient = useQueryClient();
	const walletPublicKey: string = currentUser?.get('ethAddress') || '';
	const HERC20ContractAddress = useLoanFlowStore((state) => state.HERC20ContractAddr);
	const { nftContractAddress, htokenHelperContractAddress, hivemindContractAddress } =
		getContractsByHTokenAddr(HERC20ContractAddress);
	const setWorkflow = useLoanFlowStore((state) => state.setWorkflow);
	const [selectedNft, setSelectedNft] = useState<NFT | null>(null);
	const { toast, ToastComponent } = useToast();

	const [availableNFTs, isLoadingNFT] = useFetchNFTByUserByCollection(
		currentUser,
		nftContractAddress
	);
	const [nftState, setNFTState] = useState('WAIT_FOR_APPROVAL');
	const [isNFTApproved, isLoadingApproval] = useIsNFTApproved(
		nftContractAddress,
		HERC20ContractAddress,
		selectedNft?.tokenId || ''
	);
	const [maxBorrow, isLoadingMaxBorrow] = useGetMaxBorrowableAmount(
		htokenHelperContractAddress,
		HERC20ContractAddress,
		hivemindContractAddress
	);

	useEffect(() => {
		if (isNFTApproved) setNFTState('WAIT_FOR_DEPOSIT');
		else setNFTState('WAIT_FOR_APPROVAL');
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedNft, isNFTApproved]);

	useEffect(() => {
		if (isLoadingNFT || isLoadingApproval || isLoadingMaxBorrow) {
			toast.processing();
		} else {
			toast.clear();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isLoadingNFT, isLoadingApproval, isLoadingMaxBorrow]);

	const buttonTitle = () => {
		if (nftState == 'WAIT_FOR_APPROVAL') return 'Approve';
		else if (nftState == 'WAIT_FOR_DEPOSIT') return 'Deposit NFT';
		else return 'Deposit finished';
	};

	const depositCollateral = async () => {
		await depositNFTCollateral(HERC20ContractAddress, selectedNft?.tokenId || '').then(() => {
			console.log('deposit collateral');
			setSelectedNft(null);
			setNFTState('FINISH_DEPOSIT');
		});
	};

	const depositNFTMutation = useMutation(depositCollateral);

	const onClick = async () => {
		try {
			toast.processing();
			if (nftState == 'WAIT_FOR_APPROVAL') {
				await getApprovalMutation.mutateAsync();
				await queryClient.invalidateQueries(
					queryKeys.NFTApproval(
						nftContractAddress,
						HERC20ContractAddress,
						selectedNft?.tokenId || ''
					)
				);
			} else if (nftState == 'WAIT_FOR_DEPOSIT') {
				await depositNFTMutation.mutateAsync();
				await queryClient.invalidateQueries(
					queryKeys.listUserNFTs(walletPublicKey, nftContractAddress)
				);
				await queryClient.invalidateQueries(
					queryKeys.listUserCoupons(HERC20ContractAddress, walletPublicKey)
				);
			} else if (nftState === 'FINISH_DEPOSIT') {
				setSelectedNft(null);
			}
			toast.success('Successful! Transaction complete');
		} catch (err) {
			console.error(err);
			toast.error('Sorry! Transaction failed');
		}
	};

	const getApproval = async () => {
		await getDepositNFTApproval(
			nftContractAddress,
			HERC20ContractAddress,
			selectedNft?.tokenId || ''
		)
			.then(() => {
				console.log('get NFT Approval');
			})
			.catch(function (err) {
				console.error('get NFT Approval fail');
				throw err;
			});
	};

	const getApprovalMutation = useMutation(getApproval);

	// set selection state and render (or not) detail nft
	const selectNFT = (nft: NFT) => {
		setSelectedNft(nft);
	};

	const renderContent = () => {
		return (
			<>
				<div className={styles.newBorrowingTitle}>Choose NFT</div>
				<NftList data={availableNFTs} selectNFT={selectNFT} buttonText={fsn(maxBorrow)} />
			</>
		);
	};

	const handleCancel = () => {
		setIsSidebarVisibleInMobile(false);
		setWorkflow(LoanWorkFlowType.none);
		document.body.classList.remove('disable-scroll');
	};

	const renderFooter = () => {
		return toast?.state ? (
			<ToastComponent />
		) : (
			<div className={styles.buttons}>
				<div className={styles.smallCol}>
					<HoneyButton variant="secondary" onClick={handleCancel} isFluid>
						Cancel
					</HoneyButton>
				</div>
				<div className={styles.bigCol}>
					<HoneyButton variant="primary" isFluid disabled={selectedNft == null} onClick={onClick}>
						<>{buttonTitle()}</>
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
