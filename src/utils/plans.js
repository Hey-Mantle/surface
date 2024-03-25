import { Labels, PlanInterval } from "./constants";

/**
 * Generate a long label for the given interval
 * @param {"ANNUAL"|"EVERY_30_DAYS"} interval - The interval to generate a label for
 * @returns {string} "year" | "month" - The long label for the interval
 */
export const intervalLabelLong = (interval = PlanInterval.Every30Days) => {
  switch (interval) {
    case PlanInterval.Annual:
      return "year";
    case PlanInterval.Every30Days:
    default:
      return "month";
  }
};

/**
 * Generate a short label for the given interval
 * @param {"ANNUAL"|"EVERY_30_DAYS"} interval - The interval to generate a label for
 * @returns {string} "yr" | "mo" - The short label for the interval
 */
export const intervalLabelShort = (interval = PlanInterval.Every30Days) => {
  switch (interval) {
    case PlanInterval.Annual:
      return "yr";
    case PlanInterval.Every30Days:
    default:
      return "mo";
  }
};

/**
 * Generate a label for the given interval and format
 * @param {object} params
 * @param {"ANNUAL"|"EVERY_30_DAYS"} params.interval - The interval to generate a label for
 * @param {boolean} params.useShortFormPlanIntervals - Whether to use short form plan intervals
 * @returns {string} "year" | "month" | "yr" | "mo" - The label for the interval
 */
export const intervalLabel = ({
  interval = PlanInterval.Every30Days,
  useShortFormPlanIntervals = true,
}) => {
  return useShortFormPlanIntervals ? intervalLabelShort(interval) : intervalLabelLong(interval);
};

/**
 * Check if the plan is recommended by using custom fields
 * @param {object} params
 * @param {import('@heymantle/client').Plan} params.plan - The Mantle plan to check
 * @param {string} params.customFieldKey - The key to check for the recommended status, default "recommended"
 * @returns {boolean} Whether the plan is recommended
 */
export const isRecommendedPlan = ({ plan, customFieldKey = "recommended" }) => {
  return !!plan.customFields?.[customFieldKey];
};

/**
 * Get the custom button label for the plan, or the default label
 * @param {object} params
 * @param {import('@heymantle/client').Plan} params.plan - The Mantle plan to check
 * @param {string} params.customFieldKey - The key to check for the button label, default "buttonLabel"
 * @returns {string} The custom button label or the default label
 */
export const customButtonLabel = ({ plan, customFieldKey = "buttonLabel" }) => {
  return plan.customFields?.[customFieldKey] || Labels.SelectPlan;
};
