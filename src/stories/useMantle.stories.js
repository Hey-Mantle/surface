import { MantleProvider } from "..";
import { AuthenticatedPage } from "./AuthenticatedPage";

export default {
  title: "Example/useMantle",
  component: AuthenticatedPage,
  decorators: [
    (Story, context) => (
      <MantleProvider
        appId={context.args.appId}
        customerApiToken={context.args.customerApiToken}
      >
        <Story />
      </MantleProvider>
    ),
  ],
  parameters: {
    layout: "centered",
  },
  args: {
    appId: "",
    customerApiToken: "",
  },
};

export const Authenticated = {
  args: {},
};
