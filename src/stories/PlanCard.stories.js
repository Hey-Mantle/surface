import { PlanCard } from '../components';

export default {
  title: 'Example/PlanCard',
  component: PlanCard,
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'centered',
  },
  args: {
    plan: {
      "id": 123,
      "name": "Basic",
      "subtotal": 29,
      "features": {
        "local_pickup": {
          "name": "Local pickup",
          "value": true,
          "type": "boolean",
          "id": 12345
        }
      },
      "interval": "EVERY_30_DAYS",
      "usageCharges": {},
      "trialDays": 14
    },
    onSubscribe: () => {},
  }
};

export const Selected = {
  args: {
    selected: true,
  }
};

export const NotSelected = {
  args: {
    selected: false,
  },
};