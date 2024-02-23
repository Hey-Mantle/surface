import { HighlightedCard } from '../components';
import { Plans } from './test_data/plans';
import { Customer } from './test_data/customer';

export default {
  title: 'Plans/HighlightedCard',
  component: HighlightedCard,
  tags: ['autodocs'],
  argTypes: {
    pageWidth: {
      options: ["default", "narrow", "full"],
      control: { type: 'radio' },
    },
  },
  args: {
    pageWidth: "default",
    showRecommendedBadge: true,
    showCurrencySymbol: true,
    showPlanIntervalToggle: true,
    showTrialDaysAsFeature: true,
    useShortFormPlanIntevals: true,
    addSpacingToNonRecommendedPlans: true,
    customFieldCta: null,
    customFieldPlanRecommended: "Recommended",
    showCustomPlans: false,
    backUrl: "",
    onSubscribe: () => {},
    customer: Customer,
    plans: Plans,
  }
};

export const FourColumns = {
  args: {},
};

export const ThreeColumns = {
  args: {
    plans: Plans.filter(plan => plan.name !== "Ultra"),
  },
};

export const TwoColumns = {
  args: {
    plans: Plans.filter(plan => plan.name !== "Ultra" && plan.name !== "Advanced"),
  }
};

export const OneColumn = {
  args: {
    plans: Plans.filter(plan => plan.name !== "Ultra" && plan.name !== "Advanced" && plan.name !== "Pro"),
  }
};