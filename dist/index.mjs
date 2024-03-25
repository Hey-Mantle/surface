import e, { createContext as ie, useState as R, useEffect as oe, useContext as ue } from "react";
import { Box as C, BlockStack as d, Button as $, InlineStack as w, Badge as V, Text as o, Icon as H, Grid as q, Page as G, ButtonGroup as Z, Layout as W, Banner as J, Divider as Q, Card as K } from "@shopify/polaris";
class me {
  /**
   * Creates a new MantleClient. If being used in the browser, or any frontend code, never use the apiKey parameter,
   * always use the customerApiToken for the customer that is currently authenticated on the frontend.
   * @param {Object} params
   * @param {string} params.appId - The Mantle App ID set up on your app in your Mantle account.
   * @param {string} params.apiKey - The Mantle App API key set up on your app in your Mantle account. This should never be used in the browser.
   * @param {string} params.customerApiToken - The Mantle Customer API Token returned by the /identify endpoint. This should be used in the browser.
   * @param {string} [params.apiUrl] - The Mantle API URL to use
   */
  constructor({ appId: n, apiKey: r, customerApiToken: c, apiUrl: l = "https://appapi.heymantle.com/v1" }) {
    if (!n)
      throw new Error("MantleClient appId is required");
    if (typeof window < "u" && r)
      throw new Error("MantleClient apiKey should never be used in the browser");
    if (!r && !c)
      throw new Error("MantleClient one of apiKey or customerApiToken is required");
    this.appId = n, this.apiKey = r, this.customerApiToken = c, this.apiUrl = l;
  }
  /**
   * Makes a request to the Mantle API
   * @param {Object} params
   * @param {"customer"|"usage_events"|"subscriptions"} params.path - The path to request
   * @param {"GET"|"POST"|"PUT"|"DELETE"} params.method - The HTTP method to use. Defaults to GET
   * @param {JSON} [params.body] - The request body
   * @returns {Promise<JSON>} a promise that resolves to the response body
   */
  async mantleRequest({ path: n, method: r = "GET", body: c }) {
    try {
      return await (await fetch(`${this.apiUrl}${n.startsWith("/") ? "" : "/"}${n}`, {
        method: r,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-Mantle-App-Id": this.appId,
          ...this.apiKey ? { "X-Mantle-App-Api-Key": this.apiKey } : {},
          ...this.customerApiToken ? { "X-Mantle-Customer-Api-Token": this.customerApiToken } : {}
        },
        ...c && {
          body: JSON.stringify(c)
        }
      })).json();
    } catch (l) {
      throw console.error(`[mantleRequest] ${n} error: ${l.message}`), l;
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
    myshopifyDomain: r,
    platform: c = "shopify",
    accessToken: l,
    name: i,
    email: b,
    customFields: f
  }) {
    return await this.mantleRequest({
      path: "identify",
      method: "POST",
      body: { platformId: n, myshopifyDomain: r, platform: c, accessToken: l, name: i, email: b, customFields: f }
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
  async subscribe({ planId: n, planIds: r, discountId: c, returnUrl: l, billingProvider: i }) {
    return await this.mantleRequest({
      path: "subscriptions",
      method: "POST",
      body: { planId: n, planIds: r, discountId: c, returnUrl: l, billingProvider: i }
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
  async updateSubscription({ id: n, cappedAmount: r }) {
    return await this.mantleRequest({
      path: "subscriptions",
      method: "PUT",
      body: { id: n, cappedAmount: r }
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
  async sendUsageEvent({ eventId: n, eventName: r, customerId: c, properties: l = {} }) {
    return await this.mantleRequest({
      path: "usage_events",
      method: "POST",
      body: {
        eventId: n,
        eventName: r,
        ...c ? { customerId: c } : {},
        properties: l
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
var de = {
  MantleClient: me
};
const se = ie(), ge = ({ feature: t, count: n = 0 }) => (t == null ? void 0 : t.type) === "boolean" ? t.value : (t == null ? void 0 : t.type) === "limit" ? n < t.value || t.value === -1 : !1, xe = ({
  appId: t,
  customerApiToken: n,
  apiUrl: r = "https://appapi.heymantle.com/v1",
  children: c
}) => {
  const l = new de.MantleClient({ appId: t, customerApiToken: n, apiUrl: r }), [i, b] = R(null), [f, p] = R(!0), [P, A] = R(null), M = async () => {
    try {
      p(!0);
      const g = await l.getCustomer();
      b(g);
    } catch (g) {
      A(g);
    } finally {
      p(!1);
    }
  }, v = async (g) => {
    await l.sendUsageEvent(g);
  }, T = async ({ planId: g, planIds: h, discountId: L, billingProvider: Y, returnUrl: E }) => await l.subscribe({
    planId: g,
    planIds: h,
    discountId: L,
    billingProvider: Y,
    returnUrl: E
  }), D = async () => await l.cancelSubscription();
  oe(() => {
    n && M();
  }, [n]);
  const S = (i == null ? void 0 : i.plans) || [], y = i == null ? void 0 : i.subscription, m = y == null ? void 0 : y.plan;
  return /* @__PURE__ */ e.createElement(
    se.Provider,
    {
      value: {
        customer: i,
        subscription: y,
        plans: S,
        loading: f,
        error: P,
        client: l,
        sendUsageEvent: v,
        subscribe: T,
        cancelSubscription: D,
        isFeatureEnabled: ({ featureKey: g, count: h = 0 }) => i != null && i.features[g] ? ge({ feature: i.features[g], count: h }) : !1,
        limitForFeature: ({ featureKey: g }) => i != null && i.features[g] && m.features[g].type === "limit" ? i.features[g].value : -1,
        refetch: async () => {
          await M();
        }
      }
    },
    c
  );
}, Be = () => {
  const t = ue(se);
  if (t === void 0)
    throw new Error("useMantle must be used within a MantleProvider");
  return t;
}, re = (t) => t.type === "boolean" && t.value == !0 || t.type === "limit" && t.value !== 0, Fe = (t, n) => re(n) - re(t) || t.name.localeCompare(n.name), Ee = (t = "USD") => new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: t,
  notation: "standard"
}), O = (t, n = "USD", r = !0) => {
  let c = Ee(n).format(t);
  return r && (c = c.replace(/\.00$/, "")), c;
}, u = {
  Annual: "ANNUAL",
  Every30Days: "EVERY_30_DAYS"
}, N = {
  Public: "public",
  CustomerTag: "customerTag",
  ShopifyPlan: "shopifyPlan",
  Customer: "customer",
  Hidden: "hidden"
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
}, ye = (t = u.Every30Days) => {
  switch (t) {
    case u.Annual:
      return "year";
    case u.Every30Days:
    default:
      return "month";
  }
}, he = (t = u.Every30Days) => {
  switch (t) {
    case u.Annual:
      return "yr";
    case u.Every30Days:
    default:
      return "mo";
  }
}, X = ({
  interval: t = u.Every30Days,
  useShortFormPlanIntervals: n = !0
}) => n ? he(t) : ye(t), le = ({ plan: t, customFieldKey: n = "recommended" }) => {
  var r;
  return !!((r = t.customFields) != null && r[n]);
}, ce = ({ plan: t, customFieldKey: n = "buttonLabel" }) => {
  var r;
  return ((r = t.customFields) == null ? void 0 : r[n]) || s.SelectPlan;
}, be = ({ plan: t }) => {
  var n;
  return ((n = t.discounts) == null ? void 0 : n.length) > 0 ? t.discounts.reduce(
    (r, c) => r.discountedAmount < c.discountedAmount ? r : c
  ) : void 0;
}, ve = (t = 4) => t % 4 === 0 ? { xs: 6, sm: 6, md: 2, lg: 3, xl: 3 } : t % 3 === 0 ? { xs: 6, sm: 6, md: 2, lg: 4, xl: 4 } : t % 2 === 0 ? { xs: 6, sm: 6, md: 3, lg: 6, xl: 6 } : t === 1 ? { xs: 6, sm: 6, md: 6, lg: 12, xl: 12 } : { xs: 6, sm: 6, md: 2, lg: 4, xl: 4 }, pe = (t = 4) => t % 4 === 0 ? 4 : t % 3 === 0 ? 3 : t % 2 === 0 ? 2 : t === 1 ? 1 : 4;
var U = function(n) {
  return /* @__PURE__ */ e.createElement("svg", Object.assign({
    viewBox: "0 0 20 20"
  }, n), /* @__PURE__ */ e.createElement("path", {
    fillRule: "evenodd",
    d: "M15.78 5.97a.75.75 0 0 1 0 1.06l-6.5 6.5a.75.75 0 0 1-1.06 0l-3.25-3.25a.75.75 0 1 1 1.06-1.06l2.72 2.72 5.97-5.97a.75.75 0 0 1 1.06 0Z"
  }));
};
U.displayName = "CheckIcon";
var j = function(n) {
  return /* @__PURE__ */ e.createElement("svg", Object.assign({
    viewBox: "0 0 20 20"
  }, n), /* @__PURE__ */ e.createElement("path", {
    d: "M10.75 6.75a.75.75 0 0 0-1.5 0v2.5h-2.5a.75.75 0 0 0 0 1.5h2.5v2.5a.75.75 0 0 0 1.5 0v-2.5h2.5a.75.75 0 0 0 0-1.5h-2.5v-2.5Z"
  }));
};
j.displayName = "PlusIcon";
const fe = ({ plan: t }) => /* @__PURE__ */ e.createElement(d, { gap: "100" }, /* @__PURE__ */ e.createElement(o, { variant: "headingMd", alignment: "center" }, t.name), t.description && /* @__PURE__ */ e.createElement(o, { variant: "bodyLg", tone: "subdued", alignment: "center" }, t.description)), Se = ({ plan: t, discount: n, useShortFormPlanIntervals: r = !0 }) => /* @__PURE__ */ e.createElement(d, { gap: "100" }, !!n && /* @__PURE__ */ e.createElement(w, { align: "center", blockAlign: "center", gap: "200" }, /* @__PURE__ */ e.createElement(o, { variant: "heading3xl" }, O(discountedAmount, t.currency, !0)), /* @__PURE__ */ e.createElement(
  o,
  {
    variant: "heading3xl",
    tone: "subdued",
    fontWeight: "medium",
    textDecorationLine: "line-through"
  },
  O(t.amount, t.currency, !0)
), /* @__PURE__ */ e.createElement(o, { variant: "bodyLg", tone: "subdued" }, s.Per, " ", X({ interval: t.interval, useShortFormPlanIntervals: r }))), !n && /* @__PURE__ */ e.createElement(w, { align: "center", blockAlign: "center", gap: "200" }, /* @__PURE__ */ e.createElement(o, { alignment: "center", variant: "heading3xl" }, O(t.amount, t.currency, !0)), /* @__PURE__ */ e.createElement(o, { alignment: "center", variant: "bodyLg", tone: "subdued" }, s.Per, " ", X({ interval: t.interval, useShortFormPlanIntervals: r }))), t.usageCharges.length > 0 && /* @__PURE__ */ e.createElement(d, null, t.usageCharges.map((c, l) => /* @__PURE__ */ e.createElement(w, { key: `plan-usageCharge-${l}`, align: "center", gap: "100" }, /* @__PURE__ */ e.createElement(C, null, /* @__PURE__ */ e.createElement(H, { source: j, tone: "positive" })), /* @__PURE__ */ e.createElement(o, { variant: "bodyLg" }, c.terms))))), Ce = ({ plan: t, trialDaysAsFeature: n = !1 }) => /* @__PURE__ */ e.createElement(d, { gap: "300" }, n && t.trialDays && t.trialDays > 0 ? /* @__PURE__ */ e.createElement(w, { align: "center", blockAlign: "center", gap: "100" }, /* @__PURE__ */ e.createElement(C, null, /* @__PURE__ */ e.createElement(H, { source: U, tone: "positive" })), /* @__PURE__ */ e.createElement(o, { tone: "subdued" }, s.FreeTrialLength.replace("{{ trialDays }}", t.trialDays))) : null, t.featuresOrder.map((r, c) => {
  const l = t.features[r];
  if (l.type !== "boolean" || l.value === !0)
    return /* @__PURE__ */ e.createElement(w, { key: `plan-feature-${c}`, align: "center", gap: "100" }, /* @__PURE__ */ e.createElement(C, null, /* @__PURE__ */ e.createElement(H, { source: U, tone: "positive" })), l.type === "boolean" ? /* @__PURE__ */ e.createElement(o, { tone: "subdued" }, l.name) : /* @__PURE__ */ e.createElement(o, { tone: "subdued" }, l.value, " ", l.name));
})), we = ({
  plan: t,
  discount: n,
  buttonLabel: r,
  onSelectPlan: c,
  useShortFormPlanIntervals: l = !0,
  trialDaysAsFeature: i = !1,
  expanded: b = !1,
  isActivePlan: f = !1,
  isRecommendedPlan: p = !1,
  isCustomPlan: P = !1,
  showRecommendedPlanBadge: A = !0
}) => /* @__PURE__ */ e.createElement(C, { position: "relative", minHeight: "100%" }, /* @__PURE__ */ e.createElement(C, { paddingBlock: b || p ? void 0 : "800", minHeight: "100%" }, /* @__PURE__ */ e.createElement(
  C,
  {
    background: p || P ? "bg-surface" : "bg-surface-secondary",
    borderStyle: "solid",
    borderColor: "border",
    borderWidth: "025",
    paddingBlock: b || p ? "1600" : "800",
    paddingInline: "400",
    borderRadius: "200",
    minHeight: "calc(100% - calc(var(--p-space-800) * 2))"
  },
  /* @__PURE__ */ e.createElement(d, { gap: "800" }, /* @__PURE__ */ e.createElement(d, { gap: "400" }, /* @__PURE__ */ e.createElement(fe, { plan: t }), /* @__PURE__ */ e.createElement(
    Se,
    {
      plan: t,
      discount: n,
      useShortFormPlanIntervals: l
    }
  )), /* @__PURE__ */ e.createElement(
    $,
    {
      size: "large",
      variant: p ? "primary" : "secondary",
      onClick: () => {
        c ? c({ plan: t, discount: n }) : console.log("No onSelectPlan callback provided");
      },
      disabled: f
    },
    r || s.SelectPlan
  ), /* @__PURE__ */ e.createElement(Ce, { plan: t, trialDaysAsFeature: i }), p && A && /* @__PURE__ */ e.createElement(w, { align: "center", gap: "100" }, /* @__PURE__ */ e.createElement(V, { tone: "success" }, s.MostPopular)))
))), I = {
  /**
   * Recommended plans will be highlighted and optionally expanded
   */
  Highlighted: "highlighted",
  /**
   * All plans will be displayed in a horizontal stack based on the screen size
   */
  Horizontal: "horizontal",
  /**
   * All plans will be displayed in a vertical stack
   */
  Vertical: "vertical"
}, _ = ({
  plans: t,
  customer: n,
  onSelectPlan: r,
  planInterval: c,
  cardType: l = I.Horizontal,
  trialDaysAsFeature: i = !0,
  useShortFormPlanIntervals: b = !0,
  keyForRecommended: f = "recommended",
  keyForCustomButtonLabel: p = "buttonLabel",
  showRecommendedPlanBadge: P = !0,
  applyDiscount: A = !0
}) => {
  var y;
  const M = (y = n == null ? void 0 : n.subscription) != null && y.active ? n.subscription : void 0, v = M == null ? void 0 : M.plan, T = c ? t.filter((m) => m.interval === c) : t, D = l === I.Vertical ? 1 : pe(T.length), S = ve(D);
  return /* @__PURE__ */ React.createElement(q, { columns: D }, T.map((m) => {
    const g = A ? be({ plan: m }) : void 0;
    return /* @__PURE__ */ React.createElement(q.Cell, { columnSpan: S, key: m.id }, l === I.Highlighted && /* @__PURE__ */ React.createElement(
      we,
      {
        key: `HighlightedPlanCard-${m.id}`,
        plan: m,
        discount: g,
        onSelectPlan: r,
        isActivePlan: (v == null ? void 0 : v.id) === m.id,
        trialDaysAsFeature: i,
        useShortFormPlanIntervals: b,
        isCustomPlan: m.availability !== N.Public,
        isRecommendedPlan: le({ plan: m, customFieldKey: f }),
        buttonLabel: ce({ plan: m, customFieldKey: p }),
        showRecommendedPlanBadge: P
      }
    ), l === I.Horizontal && /* @__PURE__ */ React.createElement(
      De,
      {
        key: `HorizontalPlanCard-${m.id}`,
        plan: m,
        discount: g,
        onSelectPlan: r,
        isActivePlan: (v == null ? void 0 : v.id) === m.id,
        trialDaysAsFeature: i,
        useShortFormPlanIntervals: b,
        isRecommendedPlan: le({ plan: m, customFieldKey: f }),
        buttonLabel: ce({ plan: m, customFieldKey: p }),
        showRecommendedPlanBadge: P
      }
    ));
  }));
}, Te = ({
  customer: t,
  plans: n,
  onSubscribe: r,
  backUrl: c = "",
  // string: URL to use as "back" breadcrumb URL. leave as empty string or null to hide the back button
  showRecommendedBadge: l = !0,
  // boolean
  customFieldCta: i,
  // string: value of the custom plan field to use as the CTA. e.g. "cta"
  customFieldPlanRecommended: b = "Recommended",
  // string: value of the custom plan field to use as the recommended badge
  showPlanIntervalToggle: f = !0,
  // boolean
  showTrialDaysAsFeature: p = !0,
  // boolean
  useShortFormPlanIntervals: P,
  // boolean: e.g. show "$ / mo" instead of "$ / month"
  pageWidth: A = "default",
  // string: "full", "narrow", or "default"
  showCustomPlans: M = !0
  // boolean: show custom plans
}) => {
  const v = t == null ? void 0 : t.subscription, T = new URLSearchParams(window.location.search), D = n.some((E) => E.interval === u.Annual) && n.some((E) => E.interval === u.Every30Days), S = n.find((E) => E.id === (v == null ? void 0 : v.plan.id)), [y, m] = R(
    S ? S.interval : D ? u.Annual : u.Every30Days
  ), g = n.filter((E) => E.availability === N.Public), h = M ? n.filter((E) => E.availability !== N.Public) : [], [L, Y] = R(
    T.get("subscribed") === "true"
  );
  return /* @__PURE__ */ e.createElement(
    G,
    {
      title: s.Plans,
      backAction: c ? { content: s.Back, url: c } : void 0,
      secondaryActions: f && D ? /* @__PURE__ */ e.createElement(Z, { variant: "segmented" }, /* @__PURE__ */ e.createElement(
        $,
        {
          pressed: y === u.Every30Days,
          onClick: () => m(u.Every30Days)
        },
        s.Monthly
      ), /* @__PURE__ */ e.createElement(
        $,
        {
          pressed: y === u.Annual,
          onClick: () => m(u.Annual)
        },
        s.Yearly
      )) : void 0,
      fullWidth: A === "full",
      narrowWidth: A === "narrow"
    },
    /* @__PURE__ */ e.createElement(W, null, /* @__PURE__ */ e.createElement(W.Section, null, /* @__PURE__ */ e.createElement(d, { gap: "1000" }, L && /* @__PURE__ */ e.createElement(
      J,
      {
        tone: "success",
        title: s.SubscribeSuccessTitle,
        onDismiss: () => {
          Y(!1), window.history.replaceState({}, document.title, window.location.pathname);
        }
      },
      s.SubscribeSuccessBody
    ), /* @__PURE__ */ e.createElement(
      _,
      {
        plans: g,
        onSelectPlan: r,
        planInterval: y,
        cardType: I.Horizontal,
        keyForRecommended: b,
        keyForCustomButtonLabel: i,
        trialDaysAsFeature: p,
        useShortFormPlanIntervals: P,
        showRecommendedPlanBadge: l
      }
    ), (h == null ? void 0 : h.length) > 0 && /* @__PURE__ */ e.createElement(Q, { borderColor: "border" }), (h == null ? void 0 : h.length) > 0 && /* @__PURE__ */ e.createElement(d, { gap: "300" }, /* @__PURE__ */ e.createElement(C, { paddingInline: { xs: 400, sm: 0 } }, /* @__PURE__ */ e.createElement(o, { variant: "headingMd" }, s.CustomPlans)), /* @__PURE__ */ e.createElement(
      _,
      {
        plans: h,
        onSelectPlan: r,
        planInterval: y,
        cardType: I.Horizontal,
        keyForRecommended: b,
        keyForCustomButtonLabel: i,
        trialDaysAsFeature: p,
        useShortFormPlanIntervals: P,
        showRecommendedPlanBadge: l
      }
    )))))
  );
}, Pe = ({ plan: t, isRecommendedPlan: n = !1 }) => /* @__PURE__ */ e.createElement(d, null, /* @__PURE__ */ e.createElement(w, { align: "space-between", gap: "100" }, /* @__PURE__ */ e.createElement(o, { variant: "bodyLg" }, t.name), n && /* @__PURE__ */ e.createElement(V, { tone: "success" }, s.MostPopular)), t.description && /* @__PURE__ */ e.createElement(o, { tone: "subdued" }, t.description)), ke = ({ plan: t, discount: n, useShortFormPlanIntervals: r = !0 }) => /* @__PURE__ */ e.createElement(d, { gap: "100" }, !!n && /* @__PURE__ */ e.createElement(w, { blockAlign: "center", gap: "200" }, /* @__PURE__ */ e.createElement(o, { variant: "headingXl" }, O(n.discountedAmount, t.currency)), /* @__PURE__ */ e.createElement(
  o,
  {
    variant: "headingXl",
    tone: "subdued",
    fontWeight: "medium",
    textDecorationLine: "line-through"
  },
  t.amount
), /* @__PURE__ */ e.createElement(o, { variant: "bodyLg", tone: "subdued" }, s.Per, " ", X({ interval: t.interval, useShortFormPlanIntervals: r }))), !n && /* @__PURE__ */ e.createElement(w, { blockAlign: "center", gap: "200" }, /* @__PURE__ */ e.createElement(o, { alignment: "center", variant: "headingXl" }, O(t.amount, t.currency)), /* @__PURE__ */ e.createElement(o, { alignment: "center", variant: "bodyLg", tone: "subdued" }, s.Per, " ", X({ interval: t.interval, useShortFormPlanIntervals: r }))), t.usageCharges && t.usageCharges.length > 0 && /* @__PURE__ */ e.createElement(d, null, t.usageCharges.map((c, l) => /* @__PURE__ */ e.createElement(w, { key: `plan-usageCharge-${l}`, align: "start", gap: "100" }, /* @__PURE__ */ e.createElement(C, null, /* @__PURE__ */ e.createElement(H, { source: j, tone: "positive" })), /* @__PURE__ */ e.createElement(o, { variant: "bodyLg" }, c.terms))))), Ae = ({ plan: t, trialDaysAsFeature: n = !1 }) => /* @__PURE__ */ e.createElement(d, { gap: "100" }, n && t.trialDays && t.trialDays > 0 ? /* @__PURE__ */ e.createElement(w, { align: "start", gap: "100" }, /* @__PURE__ */ e.createElement(C, null, /* @__PURE__ */ e.createElement(H, { source: U, tone: "positive" })), /* @__PURE__ */ e.createElement(o, { tone: "subdued" }, s.FreeTrialLength.replace("{{ trialDays }}", t.trialDays))) : null, t.featuresOrder.map((r, c) => {
  const l = t.features[r];
  if (l.type !== "boolean" || l.value === !0)
    return /* @__PURE__ */ e.createElement(w, { key: `plan-feature-${c}`, align: "start", gap: "100" }, /* @__PURE__ */ e.createElement(C, null, /* @__PURE__ */ e.createElement(H, { source: U, tone: "positive" })), l.type === "boolean" ? /* @__PURE__ */ e.createElement(o, { tone: "subdued" }, l.name) : /* @__PURE__ */ e.createElement(o, { tone: "subdued" }, l.value, " ", l.name));
})), De = ({
  plan: t,
  discount: n,
  buttonLabel: r,
  onSelectPlan: c,
  useShortFormPlanIntervals: l = !0,
  trialDaysAsFeature: i = !1,
  isRecommendedPlan: b = !1,
  isActivePlan: f = !1
}) => /* @__PURE__ */ e.createElement(K, null, /* @__PURE__ */ e.createElement(d, { gap: "400" }, /* @__PURE__ */ e.createElement(Pe, { plan: t, isRecommendedPlan: b }), /* @__PURE__ */ e.createElement(
  ke,
  {
    plan: t,
    discount: n,
    useShortFormPlanIntervals: l
  }
), /* @__PURE__ */ e.createElement(
  $,
  {
    size: "large",
    variant: b ? "primary" : "secondary",
    onClick: () => {
      c ? c({ plan: t, discount: n }) : console.log("No onSelectPlan callback provided");
    },
    disabled: f
  },
  f ? s.CurrentPlan : r || s.SelectPlan
), /* @__PURE__ */ e.createElement(Ae, { plan: t, trialDaysAsFeature: i }))), Re = ({
  customer: t,
  plans: n,
  onSubscribe: r,
  backUrl: c = "",
  // string: URL to use as "back" breadcrumb URL. leave as empty string or null to hide the back button
  showRecommendedBadge: l = !0,
  // boolean
  customFieldCta: i = null,
  // string: value of the custom plan field to use as the CTA. e.g. "cta"
  customFieldPlanRecommended: b = "Recommended",
  // string: value of the custom plan field to use as the recommended badge
  showPlanIntervalToggle: f = !0,
  // boolean
  showTrialDaysAsFeature: p = !0,
  // boolean
  useShortFormPlanIntervals: P = !0,
  // boolean: e.g. show "$ / mo" instead of "$ / month"
  pageWidth: A = "default",
  // string: "full", "narrow", or "default"
  showCustomPlans: M = !0
  // boolean: show custom plans
}) => {
  const v = t == null ? void 0 : t.subscription, T = new URLSearchParams(window.location.search), D = n.some((E) => E.interval === u.Annual) && n.some((E) => E.interval === u.Every30Days), S = n.find((E) => E.id === (v == null ? void 0 : v.plan.id)), [y, m] = R(
    S ? S.interval : D ? u.Annual : u.Every30Days
  ), g = n.filter((E) => E.availability === N.Public), h = M ? n.filter((E) => E.availability !== N.Public) : [], [L, Y] = R(
    T.get("subscribed") === "true"
  );
  return /* @__PURE__ */ e.createElement(
    G,
    {
      title: s.Plans,
      backAction: c && c !== "" ? { content: s.Back, url: c } : void 0,
      secondaryActions: f && D ? /* @__PURE__ */ e.createElement(Z, { variant: "segmented" }, /* @__PURE__ */ e.createElement(
        $,
        {
          pressed: y === u.Every30Days,
          onClick: () => m(u.Every30Days)
        },
        s.Monthly
      ), /* @__PURE__ */ e.createElement(
        $,
        {
          pressed: y === u.Annual,
          onClick: () => m(u.Annual)
        },
        s.Yearly
      )) : void 0,
      fullWidth: A === "full",
      narrowWidth: A === "narrow"
    },
    /* @__PURE__ */ e.createElement(C, { paddingBlockEnd: "800" }, /* @__PURE__ */ e.createElement(W, null, /* @__PURE__ */ e.createElement(W.Section, null, /* @__PURE__ */ e.createElement(d, { gap: "1000" }, L && /* @__PURE__ */ e.createElement(
      J,
      {
        tone: "success",
        title: s.SubscribeSuccessTitle,
        onDismiss: () => {
          Y(!1), window.history.replaceState({}, document.title, window.location.pathname);
        }
      },
      s.SubscribeSuccessBody
    ), /* @__PURE__ */ e.createElement(
      _,
      {
        plans: g,
        onSelectPlan: r,
        planInterval: y,
        cardType: I.Highlighted,
        keyForRecommended: b,
        keyForCustomButtonLabel: i,
        trialDaysAsFeature: p,
        useShortFormPlanIntervals: P,
        showRecommendedPlanBadge: l
      }
    ), (h == null ? void 0 : h.length) > 0 && /* @__PURE__ */ e.createElement(Q, { borderColor: "border" }), (h == null ? void 0 : h.length) > 0 && /* @__PURE__ */ e.createElement(d, { gap: "300" }, /* @__PURE__ */ e.createElement(C, { paddingInline: { xs: 400, sm: 0 } }, /* @__PURE__ */ e.createElement(o, { variant: "headingMd" }, s.CustomPlans)), /* @__PURE__ */ e.createElement(
      _,
      {
        plans: h,
        onSelectPlan: r,
        planInterval: y,
        cardType: I.Highlighted,
        keyForRecommended: b,
        keyForCustomButtonLabel: i,
        trialDaysAsFeature: p,
        useShortFormPlanIntervals: P,
        showRecommendedPlanBadge: l
      }
    ))))))
  );
}, $e = ({
  customer: t,
  plans: n,
  onSubscribe: r,
  backUrl: c = "",
  // string: URL to use as "back" breadcrumb URL. leave as empty string or null to hide the back button
  showRecommendedBadge: l = !0,
  // boolean
  customFieldCta: i = null,
  // string: value of the custom plan field to use as the CTA. e.g. "cta"
  customFieldPlanRecommended: b = "Recommended",
  // string: value of the custom plan field to use as the recommended badge
  showPlanIntervalToggle: f = !1,
  // boolean
  showTrialDaysAsFeature: p = !0,
  // boolean
  useShortFormPlanIntervals: P = !0,
  // boolean: e.g. show "$ / mo" instead of "$ / month"
  pageWidth: A = "default",
  // string: "full", "narrow", or "default"
  showCustomPlans: M = !0
  // boolean: show custom plans
}) => {
  const v = t == null ? void 0 : t.subscription, T = new URLSearchParams(window.location.search), D = n.some((a) => a.interval === u.Annual) && n.some((a) => a.interval === u.Every30Days), S = n.find((a) => a.id === (v == null ? void 0 : v.plan.id)), [y, m] = R(
    S ? S.interval : D ? u.Annual : u.Every30Days
  ), g = n.filter(
    (a) => a.availability !== "customerTag" && a.availability !== "customer"
  ), h = f && D ? g.filter((a) => a.interval === y) : g, L = M ? n.filter(
    (a) => a.availability === "customerTag" || a.availability === "customer"
  ) : [], [Y, E] = R(
    T.get("subscribed") === "true"
  ), ee = ({ plan: a, discount: x }) => /* @__PURE__ */ e.createElement(d, null, /* @__PURE__ */ e.createElement(o, { variant: "bodyLg" }, a.name), a.description && /* @__PURE__ */ e.createElement(o, { tone: "subdued" }, a.description)), te = ({ plan: a, discount: x }) => /* @__PURE__ */ e.createElement(d, { gap: "200" }, /* @__PURE__ */ e.createElement(o, { fontWeight: "medium" }, s.Features), /* @__PURE__ */ e.createElement(d, { gap: "100" }, p && a.trialDays !== 0 && /* @__PURE__ */ e.createElement(w, { align: "start", gap: "100" }, /* @__PURE__ */ e.createElement(C, null, /* @__PURE__ */ e.createElement(H, { source: U, tone: "positive" })), /* @__PURE__ */ e.createElement(o, { tone: "subdued" }, s.FreeTrialLength.replace("{{ trialDays }}", a.trialDays))), a.featuresOrder.map((k, B) => {
    const F = a.features[k];
    if (F.type !== "boolean" || F.value === !0)
      return /* @__PURE__ */ e.createElement(w, { key: `plan-feature-${B}`, align: "start", gap: "100" }, /* @__PURE__ */ e.createElement(C, null, /* @__PURE__ */ e.createElement(H, { source: U, tone: "positive" })), F.type === "boolean" ? /* @__PURE__ */ e.createElement(o, { tone: "subdued" }, F.name) : /* @__PURE__ */ e.createElement(o, { tone: "subdued" }, F.value, " ", F.name));
  }))), ne = ({ plan: a, discount: x }) => /* @__PURE__ */ e.createElement(d, { gap: "100" }, x ? /* @__PURE__ */ e.createElement(w, { blockAlign: "center", gap: "200" }, /* @__PURE__ */ e.createElement(o, { variant: "headingXl" }, O(x.discountedAmount, a.currency)), /* @__PURE__ */ e.createElement(
    o,
    {
      variant: "headingXl",
      tone: "subdued",
      fontWeight: "medium",
      textDecorationLine: "line-through"
    },
    a.amount
  ), /* @__PURE__ */ e.createElement(o, { variant: "bodyLg", tone: "subdued" }, s.Per, " ", X({ interval: a.interval, useShortFormPlanIntervals: P }))) : /* @__PURE__ */ e.createElement(w, { blockAlign: "center", gap: "200" }, /* @__PURE__ */ e.createElement(o, { alignment: "center", variant: "headingXl" }, O(a.amount, a.currency)), /* @__PURE__ */ e.createElement(o, { alignment: "center", variant: "bodyLg", tone: "subdued" }, s.Per, " ", X({ interval: a.interval, useShortFormPlanIntervals: P }))), a.usageCharges.length > 0 && /* @__PURE__ */ e.createElement(d, null, a.usageCharges.map((k, B) => /* @__PURE__ */ e.createElement(w, { key: `plan-usageCharge-${B}`, align: "start", gap: "100" }, /* @__PURE__ */ e.createElement(C, null, /* @__PURE__ */ e.createElement(H, { source: j, tone: "positive" })), /* @__PURE__ */ e.createElement(o, { variant: "bodyLg" }, k.terms))))), ae = ({ plan: a, discount: x }) => {
    const k = i && a.customFields[i], B = a.customFields && a.customFields[b];
    return /* @__PURE__ */ e.createElement(w, { blockAlign: "center", gap: "400" }, /* @__PURE__ */ e.createElement(
      $,
      {
        size: "large",
        variant: B ? "primary" : "secondary",
        onClick: () => r({ planId: a.id, discountId: x == null ? void 0 : x.id }),
        disabled: (S == null ? void 0 : S.id) === a.id
      },
      (S == null ? void 0 : S.id) === a.id ? s.CurrentPlan : k ? a.customFields[i] : s.SelectPlan
    ), B && l && /* @__PURE__ */ e.createElement(C, null, /* @__PURE__ */ e.createElement(V, { tone: "success" }, s.MostPopular)));
  };
  return /* @__PURE__ */ e.createElement(
    G,
    {
      title: s.Plans,
      backAction: c !== "" ? { content: s.Back, url: c } : void 0,
      secondaryActions: f && D ? /* @__PURE__ */ e.createElement(Z, { variant: "segmented" }, /* @__PURE__ */ e.createElement(
        $,
        {
          pressed: y === u.Every30Days,
          onClick: () => m(u.Every30Days)
        },
        s.Monthly
      ), /* @__PURE__ */ e.createElement(
        $,
        {
          pressed: y === u.Annual,
          onClick: () => m(u.Annual)
        },
        s.Year
      )) : void 0,
      fullWidth: A === "full",
      narrowWidth: A === "narrow"
    },
    /* @__PURE__ */ e.createElement(W, null, /* @__PURE__ */ e.createElement(W.Section, null, /* @__PURE__ */ e.createElement(d, { gap: "400" }, Y && /* @__PURE__ */ e.createElement(
      J,
      {
        tone: "success",
        title: s.SubscribeSuccessTitle,
        onDismiss: () => {
          E(!1), window.history.replaceState({}, document.title, window.location.pathname);
        }
      },
      s.SubscribeSuccessBody
    ), h.map((a, x) => {
      var B;
      const k = ((B = a.discounts) == null ? void 0 : B.length) > 0 ? a.discounts.reduce(
        (F, z) => F.discountedAmount < z.discountedAmount ? F : z
      ) : null;
      return /* @__PURE__ */ e.createElement(K, { key: `plan-${x}` }, /* @__PURE__ */ e.createElement(q, null, /* @__PURE__ */ e.createElement(q.Cell, { columnSpan: { xs: 6, sm: 6, md: 3, lg: 6, xl: 12 } }, /* @__PURE__ */ e.createElement(d, { gap: "400" }, /* @__PURE__ */ e.createElement(d, { gap: "200" }, ee({ plan: a, discount: k }), ne({ plan: a, discount: k })), /* @__PURE__ */ e.createElement(C, null, ae({ plan: a, discount: k })))), /* @__PURE__ */ e.createElement(q.Cell, { columnSpan: { xs: 6, sm: 6, md: 3, lg: 6, xl: 12 } }, te({ plan: a, discount: k }))));
    }), (L == null ? void 0 : L.length) > 0 && /* @__PURE__ */ e.createElement(Q, { borderColor: "border" }), (L == null ? void 0 : L.length) > 0 && /* @__PURE__ */ e.createElement(d, { gap: "300" }, /* @__PURE__ */ e.createElement(C, { paddingInline: { xs: 400, sm: 0 } }, /* @__PURE__ */ e.createElement(o, { variant: "headingMd" }, s.CustomPlans)), /* @__PURE__ */ e.createElement(q, null, L.map((a, x) => {
      var B;
      const k = ((B = a.discounts) == null ? void 0 : B.length) > 0 ? a.discounts.reduce(
        (F, z) => F.discountedAmount < z.discountedAmount ? F : z
      ) : null;
      return /* @__PURE__ */ e.createElement(q.Cell, { key: `custom-plan-${x}`, columnSpan: columnSpan() }, /* @__PURE__ */ e.createElement(K, null, /* @__PURE__ */ e.createElement(d, { gap: "400" }, ee({ plan: a, discount: k }), ne({ plan: a, discount: k }), ae({ plan: a, discount: k }), te({ plan: a, discount: k }))));
    }))))))
  );
};
export {
  Re as HighlightedPlanCards,
  De as HorizontalPlanCard,
  Te as HorizontalPlanCards,
  s as Labels,
  xe as MantleProvider,
  N as PlanAvailability,
  _ as PlanCardStack,
  I as PlanCardType,
  Ae as PlanFeaturesSection,
  u as PlanInterval,
  ke as PlanPricingSection,
  Pe as PlanTitleSection,
  $e as VerticalPlanCards,
  ce as customButtonLabel,
  re as featureEnabled,
  Fe as featureSort,
  be as highestDiscount,
  X as intervalLabel,
  ye as intervalLabelLong,
  he as intervalLabelShort,
  le as isRecommendedPlan,
  O as money,
  Be as useMantle
};
