import { HorizontalCards } from '../components';
import { Plans } from './test_data/plans';

export default {
  title: 'Example/HorizontalCards',
  component: HorizontalCards,
  parameters: {
    layout: 'centered',
  },
  args: {
    onSubscribe: () => {},
  }
};

export const CurrentlySubscribed = {
  args: {
    subscription: {
      plan: Plans[0],
      features: Plans[0].features,
    }
  }
};

export const NotSubscribed = {
  args: {
    subscription: null,
  },
};
