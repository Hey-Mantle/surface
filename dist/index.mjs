import w, { createContext as C, useState as c, useEffect as E, useContext as T } from "react";
class f {
  /**
   * Creates a new MantleClient
   * @param {Object} params
   * @param {string} params.appId - The Mantle App ID provided by Mantle
   * @param {string} params.customerApiToken - The Mantle Customer API Token returned by the /identify endpoint
   * @param {string} params.apiUrl - The Mantle API URL to use
   */
  constructor({ appId: n, customerApiToken: r, apiUrl: a = "https://appapi.heymantle.com/v1" }) {
    this.appId = n, this.customerApiToken = r, this.apiUrl = a;
  }
  /**
   * Makes a request to the Mantle API
   * @param {Object} params
   * @param {"customer"|"usage_events"|"subscriptions"} params.resource - The Mantle resource to request
   * @param {"GET"|"POST"|"PUT"|"DELETE"} params.method - The HTTP method to use. Defaults to GET
   * @param {JSON} [params.body] - The request body
   * @returns {Promise<JSON>} a promise that resolves to the response body
   */
  async mantleRequest({ resource: n, method: r = "GET", body: a }) {
    return await (await fetch(`${this.apiUrl}/${n}`, {
      method: r,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-Mantle-App-Id": this.appId,
        "X-Mantle-Customer-Api-Token": this.customerApiToken
      },
      ...a && {
        body: JSON.stringify(a)
      }
    })).json();
  }
  /**
   * Get the customer associated with the current customer API token
   * @returns {Promise<Customer>} a promise that resolves to the current customer
   */
  async getCustomer() {
    return (await this.mantleRequest({ resource: "customer" })).customer;
  }
  /**
   * Subscribe to a plan
   * @param {Object} params - The subscription options
   * @param {string} params.planId - The ID of the plan to subscribe to
   * @param {string} params.returnUrl - The URL to redirect to after the subscription is complete
   * @returns {Promise<Subscription>} a promise that resolves to the created subscription
   */
  async subscribe({ planId: n, returnUrl: r }) {
    return await this.mantleRequest({
      resource: "subscriptions",
      method: "POST",
      body: { planId: n, returnUrl: r }
    });
  }
  /**
   * Cancel the current subscription
   * @returns {Promise<Subscription>} a promise that resolves to the cancelled subscription
   */
  async cancelSubscription() {
    return await this.mantleRequest({ resource: "subscriptions", method: "DELETE" });
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
      resource: "subscriptions",
      method: "PUT",
      body: { id: n, cappedAmount: r }
    });
  }
  /**
   * Send a usage event
   * @param {Object} params - The usage event options
   * @param {string} [params.eventId] - The ID of the event
   * @param {string} params.eventName - The name of the event which can be tracked by usage metrics
   * @param {JSON} params.properties - The event properties
   * @returns {Promise<boolean>} true if the event was sent successfully
   */
  async sendUsageEvent({ eventId: n, eventName: r, properties: a = {} }) {
    return await this.mantleRequest({
      resource: "usage_events",
      method: "POST",
      body: {
        event_id: n,
        event_name: r,
        properties: a
      }
    });
  }
}
const m = C(), M = ({ feature: e, count: n = 0 }) => (e == null ? void 0 : e.type) === "boolean" ? e.value : (e == null ? void 0 : e.type) === "limit" ? n < e.value || e.value === -1 : !1, R = ({
  appId: e,
  customerApiToken: n,
  apiUrl: r = "https://appapi.heymantle.com/v1",
  children: a
}) => {
  const i = new f({ appId: e, customerApiToken: n, apiUrl: r }), [t, h] = c(null), [d, u] = c(!0), [y, v] = c(null), b = async () => {
    try {
      u(!0);
      const s = await i.getCustomer();
      h(s);
    } catch (s) {
      v(s);
    } finally {
      u(!1);
    }
  };
  E(() => {
    b();
  }, []);
  const l = (t == null ? void 0 : t.plans) || [], o = t == null ? void 0 : t.subscription, p = (o == null ? void 0 : o.plan) || l.find((s) => s.amount === 0 && s.public);
  return /* @__PURE__ */ w.createElement(
    m.Provider,
    {
      value: {
        customer: t,
        subscription: o,
        currentPlan: p,
        plans: l,
        loading: d,
        error: y,
        client: i,
        isFeatureEnabled: ({ featureKey: s, count: g = 0 }) => t != null && t.features[s] ? M(t.features[s]) : !1,
        limitForFeature: ({ featureKey: s }) => t != null && t.features[s] && p.features[s].type === "limit" ? t.features[s].value : -1,
        refetch: async () => {
          await fetchCurrentCustomer();
        }
      }
    },
    a
  );
}, q = () => {
  const e = T(m);
  if (e === void 0)
    throw new Error("useMantle must be used within a MantleProvider");
  return e;
};
module.exports = {};
export {
  f as MantleClient,
  R as MantleProvider,
  q as useMantle
};
