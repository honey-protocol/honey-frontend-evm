const {createVanillaExtractPlugin} = require('@vanilla-extract/next-plugin');
const withVanillaExtract = createVanillaExtractPlugin();
const {PHASE_DEVELOPMENT_SERVER} = require('next/constants')

/** @type {import('next').NextConfig} */

module.exports = (phase, {defaultConfig}) => {
  if (phase === PHASE_DEVELOPMENT_SERVER) {
    const env = {
      chain: "mumbai",
      confirmedBlocks: 1,
      envName: "dev",
      basePath: "/dev"
    }
    const images = {
      domains: ["bearsdeluxe.mypinata.cloud"],
    }

    const devNextConfig = {
      reactStrictMode: true,
      env: env,
      images: images
    };
    return withVanillaExtract(devNextConfig)
  } else {
    const env = {
      chain: "mumbai",
      confirmedBlocks: 1,
      envName: "prod",
      basePath: "/prod"
    }
    const images = {
      domains: ["bearsdeluxe.mypinata.cloud"],
    }
    const ProdNextConfig = {
      reactStrictMode: true,
      env: env,
      images: images
    };
    return withVanillaExtract(ProdNextConfig)
  }
}
