import e, { createContext as se, useState as k, useEffect as ie, useContext as oe } from "react";
import { Page as ee, ButtonGroup as te, Button as I, Layout as z, BlockStack as E, Banner as ne, Grid as T, Card as J, Divider as ae, Box as p, Text as i, InlineStack as L, Badge as re, Icon as D } from "@shopify/polaris";
class ce {
  /**
   * Creates a new MantleClient. If being used in the browser, or any frontend code, never use the apiKey parameter, always use the customerApiToken for the customer that is currently authenticated on the frontend.
   * @param {Object} params
   * @param {string} params.appId - The Mantle App ID set up on your app in your Mantle account.
   * @param {string} params.apiKey - The Mantle App API key set up on your app in your Mantle account.
   * @param {string} params.customerApiToken - The Mantle Customer API Token returned by the /identify endpoint
   * @param {string} params.apiUrl - The Mantle API URL to use
   */
  constructor({ appId: r, apiKey: A, customerApiToken: R, apiUrl: C = "https://appapi.heymantle.com/v1" }) {
    if (!r)
      throw new Error("MantleClient appId is required");
    if (typeof window < "u" && A)
      throw new Error("MantleClient apiKey should never be used in the browser");
    if (!A && !R)
      throw new Error("MantleClient one of apiKey or customerApiToken is required");
    this.appId = r, this.apiKey = A, this.customerApiToken = R, this.apiUrl = C;
  }
  /**
   * Makes a request to the Mantle API
   * @param {Object} params
   * @param {"customer"|"usage_events"|"subscriptions"} params.path - The path to request
   * @param {"GET"|"POST"|"PUT"|"DELETE"} params.method - The HTTP method to use. Defaults to GET
   * @param {JSON} [params.body] - The request body
   * @returns {Promise<JSON>} a promise that resolves to the response body
   */
  async mantleRequest({ path: r, method: A = "GET", body: R }) {
    try {
      return await (await fetch(`${this.apiUrl}/v1${r.startsWith("/") ? "" : "/"}${r}`, {
        method: A,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-Mantle-App-Id": this.appId,
          ...this.apiKey ? { "X-Mantle-App-Api-Key": this.apiKey } : {},
          ...this.customerApiToken ? { "X-Mantle-Customer-Api-Token": this.customerApiToken } : {}
        },
        ...R && {
          body: JSON.stringify(R)
        }
      })).json();
    } catch (C) {
      throw console.error(`[mantleRequest] ${r} error: ${C.message}`), C;
    }
  }
  /**
   * Identify the customer with Mantle
   * @param {string} platformId - The unique ID of the customer on the app platform, for Shopify this should be the Shop ID
   * @param {string} myshopifyDomain - The myshopify.com domain of the Shopify store
   * @param {string} platform - The platform the customer is on, defaults to shopify
   * @param {string} accessToken - The access token for the platform API
   * @param {string} name - The name of the customer
   * @param {string} email - The email of the customer
   * @param {Object} customFields - Any custom fields to send to Mantle
   * @returns {Promise<JSON>} a promise that resolves to the response body
   */
  async identify({ platformId: r, myshopifyDomain: A, platform: R = "shopify", accessToken: C, name: c, email: f, customFields: v }) {
    return await this.mantleRequest({
      path: "identify",
      method: "POST",
      body: { platformId: r, myshopifyDomain: A, platform: R, accessToken: C, name: c, email: f, customFields: v }
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
   * Subscribe to a plan
   * @param {Object} params - The subscription options
   * @param {string} params.planId - The ID of the plan to subscribe to
   * @param {string} params.returnUrl - The URL to redirect to after the subscription is complete
   * @returns {Promise<Subscription>} a promise that resolves to the created subscription
   */
  async subscribe({ planId: r, returnUrl: A }) {
    return await this.mantleRequest({
      path: "subscriptions",
      method: "POST",
      body: { planId: r, returnUrl: A }
    });
  }
  /**
   * Cancel the current subscription
   * @returns {Promise<Subscription>} a promise that resolves to the cancelled subscription
   */
  async cancelSubscription() {
    return await this.mantleRequest({ path: "subscriptions", method: "DELETE" });
  }
  /**
   * Update the subscription
   * @param {Object} params - The subscription options
   * @param {string} params.id - The ID of the subscription to update
   * @param {number} params.cappedAmount - The capped amount of the usage charge
   * @returns {Promise<Subscription>} a promise that resolves to the updated subscription
   */
  async updateSubscription({ id: r, cappedAmount: A }) {
    return await this.mantleRequest({
      path: "subscriptions",
      method: "PUT",
      body: { id: r, cappedAmount: A }
    });
  }
  /**
   * Send a usage event
   * @param {Object} params - The usage event options
   * @param {string} [params.eventId] - The ID of the event
   * @param {string} params.eventName - The name of the event which can be tracked by usage metrics
   * @param {string} params.customerId - Required if customerApiToken is not used for authentication. One of either the customer token, Mantle customer ID, platform ID / Shopify Shop ID, Shopify myshopify.com domain
   * @param {JSON} params.properties - The event properties
   * @returns {Promise<boolean>} true if the event was sent successfully
   */
  async sendUsageEvent({ eventId: r, eventName: A, customerId: R, properties: C = {} }) {
    return await this.mantleRequest({
      path: "usage_events",
      method: "POST",
      body: {
        eventId: r,
        eventName: A,
        ...R ? { customerId: R } : {},
        properties: C
      }
    });
  }
  /**
   * Send multiple usage events of the same type in bulk, for example, when tracking page views
   * @param {Object} params - The usage event options
   * @param {Array} params.events - The events to send
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
const le = se(), me = ({ feature: m, count: r = 0 }) => (m == null ? void 0 : m.type) === "boolean" ? m.value : (m == null ? void 0 : m.type) === "limit" ? r < m.value || m.value === -1 : !1, ge = ({
  appId: m,
  customerApiToken: r,
  apiUrl: A = "https://appapi.heymantle.com/v1",
  children: R
}) => {
  const C = new ue.MantleClient({ appId: m, customerApiToken: r, apiUrl: A }), [c, f] = k(null), [v, O] = k(!0), [x, N] = k(null), y = async () => {
    try {
      O(!0);
      const o = await C.getCustomer();
      f(o);
    } catch (o) {
      N(o);
    } finally {
      O(!1);
    }
  }, $ = async ({ eventId: o, eventName: _, properties: w = {} }) => {
    await C.sendUsageEvent({ eventId: o, eventName: _, properties: w });
  };
  ie(() => {
    r && y();
  }, [r]);
  const U = (c == null ? void 0 : c.plans) || [], b = c == null ? void 0 : c.subscription, M = b == null ? void 0 : b.plan;
  return /* @__PURE__ */ e.createElement(
    le.Provider,
    {
      value: {
        customer: c,
        subscription: b,
        plans: U,
        loading: v,
        error: x,
        client: C,
        pushEvent: $,
        isFeatureEnabled: ({ featureKey: o, count: _ = 0 }) => c != null && c.features[o] ? me({ feature: c.features[o], count: _ }) : !1,
        limitForFeature: ({ featureKey: o }) => c != null && c.features[o] && M.features[o].type === "limit" ? c.features[o].value : -1,
        refetch: async () => {
          await y();
        }
      }
    },
    R
  );
}, Se = () => {
  const m = oe(le);
  if (m === void 0)
    throw new Error("useMantle must be used within a MantleProvider");
  return m;
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
const g = {
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
}, B = {
  EVERY_30_DAYS: "EVERY_30_DAYS",
  ANNUAL: "ANNUAL"
}, Ae = ({
  customer: m,
  plans: r,
  onSubscribe: A,
  backUrl: R = "",
  // string: URL to use as "back" breadcrumb URL. leave as empty string or null to hide the back button
  showRecommendedBadge: C = !0,
  // boolean
  customFieldCta: c = null,
  // string: value of the custom plan field to use as the CTA. e.g. "cta"
  customFieldPlanRecommended: f = "Recommended",
  // string: value of the custom plan field to use as the recommended badge
  showCurrencySymbol: v = !0,
  // boolean
  showPlanIntervalToggle: O = !0,
  // boolean
  showTrialDaysAsFeature: x = !0,
  // boolean
  useShortFormPlanIntervals: N = !0,
  // boolean: e.g. show "$ / mo" instead of "$ / month"
  pageWidth: y = "default",
  // string: "full", "narrow", or "default"
  showCustomPlans: $ = !0
  // boolean: show custom plans
}) => {
  const U = m == null ? void 0 : m.subscription, b = new URLSearchParams(window.location.search), M = r.some((n) => n.interval === B.ANNUAL) && r.some((n) => n.interval === B.EVERY_30_DAYS), o = r.find((n) => n.id === (U == null ? void 0 : U.plan.id)), [_, w] = k(o ? o.interval : M ? B.ANNUAL : B.EVERY_30_DAYS), V = r.filter((n) => n.availability !== "customerTag" && n.availability !== "customer"), G = O && M ? V.filter((n) => n.interval === _) : V, h = $ ? r.filter((n) => n.availability === "customerTag" || n.availability === "customer") : [], [Y, Z] = k(b.get("subscribed") === "true"), W = (n = G.length) => n % 4 === 0 ? { xs: 6, sm: 6, md: 2, lg: 3, xl: 3 } : n % 3 === 0 ? { xs: 6, sm: 6, md: 2, lg: 4, xl: 4 } : n % 2 === 0 ? { xs: 6, sm: 6, md: 3, lg: 6, xl: 6 } : n === 1 ? { xs: 6, sm: 6, md: 6, lg: 12, xl: 12 } : { xs: 6, sm: 6, md: 2, lg: 4, xl: 4 }, F = ({ plan: n, discount: t }) => {
    const l = n.customFields && n.customFields[f];
    return /* @__PURE__ */ e.createElement(E, null, /* @__PURE__ */ e.createElement(L, { align: "space-between", gap: "100" }, /* @__PURE__ */ e.createElement(i, { variant: "bodyLg" }, n.name), l && C && /* @__PURE__ */ e.createElement(re, { tone: "success" }, g.MOST_POPULAR)), n.description && /* @__PURE__ */ e.createElement(i, { tone: "subdued" }, n.description));
  }, X = ({ plan: n, discount: t }) => /* @__PURE__ */ e.createElement(E, { gap: "100" }, x && n.trialDays !== 0 && /* @__PURE__ */ e.createElement(L, { align: "start", gap: "100" }, /* @__PURE__ */ e.createElement(p, null, /* @__PURE__ */ e.createElement(D, { source: j, tone: "positive" })), /* @__PURE__ */ e.createElement(i, { tone: "subdued" }, g.FREE_TRIAL_LENGTH.replace("{{ trialDays }}", n.trialDays))), n.featuresOrder.map((l, s) => {
    const u = n.features[l];
    if (u.type !== "boolean" || u.value === !0)
      return /* @__PURE__ */ e.createElement(L, { key: `plan-feature-${s}`, align: "start", gap: "100" }, /* @__PURE__ */ e.createElement(p, null, /* @__PURE__ */ e.createElement(D, { source: j, tone: "positive" })), u.type === "boolean" ? /* @__PURE__ */ e.createElement(i, { tone: "subdued" }, u.name) : /* @__PURE__ */ e.createElement(i, { tone: "subdued" }, u.value, " ", u.name));
  })), q = ({ plan: n, discount: t }) => /* @__PURE__ */ e.createElement(E, { gap: "100" }, t ? /* @__PURE__ */ e.createElement(L, { blockAlign: "center", gap: "200" }, /* @__PURE__ */ e.createElement(i, { variant: "headingXl" }, v && g.CURRENCY_SYMBOL, t.discountedAmount), /* @__PURE__ */ e.createElement(i, { variant: "headingXl", tone: "subdued", fontWeight: "medium", textDecorationLine: "line-through" }, n.amount), /* @__PURE__ */ e.createElement(i, { variant: "bodyLg", tone: "subdued" }, g.PER, " ", n.interval === B.ANNUAL ? N ? g.YEAR_SHORT : g.YEAR : N ? g.MONTH_SHORT : g.MONTH)) : /* @__PURE__ */ e.createElement(L, { blockAlign: "center", gap: "200" }, /* @__PURE__ */ e.createElement(i, { alignment: "center", variant: "headingXl" }, v && g.CURRENCY_SYMBOL, n.amount), /* @__PURE__ */ e.createElement(i, { alignment: "center", variant: "bodyLg", tone: "subdued" }, g.PER, " ", n.interval === B.ANNUAL ? N ? g.YEAR_SHORT : g.YEAR : N ? g.MONTH_SHORT : g.MONTH)), n.usageCharges.length > 0 && /* @__PURE__ */ e.createElement(E, null, n.usageCharges.map((l, s) => /* @__PURE__ */ e.createElement(L, { key: `plan-usageCharge-${s}`, align: "start", gap: "100" }, /* @__PURE__ */ e.createElement(p, null, /* @__PURE__ */ e.createElement(D, { source: Q, tone: "positive" })), /* @__PURE__ */ e.createElement(i, { variant: "bodyLg" }, l.terms))))), a = ({ plan: n, discount: t }) => {
    const l = c && n.customFields[c], s = n.customFields && n.customFields[f];
    return /* @__PURE__ */ e.createElement(
      I,
      {
        size: "large",
        variant: s ? "primary" : "secondary",
        onClick: () => A({ planId: n.id, discountId: t == null ? void 0 : t.id }),
        disabled: (o == null ? void 0 : o.id) === n.id
      },
      (o == null ? void 0 : o.id) === n.id ? g.CURRENT_PLAN : l ? n.customFields[c] : g.SELECT_PLAN
    );
  };
  return /* @__PURE__ */ e.createElement(
    ee,
    {
      title: g.PLANS,
      backAction: R !== "" ? { content: g.BACK, url: R } : void 0,
      secondaryActions: O && M ? /* @__PURE__ */ e.createElement(te, { variant: "segmented" }, /* @__PURE__ */ e.createElement(
        I,
        {
          pressed: _ === B.EVERY_30_DAYS,
          onClick: () => w(B.EVERY_30_DAYS)
        },
        g.MONTHLY
      ), /* @__PURE__ */ e.createElement(
        I,
        {
          pressed: _ === B.ANNUAL,
          onClick: () => w(B.ANNUAL)
        },
        g.YEARLY
      )) : void 0,
      fullWidth: y === "full",
      narrowWidth: y === "narrow"
    },
    /* @__PURE__ */ e.createElement(z, null, /* @__PURE__ */ e.createElement(z.Section, null, /* @__PURE__ */ e.createElement(E, { gap: "1000" }, Y && /* @__PURE__ */ e.createElement(
      ne,
      {
        tone: "success",
        title: g.SUBSCRIBE_SUCCESS_TITLE,
        onDismiss: () => {
          Z(!1), window.history.replaceState({}, document.title, window.location.pathname);
        }
      },
      g.SUBSCRIBE_SUCCESS_BODY
    ), /* @__PURE__ */ e.createElement(T, null, G.map((n, t) => {
      var s;
      const l = ((s = n.discounts) == null ? void 0 : s.length) > 0 ? n.discounts.reduce((u, K) => u.discountedAmount < K.discountedAmount ? u : K) : null;
      return /* @__PURE__ */ e.createElement(T.Cell, { key: `plan-${t}`, columnSpan: W() }, /* @__PURE__ */ e.createElement(J, null, /* @__PURE__ */ e.createElement(E, { gap: "400" }, F({ plan: n, discount: l }), q({ plan: n, discount: l }), a({ plan: n, discount: l }), X({ plan: n, discount: l }))));
    })), (h == null ? void 0 : h.length) > 0 && /* @__PURE__ */ e.createElement(ae, { borderColor: "border" }), (h == null ? void 0 : h.length) > 0 && /* @__PURE__ */ e.createElement(E, { gap: "300" }, /* @__PURE__ */ e.createElement(p, { paddingInline: { xs: 400, sm: 0 } }, /* @__PURE__ */ e.createElement(i, { variant: "headingMd" }, g.CUSTOM_PLANS)), /* @__PURE__ */ e.createElement(T, null, h.map((n, t) => {
      var s;
      const l = ((s = n.discounts) == null ? void 0 : s.length) > 0 ? n.discounts.reduce((u, K) => u.discountedAmount < K.discountedAmount ? u : K) : null;
      return /* @__PURE__ */ e.createElement(T.Cell, { key: `custom-plan-${t}`, columnSpan: W() }, /* @__PURE__ */ e.createElement(J, null, /* @__PURE__ */ e.createElement(E, { gap: "400" }, F({ plan: n, discount: l }), q({ plan: n, discount: l }), a({ plan: n, discount: l }), X({ plan: n, discount: l }))));
    }))))))
  );
}, S = {
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
}, Re = ({
  customer: m,
  plans: r,
  onSubscribe: A,
  backUrl: R = "",
  // string: URL to use as "back" breadcrumb URL. leave as empty string or null to hide the back button
  showRecommendedBadge: C = !0,
  // boolean
  customFieldCta: c = null,
  // string: value of the custom plan field to use as the CTA. e.g. "cta"
  customFieldPlanRecommended: f = "Recommended",
  // string: value of the custom plan field to use as the recommended badge
  addSpacingToNonRecommendedPlans: v = !0,
  // boolean
  showCurrencySymbol: O = !0,
  // boolean
  showPlanIntervalToggle: x = !0,
  // boolean
  showTrialDaysAsFeature: N = !0,
  // boolean
  useShortFormPlanIntervals: y = !0,
  // boolean: e.g. show "$ / mo" instead of "$ / month"
  pageWidth: $ = "default",
  // string: "full", "narrow", or "default"
  showCustomPlans: U = !0
  // boolean: show custom plans
}) => {
  const b = m == null ? void 0 : m.subscription, M = new URLSearchParams(window.location.search), o = r.some((t) => t.interval === P.ANNUAL) && r.some((t) => t.interval === P.EVERY_30_DAYS), _ = r.find((t) => t.id === (b == null ? void 0 : b.plan.id)), [w, V] = k(_ ? _.interval : o ? P.ANNUAL : P.EVERY_30_DAYS), G = r.filter((t) => t.availability !== "customerTag" && t.availability !== "customer"), h = x && o ? G.filter((t) => t.interval === w) : G, Y = U ? r.filter((t) => t.availability === "customerTag" || t.availability === "customer") : [], [Z, W] = k(M.get("subscribed") === "true"), F = (t = h.length) => t % 4 === 0 ? { xs: 6, sm: 6, md: 2, lg: 3, xl: 3 } : t % 3 === 0 ? { xs: 6, sm: 6, md: 2, lg: 4, xl: 4 } : t % 2 === 0 ? { xs: 6, sm: 6, md: 3, lg: 6, xl: 6 } : t === 1 ? { xs: 6, sm: 6, md: 6, lg: 12, xl: 12 } : { xs: 6, sm: 6, md: 2, lg: 4, xl: 4 }, X = () => h.length % 4 === 0 ? 4 : h.length % 3 === 0 ? 3 : h.length % 2 === 0 ? 2 : h.length === 1 ? 1 : 4, q = (t) => /* @__PURE__ */ e.createElement(E, { gap: "100" }, /* @__PURE__ */ e.createElement(i, { variant: "headingMd", alignment: "center" }, t.name), t.description && /* @__PURE__ */ e.createElement(i, { variant: "bodyLg", tone: "subdued", alignment: "center" }, t.description)), a = (t) => /* @__PURE__ */ e.createElement(E, { gap: "300" }, N && t.trialDays !== 0 && /* @__PURE__ */ e.createElement(L, { align: "center", blockAlign: "center", gap: "100" }, /* @__PURE__ */ e.createElement(p, null, /* @__PURE__ */ e.createElement(D, { source: j, tone: "positive" })), /* @__PURE__ */ e.createElement(i, { tone: "subdued" }, S.FREE_TRIAL_LENGTH.replace("{{ trialDays }}", t.trialDays))), t.featuresOrder.map((l, s) => {
    const u = t.features[l];
    if (u.type !== "boolean" || u.value === !0)
      return /* @__PURE__ */ e.createElement(L, { key: `plan-feature-${s}`, align: "center", gap: "100" }, /* @__PURE__ */ e.createElement(p, null, /* @__PURE__ */ e.createElement(D, { source: j, tone: "positive" })), u.type === "boolean" ? /* @__PURE__ */ e.createElement(i, { tone: "subdued" }, u.name) : /* @__PURE__ */ e.createElement(i, { tone: "subdued" }, u.value, " ", u.name));
  })), n = (t) => {
    let l = t.amount;
    for (const s of t.discounts)
      l = s.percentage ? t.amount - t.amount * (s.percentage / 100) : t.amount - s.amount;
    return /* @__PURE__ */ e.createElement(E, { gap: "100" }, t.discounts.length > 0 ? /* @__PURE__ */ e.createElement(L, { align: "center", blockAlign: "center", gap: "200" }, /* @__PURE__ */ e.createElement(i, { variant: "heading3xl" }, O && S.CURRENCY_SYMBOL, l), /* @__PURE__ */ e.createElement(i, { variant: "heading3xl", tone: "subdued", fontWeight: "medium", textDecorationLine: "line-through" }, t.amount), /* @__PURE__ */ e.createElement(i, { variant: "bodyLg", tone: "subdued" }, S.PER, " ", t.interval === P.ANNUAL ? y ? S.YEAR_SHORT : S.YEAR : y ? S.MONTH_SHORT : S.MONTH)) : /* @__PURE__ */ e.createElement(L, { align: "center", blockAlign: "center", gap: "200" }, /* @__PURE__ */ e.createElement(i, { alignment: "center", variant: "heading3xl" }, O && S.CURRENCY_SYMBOL, t.amount), /* @__PURE__ */ e.createElement(i, { alignment: "center", variant: "bodyLg", tone: "subdued" }, S.PER, " ", t.interval === P.ANNUAL ? y ? S.YEAR_SHORT : S.YEAR : y ? S.MONTH_SHORT : S.MONTH)), t.usageCharges.length > 0 && /* @__PURE__ */ e.createElement(E, null, t.usageCharges.map((s, u) => /* @__PURE__ */ e.createElement(L, { key: `plan-usageCharge-${u}`, align: "center", gap: "100" }, /* @__PURE__ */ e.createElement(p, null, /* @__PURE__ */ e.createElement(D, { source: Q, tone: "positive" })), /* @__PURE__ */ e.createElement(i, { variant: "bodyLg" }, s.terms)))));
  };
  return /* @__PURE__ */ e.createElement(
    ee,
    {
      title: S.PLANS,
      backAction: R && R !== "" ? { content: S.BACK, url: R } : void 0,
      secondaryActions: x && o ? /* @__PURE__ */ e.createElement(te, { variant: "segmented" }, /* @__PURE__ */ e.createElement(
        I,
        {
          pressed: w === P.EVERY_30_DAYS,
          onClick: () => V(P.EVERY_30_DAYS)
        },
        S.MONTHLY
      ), /* @__PURE__ */ e.createElement(
        I,
        {
          pressed: w === P.ANNUAL,
          onClick: () => V(P.ANNUAL)
        },
        S.YEARLY
      )) : void 0,
      fullWidth: $ === "full",
      narrowWidth: $ === "narrow"
    },
    /* @__PURE__ */ e.createElement(p, { paddingBlockEnd: "800" }, /* @__PURE__ */ e.createElement(z, null, /* @__PURE__ */ e.createElement(z.Section, null, /* @__PURE__ */ e.createElement(E, { gap: "1000" }, Z && /* @__PURE__ */ e.createElement(
      ne,
      {
        tone: "success",
        title: S.SUBSCRIBE_SUCCESS_TITLE,
        onDismiss: () => {
          W(!1), window.history.replaceState({}, document.title, window.location.pathname);
        }
      },
      S.SUBSCRIBE_SUCCESS_BODY
    ), /* @__PURE__ */ e.createElement(T, { columns: X() }, h.map((t, l) => {
      const s = t.customFields && t.customFields[f], u = c && t.customFields[c];
      return /* @__PURE__ */ e.createElement(T.Cell, { key: `plan-${l}`, columnSpan: F() }, /* @__PURE__ */ e.createElement(
        p,
        {
          position: "relative",
          minHeight: "100%"
        },
        /* @__PURE__ */ e.createElement(
          p,
          {
            paddingBlock: !v || s ? void 0 : "800",
            minHeight: "100%"
          },
          /* @__PURE__ */ e.createElement(
            p,
            {
              background: s ? "bg-surface" : "bg-surface-secondary",
              borderStyle: "solid",
              borderColor: "border",
              borderWidth: "025",
              paddingBlock: v && s ? "1600" : "800",
              paddingInline: "400",
              borderRadius: "200",
              minHeight: "calc(100% - calc(var(--p-space-800) * 2))"
            },
            /* @__PURE__ */ e.createElement(E, { gap: "800" }, /* @__PURE__ */ e.createElement(E, { gap: "400" }, q(t), n(t)), /* @__PURE__ */ e.createElement(
              I,
              {
                size: "large",
                variant: s ? "primary" : "secondary",
                onClick: () => A(t)
              },
              u ? t.customFields[c] : S.SELECT_PLAN
            ), a(t), s && C && /* @__PURE__ */ e.createElement(L, { key: `plan-feature-${l}`, align: "center", gap: "100" }, /* @__PURE__ */ e.createElement(re, { tone: "success" }, S.MOST_POPULAR)))
          )
        )
      ));
    })), (Y == null ? void 0 : Y.length) > 0 && /* @__PURE__ */ e.createElement(ae, { borderColor: "border" }), (Y == null ? void 0 : Y.length) > 0 && /* @__PURE__ */ e.createElement(E, { gap: "300" }, /* @__PURE__ */ e.createElement(p, { paddingInline: { xs: 400, sm: 0 } }, /* @__PURE__ */ e.createElement(i, { variant: "headingMd" }, S.CUSTOM_PLANS)), /* @__PURE__ */ e.createElement(T, null, Y.map((t, l) => {
      const s = t.customFields && t.customFields[f], u = c && t.customFields[c];
      return /* @__PURE__ */ e.createElement(T.Cell, { key: `custom-plan-${l}`, columnSpan: F(Y.length) }, /* @__PURE__ */ e.createElement(J, null, /* @__PURE__ */ e.createElement(E, { gap: "400" }, q(t), n(t), /* @__PURE__ */ e.createElement(
        I,
        {
          size: "large",
          variant: s ? "primary" : "secondary",
          onClick: () => A(t)
        },
        u ? t.customFields[c] : S.SELECT_PLAN
      ), a(t))));
    })))))))
  );
}, d = {
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
}, H = {
  EVERY_30_DAYS: "EVERY_30_DAYS",
  ANNUAL: "ANNUAL"
}, he = ({
  customer: m,
  plans: r,
  onSubscribe: A,
  backUrl: R = "",
  // string: URL to use as "back" breadcrumb URL. leave as empty string or null to hide the back button
  showRecommendedBadge: C = !0,
  // boolean
  customFieldCta: c = null,
  // string: value of the custom plan field to use as the CTA. e.g. "cta"
  customFieldPlanRecommended: f = "Recommended",
  // string: value of the custom plan field to use as the recommended badge
  showCurrencySymbol: v = !0,
  // boolean
  showPlanIntervalToggle: O = !1,
  // boolean
  showTrialDaysAsFeature: x = !0,
  // boolean
  useShortFormPlanIntervals: N = !0,
  // boolean: e.g. show "$ / mo" instead of "$ / month"
  pageWidth: y = "default",
  // string: "full", "narrow", or "default"
  showCustomPlans: $ = !0
  // boolean: show custom plans
}) => {
  const U = m == null ? void 0 : m.subscription, b = new URLSearchParams(window.location.search), M = r.some((a) => a.interval === H.ANNUAL) && r.some((a) => a.interval === H.EVERY_30_DAYS), o = r.find((a) => a.id === (U == null ? void 0 : U.plan.id)), [_, w] = k(o ? o.interval : M ? H.ANNUAL : H.EVERY_30_DAYS), V = r.filter((a) => a.availability !== "customerTag" && a.availability !== "customer"), G = O && M ? V.filter((a) => a.interval === _) : V, h = $ ? r.filter((a) => a.availability === "customerTag" || a.availability === "customer") : [], [Y, Z] = k(b.get("subscribed") === "true"), W = ({ plan: a, discount: n }) => /* @__PURE__ */ e.createElement(E, null, /* @__PURE__ */ e.createElement(i, { variant: "bodyLg" }, a.name), a.description && /* @__PURE__ */ e.createElement(i, { tone: "subdued" }, a.description)), F = ({ plan: a, discount: n }) => /* @__PURE__ */ e.createElement(E, { gap: "200" }, /* @__PURE__ */ e.createElement(i, { fontWeight: "medium" }, d.FEATURES), /* @__PURE__ */ e.createElement(E, { gap: "100" }, x && a.trialDays !== 0 && /* @__PURE__ */ e.createElement(L, { align: "start", gap: "100" }, /* @__PURE__ */ e.createElement(p, null, /* @__PURE__ */ e.createElement(D, { source: j, tone: "positive" })), /* @__PURE__ */ e.createElement(i, { tone: "subdued" }, d.FREE_TRIAL_LENGTH.replace("{{ trialDays }}", a.trialDays))), a.featuresOrder.map((t, l) => {
    const s = a.features[t];
    if (s.type !== "boolean" || s.value === !0)
      return /* @__PURE__ */ e.createElement(L, { key: `plan-feature-${l}`, align: "start", gap: "100" }, /* @__PURE__ */ e.createElement(p, null, /* @__PURE__ */ e.createElement(D, { source: j, tone: "positive" })), s.type === "boolean" ? /* @__PURE__ */ e.createElement(i, { tone: "subdued" }, s.name) : /* @__PURE__ */ e.createElement(i, { tone: "subdued" }, s.value, " ", s.name));
  }))), X = ({ plan: a, discount: n }) => /* @__PURE__ */ e.createElement(E, { gap: "100" }, n ? /* @__PURE__ */ e.createElement(L, { blockAlign: "center", gap: "200" }, /* @__PURE__ */ e.createElement(i, { variant: "headingXl" }, v && d.CURRENCY_SYMBOL, n.discountedAmount), /* @__PURE__ */ e.createElement(i, { variant: "headingXl", tone: "subdued", fontWeight: "medium", textDecorationLine: "line-through" }, a.amount), /* @__PURE__ */ e.createElement(i, { variant: "bodyLg", tone: "subdued" }, d.PER, " ", a.interval === H.ANNUAL ? N ? d.YEAR_SHORT : d.YEAR : N ? d.MONTH_SHORT : d.MONTH)) : /* @__PURE__ */ e.createElement(L, { blockAlign: "center", gap: "200" }, /* @__PURE__ */ e.createElement(i, { alignment: "center", variant: "headingXl" }, v && d.CURRENCY_SYMBOL, a.amount), /* @__PURE__ */ e.createElement(i, { alignment: "center", variant: "bodyLg", tone: "subdued" }, d.PER, " ", a.interval === H.ANNUAL ? N ? d.YEAR_SHORT : d.YEAR : N ? d.MONTH_SHORT : d.MONTH)), a.usageCharges.length > 0 && /* @__PURE__ */ e.createElement(E, null, a.usageCharges.map((t, l) => /* @__PURE__ */ e.createElement(L, { key: `plan-usageCharge-${l}`, align: "start", gap: "100" }, /* @__PURE__ */ e.createElement(p, null, /* @__PURE__ */ e.createElement(D, { source: Q, tone: "positive" })), /* @__PURE__ */ e.createElement(i, { variant: "bodyLg" }, t.terms))))), q = ({ plan: a, discount: n }) => {
    const t = c && a.customFields[c], l = a.customFields && a.customFields[f];
    return /* @__PURE__ */ e.createElement(L, { blockAlign: "center", gap: "400" }, /* @__PURE__ */ e.createElement(
      I,
      {
        size: "large",
        variant: l ? "primary" : "secondary",
        onClick: () => A({ planId: a.id, discountId: n == null ? void 0 : n.id }),
        disabled: (o == null ? void 0 : o.id) === a.id
      },
      (o == null ? void 0 : o.id) === a.id ? d.CURRENT_PLAN : t ? a.customFields[c] : d.SELECT_PLAN
    ), l && C && /* @__PURE__ */ e.createElement(p, null, /* @__PURE__ */ e.createElement(re, { tone: "success" }, d.MOST_POPULAR)));
  };
  return /* @__PURE__ */ e.createElement(
    ee,
    {
      title: d.PLANS,
      backAction: R !== "" ? { content: d.BACK, url: R } : void 0,
      secondaryActions: O && M ? /* @__PURE__ */ e.createElement(te, { variant: "segmented" }, /* @__PURE__ */ e.createElement(
        I,
        {
          pressed: _ === H.EVERY_30_DAYS,
          onClick: () => w(H.EVERY_30_DAYS)
        },
        d.MONTHLY
      ), /* @__PURE__ */ e.createElement(
        I,
        {
          pressed: _ === H.ANNUAL,
          onClick: () => w(H.ANNUAL)
        },
        d.YEARLY
      )) : void 0,
      fullWidth: y === "full",
      narrowWidth: y === "narrow"
    },
    /* @__PURE__ */ e.createElement(z, null, /* @__PURE__ */ e.createElement(z.Section, null, /* @__PURE__ */ e.createElement(E, { gap: "400" }, Y && /* @__PURE__ */ e.createElement(
      ne,
      {
        tone: "success",
        title: d.SUBSCRIBE_SUCCESS_TITLE,
        onDismiss: () => {
          Z(!1), window.history.replaceState({}, document.title, window.location.pathname);
        }
      },
      d.SUBSCRIBE_SUCCESS_BODY
    ), G.map((a, n) => {
      var l;
      const t = ((l = a.discounts) == null ? void 0 : l.length) > 0 ? a.discounts.reduce((s, u) => s.discountedAmount < u.discountedAmount ? s : u) : null;
      return /* @__PURE__ */ e.createElement(J, { key: `plan-${n}` }, /* @__PURE__ */ e.createElement(T, null, /* @__PURE__ */ e.createElement(T.Cell, { columnSpan: { xs: 6, sm: 6, md: 3, lg: 6, xl: 12 } }, /* @__PURE__ */ e.createElement(E, { gap: "400" }, /* @__PURE__ */ e.createElement(E, { gap: "200" }, W({ plan: a, discount: t }), X({ plan: a, discount: t })), /* @__PURE__ */ e.createElement(p, null, q({ plan: a, discount: t })))), /* @__PURE__ */ e.createElement(T.Cell, { columnSpan: { xs: 6, sm: 6, md: 3, lg: 6, xl: 12 } }, F({ plan: a, discount: t }))));
    }), (h == null ? void 0 : h.length) > 0 && /* @__PURE__ */ e.createElement(ae, { borderColor: "border" }), (h == null ? void 0 : h.length) > 0 && /* @__PURE__ */ e.createElement(E, { gap: "300" }, /* @__PURE__ */ e.createElement(p, { paddingInline: { xs: 400, sm: 0 } }, /* @__PURE__ */ e.createElement(i, { variant: "headingMd" }, d.CUSTOM_PLANS)), /* @__PURE__ */ e.createElement(T, null, h.map((a, n) => {
      var l;
      const t = ((l = a.discounts) == null ? void 0 : l.length) > 0 ? a.discounts.reduce((s, u) => s.discountedAmount < u.discountedAmount ? s : u) : null;
      return /* @__PURE__ */ e.createElement(T.Cell, { key: `custom-plan-${n}`, columnSpan: columnSpan() }, /* @__PURE__ */ e.createElement(J, null, /* @__PURE__ */ e.createElement(E, { gap: "400" }, W({ plan: a, discount: t }), X({ plan: a, discount: t }), q({ plan: a, discount: t }), F({ plan: a, discount: t }))));
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
