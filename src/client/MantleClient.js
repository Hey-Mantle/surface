export class MantleClient {
  /**
   * Creates a new MantleClient
   * @param {Object} options
   * @param {string} options.appId - The Mantle App ID provided by Mantle
   * @param {string} options.customerApiToken - The Mantle Customer API Token returned by the /identity endpoint
   * @param {string} options.apiUrl - The Mantle API URL to use
   */
  constructor({ appId, customerApiToken, apiUrl = "https://appapi.heymantle.com/v1" }) {
    this.appId = appId;
    this.customerApiToken = customerApiToken;
    this.apiUrl = apiUrl;
  }

  /**
   * Makes a request to the Mantle API
   * @param {Object} options
   * @param {"customer"|"usage_events"|"subscriptions"} options.resource - The Mantle resource to request
   * @param {"GET"|"POST"|"PUT"|"DELETE"} options.method - The HTTP method to use. Defaults to GET
   * @param {JSON} [options.body] - The request body
   */
  async mantleRequest({ resource, method = "GET", body }) {
    const response = await fetch(`${this.apiUrl}/${resource}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-Mantle-App-Id": this.appId,
        "X-Mantle-Customer-Api-Token": this.customerApiToken,
      },
      ...(body && {
        body: JSON.stringify(body),
      }),
    });
    const result = await response.json();
    return result;
  }

  /**
   * Get the customer associated with the current customer API token
   * @returns {Promise<{customer: import('./types.js').Customer}>} - The current customer
   */
  async getCustomer() {
    return (await this.mantleRequest({ resource: "customer" })).customer;
  }

  /**
   * Subscribe to a plan
   * @param {Object} options - The subscription options
   * @param {string} options.planId - The ID of the plan to subscribe to
   * @param {string} options.returnUrl - The URL to redirect to after the subscription is complete
   * @returns {Promise<{subscription: import('./types.js').Subscription}>} - The subscription
   */
  async subscribe({ planId, returnUrl }) {
    return await this.mantleRequest({
      resource: "subscriptions",
      method: "POST",
      body: { planId, returnUrl },
    });
  }

  /**
   * Send a usage event
   * @param {Object} options - The usage event options
   * @param {string} [options.eventId] - The ID of the event
   * @param {string} options.eventName - The name of the event
   * @param {JSON} [options.properties] - The event properties
   * @returns {Promise<{usageEvent: import('./types.js').UsageEvent}>} - The usage event
   */
  async sendUsageEvent({ eventId, eventName, properties = {} }) {
    return await this.mantleRequest({
      resource: "usage_events",
      method: "POST",
      body: {
        event_id: eventId,
        event_name: eventName,
        properties,
      },
    });
  }

  async cancelSubscription() {
    return await this.mantleRequest({ resource: "subscriptions", method: "DELETE" });
  }
}
