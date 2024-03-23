import e, { createContext as se, useState as x, useEffect as ie, useContext as ce } from "react";
import { Page as ee, ButtonGroup as te, Button as k, Layout as z, BlockStack as m, Banner as ne, Grid as v, Card as J, Divider as ae, Box as L, Text as i, InlineStack as _, Badge as re, Icon as $ } from "@shopify/polaris";
class oe {
  /**
   * Creates a new MantleClient. If being used in the browser, or any frontend code, never use the apiKey parameter, always use the customerApiToken for the customer that is currently authenticated on the frontend.
   * @param {Object} params
   * @param {string} params.appId - The Mantle App ID set up on your app in your Mantle account.
   * @param {string} params.apiKey - The Mantle App API key set up on your app in your Mantle account.
   * @param {string} params.customerApiToken - The Mantle Customer API Token returned by the /identify endpoint
   * @param {string} params.apiUrl - The Mantle API URL to use
   */
  constructor({ appId: r, apiKey: R, customerApiToken: h, apiUrl: p = "https://appapi.heymantle.com/v1" }) {
    if (!r)
      throw new Error("MantleClient appId is required");
    if (typeof window < "u" && R)
      throw new Error("MantleClient apiKey should never be used in the browser");
    if (!R && !h)
      throw new Error("MantleClient one of apiKey or customerApiToken is required");
    this.appId = r, this.apiKey = R, this.customerApiToken = h, this.apiUrl = p;
  }
  /**
   * Makes a request to the Mantle API
   * @param {Object} params
   * @param {"customer"|"usage_events"|"subscriptions"} params.path - The path to request
   * @param {"GET"|"POST"|"PUT"|"DELETE"} params.method - The HTTP method to use. Defaults to GET
   * @param {JSON} [params.body] - The request body
   * @returns {Promise<JSON>} a promise that resolves to the response body
   */
  async mantleRequest({ path: r, method: R = "GET", body: h }) {
    try {
      return await (await fetch(`${this.apiUrl}/v1${r.startsWith("/") ? "" : "/"}${r}`, {
        method: R,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-Mantle-App-Id": this.appId,
          ...this.apiKey ? { "X-Mantle-App-Api-Key": this.apiKey } : {},
          ...this.customerApiToken ? { "X-Mantle-Customer-Api-Token": this.customerApiToken } : {}
        },
        ...h && {
          body: JSON.stringify(h)
        }
      })).json();
    } catch (p) {
      throw console.error(`[mantleRequest] ${r} error: ${p.message}`), p;
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
  async identify({ platformId: r, myshopifyDomain: R, platform: h = "shopify", accessToken: p, name: c, email: O, customFields: b }) {
    return await this.mantleRequest({
      path: "identify",
      method: "POST",
      body: { platformId: r, myshopifyDomain: R, platform: h, accessToken: p, name: c, email: O, customFields: b }
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
  async subscribe({ planId: r, returnUrl: R }) {
    return await this.mantleRequest({
      path: "subscriptions",
      method: "POST",
      body: { planId: r, returnUrl: R }
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
  async updateSubscription({ id: r, cappedAmount: R }) {
    return await this.mantleRequest({
      path: "subscriptions",
      method: "PUT",
      body: { id: r, cappedAmount: R }
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
  async sendUsageEvent({ eventId: r, eventName: R, customerId: h, properties: p = {} }) {
    return await this.mantleRequest({
      path: "usage_events",
      method: "POST",
      body: {
        eventId: r,
        eventName: R,
        ...h ? { customerId: h } : {},
        properties: p
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
  MantleClient: oe
};
const le = se(), me = ({ feature: u, count: r = 0 }) => (u == null ? void 0 : u.type) === "boolean" ? u.value : (u == null ? void 0 : u.type) === "limit" ? r < u.value || u.value === -1 : !1, ge = ({
  appId: u,
  customerApiToken: r,
  apiUrl: R = "https://appapi.heymantle.com/v1",
  children: h
}) => {
  const p = new ue.MantleClient({ appId: u, customerApiToken: r, apiUrl: R }), [c, O] = x(null), [b, U] = x(!0), [V, y] = x(null), T = async () => {
    try {
      U(!0);
      const d = await p.getCustomer();
      O(d);
    } catch (d) {
      y(d);
    } finally {
      U(!1);
    }
  }, F = async ({ eventId: d, eventName: N, properties: B = {} }) => {
    await p.sendUsageEvent({ eventId: d, eventName: N, properties: B });
  }, M = async ({ planId: d, discountId: N, returnUrl: B }) => await p.subscribe({ planId: d, discountId: N, returnUrl: B }), D = async () => await p.cancelSubscription();
  ie(() => {
    r && T();
  }, [r]);
  const w = (c == null ? void 0 : c.plans) || [], E = c == null ? void 0 : c.subscription, Y = E == null ? void 0 : E.plan;
  return /* @__PURE__ */ e.createElement(
    le.Provider,
    {
      value: {
        customer: c,
        subscription: E,
        plans: w,
        loading: b,
        error: V,
        client: p,
        pushEvent: F,
        subscribe: M,
        cancelSubscription: D,
        isFeatureEnabled: ({ featureKey: d, count: N = 0 }) => c != null && c.features[d] ? me({ feature: c.features[d], count: N }) : !1,
        limitForFeature: ({ featureKey: d }) => c != null && c.features[d] && Y.features[d].type === "limit" ? c.features[d].value : -1,
        refetch: async () => {
          await T();
        }
      }
    },
    h
  );
}, Se = () => {
  const u = ce(le);
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
const S = {
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
  onSubscribe: R,
  backUrl: h = "",
  // string: URL to use as "back" breadcrumb URL. leave as empty string or null to hide the back button
  showRecommendedBadge: p = !0,
  // boolean
  customFieldCta: c = null,
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
  const M = u == null ? void 0 : u.subscription, D = new URLSearchParams(window.location.search), w = r.some((n) => n.interval === P.ANNUAL) && r.some((n) => n.interval === P.EVERY_30_DAYS), E = r.find((n) => n.id === (M == null ? void 0 : M.plan.id)), [Y, d] = x(E ? E.interval : w ? P.ANNUAL : P.EVERY_30_DAYS), N = r.filter((n) => n.availability !== "customerTag" && n.availability !== "customer"), B = U && w ? N.filter((n) => n.interval === Y) : N, C = F ? r.filter((n) => n.availability === "customerTag" || n.availability === "customer") : [], [f, Z] = x(D.get("subscribed") === "true"), W = (n = B.length) => n % 4 === 0 ? { xs: 6, sm: 6, md: 2, lg: 3, xl: 3 } : n % 3 === 0 ? { xs: 6, sm: 6, md: 2, lg: 4, xl: 4 } : n % 2 === 0 ? { xs: 6, sm: 6, md: 3, lg: 6, xl: 6 } : n === 1 ? { xs: 6, sm: 6, md: 6, lg: 12, xl: 12 } : { xs: 6, sm: 6, md: 2, lg: 4, xl: 4 }, q = ({ plan: n, discount: t }) => {
    const l = n.customFields && n.customFields[O];
    return /* @__PURE__ */ e.createElement(m, null, /* @__PURE__ */ e.createElement(_, { align: "space-between", gap: "100" }, /* @__PURE__ */ e.createElement(i, { variant: "bodyLg" }, n.name), l && p && /* @__PURE__ */ e.createElement(re, { tone: "success" }, S.MOST_POPULAR)), n.description && /* @__PURE__ */ e.createElement(i, { tone: "subdued" }, n.description));
  }, X = ({ plan: n, discount: t }) => /* @__PURE__ */ e.createElement(m, { gap: "100" }, V && n.trialDays !== 0 && /* @__PURE__ */ e.createElement(_, { align: "start", gap: "100" }, /* @__PURE__ */ e.createElement(L, null, /* @__PURE__ */ e.createElement($, { source: j, tone: "positive" })), /* @__PURE__ */ e.createElement(i, { tone: "subdued" }, S.FREE_TRIAL_LENGTH.replace("{{ trialDays }}", n.trialDays))), n.featuresOrder.map((l, s) => {
    const o = n.features[l];
    if (o.type !== "boolean" || o.value === !0)
      return /* @__PURE__ */ e.createElement(_, { key: `plan-feature-${s}`, align: "start", gap: "100" }, /* @__PURE__ */ e.createElement(L, null, /* @__PURE__ */ e.createElement($, { source: j, tone: "positive" })), o.type === "boolean" ? /* @__PURE__ */ e.createElement(i, { tone: "subdued" }, o.name) : /* @__PURE__ */ e.createElement(i, { tone: "subdued" }, o.value, " ", o.name));
  })), G = ({ plan: n, discount: t }) => /* @__PURE__ */ e.createElement(m, { gap: "100" }, t ? /* @__PURE__ */ e.createElement(_, { blockAlign: "center", gap: "200" }, /* @__PURE__ */ e.createElement(i, { variant: "headingXl" }, b && S.CURRENCY_SYMBOL, t.discountedAmount), /* @__PURE__ */ e.createElement(i, { variant: "headingXl", tone: "subdued", fontWeight: "medium", textDecorationLine: "line-through" }, n.amount), /* @__PURE__ */ e.createElement(i, { variant: "bodyLg", tone: "subdued" }, S.PER, " ", n.interval === P.ANNUAL ? y ? S.YEAR_SHORT : S.YEAR : y ? S.MONTH_SHORT : S.MONTH)) : /* @__PURE__ */ e.createElement(_, { blockAlign: "center", gap: "200" }, /* @__PURE__ */ e.createElement(i, { alignment: "center", variant: "headingXl" }, b && S.CURRENCY_SYMBOL, n.amount), /* @__PURE__ */ e.createElement(i, { alignment: "center", variant: "bodyLg", tone: "subdued" }, S.PER, " ", n.interval === P.ANNUAL ? y ? S.YEAR_SHORT : S.YEAR : y ? S.MONTH_SHORT : S.MONTH)), n.usageCharges.length > 0 && /* @__PURE__ */ e.createElement(m, null, n.usageCharges.map((l, s) => /* @__PURE__ */ e.createElement(_, { key: `plan-usageCharge-${s}`, align: "start", gap: "100" }, /* @__PURE__ */ e.createElement(L, null, /* @__PURE__ */ e.createElement($, { source: Q, tone: "positive" })), /* @__PURE__ */ e.createElement(i, { variant: "bodyLg" }, l.terms))))), a = ({ plan: n, discount: t }) => {
    const l = c && n.customFields[c], s = n.customFields && n.customFields[O];
    return /* @__PURE__ */ e.createElement(
      k,
      {
        size: "large",
        variant: s ? "primary" : "secondary",
        onClick: () => R({ planId: n.id, discountId: t == null ? void 0 : t.id }),
        disabled: (E == null ? void 0 : E.id) === n.id
      },
      (E == null ? void 0 : E.id) === n.id ? S.CURRENT_PLAN : l ? n.customFields[c] : S.SELECT_PLAN
    );
  };
  return /* @__PURE__ */ e.createElement(
    ee,
    {
      title: S.PLANS,
      backAction: h !== "" ? { content: S.BACK, url: h } : void 0,
      secondaryActions: U && w ? /* @__PURE__ */ e.createElement(te, { variant: "segmented" }, /* @__PURE__ */ e.createElement(
        k,
        {
          pressed: Y === P.EVERY_30_DAYS,
          onClick: () => d(P.EVERY_30_DAYS)
        },
        S.MONTHLY
      ), /* @__PURE__ */ e.createElement(
        k,
        {
          pressed: Y === P.ANNUAL,
          onClick: () => d(P.ANNUAL)
        },
        S.YEARLY
      )) : void 0,
      fullWidth: T === "full",
      narrowWidth: T === "narrow"
    },
    /* @__PURE__ */ e.createElement(z, null, /* @__PURE__ */ e.createElement(z.Section, null, /* @__PURE__ */ e.createElement(m, { gap: "1000" }, f && /* @__PURE__ */ e.createElement(
      ne,
      {
        tone: "success",
        title: S.SUBSCRIBE_SUCCESS_TITLE,
        onDismiss: () => {
          Z(!1), window.history.replaceState({}, document.title, window.location.pathname);
        }
      },
      S.SUBSCRIBE_SUCCESS_BODY
    ), /* @__PURE__ */ e.createElement(v, null, B.map((n, t) => {
      var s;
      const l = ((s = n.discounts) == null ? void 0 : s.length) > 0 ? n.discounts.reduce((o, K) => o.discountedAmount < K.discountedAmount ? o : K) : null;
      return /* @__PURE__ */ e.createElement(v.Cell, { key: `plan-${t}`, columnSpan: W() }, /* @__PURE__ */ e.createElement(J, null, /* @__PURE__ */ e.createElement(m, { gap: "400" }, q({ plan: n, discount: l }), G({ plan: n, discount: l }), a({ plan: n, discount: l }), X({ plan: n, discount: l }))));
    })), (C == null ? void 0 : C.length) > 0 && /* @__PURE__ */ e.createElement(ae, { borderColor: "border" }), (C == null ? void 0 : C.length) > 0 && /* @__PURE__ */ e.createElement(m, { gap: "300" }, /* @__PURE__ */ e.createElement(L, { paddingInline: { xs: 400, sm: 0 } }, /* @__PURE__ */ e.createElement(i, { variant: "headingMd" }, S.CUSTOM_PLANS)), /* @__PURE__ */ e.createElement(v, null, C.map((n, t) => {
      var s;
      const l = ((s = n.discounts) == null ? void 0 : s.length) > 0 ? n.discounts.reduce((o, K) => o.discountedAmount < K.discountedAmount ? o : K) : null;
      return /* @__PURE__ */ e.createElement(v.Cell, { key: `custom-plan-${t}`, columnSpan: W() }, /* @__PURE__ */ e.createElement(J, null, /* @__PURE__ */ e.createElement(m, { gap: "400" }, q({ plan: n, discount: l }), G({ plan: n, discount: l }), a({ plan: n, discount: l }), X({ plan: n, discount: l }))));
    }))))))
  );
}, A = {
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
  onSubscribe: R,
  backUrl: h = "",
  // string: URL to use as "back" breadcrumb URL. leave as empty string or null to hide the back button
  showRecommendedBadge: p = !0,
  // boolean
  customFieldCta: c = null,
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
  const D = u == null ? void 0 : u.subscription, w = new URLSearchParams(window.location.search), E = r.some((t) => t.interval === H.ANNUAL) && r.some((t) => t.interval === H.EVERY_30_DAYS), Y = r.find((t) => t.id === (D == null ? void 0 : D.plan.id)), [d, N] = x(Y ? Y.interval : E ? H.ANNUAL : H.EVERY_30_DAYS), B = r.filter((t) => t.availability !== "customerTag" && t.availability !== "customer"), C = V && E ? B.filter((t) => t.interval === d) : B, f = M ? r.filter((t) => t.availability === "customerTag" || t.availability === "customer") : [], [Z, W] = x(w.get("subscribed") === "true"), q = (t = C.length) => t % 4 === 0 ? { xs: 6, sm: 6, md: 2, lg: 3, xl: 3 } : t % 3 === 0 ? { xs: 6, sm: 6, md: 2, lg: 4, xl: 4 } : t % 2 === 0 ? { xs: 6, sm: 6, md: 3, lg: 6, xl: 6 } : t === 1 ? { xs: 6, sm: 6, md: 6, lg: 12, xl: 12 } : { xs: 6, sm: 6, md: 2, lg: 4, xl: 4 }, X = () => C.length % 4 === 0 ? 4 : C.length % 3 === 0 ? 3 : C.length % 2 === 0 ? 2 : C.length === 1 ? 1 : 4, G = (t) => /* @__PURE__ */ e.createElement(m, { gap: "100" }, /* @__PURE__ */ e.createElement(i, { variant: "headingMd", alignment: "center" }, t.name), t.description && /* @__PURE__ */ e.createElement(i, { variant: "bodyLg", tone: "subdued", alignment: "center" }, t.description)), a = (t) => /* @__PURE__ */ e.createElement(m, { gap: "300" }, y && t.trialDays !== 0 && /* @__PURE__ */ e.createElement(_, { align: "center", blockAlign: "center", gap: "100" }, /* @__PURE__ */ e.createElement(L, null, /* @__PURE__ */ e.createElement($, { source: j, tone: "positive" })), /* @__PURE__ */ e.createElement(i, { tone: "subdued" }, A.FREE_TRIAL_LENGTH.replace("{{ trialDays }}", t.trialDays))), t.featuresOrder.map((l, s) => {
    const o = t.features[l];
    if (o.type !== "boolean" || o.value === !0)
      return /* @__PURE__ */ e.createElement(_, { key: `plan-feature-${s}`, align: "center", gap: "100" }, /* @__PURE__ */ e.createElement(L, null, /* @__PURE__ */ e.createElement($, { source: j, tone: "positive" })), o.type === "boolean" ? /* @__PURE__ */ e.createElement(i, { tone: "subdued" }, o.name) : /* @__PURE__ */ e.createElement(i, { tone: "subdued" }, o.value, " ", o.name));
  })), n = (t) => {
    let l = t.amount;
    for (const s of t.discounts)
      l = s.percentage ? t.amount - t.amount * (s.percentage / 100) : t.amount - s.amount;
    return /* @__PURE__ */ e.createElement(m, { gap: "100" }, t.discounts.length > 0 ? /* @__PURE__ */ e.createElement(_, { align: "center", blockAlign: "center", gap: "200" }, /* @__PURE__ */ e.createElement(i, { variant: "heading3xl" }, U && A.CURRENCY_SYMBOL, l), /* @__PURE__ */ e.createElement(i, { variant: "heading3xl", tone: "subdued", fontWeight: "medium", textDecorationLine: "line-through" }, t.amount), /* @__PURE__ */ e.createElement(i, { variant: "bodyLg", tone: "subdued" }, A.PER, " ", t.interval === H.ANNUAL ? T ? A.YEAR_SHORT : A.YEAR : T ? A.MONTH_SHORT : A.MONTH)) : /* @__PURE__ */ e.createElement(_, { align: "center", blockAlign: "center", gap: "200" }, /* @__PURE__ */ e.createElement(i, { alignment: "center", variant: "heading3xl" }, U && A.CURRENCY_SYMBOL, t.amount), /* @__PURE__ */ e.createElement(i, { alignment: "center", variant: "bodyLg", tone: "subdued" }, A.PER, " ", t.interval === H.ANNUAL ? T ? A.YEAR_SHORT : A.YEAR : T ? A.MONTH_SHORT : A.MONTH)), t.usageCharges.length > 0 && /* @__PURE__ */ e.createElement(m, null, t.usageCharges.map((s, o) => /* @__PURE__ */ e.createElement(_, { key: `plan-usageCharge-${o}`, align: "center", gap: "100" }, /* @__PURE__ */ e.createElement(L, null, /* @__PURE__ */ e.createElement($, { source: Q, tone: "positive" })), /* @__PURE__ */ e.createElement(i, { variant: "bodyLg" }, s.terms)))));
  };
  return /* @__PURE__ */ e.createElement(
    ee,
    {
      title: A.PLANS,
      backAction: h && h !== "" ? { content: A.BACK, url: h } : void 0,
      secondaryActions: V && E ? /* @__PURE__ */ e.createElement(te, { variant: "segmented" }, /* @__PURE__ */ e.createElement(
        k,
        {
          pressed: d === H.EVERY_30_DAYS,
          onClick: () => N(H.EVERY_30_DAYS)
        },
        A.MONTHLY
      ), /* @__PURE__ */ e.createElement(
        k,
        {
          pressed: d === H.ANNUAL,
          onClick: () => N(H.ANNUAL)
        },
        A.YEARLY
      )) : void 0,
      fullWidth: F === "full",
      narrowWidth: F === "narrow"
    },
    /* @__PURE__ */ e.createElement(L, { paddingBlockEnd: "800" }, /* @__PURE__ */ e.createElement(z, null, /* @__PURE__ */ e.createElement(z.Section, null, /* @__PURE__ */ e.createElement(m, { gap: "1000" }, Z && /* @__PURE__ */ e.createElement(
      ne,
      {
        tone: "success",
        title: A.SUBSCRIBE_SUCCESS_TITLE,
        onDismiss: () => {
          W(!1), window.history.replaceState({}, document.title, window.location.pathname);
        }
      },
      A.SUBSCRIBE_SUCCESS_BODY
    ), /* @__PURE__ */ e.createElement(v, { columns: X() }, C.map((t, l) => {
      const s = t.customFields && t.customFields[O], o = c && t.customFields[c];
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
                onClick: () => R(t)
              },
              o ? t.customFields[c] : A.SELECT_PLAN
            ), a(t), s && p && /* @__PURE__ */ e.createElement(_, { key: `plan-feature-${l}`, align: "center", gap: "100" }, /* @__PURE__ */ e.createElement(re, { tone: "success" }, A.MOST_POPULAR)))
          )
        )
      ));
    })), (f == null ? void 0 : f.length) > 0 && /* @__PURE__ */ e.createElement(ae, { borderColor: "border" }), (f == null ? void 0 : f.length) > 0 && /* @__PURE__ */ e.createElement(m, { gap: "300" }, /* @__PURE__ */ e.createElement(L, { paddingInline: { xs: 400, sm: 0 } }, /* @__PURE__ */ e.createElement(i, { variant: "headingMd" }, A.CUSTOM_PLANS)), /* @__PURE__ */ e.createElement(v, null, f.map((t, l) => {
      const s = t.customFields && t.customFields[O], o = c && t.customFields[c];
      return /* @__PURE__ */ e.createElement(v.Cell, { key: `custom-plan-${l}`, columnSpan: q(f.length) }, /* @__PURE__ */ e.createElement(J, null, /* @__PURE__ */ e.createElement(m, { gap: "400" }, G(t), n(t), /* @__PURE__ */ e.createElement(
        k,
        {
          size: "large",
          variant: s ? "primary" : "secondary",
          onClick: () => R(t)
        },
        o ? t.customFields[c] : A.SELECT_PLAN
      ), a(t))));
    })))))))
  );
}, g = {
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
  onSubscribe: R,
  backUrl: h = "",
  // string: URL to use as "back" breadcrumb URL. leave as empty string or null to hide the back button
  showRecommendedBadge: p = !0,
  // boolean
  customFieldCta: c = null,
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
  const M = u == null ? void 0 : u.subscription, D = new URLSearchParams(window.location.search), w = r.some((a) => a.interval === I.ANNUAL) && r.some((a) => a.interval === I.EVERY_30_DAYS), E = r.find((a) => a.id === (M == null ? void 0 : M.plan.id)), [Y, d] = x(E ? E.interval : w ? I.ANNUAL : I.EVERY_30_DAYS), N = r.filter((a) => a.availability !== "customerTag" && a.availability !== "customer"), B = U && w ? N.filter((a) => a.interval === Y) : N, C = F ? r.filter((a) => a.availability === "customerTag" || a.availability === "customer") : [], [f, Z] = x(D.get("subscribed") === "true"), W = ({ plan: a, discount: n }) => /* @__PURE__ */ e.createElement(m, null, /* @__PURE__ */ e.createElement(i, { variant: "bodyLg" }, a.name), a.description && /* @__PURE__ */ e.createElement(i, { tone: "subdued" }, a.description)), q = ({ plan: a, discount: n }) => /* @__PURE__ */ e.createElement(m, { gap: "200" }, /* @__PURE__ */ e.createElement(i, { fontWeight: "medium" }, g.FEATURES), /* @__PURE__ */ e.createElement(m, { gap: "100" }, V && a.trialDays !== 0 && /* @__PURE__ */ e.createElement(_, { align: "start", gap: "100" }, /* @__PURE__ */ e.createElement(L, null, /* @__PURE__ */ e.createElement($, { source: j, tone: "positive" })), /* @__PURE__ */ e.createElement(i, { tone: "subdued" }, g.FREE_TRIAL_LENGTH.replace("{{ trialDays }}", a.trialDays))), a.featuresOrder.map((t, l) => {
    const s = a.features[t];
    if (s.type !== "boolean" || s.value === !0)
      return /* @__PURE__ */ e.createElement(_, { key: `plan-feature-${l}`, align: "start", gap: "100" }, /* @__PURE__ */ e.createElement(L, null, /* @__PURE__ */ e.createElement($, { source: j, tone: "positive" })), s.type === "boolean" ? /* @__PURE__ */ e.createElement(i, { tone: "subdued" }, s.name) : /* @__PURE__ */ e.createElement(i, { tone: "subdued" }, s.value, " ", s.name));
  }))), X = ({ plan: a, discount: n }) => /* @__PURE__ */ e.createElement(m, { gap: "100" }, n ? /* @__PURE__ */ e.createElement(_, { blockAlign: "center", gap: "200" }, /* @__PURE__ */ e.createElement(i, { variant: "headingXl" }, b && g.CURRENCY_SYMBOL, n.discountedAmount), /* @__PURE__ */ e.createElement(i, { variant: "headingXl", tone: "subdued", fontWeight: "medium", textDecorationLine: "line-through" }, a.amount), /* @__PURE__ */ e.createElement(i, { variant: "bodyLg", tone: "subdued" }, g.PER, " ", a.interval === I.ANNUAL ? y ? g.YEAR_SHORT : g.YEAR : y ? g.MONTH_SHORT : g.MONTH)) : /* @__PURE__ */ e.createElement(_, { blockAlign: "center", gap: "200" }, /* @__PURE__ */ e.createElement(i, { alignment: "center", variant: "headingXl" }, b && g.CURRENCY_SYMBOL, a.amount), /* @__PURE__ */ e.createElement(i, { alignment: "center", variant: "bodyLg", tone: "subdued" }, g.PER, " ", a.interval === I.ANNUAL ? y ? g.YEAR_SHORT : g.YEAR : y ? g.MONTH_SHORT : g.MONTH)), a.usageCharges.length > 0 && /* @__PURE__ */ e.createElement(m, null, a.usageCharges.map((t, l) => /* @__PURE__ */ e.createElement(_, { key: `plan-usageCharge-${l}`, align: "start", gap: "100" }, /* @__PURE__ */ e.createElement(L, null, /* @__PURE__ */ e.createElement($, { source: Q, tone: "positive" })), /* @__PURE__ */ e.createElement(i, { variant: "bodyLg" }, t.terms))))), G = ({ plan: a, discount: n }) => {
    const t = c && a.customFields[c], l = a.customFields && a.customFields[O];
    return /* @__PURE__ */ e.createElement(_, { blockAlign: "center", gap: "400" }, /* @__PURE__ */ e.createElement(
      k,
      {
        size: "large",
        variant: l ? "primary" : "secondary",
        onClick: () => R({ planId: a.id, discountId: n == null ? void 0 : n.id }),
        disabled: (E == null ? void 0 : E.id) === a.id
      },
      (E == null ? void 0 : E.id) === a.id ? g.CURRENT_PLAN : t ? a.customFields[c] : g.SELECT_PLAN
    ), l && p && /* @__PURE__ */ e.createElement(L, null, /* @__PURE__ */ e.createElement(re, { tone: "success" }, g.MOST_POPULAR)));
  };
  return /* @__PURE__ */ e.createElement(
    ee,
    {
      title: g.PLANS,
      backAction: h !== "" ? { content: g.BACK, url: h } : void 0,
      secondaryActions: U && w ? /* @__PURE__ */ e.createElement(te, { variant: "segmented" }, /* @__PURE__ */ e.createElement(
        k,
        {
          pressed: Y === I.EVERY_30_DAYS,
          onClick: () => d(I.EVERY_30_DAYS)
        },
        g.MONTHLY
      ), /* @__PURE__ */ e.createElement(
        k,
        {
          pressed: Y === I.ANNUAL,
          onClick: () => d(I.ANNUAL)
        },
        g.YEARLY
      )) : void 0,
      fullWidth: T === "full",
      narrowWidth: T === "narrow"
    },
    /* @__PURE__ */ e.createElement(z, null, /* @__PURE__ */ e.createElement(z.Section, null, /* @__PURE__ */ e.createElement(m, { gap: "400" }, f && /* @__PURE__ */ e.createElement(
      ne,
      {
        tone: "success",
        title: g.SUBSCRIBE_SUCCESS_TITLE,
        onDismiss: () => {
          Z(!1), window.history.replaceState({}, document.title, window.location.pathname);
        }
      },
      g.SUBSCRIBE_SUCCESS_BODY
    ), B.map((a, n) => {
      var l;
      const t = ((l = a.discounts) == null ? void 0 : l.length) > 0 ? a.discounts.reduce((s, o) => s.discountedAmount < o.discountedAmount ? s : o) : null;
      return /* @__PURE__ */ e.createElement(J, { key: `plan-${n}` }, /* @__PURE__ */ e.createElement(v, null, /* @__PURE__ */ e.createElement(v.Cell, { columnSpan: { xs: 6, sm: 6, md: 3, lg: 6, xl: 12 } }, /* @__PURE__ */ e.createElement(m, { gap: "400" }, /* @__PURE__ */ e.createElement(m, { gap: "200" }, W({ plan: a, discount: t }), X({ plan: a, discount: t })), /* @__PURE__ */ e.createElement(L, null, G({ plan: a, discount: t })))), /* @__PURE__ */ e.createElement(v.Cell, { columnSpan: { xs: 6, sm: 6, md: 3, lg: 6, xl: 12 } }, q({ plan: a, discount: t }))));
    }), (C == null ? void 0 : C.length) > 0 && /* @__PURE__ */ e.createElement(ae, { borderColor: "border" }), (C == null ? void 0 : C.length) > 0 && /* @__PURE__ */ e.createElement(m, { gap: "300" }, /* @__PURE__ */ e.createElement(L, { paddingInline: { xs: 400, sm: 0 } }, /* @__PURE__ */ e.createElement(i, { variant: "headingMd" }, g.CUSTOM_PLANS)), /* @__PURE__ */ e.createElement(v, null, C.map((a, n) => {
      var l;
      const t = ((l = a.discounts) == null ? void 0 : l.length) > 0 ? a.discounts.reduce((s, o) => s.discountedAmount < o.discountedAmount ? s : o) : null;
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
