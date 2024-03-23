/// <reference types="@heymantle/client" />

/**
 * @typedef {import('.').Feature} Feature
 * @typedef {import('.').Customer} Customer
 * @typedef {import('.').Subscription} Subscription
 * @typedef {import('.').Plan} Plan
 * @typedef {import('.').TMantleContext} TMantleContext
 */

import React, { createContext, useContext, useState, useEffect } from "react";
import { MantleClient } from "@heymantle/client";

/** @type {React.Context<TMantleContext>} */
const MantleContext = createContext();

/**
 * @param {Object} params
 * @param {Feature} params.feature - The feature to evaluate
 * @param {number} [params.count] - The count to evaluate the feature with if it is a limit
 * @returns {boolean} whether the feature is considered enabled
 */
const evaluateFeature = ({ feature, count = 0 }) => {
  if (feature?.type === "boolean") {
    return feature.value;
  } else if (feature?.type === "limit") {
    return count < feature.value || feature.value === -1;
  }
  return false;
};

/**
 * MantleProvider uses the React Context API to provide a MantleClient instance and
 * the current customer to its children, which can be accessed using the useMantle hook.
 * @param {Object} params
 * @param {string} params.appId - The Mantle App ID provided by Mantle
 * @param {string} params.customerApiToken - The Mantle Customer API Token returned by the `identify` endpoint
 * @param {string} [params.apiUrl] - The Mantle API URL to use
 * @param {React.ReactNode} params.children - The children to render
 */
export const MantleProvider = ({
  appId,
  customerApiToken,
  apiUrl = "https://appapi.heymantle.com/v1",
  children,
}) => {
  /**
   * @type {MantleClient}
   */
  const mantleClient = new MantleClient({ appId, customerApiToken, apiUrl });

  /**
   * @type {[Customer, React.Dispatch<React.SetStateAction<Customer>>, boolean, React.Dispatch<React.SetStateAction<boolean>>]}
   */
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCustomer = async () => {
    try {
      setLoading(true);
      const customer = await mantleClient.getCustomer();
      setCustomer(customer);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const pushEvent = async ({ eventId, eventName, properties = {} }) => {
    await mantleClient.sendUsageEvent({ eventId, eventName, properties });
  };

  const subscribe = async ({ planId, discountId, returnUrl }) => {
    return await mantleClient.subscribe({ planId, discountId, returnUrl });
  }

  const cancelSubscription = async () => {
    return await mantleClient.cancelSubscription();
  }

  useEffect(() => {
    if (customerApiToken) {
      fetchCustomer();
    }
  }, [customerApiToken]);

  const plans = customer?.plans || [];
  const subscription = customer?.subscription;
  const currentPlan = subscription?.plan;

  return (
    <MantleContext.Provider
      value={{
        customer,
        subscription,
        plans,
        loading,
        error,
        client: mantleClient,
        pushEvent,
        subscribe,
        cancelSubscription,
        isFeatureEnabled: ({ featureKey, count = 0 }) => {
          if (!!customer?.features[featureKey]) {
            return evaluateFeature({ feature: customer.features[featureKey], count });
          }
          return false;
        },
        limitForFeature: ({ featureKey }) => {
          if (customer?.features[featureKey] && currentPlan.features[featureKey].type === "limit") {
            return customer.features[featureKey].value;
          }
          return -1;
        },
        refetch: async () => {
          await fetchCustomer();
        },
      }}
    >
      {children}
    </MantleContext.Provider>
  );
};

/**
 * useMantle is a React hook that returns the current MantleContext
 * @returns {TMantleContext} the MantleContext
 */
export const useMantle = () => {
  const context = useContext(MantleContext);

  if (context === undefined) {
    throw new Error("useMantle must be used within a MantleProvider");
  }

  return context;
};
