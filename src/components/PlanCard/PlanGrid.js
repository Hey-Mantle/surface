import { InlineGrid } from "@shopify/polaris";
import { PlanCard } from ".";

/**
 * Smart grid for displaying multiple plans.
 * @param {Object} params
 * @param {import('../MantleProvider/types').Plan[]} params.plans
 * @param {import('../MantleProvider/types').Plan} params.currentPlan
 * @param {Function} params.onSubscribe
 * @param {import('@shopify/polaris').InlineGridProps['columns']} [params.columns]
 * @returns {JSX.Element} the plan grid
 */
export const PlanGrid = ({
  plans,
  currentPlan,
  onSubscribe,
  columns = { xs: 1, sm: 3, lg: 5 },
}) => (
    <InlineGrid columns={columns} gap="400">
      {plans.map((plan) => (
        <PlanCard
          key={plan.id}
          plan={plan}
          selected={currentPlan.id === plan.id}
          onSubscribe={onSubscribe}
        />
      ))}
    </InlineGrid>
  );
