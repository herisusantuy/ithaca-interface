/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
	sassOptions: {
		includePaths: [path.join(__dirname, 'src/UI/stylesheets')],
		additionalData: `
      @import "_mixins.scss";
			@import "_variables.scss";
    `,
	},
};

module.exports = nextConfig;
