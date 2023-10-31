export class MantleClient {
  constructor({ appId, customerApiToken, apiUrl = "https://appapi.heymantle.com/v1" }) {
    this.appId = appId;
    this.customerApiToken = customerApiToken;
    this.apiUrl = apiUrl;
  }

  async mantleRequest({ path, method = "GET", body }) {
    const response = await fetch(`${this.apiUrl}${path}`, {
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

  async getCustomer() {
    return (await this.mantleRequest({ path: "/customer" })).customer;
  }

  async subscribe({ planId, returnUrl }) {
    return await this.mantleRequest({
      path: "/subscriptions",
      method: "POST",
      body: { planId, returnUrl },
    });
  }

  async sendUsageEvent({ eventId, eventName, properties = {} }) {
    return await this.mantleRequest({
      path: "/usage_events",
      method: "POST",
      body: {
        event_id: eventId,
        event_name: eventName,
        properties,
      },
    });
  }

  async cancelSubscription() {
    return await this.mantleRequest({ path: "/subscriptions", method: "DELETE" });
  }
}
