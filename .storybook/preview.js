import { AppProvider } from "@shopify/polaris";
import "@shopify/polaris/build/esm/styles.css";
import "../styles/global.css";

/** @type { import('@storybook/react').Preview } */
const preview = {
  decorators: [
    (Story, context) => (
      <AppProvider i18n={{}}>
        <Story />
      </AppProvider>
    ),
  ],
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  }
};

export default preview;
