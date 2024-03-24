import e, { createContext as le, useState as T, useEffect as se, useContext as ce } from "react";
import { BlockStack as g, InlineStack as f, Text as m, Badge as Z, Box as A, Icon as U, Card as G, Button as $, Page as J, ButtonGroup as K, Layout as H, Banner as Q, Grid as Y, Divider as ee } from "@shopify/polaris";
class ie {
  /**
   * Creates a new MantleClient. If being used in the browser, or any frontend code, never use the apiKey parameter,
   * always use the customerApiToken for the customer that is currently authenticated on the frontend.
   * @param {Object} params
   * @param {string} params.appId - The Mantle App ID set up on your app in your Mantle account.
   * @param {string} params.apiKey - The Mantle App API key set up on your app in your Mantle account. This should never be used in the browser.
   * @param {string} params.customerApiToken - The Mantle Customer API Token returned by the /identify endpoint. This should be used in the browser.
   * @param {string} [params.apiUrl] - The Mantle API URL to use
   */
  constructor({ appId: n, apiKey: o, customerApiToken: i, apiUrl: r = "https://appapi.heymantle.com/v1" }) {
    if (!n)
      throw new Error("MantleClient appId is required");
    if (typeof window < "u" && o)
      throw new Error("MantleClient apiKey should never be used in the browser");
    if (!o && !i)
      throw new Error("MantleClient one of apiKey or customerApiToken is required");
    this.appId = n, this.apiKey = o, this.customerApiToken = i, this.apiUrl = r;
  }
  /**
   * Makes a request to the Mantle API
   * @param {Object} params
   * @param {"customer"|"usage_events"|"subscriptions"} params.path - The path to request
   * @param {"GET"|"POST"|"PUT"|"DELETE"} params.method - The HTTP method to use. Defaults to GET
   * @param {JSON} [params.body] - The request body
   * @returns {Promise<JSON>} a promise that resolves to the response body
   */
  async mantleRequest({ path: n, method: o = "GET", body: i }) {
    try {
      return await (await fetch(`${this.apiUrl}${n.startsWith("/") ? "" : "/"}${n}`, {
        method: o,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-Mantle-App-Id": this.appId,
          ...this.apiKey ? { "X-Mantle-App-Api-Key": this.apiKey } : {},
          ...this.customerApiToken ? { "X-Mantle-Customer-Api-Token": this.customerApiToken } : {}
        },
        ...i && {
          body: JSON.stringify(i)
        }
      })).json();
    } catch (r) {
      throw console.error(`[mantleRequest] ${n} error: ${r.message}`), r;
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
    platformId: n,
    myshopifyDomain: o,
    platform: i = "shopify",
    accessToken: r,
    name: s,
    email: w,
    customFields: C
  }) {
    return await this.mantleRequest({
      path: "identify",
      method: "POST",
      body: { platformId: n, myshopifyDomain: o, platform: i, accessToken: r, name: s, email: w, customFields: C }
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
  async subscribe({ planId: n, planIds: o, discountId: i, returnUrl: r, billingProvider: s }) {
    return await this.mantleRequest({
      path: "subscriptions",
      method: "POST",
      body: { planId: n, planIds: o, discountId: i, returnUrl: r, billingProvider: s }
    });
  }
  /**
   * Cancel the current subscription
   * @param {Object} params - The subscription options
   * @param {string} [params.cancelReason] - The reason for cancelling the subscription
   * @returns {Promise<Subscription>} a promise that resolves to the cancelled subscription
   */
  async cancelSubscription({ cancelReason: n } = {}) {
    return await this.mantleRequest({
      path: "subscriptions",
      method: "DELETE",
      ...n && {
        body: { cancelReason: n }
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
  async updateSubscription({ id: n, cappedAmount: o }) {
    return await this.mantleRequest({
      path: "subscriptions",
      method: "PUT",
      body: { id: n, cappedAmount: o }
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
  async sendUsageEvent({ eventId: n, eventName: o, customerId: i, properties: r = {} }) {
    return await this.mantleRequest({
      path: "usage_events",
      method: "POST",
      body: {
        eventId: n,
        eventName: o,
        ...i ? { customerId: i } : {},
        properties: r
      }
    });
  }
  /**
   * Send multiple usage events of the same type in bulk, for example, when tracking page views
   * @param {Object} params - The usage event options
   * @param {UsageEvent[]} params.events - The events to send
   * @returns {Promise<boolean>} true if the events were sent successfully
   */
  async sendUsageEvents({ events: n }) {
    return await this.mantleRequest({
      path: "usage_events",
      method: "POST",
      body: {
        events: n
      }
    });
  }
}
var oe = {
  MantleClient: ie
};
const re = le(), ue = ({ feature: t, count: n = 0 }) => (t == null ? void 0 : t.type) === "boolean" ? t.value : (t == null ? void 0 : t.type) === "limit" ? n < t.value || t.value === -1 : !1, Ae = ({
  appId: t,
  customerApiToken: n,
  apiUrl: o = "https://appapi.heymantle.com/v1",
  children: i
}) => {
  const r = new oe.MantleClient({ appId: t, customerApiToken: n, apiUrl: o }), [s, w] = T(null), [C, P] = T(!0), [k, D] = T(null), F = async () => {
    try {
      P(!0);
      const p = await r.getCustomer();
      w(p);
    } catch (p) {
      D(p);
    } finally {
      P(!1);
    }
  }, _ = async (p) => {
    await r.sendUsageEvent(p);
  }, B = async ({ planId: p, planIds: M, discountId: h, billingProvider: L, returnUrl: I }) => await r.subscribe({
    planId: p,
    planIds: M,
    discountId: h,
    billingProvider: L,
    returnUrl: I
  }), N = async () => await r.cancelSubscription();
  se(() => {
    n && F();
  }, [n]);
  const v = (s == null ? void 0 : s.plans) || [], S = s == null ? void 0 : s.subscription, R = S == null ? void 0 : S.plan;
  return /* @__PURE__ */ e.createElement(
    re.Provider,
    {
      value: {
        customer: s,
        subscription: S,
        plans: v,
        loading: C,
        error: k,
        client: r,
        sendUsageEvent: _,
        subscribe: B,
        cancelSubscription: N,
        isFeatureEnabled: ({ featureKey: p, count: M = 0 }) => s != null && s.features[p] ? ue({ feature: s.features[p], count: M }) : !1,
        limitForFeature: ({ featureKey: p }) => s != null && s.features[p] && R.features[p].type === "limit" ? s.features[p].value : -1,
        refetch: async () => {
          await F();
        }
      }
    },
    i
  );
}, we = () => {
  const t = ce(re);
  if (t === void 0)
    throw new Error("useMantle must be used within a MantleProvider");
  return t;
}, te = (t) => t.type === "boolean" && t.value == !0 || t.type === "limit" && t.value !== 0, Ce = (t, n) => te(n) - te(t) || t.name.localeCompare(n.name), me = (t = "USD") => new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: t,
  notation: "standard"
}), O = (t, n = "USD", o = !0) => {
  let i = me(n).format(t);
  return o && (i = i.replace(/\.00$/, "")), i;
}, d = {
  ANNUAL: "ANNUAL",
  EVERY_30_DAYS: "EVERY_30_DAYS"
}, u = {
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
}, de = (t = d.EVERY_30_DAYS) => {
  switch (t) {
    case d.ANNUAL:
      return "year";
    case d.EVERY_30_DAYS:
    default:
      return "month";
  }
}, Ee = (t = d.EVERY_30_DAYS) => {
  switch (t) {
    case d.ANNUAL:
      return "yr";
    case d.EVERY_30_DAYS:
    default:
      return "mo";
  }
}, j = ({
  interval: t = d.EVERY_30_DAYS,
  useShortFormPlanIntervals: n = !0
}) => n ? Ee(t) : de(t);
var W = function(n) {
  return /* @__PURE__ */ e.createElement("svg", Object.assign({
    viewBox: "0 0 20 20"
  }, n), /* @__PURE__ */ e.createElement("path", {
    fillRule: "evenodd",
    d: "M15.78 5.97a.75.75 0 0 1 0 1.06l-6.5 6.5a.75.75 0 0 1-1.06 0l-3.25-3.25a.75.75 0 1 1 1.06-1.06l2.72 2.72 5.97-5.97a.75.75 0 0 1 1.06 0Z"
  }));
};
W.displayName = "CheckIcon";
var z = function(n) {
  return /* @__PURE__ */ e.createElement("svg", Object.assign({
    viewBox: "0 0 20 20"
  }, n), /* @__PURE__ */ e.createElement("path", {
    d: "M10.75 6.75a.75.75 0 0 0-1.5 0v2.5h-2.5a.75.75 0 0 0 0 1.5h2.5v2.5a.75.75 0 0 0 1.5 0v-2.5h2.5a.75.75 0 0 0 0-1.5h-2.5v-2.5Z"
  }));
};
z.displayName = "PlusIcon";
const ge = ({ plan: t, isRecommendedPlan: n = !1 }) => /* @__PURE__ */ e.createElement(g, null, /* @__PURE__ */ e.createElement(f, { align: "space-between", gap: "100" }, /* @__PURE__ */ e.createElement(m, { variant: "bodyLg" }, t.name), n && /* @__PURE__ */ e.createElement(Z, { tone: "success" }, u.MostPopular)), t.description && /* @__PURE__ */ e.createElement(m, { tone: "subdued" }, t.description)), he = ({ plan: t, discount: n, useShortFormPlanIntervals: o = !0 }) => /* @__PURE__ */ e.createElement(g, { gap: "100" }, !!n && /* @__PURE__ */ e.createElement(f, { blockAlign: "center", gap: "200" }, /* @__PURE__ */ e.createElement(m, { variant: "headingXl" }, O(n.discountedAmount, t.currency)), /* @__PURE__ */ e.createElement(
  m,
  {
    variant: "headingXl",
    tone: "subdued",
    fontWeight: "medium",
    textDecorationLine: "line-through"
  },
  t.amount
), /* @__PURE__ */ e.createElement(m, { variant: "bodyLg", tone: "subdued" }, u.Per, " ", j({ interval: t.interval, useShortFormPlanIntervals: o }))), !n && /* @__PURE__ */ e.createElement(f, { blockAlign: "center", gap: "200" }, /* @__PURE__ */ e.createElement(m, { alignment: "center", variant: "headingXl" }, O(t.amount, t.currency)), /* @__PURE__ */ e.createElement(m, { alignment: "center", variant: "bodyLg", tone: "subdued" }, u.Per, " ", j({ interval: t.interval, useShortFormPlanIntervals: o }))), t.usageCharges && t.usageCharges.length > 0 && /* @__PURE__ */ e.createElement(g, null, t.usageCharges.map((i, r) => /* @__PURE__ */ e.createElement(f, { key: `plan-usageCharge-${r}`, align: "start", gap: "100" }, /* @__PURE__ */ e.createElement(A, null, /* @__PURE__ */ e.createElement(U, { source: z, tone: "positive" })), /* @__PURE__ */ e.createElement(m, { variant: "bodyLg" }, i.terms))))), ye = ({ plan: t, trialDaysAsFeature: n = !1 }) => /* @__PURE__ */ e.createElement(g, { gap: "100" }, n && t.trialDays && t.trialDays > 0 ? /* @__PURE__ */ e.createElement(f, { align: "start", gap: "100" }, /* @__PURE__ */ e.createElement(A, null, /* @__PURE__ */ e.createElement(U, { source: W, tone: "positive" })), /* @__PURE__ */ e.createElement(m, { tone: "subdued" }, u.FreeTrialLength.replace("{{ trialDays }}", t.trialDays))) : null, t.featuresOrder.map((o, i) => {
  const r = t.features[o];
  if (r.type !== "boolean" || r.value === !0)
    return /* @__PURE__ */ e.createElement(f, { key: `plan-feature-${i}`, align: "start", gap: "100" }, /* @__PURE__ */ e.createElement(A, null, /* @__PURE__ */ e.createElement(U, { source: W, tone: "positive" })), r.type === "boolean" ? /* @__PURE__ */ e.createElement(m, { tone: "subdued" }, r.name) : /* @__PURE__ */ e.createElement(m, { tone: "subdued" }, r.value, " ", r.name));
})), ne = ({
  plan: t,
  discount: n,
  buttonLabel: o,
  onSelectPlan: i,
  useShortFormPlanIntervals: r = !0,
  trialDaysAsFeature: s = !1,
  isRecommendedPlan: w = !1,
  isActivePlan: C = !1
}) => /* @__PURE__ */ e.createElement(G, null, /* @__PURE__ */ e.createElement(g, { gap: "400" }, /* @__PURE__ */ e.createElement(ge, { plan: t, isRecommendedPlan: w }), /* @__PURE__ */ e.createElement(
  he,
  {
    plan: t,
    discount: n,
    useShortFormPlanIntervals: r
  }
), /* @__PURE__ */ e.createElement(
  $,
  {
    size: "large",
    variant: w ? "primary" : "secondary",
    onClick: () => {
      i(t);
    },
    disabled: C
  },
  C ? u.CurrentPlan : o || u.SelectPlan
), /* @__PURE__ */ e.createElement(ye, { plan: t, trialDaysAsFeature: s }))), Pe = ({
  customer: t,
  plans: n,
  onSubscribe: o,
  backUrl: i = "",
  // string: URL to use as "back" breadcrumb URL. leave as empty string or null to hide the back button
  showRecommendedBadge: r = !0,
  // boolean
  customFieldCta: s,
  // string: value of the custom plan field to use as the CTA. e.g. "cta"
  customFieldPlanRecommended: w = "Recommended",
  // string: value of the custom plan field to use as the recommended badge
  showPlanIntervalToggle: C = !0,
  // boolean
  showTrialDaysAsFeature: P = !0,
  // boolean
  useShortFormPlanIntervals: k,
  // boolean: e.g. show "$ / mo" instead of "$ / month"
  pageWidth: D = "default",
  // string: "full", "narrow", or "default"
  showCustomPlans: F = !0
  // boolean: show custom plans
}) => {
  const _ = t == null ? void 0 : t.subscription, B = new URLSearchParams(window.location.search), N = n.some((c) => c.interval === d.ANNUAL) && n.some((c) => c.interval === d.EVERY_30_DAYS), v = n.find((c) => c.id === (_ == null ? void 0 : _.plan.id)), [S, R] = T(
    v ? v.interval : N ? d.ANNUAL : d.EVERY_30_DAYS
  ), p = n.filter(
    (c) => c.availability !== "customerTag" && c.availability !== "customer"
  ), M = C && N ? p.filter((c) => c.interval === S) : p, h = F ? n.filter(
    (c) => c.availability === "customerTag" || c.availability === "customer"
  ) : [], [L, I] = T(
    B.get("subscribed") === "true"
  ), q = (c = M.length) => c % 4 === 0 ? { xs: 6, sm: 6, md: 2, lg: 3, xl: 3 } : c % 3 === 0 ? { xs: 6, sm: 6, md: 2, lg: 4, xl: 4 } : c % 2 === 0 ? { xs: 6, sm: 6, md: 3, lg: 6, xl: 6 } : c === 1 ? { xs: 6, sm: 6, md: 6, lg: 12, xl: 12 } : { xs: 6, sm: 6, md: 2, lg: 4, xl: 4 };
  return /* @__PURE__ */ e.createElement(
    J,
    {
      title: u.Plans,
      backAction: i ? { content: u.Back, url: i } : void 0,
      secondaryActions: C && N ? /* @__PURE__ */ e.createElement(K, { variant: "segmented" }, /* @__PURE__ */ e.createElement(
        $,
        {
          pressed: S === d.EVERY_30_DAYS,
          onClick: () => R(d.EVERY_30_DAYS)
        },
        u.Monthly
      ), /* @__PURE__ */ e.createElement(
        $,
        {
          pressed: S === d.ANNUAL,
          onClick: () => R(d.ANNUAL)
        },
        u.Yearly
      )) : void 0,
      fullWidth: D === "full",
      narrowWidth: D === "narrow"
    },
    /* @__PURE__ */ e.createElement(H, null, /* @__PURE__ */ e.createElement(H.Section, null, /* @__PURE__ */ e.createElement(g, { gap: "1000" }, L && /* @__PURE__ */ e.createElement(
      Q,
      {
        tone: "success",
        title: u.SubscribeSuccessTitle,
        onDismiss: () => {
          I(!1), window.history.replaceState({}, document.title, window.location.pathname);
        }
      },
      u.SubscribeSuccessBody
    ), /* @__PURE__ */ e.createElement(Y, null, M.map((c, V) => {
      var y;
      const l = ((y = c.discounts) == null ? void 0 : y.length) > 0 ? c.discounts.reduce(
        (E, b) => E.discountedAmount < b.discountedAmount ? E : b
      ) : null, a = s && c.customFields ? c.customFields[s] : void 0;
      return /* @__PURE__ */ e.createElement(Y.Cell, { key: `plan-${V}`, columnSpan: q() }, /* @__PURE__ */ e.createElement(
        ne,
        {
          plan: c,
          discount: l,
          onSelectPlan: (E) => {
            o(E);
          },
          isActivePlan: (v == null ? void 0 : v.id) === c.id,
          useShortFormPlanIntervals: k,
          isRecommendedPlan: r && c.customFields && c.customFields[w],
          trialDaysAsFeature: P,
          buttonLabel: a
        }
      ));
    })), (h == null ? void 0 : h.length) > 0 && /* @__PURE__ */ e.createElement(ee, { borderColor: "border" }), (h == null ? void 0 : h.length) > 0 && /* @__PURE__ */ e.createElement(g, { gap: "300" }, /* @__PURE__ */ e.createElement(A, { paddingInline: { xs: 400, sm: 0 } }, /* @__PURE__ */ e.createElement(m, { variant: "headingMd" }, u.CustomPlans)), /* @__PURE__ */ e.createElement(Y, null, h.map((c, V) => {
      var y;
      const l = ((y = c.discounts) == null ? void 0 : y.length) > 0 ? c.discounts.reduce(
        (E, b) => E.discountedAmount < b.discountedAmount ? E : b
      ) : null, a = s && c.customFields ? c.customFields[s] : void 0;
      return /* @__PURE__ */ e.createElement(Y.Cell, { key: `custom-plan-${V}`, columnSpan: q() }, /* @__PURE__ */ e.createElement(
        ne,
        {
          plan: c,
          discount: l,
          onSelectPlan: (E) => {
            o(E);
          },
          isActivePlan: (v == null ? void 0 : v.id) === c.id,
          useShortFormPlanIntervals: k,
          isRecommendedPlan: r && c.customFields && c.customFields[w],
          trialDaysAsFeature: P,
          buttonLabel: a
        }
      ));
    }))))))
  );
}, be = ({ plan: t }) => /* @__PURE__ */ e.createElement(g, { gap: "100" }, /* @__PURE__ */ e.createElement(m, { variant: "headingMd", alignment: "center" }, t.name), t.description && /* @__PURE__ */ e.createElement(m, { variant: "bodyLg", tone: "subdued", alignment: "center" }, t.description)), ve = ({ plan: t, discount: n, useShortFormPlanIntervals: o = !0 }) => /* @__PURE__ */ e.createElement(g, { gap: "100" }, !!n && /* @__PURE__ */ e.createElement(f, { align: "center", blockAlign: "center", gap: "200" }, /* @__PURE__ */ e.createElement(m, { variant: "heading3xl" }, O(discountedAmount, t.currency, !0)), /* @__PURE__ */ e.createElement(
  m,
  {
    variant: "heading3xl",
    tone: "subdued",
    fontWeight: "medium",
    textDecorationLine: "line-through"
  },
  O(t.amount, t.currency, !0)
), /* @__PURE__ */ e.createElement(m, { variant: "bodyLg", tone: "subdued" }, u.Per, " ", j({ interval: t.interval, useShortFormPlanIntervals: o }))), !n && /* @__PURE__ */ e.createElement(f, { align: "center", blockAlign: "center", gap: "200" }, /* @__PURE__ */ e.createElement(m, { alignment: "center", variant: "heading3xl" }, O(t.amount, t.currency, !0)), /* @__PURE__ */ e.createElement(m, { alignment: "center", variant: "bodyLg", tone: "subdued" }, u.Per, " ", j({ interval: t.interval, useShortFormPlanIntervals: o }))), t.usageCharges.length > 0 && /* @__PURE__ */ e.createElement(g, null, t.usageCharges.map((i, r) => /* @__PURE__ */ e.createElement(f, { key: `plan-usageCharge-${r}`, align: "center", gap: "100" }, /* @__PURE__ */ e.createElement(A, null, /* @__PURE__ */ e.createElement(U, { source: z, tone: "positive" })), /* @__PURE__ */ e.createElement(m, { variant: "bodyLg" }, i.terms))))), pe = ({ plan: t, trialDaysAsFeature: n = !1 }) => /* @__PURE__ */ e.createElement(g, { gap: "300" }, n && t.trialDays && t.trialDays > 0 ? /* @__PURE__ */ e.createElement(f, { align: "center", blockAlign: "center", gap: "100" }, /* @__PURE__ */ e.createElement(A, null, /* @__PURE__ */ e.createElement(U, { source: W, tone: "positive" })), /* @__PURE__ */ e.createElement(m, { tone: "subdued" }, u.FreeTrialLength.replace("{{ trialDays }}", t.trialDays))) : null, t.featuresOrder.map((o, i) => {
  const r = t.features[o];
  if (r.type !== "boolean" || r.value === !0)
    return /* @__PURE__ */ e.createElement(f, { key: `plan-feature-${i}`, align: "center", gap: "100" }, /* @__PURE__ */ e.createElement(A, null, /* @__PURE__ */ e.createElement(U, { source: W, tone: "positive" })), r.type === "boolean" ? /* @__PURE__ */ e.createElement(m, { tone: "subdued" }, r.name) : /* @__PURE__ */ e.createElement(m, { tone: "subdued" }, r.value, " ", r.name));
})), ae = ({
  plan: t,
  discount: n,
  buttonLabel: o,
  onSelectPlan: i,
  useShortFormPlanIntervals: r = !0,
  trialDaysAsFeature: s = !1,
  expanded: w = !1,
  isActivePlan: C = !1,
  isRecommendedPlan: P = !1,
  isCustomPlan: k = !1,
  showRecommendedPlanBadge: D = !1
}) => /* @__PURE__ */ e.createElement(A, { position: "relative", minHeight: "100%" }, /* @__PURE__ */ e.createElement(A, { paddingBlock: w || P ? void 0 : "800", minHeight: "100%" }, /* @__PURE__ */ e.createElement(
  A,
  {
    background: P || k ? "bg-surface" : "bg-surface-secondary",
    borderStyle: "solid",
    borderColor: "border",
    borderWidth: "025",
    paddingBlock: w || P ? "1600" : "800",
    paddingInline: "400",
    borderRadius: "200",
    minHeight: "calc(100% - calc(var(--p-space-800) * 2))"
  },
  /* @__PURE__ */ e.createElement(g, { gap: "800" }, /* @__PURE__ */ e.createElement(g, { gap: "400" }, /* @__PURE__ */ e.createElement(be, { plan: t }), /* @__PURE__ */ e.createElement(
    ve,
    {
      plan: t,
      discount: n,
      useShortFormPlanIntervals: r
    }
  )), /* @__PURE__ */ e.createElement(
    $,
    {
      size: "large",
      variant: P ? "primary" : "secondary",
      onClick: () => i(t),
      disabled: C
    },
    o || u.SelectPlan
  ), /* @__PURE__ */ e.createElement(pe, { plan: t, trialDaysAsFeature: s }), P && D && /* @__PURE__ */ e.createElement(f, { align: "center", gap: "100" }, /* @__PURE__ */ e.createElement(Z, { tone: "success" }, u.MostPopular)))
))), Le = ({
  customer: t,
  plans: n,
  onSubscribe: o,
  backUrl: i = "",
  // string: URL to use as "back" breadcrumb URL. leave as empty string or null to hide the back button
  showRecommendedBadge: r = !0,
  // boolean
  customFieldCta: s = null,
  // string: value of the custom plan field to use as the CTA. e.g. "cta"
  customFieldPlanRecommended: w = "Recommended",
  // string: value of the custom plan field to use as the recommended badge
  addSpacingToNonRecommendedPlans: C = !0,
  // boolean
  showPlanIntervalToggle: P = !0,
  // boolean
  showTrialDaysAsFeature: k = !0,
  // boolean
  useShortFormPlanIntervals: D = !0,
  // boolean: e.g. show "$ / mo" instead of "$ / month"
  pageWidth: F = "default",
  // string: "full", "narrow", or "default"
  showCustomPlans: _ = !0
  // boolean: show custom plans
}) => {
  const B = t == null ? void 0 : t.subscription, N = new URLSearchParams(window.location.search), v = n.some((l) => l.interval === d.ANNUAL) && n.some((l) => l.interval === d.EVERY_30_DAYS), S = n.find((l) => l.id === (B == null ? void 0 : B.plan.id)), [R, p] = T(
    S ? S.interval : v ? d.ANNUAL : d.EVERY_30_DAYS
  ), M = n.filter(
    (l) => l.availability !== "customerTag" && l.availability !== "customer"
  ), h = P && v ? M.filter((l) => l.interval === R) : M, L = _ ? n.filter(
    (l) => l.availability === "customerTag" || l.availability === "customer"
  ) : [], [I, q] = T(
    N.get("subscribed") === "true"
  ), c = (l = h.length) => l % 4 === 0 ? { xs: 6, sm: 6, md: 2, lg: 3, xl: 3 } : l % 3 === 0 ? { xs: 6, sm: 6, md: 2, lg: 4, xl: 4 } : l % 2 === 0 ? { xs: 6, sm: 6, md: 3, lg: 6, xl: 6 } : l === 1 ? { xs: 6, sm: 6, md: 6, lg: 12, xl: 12 } : { xs: 6, sm: 6, md: 2, lg: 4, xl: 4 }, V = () => h.length % 4 === 0 ? 4 : h.length % 3 === 0 ? 3 : h.length % 2 === 0 ? 2 : h.length === 1 ? 1 : 4;
  return /* @__PURE__ */ e.createElement(
    J,
    {
      title: u.Plans,
      backAction: i && i !== "" ? { content: u.Back, url: i } : void 0,
      secondaryActions: P && v ? /* @__PURE__ */ e.createElement(K, { variant: "segmented" }, /* @__PURE__ */ e.createElement(
        $,
        {
          pressed: R === d.EVERY_30_DAYS,
          onClick: () => p(d.EVERY_30_DAYS)
        },
        u.Monthly
      ), /* @__PURE__ */ e.createElement(
        $,
        {
          pressed: R === d.ANNUAL,
          onClick: () => p(d.ANNUAL)
        },
        u.Yearly
      )) : void 0,
      fullWidth: F === "full",
      narrowWidth: F === "narrow"
    },
    /* @__PURE__ */ e.createElement(A, { paddingBlockEnd: "800" }, /* @__PURE__ */ e.createElement(H, null, /* @__PURE__ */ e.createElement(H.Section, null, /* @__PURE__ */ e.createElement(g, { gap: "1000" }, I && /* @__PURE__ */ e.createElement(
      Q,
      {
        tone: "success",
        title: u.SubscribeSuccessTitle,
        onDismiss: () => {
          q(!1), window.history.replaceState({}, document.title, window.location.pathname);
        }
      },
      u.SubscribeSuccessBody
    ), /* @__PURE__ */ e.createElement(Y, { columns: V() }, h.map((l, a) => {
      var b;
      const y = l.customFields && l.customFields[w], E = s && l.customFields[s];
      return /* @__PURE__ */ e.createElement(Y.Cell, { key: `plan-${a}`, columnSpan: c() }, /* @__PURE__ */ e.createElement(
        ae,
        {
          plan: l,
          discount: ((b = l.discounts) == null ? void 0 : b.length) > 0 ? l.discounts[0] : null,
          buttonLabel: E ? l.customFields[s] : void 0,
          onSelectPlan: o,
          useShortFormPlanIntervals: D,
          trialDaysAsFeature: k,
          expanded: C || y,
          isActivePlan: (S == null ? void 0 : S.id) === l.id,
          isRecommendedPlan: y,
          showRecommendedPlanBadge: r
        }
      ));
    })), (L == null ? void 0 : L.length) > 0 && /* @__PURE__ */ e.createElement(ee, { borderColor: "border" }), (L == null ? void 0 : L.length) > 0 && /* @__PURE__ */ e.createElement(g, { gap: "300" }, /* @__PURE__ */ e.createElement(A, { paddingInline: { xs: 400, sm: 0 } }, /* @__PURE__ */ e.createElement(m, { variant: "headingMd" }, u.CustomPlans)), /* @__PURE__ */ e.createElement(Y, null, L.map((l, a) => {
      var b;
      const y = l.customFields && l.customFields[w], E = s && l.customFields[s];
      return /* @__PURE__ */ e.createElement(
        Y.Cell,
        {
          key: `custom-plan-${a}`,
          columnSpan: c(L.length)
        },
        /* @__PURE__ */ e.createElement(
          ae,
          {
            plan: l,
            discount: ((b = l.discounts) == null ? void 0 : b.length) > 0 ? l.discounts[0] : null,
            buttonLabel: E ? l.customFields[s] : void 0,
            onSelectPlan: o,
            useShortFormPlanIntervals: D,
            trialDaysAsFeature: k,
            expanded: C || y,
            isActivePlan: (S == null ? void 0 : S.id) === l.id,
            isRecommendedPlan: y,
            showRecommendedPlanBadge: r,
            isCustomPlan: !0
          }
        )
      );
    })))))))
  );
}, Ye = ({
  customer: t,
  plans: n,
  onSubscribe: o,
  backUrl: i = "",
  // string: URL to use as "back" breadcrumb URL. leave as empty string or null to hide the back button
  showRecommendedBadge: r = !0,
  // boolean
  customFieldCta: s = null,
  // string: value of the custom plan field to use as the CTA. e.g. "cta"
  customFieldPlanRecommended: w = "Recommended",
  // string: value of the custom plan field to use as the recommended badge
  showPlanIntervalToggle: C = !1,
  // boolean
  showTrialDaysAsFeature: P = !0,
  // boolean
  useShortFormPlanIntervals: k = !0,
  // boolean: e.g. show "$ / mo" instead of "$ / month"
  pageWidth: D = "default",
  // string: "full", "narrow", or "default"
  showCustomPlans: F = !0
  // boolean: show custom plans
}) => {
  const _ = t == null ? void 0 : t.subscription, B = new URLSearchParams(window.location.search), N = n.some((a) => a.interval === d.ANNUAL) && n.some((a) => a.interval === d.EVERY_30_DAYS), v = n.find((a) => a.id === (_ == null ? void 0 : _.plan.id)), [S, R] = T(
    v ? v.interval : N ? d.ANNUAL : d.EVERY_30_DAYS
  ), p = n.filter(
    (a) => a.availability !== "customerTag" && a.availability !== "customer"
  ), M = C && N ? p.filter((a) => a.interval === S) : p, h = F ? n.filter(
    (a) => a.availability === "customerTag" || a.availability === "customer"
  ) : [], [L, I] = T(
    B.get("subscribed") === "true"
  ), q = ({ plan: a, discount: y }) => /* @__PURE__ */ e.createElement(g, null, /* @__PURE__ */ e.createElement(m, { variant: "bodyLg" }, a.name), a.description && /* @__PURE__ */ e.createElement(m, { tone: "subdued" }, a.description)), c = ({ plan: a, discount: y }) => /* @__PURE__ */ e.createElement(g, { gap: "200" }, /* @__PURE__ */ e.createElement(m, { fontWeight: "medium" }, u.Features), /* @__PURE__ */ e.createElement(g, { gap: "100" }, P && a.trialDays !== 0 && /* @__PURE__ */ e.createElement(f, { align: "start", gap: "100" }, /* @__PURE__ */ e.createElement(A, null, /* @__PURE__ */ e.createElement(U, { source: W, tone: "positive" })), /* @__PURE__ */ e.createElement(m, { tone: "subdued" }, u.FreeTrialLength.replace("{{ trialDays }}", a.trialDays))), a.featuresOrder.map((E, b) => {
    const x = a.features[E];
    if (x.type !== "boolean" || x.value === !0)
      return /* @__PURE__ */ e.createElement(f, { key: `plan-feature-${b}`, align: "start", gap: "100" }, /* @__PURE__ */ e.createElement(A, null, /* @__PURE__ */ e.createElement(U, { source: W, tone: "positive" })), x.type === "boolean" ? /* @__PURE__ */ e.createElement(m, { tone: "subdued" }, x.name) : /* @__PURE__ */ e.createElement(m, { tone: "subdued" }, x.value, " ", x.name));
  }))), V = ({ plan: a, discount: y }) => /* @__PURE__ */ e.createElement(g, { gap: "100" }, y ? /* @__PURE__ */ e.createElement(f, { blockAlign: "center", gap: "200" }, /* @__PURE__ */ e.createElement(m, { variant: "headingXl" }, O(y.discountedAmount, a.currency)), /* @__PURE__ */ e.createElement(
    m,
    {
      variant: "headingXl",
      tone: "subdued",
      fontWeight: "medium",
      textDecorationLine: "line-through"
    },
    a.amount
  ), /* @__PURE__ */ e.createElement(m, { variant: "bodyLg", tone: "subdued" }, u.Per, " ", j({ interval: a.interval, useShortFormPlanIntervals: k }))) : /* @__PURE__ */ e.createElement(f, { blockAlign: "center", gap: "200" }, /* @__PURE__ */ e.createElement(m, { alignment: "center", variant: "headingXl" }, O(a.amount, a.currency)), /* @__PURE__ */ e.createElement(m, { alignment: "center", variant: "bodyLg", tone: "subdued" }, u.Per, " ", j({ interval: a.interval, useShortFormPlanIntervals: k }))), a.usageCharges.length > 0 && /* @__PURE__ */ e.createElement(g, null, a.usageCharges.map((E, b) => /* @__PURE__ */ e.createElement(f, { key: `plan-usageCharge-${b}`, align: "start", gap: "100" }, /* @__PURE__ */ e.createElement(A, null, /* @__PURE__ */ e.createElement(U, { source: z, tone: "positive" })), /* @__PURE__ */ e.createElement(m, { variant: "bodyLg" }, E.terms))))), l = ({ plan: a, discount: y }) => {
    const E = s && a.customFields[s], b = a.customFields && a.customFields[w];
    return /* @__PURE__ */ e.createElement(f, { blockAlign: "center", gap: "400" }, /* @__PURE__ */ e.createElement(
      $,
      {
        size: "large",
        variant: b ? "primary" : "secondary",
        onClick: () => o({ planId: a.id, discountId: y == null ? void 0 : y.id }),
        disabled: (v == null ? void 0 : v.id) === a.id
      },
      (v == null ? void 0 : v.id) === a.id ? u.CurrentPlan : E ? a.customFields[s] : u.SelectPlan
    ), b && r && /* @__PURE__ */ e.createElement(A, null, /* @__PURE__ */ e.createElement(Z, { tone: "success" }, u.MostPopular)));
  };
  return /* @__PURE__ */ e.createElement(
    J,
    {
      title: u.Plans,
      backAction: i !== "" ? { content: u.Back, url: i } : void 0,
      secondaryActions: C && N ? /* @__PURE__ */ e.createElement(K, { variant: "segmented" }, /* @__PURE__ */ e.createElement(
        $,
        {
          pressed: S === d.EVERY_30_DAYS,
          onClick: () => R(d.EVERY_30_DAYS)
        },
        u.Monthly
      ), /* @__PURE__ */ e.createElement(
        $,
        {
          pressed: S === d.ANNUAL,
          onClick: () => R(d.ANNUAL)
        },
        u.Year
      )) : void 0,
      fullWidth: D === "full",
      narrowWidth: D === "narrow"
    },
    /* @__PURE__ */ e.createElement(H, null, /* @__PURE__ */ e.createElement(H.Section, null, /* @__PURE__ */ e.createElement(g, { gap: "400" }, L && /* @__PURE__ */ e.createElement(
      Q,
      {
        tone: "success",
        title: u.SubscribeSuccessTitle,
        onDismiss: () => {
          I(!1), window.history.replaceState({}, document.title, window.location.pathname);
        }
      },
      u.SubscribeSuccessBody
    ), M.map((a, y) => {
      var b;
      const E = ((b = a.discounts) == null ? void 0 : b.length) > 0 ? a.discounts.reduce(
        (x, X) => x.discountedAmount < X.discountedAmount ? x : X
      ) : null;
      return /* @__PURE__ */ e.createElement(G, { key: `plan-${y}` }, /* @__PURE__ */ e.createElement(Y, null, /* @__PURE__ */ e.createElement(Y.Cell, { columnSpan: { xs: 6, sm: 6, md: 3, lg: 6, xl: 12 } }, /* @__PURE__ */ e.createElement(g, { gap: "400" }, /* @__PURE__ */ e.createElement(g, { gap: "200" }, q({ plan: a, discount: E }), V({ plan: a, discount: E })), /* @__PURE__ */ e.createElement(A, null, l({ plan: a, discount: E })))), /* @__PURE__ */ e.createElement(Y.Cell, { columnSpan: { xs: 6, sm: 6, md: 3, lg: 6, xl: 12 } }, c({ plan: a, discount: E }))));
    }), (h == null ? void 0 : h.length) > 0 && /* @__PURE__ */ e.createElement(ee, { borderColor: "border" }), (h == null ? void 0 : h.length) > 0 && /* @__PURE__ */ e.createElement(g, { gap: "300" }, /* @__PURE__ */ e.createElement(A, { paddingInline: { xs: 400, sm: 0 } }, /* @__PURE__ */ e.createElement(m, { variant: "headingMd" }, u.CustomPlans)), /* @__PURE__ */ e.createElement(Y, null, h.map((a, y) => {
      var b;
      const E = ((b = a.discounts) == null ? void 0 : b.length) > 0 ? a.discounts.reduce(
        (x, X) => x.discountedAmount < X.discountedAmount ? x : X
      ) : null;
      return /* @__PURE__ */ e.createElement(Y.Cell, { key: `custom-plan-${y}`, columnSpan: columnSpan() }, /* @__PURE__ */ e.createElement(G, null, /* @__PURE__ */ e.createElement(g, { gap: "400" }, q({ plan: a, discount: E }), V({ plan: a, discount: E }), l({ plan: a, discount: E }), c({ plan: a, discount: E }))));
    }))))))
  );
};
export {
  Le as HighlightedPlanCards,
  ne as HorizontalPlanCard,
  Pe as HorizontalPlanCards,
  u as Labels,
  Ae as MantleProvider,
  ye as PlanFeaturesSection,
  d as PlanInterval,
  he as PlanPricingSection,
  ge as PlanTitleSection,
  Ye as VerticalPlanCards,
  te as featureEnabled,
  Ce as featureSort,
  j as intervalLabel,
  de as intervalLabelLong,
  Ee as intervalLabelShort,
  O as money,
  we as useMantle
};
