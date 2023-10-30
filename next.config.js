/** @type {import('next').NextConfig} */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

const nextConfig = {
  sassOptions: {
    includePaths: [path.join(__dirname, 'src/UI/stylesheets')],
    additionalData: `
      @import "_mixins.scss";
			@import "_variables.scss";
    `,
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/trading/lite/market',
        permanent: true,
      },
      {
        source: '/trading',
        destination: '/trading/lite/market',
        permanent: true,
      },
      {
        source: '/trading/lite',
        destination: '/trading/lite/market',
        permanent: true,
      },
      {
        source: '/trading/pro',
        destination: '/trading/pro/position-builder',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
