import { numberFormatter } from './format';
import { fromWei } from 'web3-utils';

export function bidToFloat(bid: string, unit: Unit): number {
	return parseFloat(fromWei(bid, unit));
}
