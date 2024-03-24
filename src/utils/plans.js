import { PlanInterval } from "./constants";

/**
 * Generate a long label for the given interval
 * @param {"ANNUAL"|"EVERY_30_DAYS"} interval
 * @returns {string} "year" | "month"
 */
export const intervalLabelLong = (interval = PlanInterval.EVERY_30_DAYS) => {
  switch (interval) {
    case PlanInterval.ANNUAL:
      return "year";
    case PlanInterval.EVERY_30_DAYS:
    default:
      return "month";
  }
};

/**
 * Generate a short label for the given interval
 * @param {"ANNUAL"|"EVERY_30_DAYS"} interval
 * @returns {string} "yr" | "mo"
 */
export const intervalLabelShort = (interval = PlanInterval.EVERY_30_DAYS) => {
  switch (interval) {
    case PlanInterval.ANNUAL:
      return "yr";
    case PlanInterval.EVERY_30_DAYS:
    default:
      return "mo";
  }
};

/**
 * Generate a label for the given interval and format
 * @param {object} params
 * @param {"ANNUAL"|"EVERY_30_DAYS"} params.interval
 * @param {boolean} params.useShortFormPlanIntervals
 * @returns {string} "year" | "month" | "yr" | "mo"
 */
export const intervalLabel = ({
  interval = PlanInterval.EVERY_30_DAYS,
  useShortFormPlanIntervals = true,
}) => {
  return useShortFormPlanIntervals ? intervalLabelShort(interval) : intervalLabelLong(interval);
};
