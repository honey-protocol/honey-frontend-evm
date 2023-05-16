import BN from 'bn.js';
import { MarketTablePosition } from 'types/markets';
import { LendTableRow } from '../types/lend';

/**
 * Check if null or undefined
 * @param value
 */
export function isNil(value: any): boolean {
	return value === null || value === undefined;
}

/**
 * @description
 * @params
 * @returns
 */
export function BnToDecimal(val: BN | undefined, decimal: number, precision: number) {
	if (!val) return 0;
	return val.div(new BN(10 ** (decimal - precision))).toNumber() / 10 ** precision;
}

/**
 * @description function which extends the logic as a helper
 * @params value from SDK | first multiplier | second multiplier
 * @returns outcome of sum
 */
export function BnDivided(val: BN, a: number, b: number) {
	return val.div(new BN(a ** b)).toNumber();
}

export const formatAddress = (address: any) => {
	if (!address) return null;
	return `${address.slice(0, 4)}...${address.slice(address.length - 4, address.length)}`;
};

export const RoundHalfDown = (val: number, decimals: number = 2): number => {
	return Math.floor(val * 10 ** decimals) / 10 ** decimals;
};

/**
 * @description filter selected position from positions array
 * @params positions
 * @returns selected nft
 */
export const fetchAllowance = (positions: MarketTablePosition[], NFTId: string) => {
	const filtered = positions.filter((position) => position.tokenId === NFTId);
	if (filtered.length) {
		return parseFloat(filtered[0].allowance);
	} else {
		return 0;
	}
};

// TODO: no calculation needed, can now be fetched from lens/helper contract [2]
/**
 * @description calculates interest rate for lend market
 * @params baserate which is default rate provided by contract | total market supplied | total market available
 * @returns interest rate for lend market
 */
export const interestRateLend = (baseRate: number, supplied: string, available: string) => {
	const rate = baseRate * ((parseFloat(supplied) - parseFloat(available)) / parseFloat(supplied));
	return rate > 0 ? rate : 0;
};
/**
 * @description return interest rate for specific collection
 * @params positions
 * @returns interest rate
 */
export const fetchInterestRate = (lendDatas: LendTableRow[], HERC20ContractAddress: string) => {
	const lendData = lendDatas.filter((lendData) => lendData.key === HERC20ContractAddress);
	if (lendData.length) {
		return lendData[0].rate <= 0 ? 0 : lendData[0].rate;
	} else {
		return 0;
	}
};
