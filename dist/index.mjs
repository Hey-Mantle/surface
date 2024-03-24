import e, { createContext as ae, useState as I, useEffect as le, useContext as se } from "react";
import { BlockStack as h, InlineStack as A, Text as i, Badge as Z, Box as f, Icon as V, Card as j, Button as M, Page as J, ButtonGroup as K, Layout as z, Banner as Q, Grid as Y, Divider as ee } from "@shopify/polaris";
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
  constructor({ appId: r, apiKey: m, customerApiToken: u, apiUrl: o = "https://appapi.heymantle.com/v1" }) {
    if (!r)
      throw new Error("MantleClient appId is required");
    if (typeof window < "u" && m)
      throw new Error("MantleClient apiKey should never be used in the browser");
    if (!m && !u)
      throw new Error("MantleClient one of apiKey or customerApiToken is required");
    this.appId = r, this.apiKey = m, this.customerApiToken = u, this.apiUrl = o;
  }
  /**
   * Makes a request to the Mantle API
   * @param {Object} params
   * @param {"customer"|"usage_events"|"subscriptions"} params.path - The path to request
   * @param {"GET"|"POST"|"PUT"|"DELETE"} params.method - The HTTP method to use. Defaults to GET
   * @param {JSON} [params.body] - The request body
   * @returns {Promise<JSON>} a promise that resolves to the response body
   */
  async mantleRequest({ path: r, method: m = "GET", body: u }) {
    try {
      return await (await fetch(`${this.apiUrl}${r.startsWith("/") ? "" : "/"}${r}`, {
        method: m,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-Mantle-App-Id": this.appId,
          ...this.apiKey ? { "X-Mantle-App-Api-Key": this.apiKey } : {},
          ...this.customerApiToken ? { "X-Mantle-Customer-Api-Token": this.customerApiToken } : {}
        },
        ...u && {
          body: JSON.stringify(u)
        }
      })).json();
    } catch (o) {
      throw console.error(`[mantleRequest] ${r} error: ${o.message}`), o;
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
    myshopifyDomain: m,
    platform: u = "shopify",
    accessToken: o,
    name: c,
    email: C,
    customFields: k
  }) {
    return await this.mantleRequest({
      path: "identify",
      method: "POST",
      body: { platformId: r, myshopifyDomain: m, platform: u, accessToken: o, name: c, email: C, customFields: k }
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
  async subscribe({ planId: r, planIds: m, discountId: u, returnUrl: o, billingProvider: c }) {
    return await this.mantleRequest({
      path: "subscriptions",
      method: "POST",
      body: { planId: r, planIds: m, discountId: u, returnUrl: o, billingProvider: c }
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
  async updateSubscription({ id: r, cappedAmount: m }) {
    return await this.mantleRequest({
      path: "subscriptions",
      method: "PUT",
      body: { id: r, cappedAmount: m }
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
  async sendUsageEvent({ eventId: r, eventName: m, customerId: u, properties: o = {} }) {
    return await this.mantleRequest({
      path: "usage_events",
      method: "POST",
      body: {
        eventId: r,
        eventName: m,
        ...u ? { customerId: u } : {},
        properties: o
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
var ie = {
  MantleClient: ce
};
const re = ae(), oe = ({ feature: n, count: r = 0 }) => (n == null ? void 0 : n.type) === "boolean" ? n.value : (n == null ? void 0 : n.type) === "limit" ? r < n.value || n.value === -1 : !1, pe = ({
  appId: n,
  customerApiToken: r,
  apiUrl: m = "https://appapi.heymantle.com/v1",
  children: u
}) => {
  const o = new ie.MantleClient({ appId: n, customerApiToken: r, apiUrl: m }), [c, C] = I(null), [k, N] = I(!0), [F, R] = I(null), B = async () => {
    try {
      N(!0);
      const v = await o.getCustomer();
      C(v);
    } catch (v) {
      R(v);
    } finally {
      N(!1);
    }
  }, P = async (v) => {
    await o.sendUsageEvent(v);
  }, T = async ({ planId: v, planIds: _, discountId: y, billingProvider: L, returnUrl: q }) => await o.subscribe({
    planId: v,
    planIds: _,
    discountId: y,
    billingProvider: L,
    returnUrl: q
  }), D = async () => await o.cancelSubscription();
  le(() => {
    r && B();
  }, [r]);
  const b = (c == null ? void 0 : c.plans) || [], w = c == null ? void 0 : c.subscription, x = w == null ? void 0 : w.plan;
  return /* @__PURE__ */ e.createElement(
    re.Provider,
    {
      value: {
        customer: c,
        subscription: w,
        plans: b,
        loading: k,
        error: F,
        client: o,
        sendUsageEvent: P,
        subscribe: T,
        cancelSubscription: D,
        isFeatureEnabled: ({ featureKey: v, count: _ = 0 }) => c != null && c.features[v] ? oe({ feature: c.features[v], count: _ }) : !1,
        limitForFeature: ({ featureKey: v }) => c != null && c.features[v] && x.features[v].type === "limit" ? c.features[v].value : -1,
        refetch: async () => {
          await B();
        }
      }
    },
    u
  );
}, Se = () => {
  const n = se(re);
  if (n === void 0)
    throw new Error("useMantle must be used within a MantleProvider");
  return n;
};
var X = function(r) {
  return /* @__PURE__ */ e.createElement("svg", Object.assign({
    viewBox: "0 0 20 20"
  }, r), /* @__PURE__ */ e.createElement("path", {
    fillRule: "evenodd",
    d: "M15.78 5.97a.75.75 0 0 1 0 1.06l-6.5 6.5a.75.75 0 0 1-1.06 0l-3.25-3.25a.75.75 0 1 1 1.06-1.06l2.72 2.72 5.97-5.97a.75.75 0 0 1 1.06 0Z"
  }));
};
X.displayName = "CheckIcon";
var G = function(r) {
  return /* @__PURE__ */ e.createElement("svg", Object.assign({
    viewBox: "0 0 20 20"
  }, r), /* @__PURE__ */ e.createElement("path", {
    d: "M10.75 6.75a.75.75 0 0 0-1.5 0v2.5h-2.5a.75.75 0 0 0 0 1.5h2.5v2.5a.75.75 0 0 0 1.5 0v-2.5h2.5a.75.75 0 0 0 0-1.5h-2.5v-2.5Z"
  }));
};
G.displayName = "PlusIcon";
const te = (n) => n.type === "boolean" && n.value == !0 || n.type === "limit" && n.value !== 0, fe = (n, r) => te(r) - te(n) || n.name.localeCompare(r.name), ue = (n = "USD") => new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: n,
  notation: "standard"
}), W = (n, r = "USD", m = !0) => {
  let u = ue(r).format(n);
  return m && (u = u.replace(/\.00$/, "")), u;
}, d = {
  ANNUAL: "ANNUAL",
  EVERY_30_DAYS: "EVERY_30_DAYS"
}, s = {
  Back: "Back",
  CurrentPlan: "Current plan",
  CustomPlans: "Custom plans",
  CustomPlansDescription: "Plans tailored to your specific needs",
  FreeTrialLength: "{{ trialDays }}-day free trial",
  Features: "Features",
  Month: "month",
  MonthShort: "mo",
  Monthly: "Monthly",
  Year: "year",
  YearShort: "yr",
  Yearly: "Yearly",
  MostPopular: "Most popular",
  Per: "/",
  Plans: "Plans",
  SelectPlan: "Select plan",
  SubscribeSuccessTitle: "Subscription successful",
  SubscribeSuccessBody: "Thanks for subscribing to our app!"
}, me = (n = d.EVERY_30_DAYS) => {
  switch (n) {
    case d.ANNUAL:
      return "year";
    case d.EVERY_30_DAYS:
    default:
      return "month";
  }
}, de = (n = d.EVERY_30_DAYS) => {
  switch (n) {
    case d.ANNUAL:
      return "yr";
    case d.EVERY_30_DAYS:
    default:
      return "mo";
  }
}, H = ({
  interval: n = d.EVERY_30_DAYS,
  useShortFormPlanIntervals: r = !0
}) => r ? de(n) : me(n), Ee = ({ plan: n, recommended: r = !1 }) => /* @__PURE__ */ e.createElement(h, null, /* @__PURE__ */ e.createElement(A, { align: "space-between", gap: "100" }, /* @__PURE__ */ e.createElement(i, { variant: "bodyLg" }, n.name), r && /* @__PURE__ */ e.createElement(Z, { tone: "success" }, s.MostPopular)), n.description && /* @__PURE__ */ e.createElement(i, { tone: "subdued" }, n.description)), ge = ({ plan: n, discount: r, useShortFormPlanIntervals: m = !0 }) => /* @__PURE__ */ e.createElement(h, { gap: "100" }, !!r && /* @__PURE__ */ e.createElement(A, { blockAlign: "center", gap: "200" }, /* @__PURE__ */ e.createElement(i, { variant: "headingXl" }, W(r.discountedAmount, n.currency)), /* @__PURE__ */ e.createElement(
  i,
  {
    variant: "headingXl",
    tone: "subdued",
    fontWeight: "medium",
    textDecorationLine: "line-through"
  },
  n.amount
), /* @__PURE__ */ e.createElement(i, { variant: "bodyLg", tone: "subdued" }, s.Per, " ", H({ interval: n.interval, useShortFormPlanIntervals: m }))), !r && /* @__PURE__ */ e.createElement(A, { blockAlign: "center", gap: "200" }, /* @__PURE__ */ e.createElement(i, { alignment: "center", variant: "headingXl" }, W(n.amount, n.currency)), /* @__PURE__ */ e.createElement(i, { alignment: "center", variant: "bodyLg", tone: "subdued" }, s.Per, " ", H({ interval: n.interval, useShortFormPlanIntervals: m }))), n.usageCharges && n.usageCharges.length > 0 && /* @__PURE__ */ e.createElement(h, null, n.usageCharges.map((u, o) => /* @__PURE__ */ e.createElement(A, { key: `plan-usageCharge-${o}`, align: "start", gap: "100" }, /* @__PURE__ */ e.createElement(f, null, /* @__PURE__ */ e.createElement(V, { source: G, tone: "positive" })), /* @__PURE__ */ e.createElement(i, { variant: "bodyLg" }, u.terms))))), he = ({ plan: n, trialDaysAsFeature: r = !1 }) => /* @__PURE__ */ e.createElement(h, { gap: "100" }, r && n.trialDays && n.trialDays > 0 && /* @__PURE__ */ e.createElement(A, { align: "start", gap: "100" }, /* @__PURE__ */ e.createElement(f, null, /* @__PURE__ */ e.createElement(V, { source: X, tone: "positive" })), /* @__PURE__ */ e.createElement(i, { tone: "subdued" }, s.FreeTrialLength.replace("{{ trialDays }}", n.trialDays))), n.featuresOrder.map((m, u) => {
  const o = n.features[m];
  if (o.type !== "boolean" || o.value === !0)
    return /* @__PURE__ */ e.createElement(A, { key: `plan-feature-${u}`, align: "start", gap: "100" }, /* @__PURE__ */ e.createElement(f, null, /* @__PURE__ */ e.createElement(V, { source: X, tone: "positive" })), o.type === "boolean" ? /* @__PURE__ */ e.createElement(i, { tone: "subdued" }, o.name) : /* @__PURE__ */ e.createElement(i, { tone: "subdued" }, o.value, " ", o.name));
})), ne = ({
  plan: n,
  discount: r,
  buttonLabel: m,
  onSelectPlan: u,
  activePlan: o = !1,
  useShortFormPlanIntervals: c = !0,
  recommended: C = !1,
  trialDaysAsFeature: k = !1
}) => /* @__PURE__ */ e.createElement(j, null, /* @__PURE__ */ e.createElement(h, { gap: "400" }, /* @__PURE__ */ e.createElement(Ee, { plan: n, recommended: C }), /* @__PURE__ */ e.createElement(
  ge,
  {
    plan: n,
    discount: r,
    useShortFormPlanIntervals: c
  }
), /* @__PURE__ */ e.createElement(
  M,
  {
    size: "large",
    variant: C ? "primary" : "secondary",
    onClick: () => {
      u(n);
    },
    disabled: o
  },
  o ? s.CurrentPlan : m || s.SelectPlan
), /* @__PURE__ */ e.createElement(he, { plan: n, trialDaysAsFeature: k }))), Ae = ({
  customer: n,
  plans: r,
  onSubscribe: m,
  backUrl: u = "",
  // string: URL to use as "back" breadcrumb URL. leave as empty string or null to hide the back button
  showRecommendedBadge: o = !0,
  // boolean
  customFieldCta: c,
  // string: value of the custom plan field to use as the CTA. e.g. "cta"
  customFieldPlanRecommended: C = "Recommended",
  // string: value of the custom plan field to use as the recommended badge
  showPlanIntervalToggle: k = !0,
  // boolean
  showTrialDaysAsFeature: N = !0,
  // boolean
  useShortFormPlanIntervals: F,
  // boolean: e.g. show "$ / mo" instead of "$ / month"
  pageWidth: R = "default",
  // string: "full", "narrow", or "default"
  showCustomPlans: B = !0
  // boolean: show custom plans
}) => {
  const P = n == null ? void 0 : n.subscription, T = new URLSearchParams(window.location.search), D = r.some((l) => l.interval === d.ANNUAL) && r.some((l) => l.interval === d.EVERY_30_DAYS), b = r.find((l) => l.id === (P == null ? void 0 : P.plan.id)), [w, x] = I(
    b ? b.interval : D ? d.ANNUAL : d.EVERY_30_DAYS
  ), v = r.filter(
    (l) => l.availability !== "customerTag" && l.availability !== "customer"
  ), _ = k && D ? v.filter((l) => l.interval === w) : v, y = B ? r.filter(
    (l) => l.availability === "customerTag" || l.availability === "customer"
  ) : [], [L, q] = I(
    T.get("subscribed") === "true"
  ), O = (l = _.length) => l % 4 === 0 ? { xs: 6, sm: 6, md: 2, lg: 3, xl: 3 } : l % 3 === 0 ? { xs: 6, sm: 6, md: 2, lg: 4, xl: 4 } : l % 2 === 0 ? { xs: 6, sm: 6, md: 3, lg: 6, xl: 6 } : l === 1 ? { xs: 6, sm: 6, md: 6, lg: 12, xl: 12 } : { xs: 6, sm: 6, md: 2, lg: 4, xl: 4 };
  return /* @__PURE__ */ e.createElement(
    J,
    {
      title: s.Plans,
      backAction: u ? { content: s.Back, url: u } : void 0,
      secondaryActions: k && D ? /* @__PURE__ */ e.createElement(K, { variant: "segmented" }, /* @__PURE__ */ e.createElement(
        M,
        {
          pressed: w === d.EVERY_30_DAYS,
          onClick: () => x(d.EVERY_30_DAYS)
        },
        s.Monthly
      ), /* @__PURE__ */ e.createElement(
        M,
        {
          pressed: w === d.ANNUAL,
          onClick: () => x(d.ANNUAL)
        },
        s.Yearly
      )) : void 0,
      fullWidth: R === "full",
      narrowWidth: R === "narrow"
    },
    /* @__PURE__ */ e.createElement(z, null, /* @__PURE__ */ e.createElement(z.Section, null, /* @__PURE__ */ e.createElement(h, { gap: "1000" }, L && /* @__PURE__ */ e.createElement(
      Q,
      {
        tone: "success",
        title: s.SubscribeSuccessTitle,
        onDismiss: () => {
          q(!1), window.history.replaceState({}, document.title, window.location.pathname);
        }
      },
      s.SubscribeSuccessBody
    ), /* @__PURE__ */ e.createElement(Y, null, _.map((l, $) => {
      var p;
      const U = ((p = l.discounts) == null ? void 0 : p.length) > 0 ? l.discounts.reduce(
        (t, E) => t.discountedAmount < E.discountedAmount ? t : E
      ) : null, a = c && l.customFields ? l.customFields[c] : void 0;
      return /* @__PURE__ */ e.createElement(Y.Cell, { key: `plan-${$}`, columnSpan: O() }, /* @__PURE__ */ e.createElement(
        ne,
        {
          plan: l,
          discount: U,
          onSelectPlan: (t) => {
            m(t);
          },
          activePlan: (b == null ? void 0 : b.id) === l.id,
          useShortFormPlanIntervals: F,
          recommended: o && l.customFields && l.customFields[C],
          trialDaysAsFeature: N,
          buttonLabel: a
        }
      ));
    })), (y == null ? void 0 : y.length) > 0 && /* @__PURE__ */ e.createElement(ee, { borderColor: "border" }), (y == null ? void 0 : y.length) > 0 && /* @__PURE__ */ e.createElement(h, { gap: "300" }, /* @__PURE__ */ e.createElement(f, { paddingInline: { xs: 400, sm: 0 } }, /* @__PURE__ */ e.createElement(i, { variant: "headingMd" }, s.CustomPlans)), /* @__PURE__ */ e.createElement(Y, null, y.map((l, $) => {
      var p;
      const U = ((p = l.discounts) == null ? void 0 : p.length) > 0 ? l.discounts.reduce(
        (t, E) => t.discountedAmount < E.discountedAmount ? t : E
      ) : null, a = c && l.customFields ? l.customFields[c] : void 0;
      return /* @__PURE__ */ e.createElement(Y.Cell, { key: `custom-plan-${$}`, columnSpan: O() }, /* @__PURE__ */ e.createElement(
        ne,
        {
          plan: l,
          discount: U,
          onSelectPlan: (t) => {
            m(t);
          },
          activePlan: (b == null ? void 0 : b.id) === l.id,
          useShortFormPlanIntervals: F,
          recommended: o && l.customFields && l.customFields[C],
          trialDaysAsFeature: N,
          buttonLabel: a
        }
      ));
    }))))))
  );
}, we = ({
  customer: n,
  plans: r,
  onSubscribe: m,
  backUrl: u = "",
  // string: URL to use as "back" breadcrumb URL. leave as empty string or null to hide the back button
  showRecommendedBadge: o = !0,
  // boolean
  customFieldCta: c = null,
  // string: value of the custom plan field to use as the CTA. e.g. "cta"
  customFieldPlanRecommended: C = "Recommended",
  // string: value of the custom plan field to use as the recommended badge
  addSpacingToNonRecommendedPlans: k = !0,
  // boolean
  showPlanIntervalToggle: N = !0,
  // boolean
  showTrialDaysAsFeature: F = !0,
  // boolean
  useShortFormPlanIntervals: R = !0,
  // boolean: e.g. show "$ / mo" instead of "$ / month"
  pageWidth: B = "default",
  // string: "full", "narrow", or "default"
  showCustomPlans: P = !0
  // boolean: show custom plans
}) => {
  const T = n == null ? void 0 : n.subscription, D = new URLSearchParams(window.location.search), b = r.some((t) => t.interval === d.ANNUAL) && r.some((t) => t.interval === d.EVERY_30_DAYS), w = r.find((t) => t.id === (T == null ? void 0 : T.plan.id)), [x, v] = I(
    w ? w.interval : b ? d.ANNUAL : d.EVERY_30_DAYS
  ), _ = r.filter(
    (t) => t.availability !== "customerTag" && t.availability !== "customer"
  ), y = N && b ? _.filter((t) => t.interval === x) : _, L = P ? r.filter(
    (t) => t.availability === "customerTag" || t.availability === "customer"
  ) : [], [q, O] = I(
    D.get("subscribed") === "true"
  ), l = (t = y.length) => t % 4 === 0 ? { xs: 6, sm: 6, md: 2, lg: 3, xl: 3 } : t % 3 === 0 ? { xs: 6, sm: 6, md: 2, lg: 4, xl: 4 } : t % 2 === 0 ? { xs: 6, sm: 6, md: 3, lg: 6, xl: 6 } : t === 1 ? { xs: 6, sm: 6, md: 6, lg: 12, xl: 12 } : { xs: 6, sm: 6, md: 2, lg: 4, xl: 4 }, $ = () => y.length % 4 === 0 ? 4 : y.length % 3 === 0 ? 3 : y.length % 2 === 0 ? 2 : y.length === 1 ? 1 : 4, U = (t) => /* @__PURE__ */ e.createElement(h, { gap: "100" }, /* @__PURE__ */ e.createElement(i, { variant: "headingMd", alignment: "center" }, t.name), t.description && /* @__PURE__ */ e.createElement(i, { variant: "bodyLg", tone: "subdued", alignment: "center" }, t.description)), a = (t) => /* @__PURE__ */ e.createElement(h, { gap: "300" }, F && t.trialDays !== 0 && /* @__PURE__ */ e.createElement(A, { align: "center", blockAlign: "center", gap: "100" }, /* @__PURE__ */ e.createElement(f, null, /* @__PURE__ */ e.createElement(V, { source: X, tone: "positive" })), /* @__PURE__ */ e.createElement(i, { tone: "subdued" }, s.FreeTrialLength.replace("{{ trialDays }}", t.trialDays))), t.featuresOrder.map((E, g) => {
    const S = t.features[E];
    if (S.type !== "boolean" || S.value === !0)
      return /* @__PURE__ */ e.createElement(A, { key: `plan-feature-${g}`, align: "center", gap: "100" }, /* @__PURE__ */ e.createElement(f, null, /* @__PURE__ */ e.createElement(V, { source: X, tone: "positive" })), S.type === "boolean" ? /* @__PURE__ */ e.createElement(i, { tone: "subdued" }, S.name) : /* @__PURE__ */ e.createElement(i, { tone: "subdued" }, S.value, " ", S.name));
  })), p = (t) => {
    let E = t.amount;
    for (const g of t.discounts)
      E = g.percentage ? t.amount - t.amount * (g.percentage / 100) : t.amount - g.amount;
    return /* @__PURE__ */ e.createElement(h, { gap: "100" }, t.discounts.length > 0 ? /* @__PURE__ */ e.createElement(A, { align: "center", blockAlign: "center", gap: "200" }, /* @__PURE__ */ e.createElement(i, { variant: "heading3xl" }, W(E, t.currency, !0)), /* @__PURE__ */ e.createElement(
      i,
      {
        variant: "heading3xl",
        tone: "subdued",
        fontWeight: "medium",
        textDecorationLine: "line-through"
      },
      W(t.amount, t.currency, !0)
    ), /* @__PURE__ */ e.createElement(i, { variant: "bodyLg", tone: "subdued" }, s.Per, " ", H({ interval: t.interval, useShortFormPlanIntervals: R }))) : /* @__PURE__ */ e.createElement(A, { align: "center", blockAlign: "center", gap: "200" }, /* @__PURE__ */ e.createElement(i, { alignment: "center", variant: "heading3xl" }, W(t.amount, t.currency, !0)), /* @__PURE__ */ e.createElement(i, { alignment: "center", variant: "bodyLg", tone: "subdued" }, s.Per, " ", H({ interval: t.interval, useShortFormPlanIntervals: R }))), t.usageCharges.length > 0 && /* @__PURE__ */ e.createElement(h, null, t.usageCharges.map((g, S) => /* @__PURE__ */ e.createElement(A, { key: `plan-usageCharge-${S}`, align: "center", gap: "100" }, /* @__PURE__ */ e.createElement(f, null, /* @__PURE__ */ e.createElement(V, { source: G, tone: "positive" })), /* @__PURE__ */ e.createElement(i, { variant: "bodyLg" }, g.terms)))));
  };
  return /* @__PURE__ */ e.createElement(
    J,
    {
      title: s.Plans,
      backAction: u && u !== "" ? { content: s.Back, url: u } : void 0,
      secondaryActions: N && b ? /* @__PURE__ */ e.createElement(K, { variant: "segmented" }, /* @__PURE__ */ e.createElement(
        M,
        {
          pressed: x === d.EVERY_30_DAYS,
          onClick: () => v(d.EVERY_30_DAYS)
        },
        s.Monthly
      ), /* @__PURE__ */ e.createElement(
        M,
        {
          pressed: x === d.ANNUAL,
          onClick: () => v(d.ANNUAL)
        },
        s.Yearly
      )) : void 0,
      fullWidth: B === "full",
      narrowWidth: B === "narrow"
    },
    /* @__PURE__ */ e.createElement(f, { paddingBlockEnd: "800" }, /* @__PURE__ */ e.createElement(z, null, /* @__PURE__ */ e.createElement(z.Section, null, /* @__PURE__ */ e.createElement(h, { gap: "1000" }, q && /* @__PURE__ */ e.createElement(
      Q,
      {
        tone: "success",
        title: s.SubscribeSuccessTitle,
        onDismiss: () => {
          O(!1), window.history.replaceState({}, document.title, window.location.pathname);
        }
      },
      s.SubscribeSuccessBody
    ), /* @__PURE__ */ e.createElement(Y, { columns: $() }, y.map((t, E) => {
      const g = t.customFields && t.customFields[C], S = c && t.customFields[c];
      return /* @__PURE__ */ e.createElement(Y.Cell, { key: `plan-${E}`, columnSpan: l() }, /* @__PURE__ */ e.createElement(f, { position: "relative", minHeight: "100%" }, /* @__PURE__ */ e.createElement(
        f,
        {
          paddingBlock: !k || g ? void 0 : "800",
          minHeight: "100%"
        },
        /* @__PURE__ */ e.createElement(
          f,
          {
            background: g ? "bg-surface" : "bg-surface-secondary",
            borderStyle: "solid",
            borderColor: "border",
            borderWidth: "025",
            paddingBlock: k && g ? "1600" : "800",
            paddingInline: "400",
            borderRadius: "200",
            minHeight: "calc(100% - calc(var(--p-space-800) * 2))"
          },
          /* @__PURE__ */ e.createElement(h, { gap: "800" }, /* @__PURE__ */ e.createElement(h, { gap: "400" }, U(t), p(t)), /* @__PURE__ */ e.createElement(
            M,
            {
              size: "large",
              variant: g ? "primary" : "secondary",
              onClick: () => m(t)
            },
            S ? t.customFields[c] : s.SelectPlan
          ), a(t), g && o && /* @__PURE__ */ e.createElement(A, { key: `plan-feature-${E}`, align: "center", gap: "100" }, /* @__PURE__ */ e.createElement(Z, { tone: "success" }, s.MostPopular)))
        )
      )));
    })), (L == null ? void 0 : L.length) > 0 && /* @__PURE__ */ e.createElement(ee, { borderColor: "border" }), (L == null ? void 0 : L.length) > 0 && /* @__PURE__ */ e.createElement(h, { gap: "300" }, /* @__PURE__ */ e.createElement(f, { paddingInline: { xs: 400, sm: 0 } }, /* @__PURE__ */ e.createElement(i, { variant: "headingMd" }, s.CustomPlans)), /* @__PURE__ */ e.createElement(Y, null, L.map((t, E) => {
      const g = t.customFields && t.customFields[C], S = c && t.customFields[c];
      return /* @__PURE__ */ e.createElement(
        Y.Cell,
        {
          key: `custom-plan-${E}`,
          columnSpan: l(L.length)
        },
        /* @__PURE__ */ e.createElement(j, null, /* @__PURE__ */ e.createElement(h, { gap: "400" }, U(t), p(t), /* @__PURE__ */ e.createElement(
          M,
          {
            size: "large",
            variant: g ? "primary" : "secondary",
            onClick: () => m(t)
          },
          S ? t.customFields[c] : s.SelectPlan
        ), a(t)))
      );
    })))))))
  );
}, Ce = ({
  customer: n,
  plans: r,
  onSubscribe: m,
  backUrl: u = "",
  // string: URL to use as "back" breadcrumb URL. leave as empty string or null to hide the back button
  showRecommendedBadge: o = !0,
  // boolean
  customFieldCta: c = null,
  // string: value of the custom plan field to use as the CTA. e.g. "cta"
  customFieldPlanRecommended: C = "Recommended",
  // string: value of the custom plan field to use as the recommended badge
  showPlanIntervalToggle: k = !1,
  // boolean
  showTrialDaysAsFeature: N = !0,
  // boolean
  useShortFormPlanIntervals: F = !0,
  // boolean: e.g. show "$ / mo" instead of "$ / month"
  pageWidth: R = "default",
  // string: "full", "narrow", or "default"
  showCustomPlans: B = !0
  // boolean: show custom plans
}) => {
  const P = n == null ? void 0 : n.subscription, T = new URLSearchParams(window.location.search), D = r.some((a) => a.interval === d.ANNUAL) && r.some((a) => a.interval === d.EVERY_30_DAYS), b = r.find((a) => a.id === (P == null ? void 0 : P.plan.id)), [w, x] = I(
    b ? b.interval : D ? d.ANNUAL : d.EVERY_30_DAYS
  ), v = r.filter(
    (a) => a.availability !== "customerTag" && a.availability !== "customer"
  ), _ = k && D ? v.filter((a) => a.interval === w) : v, y = B ? r.filter(
    (a) => a.availability === "customerTag" || a.availability === "customer"
  ) : [], [L, q] = I(
    T.get("subscribed") === "true"
  ), O = ({ plan: a, discount: p }) => /* @__PURE__ */ e.createElement(h, null, /* @__PURE__ */ e.createElement(i, { variant: "bodyLg" }, a.name), a.description && /* @__PURE__ */ e.createElement(i, { tone: "subdued" }, a.description)), l = ({ plan: a, discount: p }) => /* @__PURE__ */ e.createElement(h, { gap: "200" }, /* @__PURE__ */ e.createElement(i, { fontWeight: "medium" }, s.Features), /* @__PURE__ */ e.createElement(h, { gap: "100" }, N && a.trialDays !== 0 && /* @__PURE__ */ e.createElement(A, { align: "start", gap: "100" }, /* @__PURE__ */ e.createElement(f, null, /* @__PURE__ */ e.createElement(V, { source: X, tone: "positive" })), /* @__PURE__ */ e.createElement(i, { tone: "subdued" }, s.FreeTrialLength.replace("{{ trialDays }}", a.trialDays))), a.featuresOrder.map((t, E) => {
    const g = a.features[t];
    if (g.type !== "boolean" || g.value === !0)
      return /* @__PURE__ */ e.createElement(A, { key: `plan-feature-${E}`, align: "start", gap: "100" }, /* @__PURE__ */ e.createElement(f, null, /* @__PURE__ */ e.createElement(V, { source: X, tone: "positive" })), g.type === "boolean" ? /* @__PURE__ */ e.createElement(i, { tone: "subdued" }, g.name) : /* @__PURE__ */ e.createElement(i, { tone: "subdued" }, g.value, " ", g.name));
  }))), $ = ({ plan: a, discount: p }) => /* @__PURE__ */ e.createElement(h, { gap: "100" }, p ? /* @__PURE__ */ e.createElement(A, { blockAlign: "center", gap: "200" }, /* @__PURE__ */ e.createElement(i, { variant: "headingXl" }, W(p.discountedAmount, a.currency)), /* @__PURE__ */ e.createElement(
    i,
    {
      variant: "headingXl",
      tone: "subdued",
      fontWeight: "medium",
      textDecorationLine: "line-through"
    },
    a.amount
  ), /* @__PURE__ */ e.createElement(i, { variant: "bodyLg", tone: "subdued" }, s.Per, " ", H({ interval: a.interval, useShortFormPlanIntervals: F }))) : /* @__PURE__ */ e.createElement(A, { blockAlign: "center", gap: "200" }, /* @__PURE__ */ e.createElement(i, { alignment: "center", variant: "headingXl" }, W(a.amount, a.currency)), /* @__PURE__ */ e.createElement(i, { alignment: "center", variant: "bodyLg", tone: "subdued" }, s.Per, " ", H({ interval: a.interval, useShortFormPlanIntervals: F }))), a.usageCharges.length > 0 && /* @__PURE__ */ e.createElement(h, null, a.usageCharges.map((t, E) => /* @__PURE__ */ e.createElement(A, { key: `plan-usageCharge-${E}`, align: "start", gap: "100" }, /* @__PURE__ */ e.createElement(f, null, /* @__PURE__ */ e.createElement(V, { source: G, tone: "positive" })), /* @__PURE__ */ e.createElement(i, { variant: "bodyLg" }, t.terms))))), U = ({ plan: a, discount: p }) => {
    const t = c && a.customFields[c], E = a.customFields && a.customFields[C];
    return /* @__PURE__ */ e.createElement(A, { blockAlign: "center", gap: "400" }, /* @__PURE__ */ e.createElement(
      M,
      {
        size: "large",
        variant: E ? "primary" : "secondary",
        onClick: () => m({ planId: a.id, discountId: p == null ? void 0 : p.id }),
        disabled: (b == null ? void 0 : b.id) === a.id
      },
      (b == null ? void 0 : b.id) === a.id ? s.CurrentPlan : t ? a.customFields[c] : s.SelectPlan
    ), E && o && /* @__PURE__ */ e.createElement(f, null, /* @__PURE__ */ e.createElement(Z, { tone: "success" }, s.MostPopular)));
  };
  return /* @__PURE__ */ e.createElement(
    J,
    {
      title: s.Plans,
      backAction: u !== "" ? { content: s.Back, url: u } : void 0,
      secondaryActions: k && D ? /* @__PURE__ */ e.createElement(K, { variant: "segmented" }, /* @__PURE__ */ e.createElement(
        M,
        {
          pressed: w === d.EVERY_30_DAYS,
          onClick: () => x(d.EVERY_30_DAYS)
        },
        s.Monthly
      ), /* @__PURE__ */ e.createElement(
        M,
        {
          pressed: w === d.ANNUAL,
          onClick: () => x(d.ANNUAL)
        },
        s.Year
      )) : void 0,
      fullWidth: R === "full",
      narrowWidth: R === "narrow"
    },
    /* @__PURE__ */ e.createElement(z, null, /* @__PURE__ */ e.createElement(z.Section, null, /* @__PURE__ */ e.createElement(h, { gap: "400" }, L && /* @__PURE__ */ e.createElement(
      Q,
      {
        tone: "success",
        title: s.SubscribeSuccessTitle,
        onDismiss: () => {
          q(!1), window.history.replaceState({}, document.title, window.location.pathname);
        }
      },
      s.SubscribeSuccessBody
    ), _.map((a, p) => {
      var E;
      const t = ((E = a.discounts) == null ? void 0 : E.length) > 0 ? a.discounts.reduce(
        (g, S) => g.discountedAmount < S.discountedAmount ? g : S
      ) : null;
      return /* @__PURE__ */ e.createElement(j, { key: `plan-${p}` }, /* @__PURE__ */ e.createElement(Y, null, /* @__PURE__ */ e.createElement(Y.Cell, { columnSpan: { xs: 6, sm: 6, md: 3, lg: 6, xl: 12 } }, /* @__PURE__ */ e.createElement(h, { gap: "400" }, /* @__PURE__ */ e.createElement(h, { gap: "200" }, O({ plan: a, discount: t }), $({ plan: a, discount: t })), /* @__PURE__ */ e.createElement(f, null, U({ plan: a, discount: t })))), /* @__PURE__ */ e.createElement(Y.Cell, { columnSpan: { xs: 6, sm: 6, md: 3, lg: 6, xl: 12 } }, l({ plan: a, discount: t }))));
    }), (y == null ? void 0 : y.length) > 0 && /* @__PURE__ */ e.createElement(ee, { borderColor: "border" }), (y == null ? void 0 : y.length) > 0 && /* @__PURE__ */ e.createElement(h, { gap: "300" }, /* @__PURE__ */ e.createElement(f, { paddingInline: { xs: 400, sm: 0 } }, /* @__PURE__ */ e.createElement(i, { variant: "headingMd" }, s.CustomPlans)), /* @__PURE__ */ e.createElement(Y, null, y.map((a, p) => {
      var E;
      const t = ((E = a.discounts) == null ? void 0 : E.length) > 0 ? a.discounts.reduce(
        (g, S) => g.discountedAmount < S.discountedAmount ? g : S
      ) : null;
      return /* @__PURE__ */ e.createElement(Y.Cell, { key: `custom-plan-${p}`, columnSpan: columnSpan() }, /* @__PURE__ */ e.createElement(j, null, /* @__PURE__ */ e.createElement(h, { gap: "400" }, O({ plan: a, discount: t }), $({ plan: a, discount: t }), U({ plan: a, discount: t }), l({ plan: a, discount: t }))));
    }))))))
  );
};
export {
  he as FeaturesSection,
  we as HighlightedPlanCards,
  ne as HorizontalPlanCard,
  Ae as HorizontalPlanCards,
  s as Labels,
  pe as MantleProvider,
  d as PlanInterval,
  ge as PricingSection,
  Ee as TitleSection,
  Ce as VerticalPlanCards,
  te as featureEnabled,
  fe as featureSort,
  H as intervalLabel,
  me as intervalLabelLong,
  de as intervalLabelShort,
  W as money,
  Se as useMantle
};
