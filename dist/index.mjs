import e, { createContext as se, useState as x, useEffect as ie, useContext as oe } from "react";
import { Page as ee, ButtonGroup as te, Button as k, Layout as z, BlockStack as m, Banner as ne, Grid as v, Card as J, Divider as ae, Box as L, Text as i, InlineStack as _, Badge as re, Icon as $ } from "@shopify/polaris";
class ce {
  /**
   * Creates a new MantleClient. If being used in the browser, or any frontend code, never use the apiKey parameter,
   * always use the customerApiToken for the customer that is currently authenticated on the frontend.
   * @param {Object} params
   * @param {string} params.appId - The Mantle App ID set up on your app in your Mantle account.
   * @param {string} params.apiKey - The Mantle App API key set up on your app in your Mantle account. This should never be used in the browser.
   * @param {string} params.customerApiToken - The Mantle Customer API Token returned by the /identify endpoint. This should be used in the browser.
   * @param {string} [params.apiUrl] - The Mantle API URL to use
   */
  constructor({ appId: r, apiKey: C, customerApiToken: d, apiUrl: A = "https://appapi.heymantle.com/v1" }) {
    if (!r)
      throw new Error("MantleClient appId is required");
    if (typeof window < "u" && C)
      throw new Error("MantleClient apiKey should never be used in the browser");
    if (!C && !d)
      throw new Error("MantleClient one of apiKey or customerApiToken is required");
    this.appId = r, this.apiKey = C, this.customerApiToken = d, this.apiUrl = A;
  }
  /**
   * Makes a request to the Mantle API
   * @param {Object} params
   * @param {"customer"|"usage_events"|"subscriptions"} params.path - The path to request
   * @param {"GET"|"POST"|"PUT"|"DELETE"} params.method - The HTTP method to use. Defaults to GET
   * @param {JSON} [params.body] - The request body
   * @returns {Promise<JSON>} a promise that resolves to the response body
   */
  async mantleRequest({ path: r, method: C = "GET", body: d }) {
    try {
      return await (await fetch(`${this.apiUrl}${r.startsWith("/") ? "" : "/"}${r}`, {
        method: C,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-Mantle-App-Id": this.appId,
          ...this.apiKey ? { "X-Mantle-App-Api-Key": this.apiKey } : {},
          ...this.customerApiToken ? { "X-Mantle-Customer-Api-Token": this.customerApiToken } : {}
        },
        ...d && {
          body: JSON.stringify(d)
        }
      })).json();
    } catch (A) {
      throw console.error(`[mantleRequest] ${r} error: ${A.message}`), A;
    }
  }
  /**
   * Identify the customer with Mantle. One of `platformId` or `myshopifyDomain` are required.
   * @param {Object} params
   * @param {string} params.platformId - The unique ID of the customer on the app platform, for Shopify this should be the Shop ID
   * @param {string} params.myshopifyDomain - The myshopify.com domain of the Shopify store
   * @param {string} [params.platform] - The platform the customer is on, defaults to shopify
   * @param {string} params.accessToken - The access token for the platform API, for Shopify apps, this should be the Shop access token
   * @param {string} params.name - The name of the customer
   * @param {string} params.email - The email of the customer
   * @param {Object.<string, Object>} [params.customFields] - Custom fields to store on the customer, must be a JSON object
   * @returns {Promise<Object.<string, string>} a promise that resolves to an object with the customer API token, `apiToken`
   */
  async identify({
    platformId: r,
    myshopifyDomain: C,
    platform: d = "shopify",
    accessToken: A,
    name: o,
    email: O,
    customFields: b
  }) {
    return await this.mantleRequest({
      path: "identify",
      method: "POST",
      body: { platformId: r, myshopifyDomain: C, platform: d, accessToken: A, name: o, email: O, customFields: b }
    });
  }
  /**
   * Get the customer associated with the current customer API token
   * @returns {Promise<Customer>} a promise that resolves to the current customer
   */
  async getCustomer() {
    return (await this.mantleRequest({ path: "customer" })).customer;
  }
  /**
   * Subscribe to a plan, or list of plans. Must provide either `planId` or `planIds`
   * @param {Object} params - The subscription options
   * @param {string} params.planId - The ID of the plan to subscribe to
   * @param {string[]} params.planIds - List of plan IDs to subscribe to
   * @param {string} params.discountId - The ID of the discount to apply to the subscription
   * @param {string} params.returnUrl - The URL to redirect to after the subscription is complete
   * @param {string} [params.billingProvider] - The name of the billing provider to use, if none is provided, use sensible default
   * @returns {Promise<Subscription>} a promise that resolves to the created subscription
   */
  async subscribe({ planId: r, planIds: C, discountId: d, returnUrl: A, billingProvider: o }) {
    return await this.mantleRequest({
      path: "subscriptions",
      method: "POST",
      body: { planId: r, planIds: C, discountId: d, returnUrl: A, billingProvider: o }
    });
  }
  /**
   * Cancel the current subscription
   * @param {Object} params - The subscription options
   * @param {string} [params.cancelReason] - The reason for cancelling the subscription
   * @returns {Promise<Subscription>} a promise that resolves to the cancelled subscription
   */
  async cancelSubscription({ cancelReason: r } = {}) {
    return await this.mantleRequest({
      path: "subscriptions",
      method: "DELETE",
      ...r && {
        body: { cancelReason: r }
      }
    });
  }
  /**
   * Update the subscription
   * @param {Object} params - The subscription options
   * @param {string} params.id - The ID of the subscription to update
   * @param {number} params.cappedAmount - The capped amount of the usage charge
   * @returns {Promise<Subscription>} a promise that resolves to the updated subscription
   */
  async updateSubscription({ id: r, cappedAmount: C }) {
    return await this.mantleRequest({
      path: "subscriptions",
      method: "PUT",
      body: { id: r, cappedAmount: C }
    });
  }
  /**
   * Send a usage event
   * @param {Object} params - The usage event options
   * @param {string} [params.eventId] - The ID of the event
   * @param {string} params.eventName - The name of the event which can be tracked by usage metrics
   * @param {string} params.customerId - Required if customerApiToken is not used for authentication. One of either the customer token, Mantle customer ID, platform ID / Shopify Shop ID, Shopify myshopify.com domain
   * @param {Object.<string, any>} params.properties - The event properties
   * @returns {Promise<boolean>} true if the event was sent successfully
   */
  async sendUsageEvent({ eventId: r, eventName: C, customerId: d, properties: A = {} }) {
    return await this.mantleRequest({
      path: "usage_events",
      method: "POST",
      body: {
        eventId: r,
        eventName: C,
        ...d ? { customerId: d } : {},
        properties: A
      }
    });
  }
  /**
   * Send multiple usage events of the same type in bulk, for example, when tracking page views
   * @param {Object} params - The usage event options
   * @param {UsageEvent[]} params.events - The events to send
   * @returns {Promise<boolean>} true if the events were sent successfully
   */
  async sendUsageEvents({ events: r }) {
    return await this.mantleRequest({
      path: "usage_events",
      method: "POST",
      body: {
        events: r
      }
    });
  }
}
var ue = {
  MantleClient: ce
};
const le = se(), me = ({ feature: u, count: r = 0 }) => (u == null ? void 0 : u.type) === "boolean" ? u.value : (u == null ? void 0 : u.type) === "limit" ? r < u.value || u.value === -1 : !1, ge = ({
  appId: u,
  customerApiToken: r,
  apiUrl: C = "https://appapi.heymantle.com/v1",
  children: d
}) => {
  const A = new ue.MantleClient({ appId: u, customerApiToken: r, apiUrl: C }), [o, O] = x(null), [b, U] = x(!0), [V, y] = x(null), T = async () => {
    try {
      U(!0);
      const g = await A.getCustomer();
      O(g);
    } catch (g) {
      y(g);
    } finally {
      U(!1);
    }
  }, F = async ({ eventId: g, eventName: N, properties: B = {} }) => {
    await A.sendUsageEvent({ eventId: g, eventName: N, properties: B });
  }, M = async ({ planId: g, discountId: N, returnUrl: B }) => await A.subscribe({ planId: g, discountId: N, returnUrl: B }), D = async () => await A.cancelSubscription();
  ie(() => {
    r && T();
  }, [r]);
  const w = (o == null ? void 0 : o.plans) || [], E = o == null ? void 0 : o.subscription, Y = E == null ? void 0 : E.plan;
  return /* @__PURE__ */ e.createElement(
    le.Provider,
    {
      value: {
        customer: o,
        subscription: E,
        plans: w,
        loading: b,
        error: V,
        client: A,
        pushEvent: F,
        subscribe: M,
        cancelSubscription: D,
        isFeatureEnabled: ({ featureKey: g, count: N = 0 }) => o != null && o.features[g] ? me({ feature: o.features[g], count: N }) : !1,
        limitForFeature: ({ featureKey: g }) => o != null && o.features[g] && Y.features[g].type === "limit" ? o.features[g].value : -1,
        refetch: async () => {
          await T();
        }
      }
    },
    d
  );
}, Se = () => {
  const u = oe(le);
  if (u === void 0)
    throw new Error("useMantle must be used within a MantleProvider");
  return u;
};
var j = function(r) {
  return /* @__PURE__ */ e.createElement("svg", Object.assign({
    viewBox: "0 0 20 20"
  }, r), /* @__PURE__ */ e.createElement("path", {
    fillRule: "evenodd",
    d: "M15.78 5.97a.75.75 0 0 1 0 1.06l-6.5 6.5a.75.75 0 0 1-1.06 0l-3.25-3.25a.75.75 0 1 1 1.06-1.06l2.72 2.72 5.97-5.97a.75.75 0 0 1 1.06 0Z"
  }));
};
j.displayName = "CheckIcon";
var Q = function(r) {
  return /* @__PURE__ */ e.createElement("svg", Object.assign({
    viewBox: "0 0 20 20"
  }, r), /* @__PURE__ */ e.createElement("path", {
    d: "M10.75 6.75a.75.75 0 0 0-1.5 0v2.5h-2.5a.75.75 0 0 0 0 1.5h2.5v2.5a.75.75 0 0 0 1.5 0v-2.5h2.5a.75.75 0 0 0 0-1.5h-2.5v-2.5Z"
  }));
};
Q.displayName = "PlusIcon";
const R = {
  BACK: "Back",
  CURRENCY_SYMBOL: "$",
  CURRENT_PLAN: "Current plan",
  CUSTOM_PLANS: "Custom plans",
  CUSTOM_PLANS_DESCRIPTION: "Plans tailored to your specific needs",
  FREE_TRIAL_LENGTH: "{{ trialDays }}-day free trial",
  MONTH: "month",
  MONTH_SHORT: "mo",
  MONTHLY: "Monthly",
  MOST_POPULAR: "Most popular",
  PER: "/",
  PLANS: "Plans",
  SELECT_PLAN: "Select plan",
  SUBSCRIBE_SUCCESS_TITLE: "Subscription successful",
  SUBSCRIBE_SUCCESS_BODY: "Thanks for subscribing to our app!",
  YEAR: "year",
  YEAR_SHORT: "yr",
  YEARLY: "Yearly"
}, P = {
  EVERY_30_DAYS: "EVERY_30_DAYS",
  ANNUAL: "ANNUAL"
}, Ae = ({
  customer: u,
  plans: r,
  onSubscribe: C,
  backUrl: d = "",
  // string: URL to use as "back" breadcrumb URL. leave as empty string or null to hide the back button
  showRecommendedBadge: A = !0,
  // boolean
  customFieldCta: o = null,
  // string: value of the custom plan field to use as the CTA. e.g. "cta"
  customFieldPlanRecommended: O = "Recommended",
  // string: value of the custom plan field to use as the recommended badge
  showCurrencySymbol: b = !0,
  // boolean
  showPlanIntervalToggle: U = !0,
  // boolean
  showTrialDaysAsFeature: V = !0,
  // boolean
  useShortFormPlanIntervals: y = !0,
  // boolean: e.g. show "$ / mo" instead of "$ / month"
  pageWidth: T = "default",
  // string: "full", "narrow", or "default"
  showCustomPlans: F = !0
  // boolean: show custom plans
}) => {
  const M = u == null ? void 0 : u.subscription, D = new URLSearchParams(window.location.search), w = r.some((n) => n.interval === P.ANNUAL) && r.some((n) => n.interval === P.EVERY_30_DAYS), E = r.find((n) => n.id === (M == null ? void 0 : M.plan.id)), [Y, g] = x(E ? E.interval : w ? P.ANNUAL : P.EVERY_30_DAYS), N = r.filter((n) => n.availability !== "customerTag" && n.availability !== "customer"), B = U && w ? N.filter((n) => n.interval === Y) : N, p = F ? r.filter((n) => n.availability === "customerTag" || n.availability === "customer") : [], [f, Z] = x(D.get("subscribed") === "true"), W = (n = B.length) => n % 4 === 0 ? { xs: 6, sm: 6, md: 2, lg: 3, xl: 3 } : n % 3 === 0 ? { xs: 6, sm: 6, md: 2, lg: 4, xl: 4 } : n % 2 === 0 ? { xs: 6, sm: 6, md: 3, lg: 6, xl: 6 } : n === 1 ? { xs: 6, sm: 6, md: 6, lg: 12, xl: 12 } : { xs: 6, sm: 6, md: 2, lg: 4, xl: 4 }, q = ({ plan: n, discount: t }) => {
    const l = n.customFields && n.customFields[O];
    return /* @__PURE__ */ e.createElement(m, null, /* @__PURE__ */ e.createElement(_, { align: "space-between", gap: "100" }, /* @__PURE__ */ e.createElement(i, { variant: "bodyLg" }, n.name), l && A && /* @__PURE__ */ e.createElement(re, { tone: "success" }, R.MOST_POPULAR)), n.description && /* @__PURE__ */ e.createElement(i, { tone: "subdued" }, n.description));
  }, X = ({ plan: n, discount: t }) => /* @__PURE__ */ e.createElement(m, { gap: "100" }, V && n.trialDays !== 0 && /* @__PURE__ */ e.createElement(_, { align: "start", gap: "100" }, /* @__PURE__ */ e.createElement(L, null, /* @__PURE__ */ e.createElement($, { source: j, tone: "positive" })), /* @__PURE__ */ e.createElement(i, { tone: "subdued" }, R.FREE_TRIAL_LENGTH.replace("{{ trialDays }}", n.trialDays))), n.featuresOrder.map((l, s) => {
    const c = n.features[l];
    if (c.type !== "boolean" || c.value === !0)
      return /* @__PURE__ */ e.createElement(_, { key: `plan-feature-${s}`, align: "start", gap: "100" }, /* @__PURE__ */ e.createElement(L, null, /* @__PURE__ */ e.createElement($, { source: j, tone: "positive" })), c.type === "boolean" ? /* @__PURE__ */ e.createElement(i, { tone: "subdued" }, c.name) : /* @__PURE__ */ e.createElement(i, { tone: "subdued" }, c.value, " ", c.name));
  })), G = ({ plan: n, discount: t }) => /* @__PURE__ */ e.createElement(m, { gap: "100" }, t ? /* @__PURE__ */ e.createElement(_, { blockAlign: "center", gap: "200" }, /* @__PURE__ */ e.createElement(i, { variant: "headingXl" }, b && R.CURRENCY_SYMBOL, t.discountedAmount), /* @__PURE__ */ e.createElement(i, { variant: "headingXl", tone: "subdued", fontWeight: "medium", textDecorationLine: "line-through" }, n.amount), /* @__PURE__ */ e.createElement(i, { variant: "bodyLg", tone: "subdued" }, R.PER, " ", n.interval === P.ANNUAL ? y ? R.YEAR_SHORT : R.YEAR : y ? R.MONTH_SHORT : R.MONTH)) : /* @__PURE__ */ e.createElement(_, { blockAlign: "center", gap: "200" }, /* @__PURE__ */ e.createElement(i, { alignment: "center", variant: "headingXl" }, b && R.CURRENCY_SYMBOL, n.amount), /* @__PURE__ */ e.createElement(i, { alignment: "center", variant: "bodyLg", tone: "subdued" }, R.PER, " ", n.interval === P.ANNUAL ? y ? R.YEAR_SHORT : R.YEAR : y ? R.MONTH_SHORT : R.MONTH)), n.usageCharges.length > 0 && /* @__PURE__ */ e.createElement(m, null, n.usageCharges.map((l, s) => /* @__PURE__ */ e.createElement(_, { key: `plan-usageCharge-${s}`, align: "start", gap: "100" }, /* @__PURE__ */ e.createElement(L, null, /* @__PURE__ */ e.createElement($, { source: Q, tone: "positive" })), /* @__PURE__ */ e.createElement(i, { variant: "bodyLg" }, l.terms))))), a = ({ plan: n, discount: t }) => {
    const l = o && n.customFields[o], s = n.customFields && n.customFields[O];
    return /* @__PURE__ */ e.createElement(
      k,
      {
        size: "large",
        variant: s ? "primary" : "secondary",
        onClick: () => C({ planId: n.id, discountId: t == null ? void 0 : t.id }),
        disabled: (E == null ? void 0 : E.id) === n.id
      },
      (E == null ? void 0 : E.id) === n.id ? R.CURRENT_PLAN : l ? n.customFields[o] : R.SELECT_PLAN
    );
  };
  return /* @__PURE__ */ e.createElement(
    ee,
    {
      title: R.PLANS,
      backAction: d !== "" ? { content: R.BACK, url: d } : void 0,
      secondaryActions: U && w ? /* @__PURE__ */ e.createElement(te, { variant: "segmented" }, /* @__PURE__ */ e.createElement(
        k,
        {
          pressed: Y === P.EVERY_30_DAYS,
          onClick: () => g(P.EVERY_30_DAYS)
        },
        R.MONTHLY
      ), /* @__PURE__ */ e.createElement(
        k,
        {
          pressed: Y === P.ANNUAL,
          onClick: () => g(P.ANNUAL)
        },
        R.YEARLY
      )) : void 0,
      fullWidth: T === "full",
      narrowWidth: T === "narrow"
    },
    /* @__PURE__ */ e.createElement(z, null, /* @__PURE__ */ e.createElement(z.Section, null, /* @__PURE__ */ e.createElement(m, { gap: "1000" }, f && /* @__PURE__ */ e.createElement(
      ne,
      {
        tone: "success",
        title: R.SUBSCRIBE_SUCCESS_TITLE,
        onDismiss: () => {
          Z(!1), window.history.replaceState({}, document.title, window.location.pathname);
        }
      },
      R.SUBSCRIBE_SUCCESS_BODY
    ), /* @__PURE__ */ e.createElement(v, null, B.map((n, t) => {
      var s;
      const l = ((s = n.discounts) == null ? void 0 : s.length) > 0 ? n.discounts.reduce((c, K) => c.discountedAmount < K.discountedAmount ? c : K) : null;
      return /* @__PURE__ */ e.createElement(v.Cell, { key: `plan-${t}`, columnSpan: W() }, /* @__PURE__ */ e.createElement(J, null, /* @__PURE__ */ e.createElement(m, { gap: "400" }, q({ plan: n, discount: l }), G({ plan: n, discount: l }), a({ plan: n, discount: l }), X({ plan: n, discount: l }))));
    })), (p == null ? void 0 : p.length) > 0 && /* @__PURE__ */ e.createElement(ae, { borderColor: "border" }), (p == null ? void 0 : p.length) > 0 && /* @__PURE__ */ e.createElement(m, { gap: "300" }, /* @__PURE__ */ e.createElement(L, { paddingInline: { xs: 400, sm: 0 } }, /* @__PURE__ */ e.createElement(i, { variant: "headingMd" }, R.CUSTOM_PLANS)), /* @__PURE__ */ e.createElement(v, null, p.map((n, t) => {
      var s;
      const l = ((s = n.discounts) == null ? void 0 : s.length) > 0 ? n.discounts.reduce((c, K) => c.discountedAmount < K.discountedAmount ? c : K) : null;
      return /* @__PURE__ */ e.createElement(v.Cell, { key: `custom-plan-${t}`, columnSpan: W() }, /* @__PURE__ */ e.createElement(J, null, /* @__PURE__ */ e.createElement(m, { gap: "400" }, q({ plan: n, discount: l }), G({ plan: n, discount: l }), a({ plan: n, discount: l }), X({ plan: n, discount: l }))));
    }))))))
  );
}, h = {
  BACK: "Back",
  CURRENCY_SYMBOL: "$",
  CURRENT_PLAN: "Current plan",
  CUSTOM_PLANS: "Custom plans",
  CUSTOM_PLANS_DESCRIPTION: "Plans tailored to your specific needs",
  FREE_TRIAL_LENGTH: "{{ trialDays }}-day free trial",
  MONTH: "month",
  MONTH_SHORT: "mo",
  MONTHLY: "Monthly",
  MOST_POPULAR: "Most popular",
  PER: "/",
  PLANS: "Plans",
  SELECT_PLAN: "Select plan",
  SUBSCRIBE_SUCCESS_TITLE: "Subscription successful",
  SUBSCRIBE_SUCCESS_BODY: "Thanks for subscribing to our app!",
  YEAR: "year",
  YEAR_SHORT: "yr",
  YEARLY: "Yearly"
}, H = {
  EVERY_30_DAYS: "EVERY_30_DAYS",
  ANNUAL: "ANNUAL"
}, Re = ({
  customer: u,
  plans: r,
  onSubscribe: C,
  backUrl: d = "",
  // string: URL to use as "back" breadcrumb URL. leave as empty string or null to hide the back button
  showRecommendedBadge: A = !0,
  // boolean
  customFieldCta: o = null,
  // string: value of the custom plan field to use as the CTA. e.g. "cta"
  customFieldPlanRecommended: O = "Recommended",
  // string: value of the custom plan field to use as the recommended badge
  addSpacingToNonRecommendedPlans: b = !0,
  // boolean
  showCurrencySymbol: U = !0,
  // boolean
  showPlanIntervalToggle: V = !0,
  // boolean
  showTrialDaysAsFeature: y = !0,
  // boolean
  useShortFormPlanIntervals: T = !0,
  // boolean: e.g. show "$ / mo" instead of "$ / month"
  pageWidth: F = "default",
  // string: "full", "narrow", or "default"
  showCustomPlans: M = !0
  // boolean: show custom plans
}) => {
  const D = u == null ? void 0 : u.subscription, w = new URLSearchParams(window.location.search), E = r.some((t) => t.interval === H.ANNUAL) && r.some((t) => t.interval === H.EVERY_30_DAYS), Y = r.find((t) => t.id === (D == null ? void 0 : D.plan.id)), [g, N] = x(Y ? Y.interval : E ? H.ANNUAL : H.EVERY_30_DAYS), B = r.filter((t) => t.availability !== "customerTag" && t.availability !== "customer"), p = V && E ? B.filter((t) => t.interval === g) : B, f = M ? r.filter((t) => t.availability === "customerTag" || t.availability === "customer") : [], [Z, W] = x(w.get("subscribed") === "true"), q = (t = p.length) => t % 4 === 0 ? { xs: 6, sm: 6, md: 2, lg: 3, xl: 3 } : t % 3 === 0 ? { xs: 6, sm: 6, md: 2, lg: 4, xl: 4 } : t % 2 === 0 ? { xs: 6, sm: 6, md: 3, lg: 6, xl: 6 } : t === 1 ? { xs: 6, sm: 6, md: 6, lg: 12, xl: 12 } : { xs: 6, sm: 6, md: 2, lg: 4, xl: 4 }, X = () => p.length % 4 === 0 ? 4 : p.length % 3 === 0 ? 3 : p.length % 2 === 0 ? 2 : p.length === 1 ? 1 : 4, G = (t) => /* @__PURE__ */ e.createElement(m, { gap: "100" }, /* @__PURE__ */ e.createElement(i, { variant: "headingMd", alignment: "center" }, t.name), t.description && /* @__PURE__ */ e.createElement(i, { variant: "bodyLg", tone: "subdued", alignment: "center" }, t.description)), a = (t) => /* @__PURE__ */ e.createElement(m, { gap: "300" }, y && t.trialDays !== 0 && /* @__PURE__ */ e.createElement(_, { align: "center", blockAlign: "center", gap: "100" }, /* @__PURE__ */ e.createElement(L, null, /* @__PURE__ */ e.createElement($, { source: j, tone: "positive" })), /* @__PURE__ */ e.createElement(i, { tone: "subdued" }, h.FREE_TRIAL_LENGTH.replace("{{ trialDays }}", t.trialDays))), t.featuresOrder.map((l, s) => {
    const c = t.features[l];
    if (c.type !== "boolean" || c.value === !0)
      return /* @__PURE__ */ e.createElement(_, { key: `plan-feature-${s}`, align: "center", gap: "100" }, /* @__PURE__ */ e.createElement(L, null, /* @__PURE__ */ e.createElement($, { source: j, tone: "positive" })), c.type === "boolean" ? /* @__PURE__ */ e.createElement(i, { tone: "subdued" }, c.name) : /* @__PURE__ */ e.createElement(i, { tone: "subdued" }, c.value, " ", c.name));
  })), n = (t) => {
    let l = t.amount;
    for (const s of t.discounts)
      l = s.percentage ? t.amount - t.amount * (s.percentage / 100) : t.amount - s.amount;
    return /* @__PURE__ */ e.createElement(m, { gap: "100" }, t.discounts.length > 0 ? /* @__PURE__ */ e.createElement(_, { align: "center", blockAlign: "center", gap: "200" }, /* @__PURE__ */ e.createElement(i, { variant: "heading3xl" }, U && h.CURRENCY_SYMBOL, l), /* @__PURE__ */ e.createElement(i, { variant: "heading3xl", tone: "subdued", fontWeight: "medium", textDecorationLine: "line-through" }, t.amount), /* @__PURE__ */ e.createElement(i, { variant: "bodyLg", tone: "subdued" }, h.PER, " ", t.interval === H.ANNUAL ? T ? h.YEAR_SHORT : h.YEAR : T ? h.MONTH_SHORT : h.MONTH)) : /* @__PURE__ */ e.createElement(_, { align: "center", blockAlign: "center", gap: "200" }, /* @__PURE__ */ e.createElement(i, { alignment: "center", variant: "heading3xl" }, U && h.CURRENCY_SYMBOL, t.amount), /* @__PURE__ */ e.createElement(i, { alignment: "center", variant: "bodyLg", tone: "subdued" }, h.PER, " ", t.interval === H.ANNUAL ? T ? h.YEAR_SHORT : h.YEAR : T ? h.MONTH_SHORT : h.MONTH)), t.usageCharges.length > 0 && /* @__PURE__ */ e.createElement(m, null, t.usageCharges.map((s, c) => /* @__PURE__ */ e.createElement(_, { key: `plan-usageCharge-${c}`, align: "center", gap: "100" }, /* @__PURE__ */ e.createElement(L, null, /* @__PURE__ */ e.createElement($, { source: Q, tone: "positive" })), /* @__PURE__ */ e.createElement(i, { variant: "bodyLg" }, s.terms)))));
  };
  return /* @__PURE__ */ e.createElement(
    ee,
    {
      title: h.PLANS,
      backAction: d && d !== "" ? { content: h.BACK, url: d } : void 0,
      secondaryActions: V && E ? /* @__PURE__ */ e.createElement(te, { variant: "segmented" }, /* @__PURE__ */ e.createElement(
        k,
        {
          pressed: g === H.EVERY_30_DAYS,
          onClick: () => N(H.EVERY_30_DAYS)
        },
        h.MONTHLY
      ), /* @__PURE__ */ e.createElement(
        k,
        {
          pressed: g === H.ANNUAL,
          onClick: () => N(H.ANNUAL)
        },
        h.YEARLY
      )) : void 0,
      fullWidth: F === "full",
      narrowWidth: F === "narrow"
    },
    /* @__PURE__ */ e.createElement(L, { paddingBlockEnd: "800" }, /* @__PURE__ */ e.createElement(z, null, /* @__PURE__ */ e.createElement(z.Section, null, /* @__PURE__ */ e.createElement(m, { gap: "1000" }, Z && /* @__PURE__ */ e.createElement(
      ne,
      {
        tone: "success",
        title: h.SUBSCRIBE_SUCCESS_TITLE,
        onDismiss: () => {
          W(!1), window.history.replaceState({}, document.title, window.location.pathname);
        }
      },
      h.SUBSCRIBE_SUCCESS_BODY
    ), /* @__PURE__ */ e.createElement(v, { columns: X() }, p.map((t, l) => {
      const s = t.customFields && t.customFields[O], c = o && t.customFields[o];
      return /* @__PURE__ */ e.createElement(v.Cell, { key: `plan-${l}`, columnSpan: q() }, /* @__PURE__ */ e.createElement(
        L,
        {
          position: "relative",
          minHeight: "100%"
        },
        /* @__PURE__ */ e.createElement(
          L,
          {
            paddingBlock: !b || s ? void 0 : "800",
            minHeight: "100%"
          },
          /* @__PURE__ */ e.createElement(
            L,
            {
              background: s ? "bg-surface" : "bg-surface-secondary",
              borderStyle: "solid",
              borderColor: "border",
              borderWidth: "025",
              paddingBlock: b && s ? "1600" : "800",
              paddingInline: "400",
              borderRadius: "200",
              minHeight: "calc(100% - calc(var(--p-space-800) * 2))"
            },
            /* @__PURE__ */ e.createElement(m, { gap: "800" }, /* @__PURE__ */ e.createElement(m, { gap: "400" }, G(t), n(t)), /* @__PURE__ */ e.createElement(
              k,
              {
                size: "large",
                variant: s ? "primary" : "secondary",
                onClick: () => C(t)
              },
              c ? t.customFields[o] : h.SELECT_PLAN
            ), a(t), s && A && /* @__PURE__ */ e.createElement(_, { key: `plan-feature-${l}`, align: "center", gap: "100" }, /* @__PURE__ */ e.createElement(re, { tone: "success" }, h.MOST_POPULAR)))
          )
        )
      ));
    })), (f == null ? void 0 : f.length) > 0 && /* @__PURE__ */ e.createElement(ae, { borderColor: "border" }), (f == null ? void 0 : f.length) > 0 && /* @__PURE__ */ e.createElement(m, { gap: "300" }, /* @__PURE__ */ e.createElement(L, { paddingInline: { xs: 400, sm: 0 } }, /* @__PURE__ */ e.createElement(i, { variant: "headingMd" }, h.CUSTOM_PLANS)), /* @__PURE__ */ e.createElement(v, null, f.map((t, l) => {
      const s = t.customFields && t.customFields[O], c = o && t.customFields[o];
      return /* @__PURE__ */ e.createElement(v.Cell, { key: `custom-plan-${l}`, columnSpan: q(f.length) }, /* @__PURE__ */ e.createElement(J, null, /* @__PURE__ */ e.createElement(m, { gap: "400" }, G(t), n(t), /* @__PURE__ */ e.createElement(
        k,
        {
          size: "large",
          variant: s ? "primary" : "secondary",
          onClick: () => C(t)
        },
        c ? t.customFields[o] : h.SELECT_PLAN
      ), a(t))));
    })))))))
  );
}, S = {
  BACK: "Back",
  CURRENCY_SYMBOL: "$",
  CURRENT_PLAN: "Current plan",
  CUSTOM_PLANS: "Custom plans",
  CUSTOM_PLANS_DESCRIPTION: "Plans tailored to your specific needs",
  FEATURES: "Features on this plan",
  FREE_TRIAL_LENGTH: "{{ trialDays }}-day free trial",
  MONTH: "month",
  MONTH_SHORT: "mo",
  MONTHLY: "Monthly",
  MOST_POPULAR: "Most popular",
  PER: "/",
  PLANS: "Plans",
  SELECT_PLAN: "Select plan",
  SUBSCRIBE_SUCCESS_TITLE: "Subscription successful",
  SUBSCRIBE_SUCCESS_BODY: "Thanks for subscribing to our app!",
  YEAR: "year",
  YEAR_SHORT: "yr",
  YEARLY: "Yearly"
}, I = {
  EVERY_30_DAYS: "EVERY_30_DAYS",
  ANNUAL: "ANNUAL"
}, he = ({
  customer: u,
  plans: r,
  onSubscribe: C,
  backUrl: d = "",
  // string: URL to use as "back" breadcrumb URL. leave as empty string or null to hide the back button
  showRecommendedBadge: A = !0,
  // boolean
  customFieldCta: o = null,
  // string: value of the custom plan field to use as the CTA. e.g. "cta"
  customFieldPlanRecommended: O = "Recommended",
  // string: value of the custom plan field to use as the recommended badge
  showCurrencySymbol: b = !0,
  // boolean
  showPlanIntervalToggle: U = !1,
  // boolean
  showTrialDaysAsFeature: V = !0,
  // boolean
  useShortFormPlanIntervals: y = !0,
  // boolean: e.g. show "$ / mo" instead of "$ / month"
  pageWidth: T = "default",
  // string: "full", "narrow", or "default"
  showCustomPlans: F = !0
  // boolean: show custom plans
}) => {
  const M = u == null ? void 0 : u.subscription, D = new URLSearchParams(window.location.search), w = r.some((a) => a.interval === I.ANNUAL) && r.some((a) => a.interval === I.EVERY_30_DAYS), E = r.find((a) => a.id === (M == null ? void 0 : M.plan.id)), [Y, g] = x(E ? E.interval : w ? I.ANNUAL : I.EVERY_30_DAYS), N = r.filter((a) => a.availability !== "customerTag" && a.availability !== "customer"), B = U && w ? N.filter((a) => a.interval === Y) : N, p = F ? r.filter((a) => a.availability === "customerTag" || a.availability === "customer") : [], [f, Z] = x(D.get("subscribed") === "true"), W = ({ plan: a, discount: n }) => /* @__PURE__ */ e.createElement(m, null, /* @__PURE__ */ e.createElement(i, { variant: "bodyLg" }, a.name), a.description && /* @__PURE__ */ e.createElement(i, { tone: "subdued" }, a.description)), q = ({ plan: a, discount: n }) => /* @__PURE__ */ e.createElement(m, { gap: "200" }, /* @__PURE__ */ e.createElement(i, { fontWeight: "medium" }, S.FEATURES), /* @__PURE__ */ e.createElement(m, { gap: "100" }, V && a.trialDays !== 0 && /* @__PURE__ */ e.createElement(_, { align: "start", gap: "100" }, /* @__PURE__ */ e.createElement(L, null, /* @__PURE__ */ e.createElement($, { source: j, tone: "positive" })), /* @__PURE__ */ e.createElement(i, { tone: "subdued" }, S.FREE_TRIAL_LENGTH.replace("{{ trialDays }}", a.trialDays))), a.featuresOrder.map((t, l) => {
    const s = a.features[t];
    if (s.type !== "boolean" || s.value === !0)
      return /* @__PURE__ */ e.createElement(_, { key: `plan-feature-${l}`, align: "start", gap: "100" }, /* @__PURE__ */ e.createElement(L, null, /* @__PURE__ */ e.createElement($, { source: j, tone: "positive" })), s.type === "boolean" ? /* @__PURE__ */ e.createElement(i, { tone: "subdued" }, s.name) : /* @__PURE__ */ e.createElement(i, { tone: "subdued" }, s.value, " ", s.name));
  }))), X = ({ plan: a, discount: n }) => /* @__PURE__ */ e.createElement(m, { gap: "100" }, n ? /* @__PURE__ */ e.createElement(_, { blockAlign: "center", gap: "200" }, /* @__PURE__ */ e.createElement(i, { variant: "headingXl" }, b && S.CURRENCY_SYMBOL, n.discountedAmount), /* @__PURE__ */ e.createElement(i, { variant: "headingXl", tone: "subdued", fontWeight: "medium", textDecorationLine: "line-through" }, a.amount), /* @__PURE__ */ e.createElement(i, { variant: "bodyLg", tone: "subdued" }, S.PER, " ", a.interval === I.ANNUAL ? y ? S.YEAR_SHORT : S.YEAR : y ? S.MONTH_SHORT : S.MONTH)) : /* @__PURE__ */ e.createElement(_, { blockAlign: "center", gap: "200" }, /* @__PURE__ */ e.createElement(i, { alignment: "center", variant: "headingXl" }, b && S.CURRENCY_SYMBOL, a.amount), /* @__PURE__ */ e.createElement(i, { alignment: "center", variant: "bodyLg", tone: "subdued" }, S.PER, " ", a.interval === I.ANNUAL ? y ? S.YEAR_SHORT : S.YEAR : y ? S.MONTH_SHORT : S.MONTH)), a.usageCharges.length > 0 && /* @__PURE__ */ e.createElement(m, null, a.usageCharges.map((t, l) => /* @__PURE__ */ e.createElement(_, { key: `plan-usageCharge-${l}`, align: "start", gap: "100" }, /* @__PURE__ */ e.createElement(L, null, /* @__PURE__ */ e.createElement($, { source: Q, tone: "positive" })), /* @__PURE__ */ e.createElement(i, { variant: "bodyLg" }, t.terms))))), G = ({ plan: a, discount: n }) => {
    const t = o && a.customFields[o], l = a.customFields && a.customFields[O];
    return /* @__PURE__ */ e.createElement(_, { blockAlign: "center", gap: "400" }, /* @__PURE__ */ e.createElement(
      k,
      {
        size: "large",
        variant: l ? "primary" : "secondary",
        onClick: () => C({ planId: a.id, discountId: n == null ? void 0 : n.id }),
        disabled: (E == null ? void 0 : E.id) === a.id
      },
      (E == null ? void 0 : E.id) === a.id ? S.CURRENT_PLAN : t ? a.customFields[o] : S.SELECT_PLAN
    ), l && A && /* @__PURE__ */ e.createElement(L, null, /* @__PURE__ */ e.createElement(re, { tone: "success" }, S.MOST_POPULAR)));
  };
  return /* @__PURE__ */ e.createElement(
    ee,
    {
      title: S.PLANS,
      backAction: d !== "" ? { content: S.BACK, url: d } : void 0,
      secondaryActions: U && w ? /* @__PURE__ */ e.createElement(te, { variant: "segmented" }, /* @__PURE__ */ e.createElement(
        k,
        {
          pressed: Y === I.EVERY_30_DAYS,
          onClick: () => g(I.EVERY_30_DAYS)
        },
        S.MONTHLY
      ), /* @__PURE__ */ e.createElement(
        k,
        {
          pressed: Y === I.ANNUAL,
          onClick: () => g(I.ANNUAL)
        },
        S.YEARLY
      )) : void 0,
      fullWidth: T === "full",
      narrowWidth: T === "narrow"
    },
    /* @__PURE__ */ e.createElement(z, null, /* @__PURE__ */ e.createElement(z.Section, null, /* @__PURE__ */ e.createElement(m, { gap: "400" }, f && /* @__PURE__ */ e.createElement(
      ne,
      {
        tone: "success",
        title: S.SUBSCRIBE_SUCCESS_TITLE,
        onDismiss: () => {
          Z(!1), window.history.replaceState({}, document.title, window.location.pathname);
        }
      },
      S.SUBSCRIBE_SUCCESS_BODY
    ), B.map((a, n) => {
      var l;
      const t = ((l = a.discounts) == null ? void 0 : l.length) > 0 ? a.discounts.reduce((s, c) => s.discountedAmount < c.discountedAmount ? s : c) : null;
      return /* @__PURE__ */ e.createElement(J, { key: `plan-${n}` }, /* @__PURE__ */ e.createElement(v, null, /* @__PURE__ */ e.createElement(v.Cell, { columnSpan: { xs: 6, sm: 6, md: 3, lg: 6, xl: 12 } }, /* @__PURE__ */ e.createElement(m, { gap: "400" }, /* @__PURE__ */ e.createElement(m, { gap: "200" }, W({ plan: a, discount: t }), X({ plan: a, discount: t })), /* @__PURE__ */ e.createElement(L, null, G({ plan: a, discount: t })))), /* @__PURE__ */ e.createElement(v.Cell, { columnSpan: { xs: 6, sm: 6, md: 3, lg: 6, xl: 12 } }, q({ plan: a, discount: t }))));
    }), (p == null ? void 0 : p.length) > 0 && /* @__PURE__ */ e.createElement(ae, { borderColor: "border" }), (p == null ? void 0 : p.length) > 0 && /* @__PURE__ */ e.createElement(m, { gap: "300" }, /* @__PURE__ */ e.createElement(L, { paddingInline: { xs: 400, sm: 0 } }, /* @__PURE__ */ e.createElement(i, { variant: "headingMd" }, S.CUSTOM_PLANS)), /* @__PURE__ */ e.createElement(v, null, p.map((a, n) => {
      var l;
      const t = ((l = a.discounts) == null ? void 0 : l.length) > 0 ? a.discounts.reduce((s, c) => s.discountedAmount < c.discountedAmount ? s : c) : null;
      return /* @__PURE__ */ e.createElement(v.Cell, { key: `custom-plan-${n}`, columnSpan: columnSpan() }, /* @__PURE__ */ e.createElement(J, null, /* @__PURE__ */ e.createElement(m, { gap: "400" }, W({ plan: a, discount: t }), X({ plan: a, discount: t }), G({ plan: a, discount: t }), q({ plan: a, discount: t }))));
    }))))))
  );
};
export {
  Re as HighlightedCard,
  Ae as HorizontalCards,
  ge as MantleProvider,
  he as VerticalCards,
  Se as useMantle
};
