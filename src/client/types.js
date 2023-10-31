/**
 * @typedef UsageMetric
 * @property {string} id - The ID of the usage metric
 * @property {string} name - The name of the usage metric
 * @property {string} eventName - The description of the usage metric
 * @property {number} currentValue - The current value of the usage metric
 * @property {number} [monthToDateValue] - The month to date value of the usage metric
 * @property {number} [last24HoursValue] - The last 24 hours value of the usage metric
 * @property {number} [last7DaysValue] - The last 7 days value of the usage metric
 * @property {number} [last30DaysValue] - The last 30 days value of the usage metric
 * @property {number} [last90DaysValue] - The last 90 days value of the usage metric
 * @property {number} [last365DaysValue] - The last 365 days value of the usage metric
 * @property {number} [allTimeValue] - The all time value of the usage metric
 * @property {UsageCharge} [usageCharge] - The usage charge of the usage metric
 */

/**
 * @typedef Feature
 * @property {string} id - The ID of the feature
 * @property {string} name - The name of the feature
 * @property {"boolean"|"limit"|"limit_with_overage"} type - The description of the feature
 * @property {string} [description] - The description of the feature
 * @property {*} value - The value of the feature
 * @property {number} displayOrder - The display order of the feature
 */

/**
 * @typedef AppliedDiscount
 * @property {string} id - The ID of the discount
 * @property {number} priceAfterDiscount - The price after discount
 * @property {Discount} discount - The discount
 * @property {string} [discountEndsAt] - The date the discount ends
 */

/**
 * @typedef Subscription
 * @property {string} id - The ID of the subscription
 * @property {Plan} plan - The plan of the subscription
 * @property {boolean} active - Whether the subscription is active
 * @property {string} [activatedAt] - The date the subscription was activated
 * @property {string} [cancelledAt] - The date the subscription was cancelled
 * @property {string} [frozenAt] - The date the subscription was frozen
 * @property {Object.<string, Feature>} features - The features of the subscription
 * @property {Array.<string>} featuresOrder - The order of the features by key
 * @property {Array.<UsageCharge>} usageCharges - The usage charges of the subscription
 * @property {string} [createdAt] - The date the subscription was created
 * @property {URL} [confirmationUrl] - The URL to confirm the subscription
 * @property {number} [usageChargeCappedAmount] - The capped amount of the usage charge
 * @property {number} [usageBalanceUsed] - The amount of the usage balance used
 * @property {AppliedDiscount} [appliedDiscount]
 * @property {number} total - The total amount of the plan, after discounts if applicable
 * @property {number} subtotal - The subtotal amount of the plan, before discounts if applicable
 */

/**
 * @typedef UsageCharge
 * @property {string} id - The ID of the usage charge
 * @property {number} amount - The amount of the usage charge
 * @property {"unit"|"unit_limits"|"percent"} type - The type of the usage charge
 * @property {string} [terms] - The terms of the usage charge
 * @property {number} cappedAmount - The capped amount of the usage charge
 * @property {string} [eventName] - The event name of the usage charge
 * @property {string} [limitEventName] - The limit event name of the usage charge
 * @property {number} [limitMin] - The limit minimum of the usage charge
 * @property {number} [limitMax] - The limit maximum of the usage charge
 */

/**
 * @typedef Discount
 * @property {string} id - The ID of the discount
 * @property {number} [amount] - The amount of the discount
 * @property {string} [amountCurrencyCode] - The currency code of the discount amount
 * @property {number} [percentage] - The percentage of the discount
 * @property {number} [durationLimitInIntervals] - The duration limit of the discount in plan intervals
 * @property {number} discountedAmount - The discounted amount of plan after discount
 */

/**
 * @typedef Plan
 * @property {string} id - The ID of the plan
 * @property {string} name - The name of the plan
 * @property {string} currencyCode - The currency code of the plan
 * @property {boolean} public - Whether the plan is public
 * @property {number} trialDays - The number of days in the trial period
 * @property {"EVERY_30_DAYS"|"ANNUAL"} interval - The interval of the plan
 * @property {Object.<string, Feature>} features - The features of the plan
 * @property {Array.<string>} featuresOrder - The order of the features by key
 * @property {Array.<UsageCharge>} usageCharges - The usage charges of the plan
 * @property {number} [usageChargeCappedAmount] - The capped amount of the usage charge
 * @property {Object.<string, Object>} [customFields] - The custom fields on the plan
 * @property {Array.<Discount>} discounts - The discounts on the plan
 * @property {Discount} [autoAppliedDiscount] - The auto apply discount on the plan, if any
 * @property {number} total - The total amount of the plan, after discounts if applicable
 * @property {number} subtotal - The subtotal amount of the plan, before discounts if applicable
 * @property {number} amount - [Deprecated] use subtotal instead
 * @property {string} [createdAt] - The date the plan was created
 * @property {string} [updatedAt] - The date the plan was last updated
 */

/**
 * @typedef Customer
 * @property {string} id - The ID of the customer
 * @property {boolean} test - Whether the customer is a test customer
 * @property {Array.<Plan>} plans - The plans available to the customer
 * @property {Subscription} [subscription] - The subscription of the current customer, if any
 * @property {Object.<string, Feature>} features - The features enabled for the current customer
 * @property {Object.<string, UsageMetric>} usage - The usage metrics for the current customer
 * @property {Object.<string, Object>} [customFields] - The custom fields on the customer
 */

module.exports = {};
