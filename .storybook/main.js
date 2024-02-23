/** @type { import('@storybook/react-webpack5').StorybookConfig } */
const config = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  framework: {
    name: "@storybook/react-webpack5",
    options: {},
  },
  addons: [
    {
      name: '@storybook/addon-essentials',
      options: {
        actions: false,
        backgrounds: false,
        viewport: false,
        measure: false,
        outline: false,
        highlight: false,
      },
    },
  ],
  docs: {
    autodocs: "tag",
  },
};
export default config;
