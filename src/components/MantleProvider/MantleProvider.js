/**
 * @typedef {import('./types').Feature} Feature
 * @typedef {import('./types').Customer} Customer
 * @typedef {import('./types').Subscription} Subscription
 * @typedef {import('./types').Plan} Plan
 * @typedef {import('./types').TMantleContext} TMantleContext
 */

import React, { createContext, useContext, useState, useEffect } from "react";
import { MantleClient } from "./MantleClient";

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
  const mantleClient = new MantleClient({ appId, customerApiToken, apiUrl });

  /**
   * @type {[Customer, React.Dispatch<React.SetStateAction<Customer>>, boolean, React.Dispatch<React.SetStateAction<boolean>>]}
   */
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCustomer = async () => {
    try {
      setLoading(true);
      const customer = await mantleClient.getCustomer();
      setCustomer(customer);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomer();
  }, []);

  const plans = customer?.plans || [];
  const subscription = customer?.subscription;
  const currentPlan = subscription?.plan || plans.find((plan) => plan.amount === 0 && plan.public);

  return (
    <MantleContext.Provider
      value={{
        customer,
        subscription,
        currentPlan,
        plans,
        loading,
        client: mantleClient,
        isFeatureEnabled: ({ featureKey, count = 0 }) => {
          if (!!customer?.features[featureKey]) {
            return evaluateFeature(customer.features[featureKey], count);
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
          await fetchCurrentCustomer();
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
