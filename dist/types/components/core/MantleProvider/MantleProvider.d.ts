export function MantleProvider({ appId, customerApiToken, apiUrl, children, }: {
    appId: string;
    customerApiToken: string;
    apiUrl?: string;
    children: React.ReactNode;
}): React.JSX.Element;
export function useMantle(): TMantleContext;
export type Feature = import('@heymantle/client').Feature;
export type Customer = import('@heymantle/client').Customer;
export type Subscription = import('@heymantle/client').Subscription;
export type Plan = import('@heymantle/client').Plan;
export type TMantleContext = {
    /**
     * - The current customer
     */
    customer: Customer;
    /**
     * - The current subscription
     */
    subscription: Subscription;
    /**
     * - The current plan
     */
    currentPlan: Plan;
    /**
     * - The available plans
     */
    plans: Array<Plan>;
    /**
     * - Whether the current customer is loading
     */
    loading: boolean;
    /**
     * - A function to refetch the current customer
     */
    refetch: RefetchCallback;
    /**
     * - A function to push an event to the event queue
     */
    pushEvent: PushEventCallback;
    /**
     * - A function to check if a feature is enabled
     */
    isFeatureEnabled: FeatureEnabledCallback;
    /**
     * - A function to get the limit for a feature
     */
    limitForFeature: FeatureLimitCallback;
    /**
     * - An function to clear the event queue
     */
    clearEventQueue: ClearEventQueueCallback;
    /**
     * - The Mantle client instance
     */
    mantleClient: MantleClient;
};
export type RefetchCallback = () => Promise<void>;
export type ClearEventQueueCallback = () => Promise<void>;
export type PushEventCallback = (event: {
    eventName: string;
    properties: any;
}, clearEventQueue?: boolean) => Promise<void>;
export type FeatureEnabledCallback = (params: {
    featureKey: string;
    count?: number;
}) => boolean;
export type FeatureLimitCallback = (params: {
    featureKey: string;
}) => number;
import React from "react";
import { MantleClient } from "@heymantle/client";
//# sourceMappingURL=MantleProvider.d.ts.map