import BN from 'bn.js';

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
  if(!val)
    return 0;
  return val.div(new BN(10 ** (decimal - precision))).toNumber() / (10 ** precision);
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
  return `${address.slice(0, 4)}...${address.slice(
    address.length - 4,
    address.length
  )}`;
}

export const RoundHalfDown = (val: number, decimals: number = 2): number => {
  return Math.floor(val * 10 ** decimals) / 10 ** decimals;
};