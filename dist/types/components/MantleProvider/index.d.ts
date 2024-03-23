export * from "./MantleProvider";
export type UsageMetric = {
    /**
     * - The ID of the usage metric
     */
    id: string;
    /**
     * - The name of the usage metric
     */
    name: string;
    /**
     * - The description of the usage metric
     */
    eventName: string;
    /**
     * - The current value of the usage metric
     */
    currentValue: number;
    /**
     * - The month to date value of the usage metric
     */
    monthToDateValue?: number;
    /**
     * - The last 24 hours value of the usage metric
     */
    last24HoursValue?: number;
    /**
     * - The last 7 days value of the usage metric
     */
    last7DaysValue?: number;
    /**
     * - The last 30 days value of the usage metric
     */
    last30DaysValue?: number;
    /**
     * - The last 90 days value of the usage metric
     */
    last90DaysValue?: number;
    /**
     * - The last 365 days value of the usage metric
     */
    last365DaysValue?: number;
    /**
     * - The all time value of the usage metric
     */
    allTimeValue?: number;
    /**
     * - The usage charge of the usage metric
     */
    usageCharge?: UsageCharge;
};
export type Feature = {
    /**
     * - The ID of the feature
     */
    id: string;
    /**
     * - The name of the feature
     */
    name: string;
    /**
     * - The description of the feature
     */
    type: "boolean" | "limit" | "limit_with_overage";
    /**
     * - The description of the feature
     */
    description?: string;
    /**
     * - The value of the feature
     */
    value: any;
    /**
     * - The display order of the feature
     */
    displayOrder: number;
};
export type AppliedDiscount = {
    /**
     * - The ID of the discount
     */
    id: string;
    /**
     * - The price after discount
     */
    priceAfterDiscount: number;
    /**
     * - The discount
     */
    discount: Discount;
    /**
     * - The date the discount ends
     */
    discountEndsAt?: string;
};
export type Subscription = {
    /**
     * - The ID of the subscription
     */
    id: string;
    /**
     * - The plan of the subscription
     */
    plan: Plan;
    /**
     * - Whether the subscription is active
     */
    active: boolean;
    /**
     * - The date the subscription was activated
     */
    activatedAt?: string;
    /**
     * - The date the subscription was cancelled
     */
    cancelledAt?: string;
    /**
     * - The date the subscription was frozen
     */
    frozenAt?: string;
    /**
     * - The features of the subscription
     */
    features: {
        [x: string]: Feature;
    };
    /**
     * - The order of the features by key
     */
    featuresOrder: Array<string>;
    /**
     * - The usage charges of the subscription
     */
    usageCharges: Array<UsageCharge>;
    /**
     * - The date the subscription was created
     */
    createdAt?: string;
    /**
     * - The URL to confirm the subscription
     */
    confirmationUrl?: URL;
    /**
     * - The capped amount of the usage charge
     */
    usageChargeCappedAmount?: number;
    /**
     * - The amount of the usage balance used
     */
    usageBalanceUsed?: number;
    appliedDiscount?: AppliedDiscount;
    /**
     * - The total amount of the plan, after discounts if applicable
     */
    total: number;
    /**
     * - The subtotal amount of the plan, before discounts if applicable
     */
    subtotal: number;
};
export type UsageCharge = {
    /**
     * - The ID of the usage charge
     */
    id: string;
    /**
     * - The amount of the usage charge
     */
    amount: number;
    /**
     * - The type of the usage charge
     */
    type: "unit" | "unit_limits" | "percent";
    /**
     * - The terms of the usage charge
     */
    terms?: string;
    /**
     * - The capped amount of the usage charge
     */
    cappedAmount: number;
    /**
     * - The event name of the usage charge
     */
    eventName?: string;
    /**
     * - The limit event name of the usage charge
     */
    limitEventName?: string;
    /**
     * - The limit minimum of the usage charge
     */
    limitMin?: number;
    /**
     * - The limit maximum of the usage charge
     */
    limitMax?: number;
};
export type Discount = {
    /**
     * - The ID of the discount
     */
    id: string;
    /**
     * - The amount of the discount
     */
    amount?: number;
    /**
     * - The currency code of the discount amount
     */
    amountCurrencyCode?: string;
    /**
     * - The percentage of the discount
     */
    percentage?: number;
    /**
     * - The duration limit of the discount in plan intervals
     */
    durationLimitInIntervals?: number;
    /**
     * - The discounted amount of plan after discount
     */
    discountedAmount: number;
};
export type Plan = {
    /**
     * - The ID of the plan
     */
    id: string;
    /**
     * - The name of the plan
     */
    name: string;
    /**
     * - The currency code of the plan
     */
    currencyCode: string;
    /**
     * - The total amount of the plan, after discounts if applicable
     */
    total: number;
    /**
     * - The subtotal amount of the plan, before discounts if applicable
     */
    subtotal: number;
    /**
     * - [Deprecated] use subtotal instead
     */
    amount: number;
    /**
     * - Whether the plan is public
     */
    public: boolean;
    /**
     * - The number of days in the trial period
     */
    trialDays: number;
    /**
     * - The interval of the plan
     */
    interval: "EVERY_30_DAYS" | "ANNUAL";
    /**
     * - The features of the plan
     */
    features: {
        [x: string]: Feature;
    };
    /**
     * - The order of the features by key
     */
    featuresOrder: Array<string>;
    /**
     * - The usage charges of the plan
     */
    usageCharges: Array<UsageCharge>;
    /**
     * - The capped amount of the usage charge
     */
    usageChargeCappedAmount?: number;
    /**
     * - The custom fields on the plan
     */
    customFields?: {
        [x: string]: any;
    };
    /**
     * - The discounts on the plan
     */
    discounts: Array<Discount>;
    /**
     * - The auto apply discount on the plan, if any
     */
    autoAppliedDiscount?: Discount;
    /**
     * - The date the plan was created
     */
    createdAt?: string;
    /**
     * - The date the plan was last updated
     */
    updatedAt?: string;
};
export type Customer = {
    /**
     * - The ID of the customer
     */
    id: string;
    /**
     * - Whether the customer is a test customer
     */
    test: boolean;
    /**
     * - The plans available to the customer
     */
    plans: Array<Plan>;
    /**
     * - The subscription of the current customer, if any
     */
    subscription?: Subscription;
    /**
     * - The features enabled for the current customer
     */
    features: {
        [x: string]: Feature;
    };
    /**
     * - The usage metrics for the current customer
     */
    usage: {
        [x: string]: UsageMetric;
    };
    /**
     * - The custom fields on the customer
     */
    customFields?: {
        [x: string]: any;
    };
};
export type TMantleContext = {
    /**
     * - The current customer
     */
    customer: Customer;
    /**
     * - The current subscription
     */
    subscription: Subscription;
    /**
     * - The current plan
     */
    currentPlan: Plan;
    /**
     * - The available plans
     */
    plans: Array<Plan>;
    /**
     * - Whether the current customer is loading
     */
    loading: boolean;
    /**
     * - A function to refetch the current customer
     */
    refetch: RefetchCallback;
    /**
     * - A function to push an event to the event queue
     */
    pushEvent: PushEventCallback;
    /**
     * - A function to check if a feature is enabled
     */
    isFeatureEnabled: FeatureEnabledCallback;
    /**
     * - A function to get the limit for a feature
     */
    limitForFeature: FeatureLimitCallback;
    /**
     * - An function to clear the event queue
     */
    clearEventQueue: ClearEventQueueCallback;
    /**
     * - The MantleClient instance
     */
    client: MantleClient;
};
export type RefetchCallback = () => Promise<void>;
export type ClearEventQueueCallback = () => Promise<void>;
export type PushEventCallback = (event: {
    eventName: string;
    properties: any;
}, clearEventQueue?: boolean) => Promise<void>;
export type FeatureEnabledCallback = (params: {
    featureKey: string;
    count?: number;
}) => boolean;
export type FeatureLimitCallback = (params: {
    featureKey: string;
}) => number;
//# sourceMappingURL=index.d.ts.map