const { createVanillaExtractPlugin } = require('@vanilla-extract/next-plugin');
const withVanillaExtract = createVanillaExtractPlugin();
const { PHASE_DEVELOPMENT_SERVER } = require('next/constants');

/** @type {import("next").NextConfig} */

module.exports = (phase, { defaultConfig }) => {
	if (phase === PHASE_DEVELOPMENT_SERVER) {
		const env = {
			chain: '0xa4b1', //arbitrum
			confirmedBlocks: 1,
			envName: 'dev',
			basePath: '/dev'
		};
		const images = {
			domains: [
				'bearsdeluxe.mypinata.cloud',
				'ipfs.io',
				'bafybeidpr6zwp4cou32kxpu3uvdfw6vjtuybdd7rtpbdpys6bvaayypubi.ipfs.w3s.link'
			]
		};

		const devNextConfig = {
			reactStrictMode: true,
			env: env,
			images: images
		};
		return withVanillaExtract(devNextConfig);
	} else {
		const env = {
			chain: '0xa4b1', //arbitrum
			confirmedBlocks: 1,
			envName: 'prod',
			basePath: '/prod'
		};
		const images = {
			domains: [
				'bearsdeluxe.mypinata.cloud',
				'ipfs.io',
				'bafybeidpr6zwp4cou32kxpu3uvdfw6vjtuybdd7rtpbdpys6bvaayypubi.ipfs.w3s.link'
			]
		};
		const ProdNextConfig = {
			reactStrictMode: true,
			env: env,
			images: images
		};
		return withVanillaExtract(ProdNextConfig);
	}
};
