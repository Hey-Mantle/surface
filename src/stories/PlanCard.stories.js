import { PlanCard } from '../components';
import { Plans } from './test_data/plans';

export default {
  title: 'Example/PlanCard',
  component: PlanCard,
  parameters: {
    layout: 'centered',
  },
  args: {
    onSubscribe: () => {},
  }
};

export const Selected = {
  args: {
    plan: Plans[0],
    selected: true,
  }
};

export const NotSelected = {
  args: {
    plan: Plans[0],
    selected: false,
  },
};
