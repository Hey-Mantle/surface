/**
 * @typedef {import('./types').Customer} Customer
 * @typedef {import('./types').Plan} Plan
 * @typedef {import('./types').Subscription} Subscription
 */

export class MantleClient {
  /**
   * Creates a new MantleClient
   * @param {Object} params
   * @param {string} params.appId - The Mantle App ID provided by Mantle
   * @param {string} params.customerApiToken - The Mantle Customer API Token returned by the /identify endpoint
   * @param {string} params.apiUrl - The Mantle API URL to use
   */
  constructor({ appId, customerApiToken, apiUrl = "https://appapi.heymantle.com/v1" }) {
    this.appId = appId;
    this.customerApiToken = customerApiToken;
    this.apiUrl = apiUrl;
  }

  /**
   * Makes a request to the Mantle API
   * @param {Object} params
   * @param {"customer"|"usage_events"|"subscriptions"} params.resource - The Mantle resource to request
   * @param {"GET"|"POST"|"PUT"|"DELETE"} params.method - The HTTP method to use. Defaults to GET
   * @param {JSON} [params.body] - The request body
   * @returns {Promise<JSON>} a promise that resolves to the response body
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
  async subscribe({ planId, returnUrl }) {
    return await this.mantleRequest({
      resource: "subscriptions",
      method: "POST",
      body: { planId, returnUrl },
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
  async updateSubscription({ id, cappedAmount }) {
    return await this.mantleRequest({
      resource: "subscriptions",
      method: "PUT",
      body: { id, cappedAmount },
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
}
