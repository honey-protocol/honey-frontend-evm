import React from 'react';

export const getNumberFormatter = (decimals?: number) => {
	const numberFormatter = new Intl.NumberFormat('en-US', {
		style: 'decimal',
		minimumFractionDigits: decimals ?? 3,
		maximumFractionDigits: decimals ?? 3
	});

	const numberFormatterMobile = new Intl.NumberFormat('en-US', {
		style: 'decimal',
		minimumFractionDigits: 0,
		maximumFractionDigits: decimals ?? 3
	});
	return { numberFormatter, numberFormatterMobile };
};

export const formatNumber = {
	format: (val?: number, decimals?: number): string => {
		if (!val) {
			return '0';
		}
		return getNumberFormatter(decimals).numberFormatter.format(val);
	},

	formatMobile: (val?: number, decimals?: number): string => {
		if (!val) {
			return '0';
		}
		return getNumberFormatter(decimals).numberFormatterMobile.format(val);
	},

	/**
	 * works like formatNumber.format but do not round number
	 * formatRoundDown(66.6666) => 66.66
	 * format(66.6666) => 66.67
	 * @param value
	 * @param decimals Significant decimals
	 */
	formatRoundDown: (value: number, decimals = 3): string => {
		if (!value) {
			return '0';
		}
		const significantDigits = parseInt(value.toExponential().split('e-')[1]) || 0;
		const decimalsUpdated = (decimals || 0) + significantDigits - 1;
		decimals = Math.min(decimalsUpdated, value.toString().length);

		return getNumberFormatter(decimals).numberFormatter.format(
			Math.floor(value * 10 ** decimals) / 10 ** decimals
		);
	},

	/**
	 * Works as formatNumber.format but adds % at the end
	 * @param val
	 */
	formatPercent: (val?: number, decimals?: number) => {
		return `${formatNumber.format(val, decimals)} %`;
	},

	/**
	 * Works as formatNumber.formatPercent but prints integer value if it is possible
	 * @param val
	 * @param precision (default = 3)
	 */
	formatPercentRounded: (val: number, precision = 3) => {
		const power = Math.pow(10, precision);
		const precisedValue = Math.round(val * power) / power;
		return Number.isInteger(precisedValue)
			? `${precisedValue} %`
			: `${formatNumber.format(precisedValue)} %`;
	},

	/**
	 * Works as formatNumber.format but adds $ at the start of the string
	 * @param val
	 */
	formatUsd: (val?: number, decimals?: number) => {
		return `$ ${formatNumber.format(val, decimals)}`;
	},

	formatUsdMobile: (val?: number, decimals?: number) => {
		return `$ ${formatNumber.formatMobile(val, decimals)}`;
	},

	/**
	 * Converts 1000 into 1K, 1 000 000 to 1M, 1 000 000 000 to 1B, etc
	 * @param value
	 * @param decimals
	 */
	formatShortName: (value: number, decimals = 2): string => {
		if (value < 1000) {
			return String(formatNumber.format(value, decimals));
		}
		const templates = [
			{ value: 1, symbol: '' },
			{ value: 1e3, symbol: 'K' },
			{ value: 1e6, symbol: 'M' }
			// { value: 1e9, symbol: 'B' },
			// { value: 1e12, symbol: 'T' },
			// { value: 1e15, symbol: 'P' },
			// { value: 1e18, symbol: 'E' },
		];
		const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
		const item = templates
			.slice()
			.reverse()
			.find((it) => {
				return value >= it.value;
			});
		return item
			? formatNumber.formatRoundDown(value / item.value, decimals).replace(rx, '$1') + item.symbol
			: '0';
	},

	// TODO: decide currency
	/**
	 * Works as formatNumber.format but adds [currency] at the start of the string
	 * @param val
	 */
	formatERC20: (val?: number, decimals?: number) => {
		return `${formatNumber.format(val, decimals)}`;
	},

	formatToThousands: (value: number): string => {
		if (value < 1000) {
			return '0 k';
		}
		return `${Math.floor(value / 1000)} k`;
	},

	/**
	 * Parse a formatted number to a float.
	 * @param {string} stringNumber - the localized number
	 */
	parse: (stringNumber: string) => {
		const decimalSeparator = formatNumber.format(1.1).replace(/\p{Number}/gu, '');

		const thousandSeparator = formatNumber
			.format(11111)
			.replace(/\p{Number}/gu, '')
			.replace(new RegExp('\\' + decimalSeparator, 'g'), '');

		return parseFloat(
			stringNumber
				.replace(new RegExp('\\' + thousandSeparator, 'g'), '')
				.replace(new RegExp('\\' + decimalSeparator), '.')
		);
	},

	formatTokenInput: (input: string, decimals: number | undefined) => {
		const [integersValue, decimalsValue] = input.split('.');

		if (!decimalsValue || decimalsValue.length === 0) {
			return input;
		}

		return `${integersValue}.${decimalsValue.slice(0, decimals)}`;
	},
	formatTokenAllDecimals: (amount: number, decimals: number) => {
		if (amount <= 0) {
			return String(amount);
		}

		return new Intl.NumberFormat('en-US', {
			style: 'decimal',
			minimumFractionDigits: 0,
			maximumFractionDigits: decimals
		}).format(amount);
	}
};

export const dateFromTimestamp = (timestamp: number | string) => {
	const time = new Date(timestamp);

	const date = time.toLocaleDateString('en-GB', {
		day: 'numeric',
		month: 'short',
		year: 'numeric'
	});

	return `${date}`;
};

/**
 * Convert long NFT name into short.
 * @param {string} nftName - full NFT name, consist of collection name + NFT number
 * @param {number} maxLength - max formatted name length, 10 by default
 */
export const formatNFTName = (nftName: string, maxLength = 10) => {
	if (nftName.length <= maxLength) {
		return nftName;
	}

	const nftNumber = nftName.match(/#\d+$/)?.[0] || '';
	const collectionName = nftNumber.length ? nftName.split(nftNumber)[0] : nftName;

	const splicedCollectionName = collectionName.slice(0, maxLength - nftNumber.length);
	return `${splicedCollectionName}...${nftNumber}`;
};
