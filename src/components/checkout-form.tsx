"use client";

import { useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { SiteImage } from "@/components/site-image";
import { CheckoutAddressSection } from "@/components/checkout-address-section";
import { checkoutCopy } from "@/data/static-pages";
import { getCartLineId } from "@/lib/cart";
import { persistLastOrderForConfirmation, saveOrder } from "@/lib/orders";
import { calculateShippingFee } from "@/lib/shipping";
import { formatPrice } from "@/lib/site-config";
import {
  buildCustomerOrderPayload,
  buildGuestOrderPayload,
  extractOrderNo,
  orderService,
} from "@/service/orderService";
import { useAuth } from "@/context/auth-context";
import { useCustomer } from "@/context/customer-context";
import { useCart } from "@/context/cart-context";
import type { CustomerAddress, Order, ShippingAddress } from "@/types";

const BANGLADESH_COUNTRY_CODE = "+880";
const BANGLADESH_PHONE_LOCAL_MAX_LENGTH = 11;

function CheckoutPhoneField({ label }: { label: string }) {
  const [phoneLocal, setPhoneLocal] = useState("");

  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value
      .replace(/\D/g, "")
      .slice(0, BANGLADESH_PHONE_LOCAL_MAX_LENGTH);
    setPhoneLocal(digits);
  };

  return (
    <div>
      <label
        htmlFor="checkout-phone"
        className="block text-xs uppercase tracking-widest text-neutral-900 mb-2"
      >
        {label}
      </label>
      <div className="flex border border-neutral-300 focus-within:border-neutral-900">
        <span
          className="shrink-0 px-4 py-3 text-sm text-neutral-600 bg-neutral-50 border-r border-neutral-300 select-none"
          aria-hidden
        >
          {BANGLADESH_COUNTRY_CODE}
        </span>
        <input
          id="checkout-phone"
          name="phoneLocal"
          type="tel"
          required
          value={phoneLocal}
          onChange={handlePhoneChange}
          autoComplete="tel-national"
          inputMode="numeric"
          maxLength={BANGLADESH_PHONE_LOCAL_MAX_LENGTH}
          placeholder="1XXXXXXXXX"
          className="min-w-0 flex-1 px-4 py-3 text-sm text-neutral-900 focus:outline-none"
        />
      </div>
    </div>
  );
}

function CheckoutField({
  id,
  name,
  label,
  required = true,
  type = "text",
  autoComplete,
}: {
  id: string;
  name: keyof ShippingAddress;
  label: string;
  required?: boolean;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-xs uppercase tracking-widest text-neutral-900 mb-2"
      >
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        className="w-full border border-neutral-300 px-4 py-3 text-sm text-neutral-900 focus:outline-none focus:border-neutral-900"
      />
    </div>
  );
}

function mapCustomerAddressToShippingAddress(
  address: CustomerAddress,
  email?: string,
): ShippingAddress {
  return {
    fullName: address.fullName,
    phone: address.phone,
    email: email ?? "",
    addressLine: address.address,
    city: address.city,
    district: "",
    postalCode: address.pincode,
  };
}

