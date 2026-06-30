"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useAuth } from "@/context/auth-context";
import { customerStorage } from "@/lib/auth-storage";
import {
  customerService,
  normalizeAddressResponse,
  normalizeCustomerProfile,
} from "@/service/customerService";
import type { Customer, CustomerAddress } from "@/types";

interface CustomerContextValue {
  customer: Customer | null;
  orders: any[];
  ordersTotal: number;
  ordersTotalAmount: string | null;
  addresses: CustomerAddress[];
  addressesTotal: number;
  profileLoading: boolean;
  profileError: unknown;
  refreshProfile: () => Promise<void>;
  createAddress: (payload: any) => Promise<CustomerAddress>;
  updateAddress: (id: string, payload: any) => Promise<CustomerAddress>;
  deleteAddress: (id: string) => Promise<void>;
}

const CustomerContext = createContext<CustomerContextValue | null>(null);

export function CustomerProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersTotal, setOrdersTotal] = useState(0);
  const [ordersTotalAmount, setOrdersTotalAmount] = useState<string | null>(null);
  const [addresses, setAddresses] = useState<CustomerAddress[]>([]);
  const [addressesTotal, setAddressesTotal] = useState(0);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState<unknown>(null);
  const fetchIdRef = useRef(0);
  const hasFetchedProfileRef = useRef(false);

  const applyProfile = useCallback((profile: ReturnType<typeof normalizeCustomerProfile>) => {
    setCustomer(profile.customer);
    setOrders(profile.orders);
    setOrdersTotal(profile.ordersTotal);
    setOrdersTotalAmount(profile.ordersTotalAmount);
    setAddresses(profile.addresses);
    setAddressesTotal(profile.addressesTotal);

    if (profile.customer) {
      customerStorage.set(profile.customer);
    }
  }, []);

  const clearProfile = useCallback(() => {
    setCustomer(null);
    setOrders([]);
    setOrdersTotal(0);
    setOrdersTotalAmount(null);
    setAddresses([]);
    setAddressesTotal(0);
    setProfileError(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    const fetchId = ++fetchIdRef.current;
    setProfileLoading(true);
    setProfileError(null);

    try {
      const response = await customerService.getMe();
      if (fetchId !== fetchIdRef.current) return;

      const profile = normalizeCustomerProfile(response);
      applyProfile(profile);
    } catch (error) {
      if (fetchId !== fetchIdRef.current) return;
      setProfileError(error);
    } finally {
      if (fetchId === fetchIdRef.current) {
        setProfileLoading(false);
      }
    }
  }, [applyProfile]);

  const createAddress = useCallback(async (payload: any) => {
    const response = await customerService.createAddress(payload);
    const address = normalizeAddressResponse(response);

    if (!address) {
      throw new Error("Invalid address response");
    }

    setAddresses((current) => {
      const next = [...current, address];
      setAddressesTotal(next.length);
      return next;
    });

    return address;
  }, []);

  const updateAddress = useCallback(async (id: string, payload: any) => {
    const response = await customerService.updateAddress(id, payload);
    const address = normalizeAddressResponse(response);

    if (!address) {
      throw new Error("Invalid address response");
    }

    setAddresses((current) => {
      const next = current.map((item) => (item.id === id ? address : item));
      setAddressesTotal(next.length);
      return next;
    });

    return address;
  }, []);

  const deleteAddress = useCallback(async (id: string) => {
    await customerService.deleteAddress(id);

    setAddresses((current) => {
      const next = current.filter((item) => item.id !== id);
      setAddressesTotal(next.length);
      return next;
    });
  }, []);

  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated) {
      hasFetchedProfileRef.current = false;
      clearProfile();
      return;
    }

    if (hasFetchedProfileRef.current) return;

    hasFetchedProfileRef.current = true;
    refreshProfile();
  }, [authLoading, isAuthenticated, clearProfile, refreshProfile]);

  const value = useMemo(
    () => ({
      customer,
      orders,
      ordersTotal,
      ordersTotalAmount,
      addresses,
      addressesTotal,
      profileLoading,
      profileError,
      refreshProfile,
      createAddress,
      updateAddress,
      deleteAddress,
    }),
    [
      customer,
      orders,
      ordersTotal,
      ordersTotalAmount,
      addresses,
      addressesTotal,
      profileLoading,
      profileError,
      refreshProfile,
      createAddress,
      updateAddress,
      deleteAddress,
    ],
  );

  return (
    <CustomerContext.Provider value={value}>{children}</CustomerContext.Provider>
  );
}

export function useCustomer(): CustomerContextValue {
  const context = useContext(CustomerContext);
  if (!context) {
    throw new Error("useCustomer must be used within CustomerProvider");
  }
  return context;
}
