interface AccountFieldProps {
  id: string;
  name: string;
  label: string;
  type?: "email" | "password" | "text";
  required?: boolean;
  autoComplete?: string;
}

export function AccountField({
  id,
  name,
  label,
  type = "text",
  required = true,
  autoComplete,
}: AccountFieldProps) {
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
