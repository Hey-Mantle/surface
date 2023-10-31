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
          "id": 12345,
        },
        "local_delivery": {
          "name": "Local delivery",
          "value": true,
          "type": "boolean",
          "id": 12346
        },
        "sms_notifications": {
          "name": "SMS notifications",
          "value": 200,
          "type": "limit",
          "id": 12347
        },
        "email_notifications": {
          "name": "Email notifications",
          "value": true,
          "type": "boolean",
          "id": 12348
        },
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