"use client";

import { checkoutCopy } from "@/data/static-pages";
import { siteConfig } from "@/lib/site-config";
import type { MobilePaymentDetails, OnlinePaymentMethod } from "@/types";

export type CheckoutPaymentCategory = "COD" | "ONLINE";

interface CheckoutPaymentSectionProps {
  paymentCategory: CheckoutPaymentCategory;
  onlineMethod: OnlinePaymentMethod | null;
  paymentDetails: MobilePaymentDetails;
  onPaymentCategoryChange: (category: CheckoutPaymentCategory) => void;
  onOnlineMethodChange: (method: OnlinePaymentMethod) => void;
  onPaymentDetailsChange: (details: MobilePaymentDetails) => void;
}

const ONLINE_METHODS: OnlinePaymentMethod[] = ["BKASH", "NAGAD", "ROCKET"];

function getMerchantNumber(method: OnlinePaymentMethod): string {
  switch (method) {
    case "BKASH":
      return siteConfig.payment.bkash.personalNumber;
    case "NAGAD":
      return siteConfig.payment.nagad.personalNumber;
    case "ROCKET":
      return siteConfig.payment.rocket.personalNumber;
  }
}

function getMethodCopy(method: OnlinePaymentMethod) {
  switch (method) {
    case "BKASH":
      return checkoutCopy.paymentMethods.bkash;
    case "NAGAD":
      return checkoutCopy.paymentMethods.nagad;
    case "ROCKET":
      return checkoutCopy.paymentMethods.rocket;
  }
}

function getMethodLabel(method: OnlinePaymentMethod): string {
  switch (method) {
    case "BKASH":
      return checkoutCopy.paymentBkash;
    case "NAGAD":
      return checkoutCopy.paymentNagad;
    case "ROCKET":
      return checkoutCopy.paymentRocket;
  }
}

function OnlinePaymentForm({
  method,
  paymentDetails,
  onPaymentDetailsChange,
}: {
  method: OnlinePaymentMethod;
  paymentDetails: MobilePaymentDetails;
  onPaymentDetailsChange: (details: MobilePaymentDetails) => void;
}) {
  const copy = getMethodCopy(method);
  const merchantNumber = getMerchantNumber(method);

  return (
    <div className="mt-4 border border-neutral-200 bg-neutral-50 p-4 sm:p-5 space-y-4">
      <p className="text-sm text-neutral-700 leading-relaxed">{copy.instruction}</p>

      <div>
        <p className="text-xs uppercase tracking-widest text-neutral-900 mb-1">
          {copy.merchantLabel}
        </p>
        <p className="text-base font-semibold text-neutral-900 font-mono tracking-wide">
          {merchantNumber}
        </p>
      </div>

      <div>
        <label
          htmlFor={`payment-sender-${method}`}
          className="block text-xs uppercase tracking-widest text-neutral-900 mb-2"
        >
          {copy.senderLabel}
        </label>
        <input
          id={`payment-sender-${method}`}
          name="paymentSenderNumber"
          type="tel"
          required
          value={paymentDetails.senderNumber}
          onChange={(e) =>
            onPaymentDetailsChange({
              ...paymentDetails,
              senderNumber: e.target.value,
            })
          }
          placeholder={copy.senderPlaceholder}
          inputMode="numeric"
          autoComplete="tel"
          className="w-full border border-neutral-300 bg-white px-4 py-3 text-sm text-neutral-900 focus:outline-none focus:border-neutral-900"
        />
      </div>

      <div>
        <label
          htmlFor={`payment-txn-${method}`}
          className="block text-xs uppercase tracking-widest text-neutral-900 mb-2"
        >
          {copy.transactionLabel}
        </label>
        <input
          id={`payment-txn-${method}`}
          name="paymentTransactionId"
          type="text"
          required
          value={paymentDetails.transactionId}
          onChange={(e) =>
            onPaymentDetailsChange({
              ...paymentDetails,
              transactionId: e.target.value,
            })
          }
          placeholder={copy.transactionPlaceholder}
          className="w-full border border-neutral-300 bg-white px-4 py-3 text-sm text-neutral-900 focus:outline-none focus:border-neutral-900"
        />
      </div>
    </div>
  );
}

export function CheckoutPaymentSection({
  paymentCategory,
  onlineMethod,
  paymentDetails,
  onPaymentCategoryChange,
  onOnlineMethodChange,
  onPaymentDetailsChange,
}: CheckoutPaymentSectionProps) {
  const copy = checkoutCopy;

  return (
    <section>
      <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-900 mb-5">
        {copy.paymentSection}
      </h2>
      <div className="space-y-3">
        <label className="flex items-start gap-3 border px-4 py-4 cursor-pointer transition-colors has-checked:border-neutral-900 has-checked:bg-neutral-50">
          <input
            type="radio"
            name="paymentCategory"
            value="COD"
            checked={paymentCategory === "COD"}
            onChange={() => onPaymentCategoryChange("COD")}
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

        <div
          className={`border transition-colors ${
            paymentCategory === "ONLINE"
              ? "border-neutral-900 bg-neutral-50"
              : "border-neutral-200"
          }`}
        >
          <label className="flex items-start gap-3 px-4 py-4 cursor-pointer">
            <input
              type="radio"
              name="paymentCategory"
              value="ONLINE"
              checked={paymentCategory === "ONLINE"}
              onChange={() => onPaymentCategoryChange("ONLINE")}
              className="mt-0.5 accent-neutral-900"
            />
            <span className="flex-1">
              <span className="block text-sm font-semibold text-neutral-900">
                {copy.paymentOnline}
              </span>
              <span className="block mt-1 text-xs text-neutral-600">
                {copy.paymentOnlineHint}
              </span>
            </span>
          </label>

          {paymentCategory === "ONLINE" && (
            <div className="px-4 pb-4 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {ONLINE_METHODS.map((method) => (
                  <label
                    key={method}
                    className={`flex items-center justify-center gap-2 border px-3 py-3 cursor-pointer text-sm font-semibold transition-colors ${
                      onlineMethod === method
                        ? "border-neutral-900 bg-white text-neutral-900"
                        : "border-neutral-300 bg-white text-neutral-700 hover:border-neutral-500"
                    }`}
                  >
                    <input
                      type="radio"
                      name="onlinePaymentMethod"
                      value={method}
                      checked={onlineMethod === method}
                      onChange={() => onOnlineMethodChange(method)}
                      className="sr-only"
                    />
                    {getMethodLabel(method)}
                  </label>
                ))}
              </div>

              {onlineMethod && (
                <OnlinePaymentForm
                  method={onlineMethod}
                  paymentDetails={paymentDetails}
                  onPaymentDetailsChange={onPaymentDetailsChange}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
