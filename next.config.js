const { createVanillaExtractPlugin } = require('@vanilla-extract/next-plugin');
const withVanillaExtract = createVanillaExtractPlugin();
const { PHASE_DEVELOPMENT_SERVER } = require('next/constants');

/** @type {import("next").NextConfig} */
const cloudinary_uri = process.env.CLOUDINARY_URI;

module.exports = (phase, { defaultConfig }) => {
	if (phase === PHASE_DEVELOPMENT_SERVER) {
		const env = {
			chain: '0x89', //polygon
			CLOUDINARY_URI: cloudinary_uri,
			confirmedBlocks: 1,
			envName: 'dev',
			basePath: '/dev'
		};
		const images = {
			domains: [
				// 'bearsdeluxe.mypinata.cloud',
				// 'ipfs.io',
				// 'bafybeidpr6zwp4cou32kxpu3uvdfw6vjtuybdd7rtpbdpys6bvaayypubi.ipfs.w3s.link',
				// 'api.sandbox.game',
				// 'https://metadata.y00ts.com/y/*',
				// 'https://bafybeigybl4254a53e7vestjhqmcgwbrq4uw3typghtgudvfqquosj7y44.ipfs.dweb.link/',
				// 'https://bafybeih3zu2mzckrf4ylywokevxxn25k5k3hs4oa5lsxczdtdlfvgwccki.ipfs.nftstorage.link/',
				'res.cloudinary.com'
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
			chain: '0x89', //polygon
			CLOUDINARY_URI: cloudinary_uri,
			confirmedBlocks: 1,
			envName: 'prod',
			basePath: '/prod'
		};
		const images = {
			domains: [
				// 'bearsdeluxe.mypinata.cloud',
				// 'ipfs.io',
				// 'bafybeidpr6zwp4cou32kxpu3uvdfw6vjtuybdd7rtpbdpys6bvaayypubi.ipfs.w3s.link',
				// 'api.sandbox.game',
				// 'https://metadata.y00ts.com/y/*',
				// 'https://bafybeigybl4254a53e7vestjhqmcgwbrq4uw3typghtgudvfqquosj7y44.ipfs.dweb.link/',
				// 'https://bafybeih3zu2mzckrf4ylywokevxxn25k5k3hs4oa5lsxczdtdlfvgwccki.ipfs.nftstorage.link/',
				'res.cloudinary.com'
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
