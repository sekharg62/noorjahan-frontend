"use client";

import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { checkoutCopy } from "@/data/static-pages";
import { useCustomer } from "@/context/customer-context";
import { getApiErrorMessage } from "@/lib/api-error";
import type { CustomerAddress } from "@/types";

type AddressFormState = {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
  alternativePh: string;
  notes: string;
};

type FormMode = "create" | "edit" | null;

function getDefaultFormState(
  customerName?: string,
  customerPhone?: string,
  address?: CustomerAddress | null,
): AddressFormState {
  return {
    fullName: address?.fullName ?? customerName ?? "",
    phone: address?.phone ?? customerPhone ?? "",
    address: address?.address ?? "",
    city: address?.city ?? "",
    pincode: address?.pincode ?? "",
    alternativePh: address?.alternativePh ?? "",
    notes: address?.notes ?? "",
  };
}

function buildAddressPayload(form: AddressFormState): any {
  const payload: any = {
    fullName: form.fullName.trim(),
    phone: form.phone.trim().replace(/\D/g, ""),
    address: form.address.trim(),
    city: form.city.trim(),
    pincode: form.pincode.trim(),
  };

  if (form.alternativePh.trim()) {
    payload.alternativePh = form.alternativePh.trim().replace(/\D/g, "");
  }

  if (form.notes.trim()) {
    payload.notes = form.notes.trim();
  }

  return payload;
}

interface AddressSectionProps {
  mode?: "checkout" | "manage";
  selectedAddressId?: string | null;
  onSelectAddress?: (id: string) => void;
}