function CheckoutOrderSummary({
  items,
  subtotal,
  shipping,
  total,
}: {
  items: ReturnType<typeof useCart>["items"];
  subtotal: number;
  shipping: number;
  total: number;
}) {
  const copy = checkoutCopy;

  return (
    <aside className="mt-10 lg:mt-0 lg:sticky lg:top-28 border border-neutral-200 p-5 sm:p-6">
      <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-900 mb-5">
        {copy.orderSummary}
      </h2>
      <ul className="space-y-4 max-h-[320px] overflow-y-auto pr-1">
        {items.map(({ product, quantity, size }) => (
          <li
            key={getCartLineId(product.id, size)}
            className="flex gap-3 text-sm"
          >
            <div className="relative w-14 h-[4.5rem] shrink-0 bg-neutral-100">
              <SiteImage
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                sizes="56px"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-neutral-900 truncate">
                {product.name}
              </p>
              <p className="text-xs text-neutral-500 uppercase tracking-wider mt-0.5">
                Size {size} · Qty {quantity}
              </p>
              <p className="mt-1 text-neutral-600">
                {formatPrice(product.price * quantity)}
              </p>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-6 pt-5 border-t border-neutral-200 space-y-2 text-sm">
        <div className="flex justify-between">
          <span>{copy.subtotal}</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span>{copy.shipping}</span>
          <span>
            {shipping === 0 ? copy.shippingFree : formatPrice(shipping)}
          </span>
        </div>
        <div className="flex justify-between text-base font-semibold text-neutral-900 pt-2">
          <span>{copy.total}</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>
    </aside>
  );
}

function CheckoutPaymentSection() {
  const copy = checkoutCopy;

  return (
    <section>
      <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-900 mb-5">
        {copy.paymentSection}
      </h2>
      <label className="flex items-start gap-3 border border-neutral-900 bg-neutral-50 px-4 py-4 cursor-default">
        <input
          type="radio"
          name="paymentMethod"
          value="cod"
          defaultChecked
          readOnly
          className="mt-0.5 accent-neutral-900"
        />
        <span>
          <span className="block text-sm font-semibold text-neutral-900">
            {copy.paymentCod}
          </span>
          <span className="block mt-1 text-xs text-neutral-600">
            {copy.paymentCodHint}
          </span>
        </span>
      </label>
    </section>
  );
}

export function CheckoutForm() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { customer, addresses } = useCustomer();
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);

  const shipping = useMemo(() => calculateShippingFee(subtotal), [subtotal]);
  const total = subtotal + shipping;
  const copy = checkoutCopy;

  const selectedAddress = addresses.find((item) => item.id === selectedAddressId);

  const completeOrder = async (
    orderNo: string,
    address: ShippingAddress,
  ) => {
    const order: Order = {
      id: orderNo,
      createdAt: new Date().toISOString(),
      items: [...items],
      address,
      paymentMethod: "cod",
      subtotal,
      shipping,
      total,
      status: "placed",
    };

    saveOrder(order);
    persistLastOrderForConfirmation(order);
    clearCart();
    router.replace(`/checkout/success?orderNo=${encodeURIComponent(orderNo)}`);
  };

  const handleGuestSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (items.length === 0) return;

    setSubmitting(true);
    setSubmitError(null);

    const form = e.currentTarget;
    const data = new FormData(form);

    const phoneLocal = String(data.get("phoneLocal") ?? "")
      .trim()
      .replace(/\D/g, "")
      .replace(/^0+/, "");

    const address: ShippingAddress = {
      fullName: String(data.get("fullName") ?? "").trim(),
      phone: phoneLocal ? `${BANGLADESH_COUNTRY_CODE}${phoneLocal}` : "",
      email: String(data.get("email") ?? "").trim(),
      addressLine: String(data.get("addressLine") ?? "").trim(),
      city: String(data.get("city") ?? "").trim(),
      district: String(data.get("district") ?? "").trim(),
      postalCode: String(data.get("postalCode") ?? "").trim(),
    };

    try {
      const response = await orderService.placeGuestOrder(
        buildGuestOrderPayload({
          address,
          phoneLocal,
          items: [...items],
        }),
      );
      const orderNo = extractOrderNo(response);

      if (!orderNo) {
        throw new Error("Order number missing from response");
      }

      await completeOrder(orderNo, address);
    } catch {
      setSubmitError(copy.placeOrderError);
      setSubmitting(false);
    }
  };

  const handleCustomerSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (items.length === 0) return;

    if (!selectedAddress) {
      setSubmitError(checkoutCopy.addresses.selectError);
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      const response = await orderService.placeCustomerOrder(
        buildCustomerOrderPayload({
          addressId: selectedAddress.id,
          items: [...items],
        }),
      );
      const orderNo = extractOrderNo(response);

      if (!orderNo) {
        throw new Error("Order number missing from response");
      }

      await completeOrder(
        orderNo,
        mapCustomerAddressToShippingAddress(selectedAddress, customer?.email),
      );
    } catch {
      setSubmitError(copy.placeOrderError);
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <p className="text-center text-sm text-neutral-600 py-12">
        {copy.emptyCart}
      </p>
    );
  }

  if (isAuthenticated) {
    return (
      <form
        onSubmit={handleCustomerSubmit}
        className="lg:grid lg:grid-cols-2 lg:gap-16 lg:items-start"
      >
        <div className="space-y-8">
          <CheckoutAddressSection
            selectedAddressId={selectedAddressId}
            onSelectAddress={setSelectedAddressId}
          />
          <CheckoutPaymentSection />

          {submitError && (
            <p className="text-sm text-red-600" role="alert">
              {submitError}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting || !selectedAddress}
            className="w-full bg-neutral-900 text-white text-xs uppercase tracking-[0.2em] py-3.5 hover:bg-neutral-800 transition-colors disabled:opacity-60"
          >
            {submitting ? "Placing order…" : copy.placeOrder}
          </button>
        </div>

        <CheckoutOrderSummary
          items={items}
          subtotal={subtotal}
          shipping={shipping}
          total={total}
        />
      </form>
    );
  }

  return (
    <form
      onSubmit={handleGuestSubmit}
      className="lg:grid lg:grid-cols-2 lg:gap-16 lg:items-start"
    >
      <div className="space-y-8">
        <section>
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-900 mb-5">
            {copy.shippingSection}
          </h2>
          <div className="space-y-5">
            <CheckoutField
              id="checkout-full-name"
              name="fullName"
              label={copy.fields.fullName}
              autoComplete="name"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <CheckoutPhoneField label={copy.fields.phone} />
              <CheckoutField
                id="checkout-email"
                name="email"
                label={copy.fields.email}
                type="email"
                required={false}
                autoComplete="email"
              />
            </div>
            <CheckoutField
              id="checkout-address"
              name="addressLine"
              label={copy.fields.addressLine}
              autoComplete="street-address"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <CheckoutField
                id="checkout-city"
                name="city"
                label={copy.fields.city}
                autoComplete="address-level2"
              />
              <CheckoutField
                id="checkout-district"
                name="district"
                label={copy.fields.district}
                autoComplete="address-level1"
              />
            </div>
            <CheckoutField
              id="checkout-postal"
              name="postalCode"
              label={copy.fields.postalCode}
              required={true}
              autoComplete="postal-code"
            />
          </div>
        </section>

        <CheckoutPaymentSection />

        {submitError && (
          <p className="text-sm text-red-600" role="alert">
            {submitError}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-neutral-900 text-white text-xs uppercase tracking-[0.2em] py-3.5 hover:bg-neutral-800 transition-colors disabled:opacity-60"
        >
          {submitting ? "Placing order…" : copy.placeOrder}
        </button>
      </div>

      <CheckoutOrderSummary
        items={items}
        subtotal={subtotal}
        shipping={shipping}
        total={total}
      />
    </form>
  );
}
