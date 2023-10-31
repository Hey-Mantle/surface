import { PlanFeatureListItem } from "../../components";

export const Plans = [
  {
    id: 123,
    name: "Basic",
    subtotal: 19,
    features: {
      local_pickup: {
        name: "Local pickup",
        value: true,
        type: "boolean",
        id: 12345,
      },
      local_delivery: {
        name: "Local delivery",
        value: PlanFeatureListItem,
        type: "boolean",
        id: 12346,
      },
      sms_notifications: {
        name: "SMS notifications",
        value: 0,
        type: "limit",
        id: 12347,
      },
      email_notifications: {
        name: "Email notifications",
        value: false,
        type: "boolean",
        id: 12348,
      },
    },
    interval: "EVERY_30_DAYS",
    usageCharges: {},
    trialDays: 14,
  },
  {
    id: 124,
    name: "Pro",
    subtotal: 29,
    features: {
      local_pickup: {
        name: "Local pickup",
        value: true,
        type: "boolean",
        id: 12345,
      },
      local_delivery: {
        name: "Local delivery",
        value: true,
        type: "boolean",
        id: 12346,
      },
      sms_notifications: {
        name: "SMS notifications",
        value: 0,
        type: "limit",
        id: 12347,
      },
      email_notifications: {
        name: "Email notifications",
        value: false,
        type: "boolean",
        id: 12348,
      },
    },
    interval: "EVERY_30_DAYS",
    usageCharges: {},
    trialDays: 14,
  },
  {
    id: 125,
    name: "Advanced",
    subtotal: 39,
    features: {
      local_pickup: {
        name: "Local pickup",
        value: true,
        type: "boolean",
        id: 12345,
      },
      local_delivery: {
        name: "Local delivery",
        value: true,
        type: "boolean",
        id: 12346,
      },
      sms_notifications: {
        name: "SMS notifications",
        value: 200,
        type: "limit",
        id: 12347,
      },
      email_notifications: {
        name: "Email notifications",
        value: true,
        type: "boolean",
        id: 12348,
      },
    },
    interval: "EVERY_30_DAYS",
    usageCharges: {},
    trialDays: 14,
  },
];