export function CheckoutAddressSection({
  mode = "checkout",
  selectedAddressId = null,
  onSelectAddress,
}: AddressSectionProps) {
  const isCheckoutMode = mode === "checkout";
  const {
    customer,
    addresses,
    profileLoading,
    createAddress,
    updateAddress,
    deleteAddress,
  } = useCustomer();

  const copy = checkoutCopy.addresses;
  const fieldCopy = checkoutCopy.fields;

  const [formMode, setFormMode] = useState<FormMode>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<AddressFormState>(() =>
    getDefaultFormState(customer?.name, customer?.phone),
  );
  const [formError, setFormError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (!isCheckoutMode || !onSelectAddress) return;
    if (selectedAddressId || addresses.length === 0) return;
    onSelectAddress(addresses[0].id);
  }, [addresses, isCheckoutMode, onSelectAddress, selectedAddressId]);

  useEffect(() => {
    if (!isCheckoutMode || !onSelectAddress) return;
    if (!selectedAddressId) return;
    if (!addresses.some((item) => item.id === selectedAddressId)) {
      onSelectAddress(addresses[0]?.id ?? "");
    }
  }, [addresses, isCheckoutMode, onSelectAddress, selectedAddressId]);

  const openCreateForm = () => {
    setFormMode("create");
    setEditingId(null);
    setForm(getDefaultFormState(customer?.name, customer?.phone));
    setFormError(null);
  };

  const openEditForm = (address: CustomerAddress) => {
    setFormMode("edit");
    setEditingId(address.id);
    setForm(getDefaultFormState(customer?.name, customer?.phone, address));
    setFormError(null);
  };

  const closeForm = () => {
    setFormMode(null);
    setEditingId(null);
    setFormError(null);
  };

  const handleFieldChange = (name: keyof AddressFormState, value: string) => {
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSaveAddress = async () => {
    setActionLoading(true);
    setFormError(null);

    const payload = buildAddressPayload(form);

    try {
      if (formMode === "edit" && editingId) {
        const updated = await updateAddress(editingId, payload);
        if (isCheckoutMode && onSelectAddress) {
          onSelectAddress(updated.id);
        }
      } else {
        const created = await createAddress(payload);
        if (isCheckoutMode && onSelectAddress) {
          onSelectAddress(created.id);
        }
      }
      closeForm();
    } catch (error) {
      setFormError(getApiErrorMessage(error, copy.addressError));
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    if (!window.confirm(copy.deleteConfirm)) return;

    setActionLoading(true);
    setFormError(null);

    try {
      await deleteAddress(id);

      if (editingId === id) {
        closeForm();
      }
    } catch (error) {
      setFormError(getApiErrorMessage(error, copy.deleteError));
    } finally {
      setActionLoading(false);
    }
  };

  if (profileLoading) {
    return (
      <p className="text-sm text-neutral-500 uppercase tracking-widest">
        Loading addresses…
      </p>
    );
  }

  return (
    <section className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-900">
            {copy.title}
          </h2>
          {isCheckoutMode && (
            <p className="mt-2 text-sm text-neutral-600">{copy.selectHint}</p>
          )}
        </div>
        {!formMode && (
          <button
            type="button"
            onClick={openCreateForm}
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-neutral-900 hover:opacity-70"
          >
            <Plus className="w-4 h-4" />
            {copy.addNew}
          </button>
        )}
      </div>

      {formError && (
        <p className="text-sm text-red-600" role="alert">
          {formError}
        </p>
      )}

      {formMode ? (
        <div className="border border-neutral-200 p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <AddressInput
              id="address-full-name"
              label={fieldCopy.fullName}
              value={form.fullName}
              onChange={(value) => handleFieldChange("fullName", value)}
              required
            />
            <AddressInput
              id="address-phone"
              label={fieldCopy.phone}
              value={form.phone}
              onChange={(value) => handleFieldChange("phone", value)}
              required
              inputMode="numeric"
            />
          </div>
          <AddressInput
            id="address-line"
            label={fieldCopy.addressLine}
            value={form.address}
            onChange={(value) => handleFieldChange("address", value)}
            required
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <AddressInput
              id="address-city"
              label={fieldCopy.city}
              value={form.city}
              onChange={(value) => handleFieldChange("city", value)}
              required
            />
            <AddressInput
              id="address-pincode"
              label={fieldCopy.pincode}
              value={form.pincode}
              onChange={(value) => handleFieldChange("pincode", value)}
              required
              inputMode="numeric"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <AddressInput
              id="address-alt-phone"
              label={fieldCopy.alternativePh}
              value={form.alternativePh}
              onChange={(value) => handleFieldChange("alternativePh", value)}
              inputMode="numeric"
            />
            <AddressInput
              id="address-notes"
              label={fieldCopy.notes}
              value={form.notes}
              onChange={(value) => handleFieldChange("notes", value)}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={handleSaveAddress}
              disabled={actionLoading}
              className="flex-1 bg-neutral-900 text-white text-xs uppercase tracking-[0.2em] py-3 hover:bg-neutral-800 transition-colors disabled:opacity-60"
            >
              {actionLoading ? copy.saving : copy.save}
            </button>
            <button
              type="button"
              onClick={closeForm}
              className="flex-1 border border-neutral-300 text-xs uppercase tracking-[0.2em] py-3 hover:bg-neutral-50 transition-colors"
            >
              {copy.cancel}
            </button>
          </div>
        </div>
      ) : addresses.length > 0 ? (
        <ul className="space-y-3">
          {addresses.map((address) => {
            const isSelected = isCheckoutMode && selectedAddressId === address.id;

            return (
              <li
                key={address.id}
                className={`border p-4 transition-colors ${
                  isSelected
                    ? "border-neutral-900 bg-neutral-50"
                    : "border-neutral-200"
                }`}
              >
                {isCheckoutMode ? (
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="checkout-address"
                      value={address.id}
                      checked={isSelected}
                      onChange={() => onSelectAddress?.(address.id)}
                      className="mt-1 shrink-0 accent-neutral-900"
                    />
                    <AddressDetails
                      address={address}
                      isSelected={isSelected}
                      selectedLabel={copy.selected}
                    />
                  </label>
                ) : (
                  <AddressDetails address={address} />
                )}
                <div
                  className={`mt-3 flex gap-4 ${isCheckoutMode ? "pl-7" : ""}`}
                >
                  <button
                    type="button"
                    onClick={() => openEditForm(address)}
                    className="inline-flex items-center gap-1 text-xs uppercase tracking-widest text-neutral-700 hover:text-neutral-900"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    {copy.edit}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteAddress(address.id)}
                    disabled={actionLoading}
                    className="inline-flex items-center gap-1 text-xs uppercase tracking-widest text-red-600 hover:text-red-700 disabled:opacity-60"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    {copy.delete}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="border border-dashed border-neutral-300 p-6 text-center">
          <p className="text-sm text-neutral-600">{copy.empty}</p>
          <button
            type="button"
            onClick={openCreateForm}
            className="mt-4 inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-neutral-900 hover:opacity-70"
          >
            <Plus className="w-4 h-4" />
            {copy.addNew}
          </button>
        </div>
      )}
    </section>
  );
}

function AddressDetails({
  address,
  isSelected,
  selectedLabel,
}: {
  address: CustomerAddress;
  isSelected?: boolean;
  selectedLabel?: string;
}) {
  return (
    <span className="flex-1 text-sm text-neutral-700 leading-relaxed">
      <span className="block font-semibold text-neutral-900">
        {address.fullName}
      </span>
      <span className="block mt-1">{address.phone}</span>
      <span className="block mt-1">
        {address.address}, {address.city} {address.pincode}
      </span>
      {address.notes && (
        <span className="block mt-1 text-neutral-500">{address.notes}</span>
      )}
      {selectedLabel && (
        <span
          className={`block mt-2 text-[10px] uppercase tracking-widest ${
            isSelected ? "text-neutral-900" : "text-transparent select-none"
          }`}
          aria-hidden={!isSelected}
        >
          {selectedLabel}
        </span>
      )}
    </span>
  );
}

function AddressInput({
  id,
  label,
  value,
  onChange,
  required = false,
  inputMode,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  inputMode?: "numeric" | "text";
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
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        inputMode={inputMode}
        className="w-full border border-neutral-300 px-4 py-3 text-sm text-neutral-900 focus:outline-none focus:border-neutral-900"
      />
    </div>
  );
}
