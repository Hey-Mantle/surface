import { PlanGrid } from '../components/PlanCard/PlanGrid';
import { Plans } from './test_data/plans';

export default {
  title: 'Example/PlanGrid',
  component: PlanGrid,
  parameters: {
    layout: 'centered',
  },
  args: {
    onSubscribe: () => {},
  }
};

export const MultiplePlans = {
  args: {
    plans: Plans,
    currentPlan: Plans[1],
  }
};
