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
        destination: '/trading/dynamic-option-strategies',
        permanent: true,
      },
      {
        source: '/trading',
        destination: '/trading/dynamic-option-strategies',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
