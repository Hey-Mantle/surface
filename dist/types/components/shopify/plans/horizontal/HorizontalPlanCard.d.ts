export function TitleSection({ plan, recommended }: {
    plan: Plan;
    recommended?: boolean;
}): JSX.Element;
export function PricingSection({ plan, discount, useShortFormPlanIntervals }: {
    plan: Plan;
    discount: Discount;
    useShortFormPlanIntervals?: boolean;
}): JSX.Element;
export function FeaturesSection({ plan, trialDaysAsFeature }: {
    plan: Plan;
    trialDaysAsFeature?: boolean;
}): JSX.Element;
export function HorizontalPlanCard({ plan, discount, buttonLabel, onSelectPlan, activePlan, useShortFormPlanIntervals, recommended, trialDaysAsFeature, }: {
    plan: Plan;
    discount: Discount;
    buttonLabel?: string;
    onSelectPlan: (plan: Plan) => void;
    activePlan?: boolean;
    useShortFormPlanIntervals?: boolean;
    recommended?: boolean;
    trialDaysAsFeature?: boolean;
}): JSX.Element;
export type Plan = import('@heymantle/client').Plan;
export type Discount = import('@heymantle/client').Discount;
//# sourceMappingURL=HorizontalPlanCard.d.ts.map