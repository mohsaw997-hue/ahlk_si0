import { useId } from "react";

export default function OutlinedInput({
  label,
  type = "text",
  value,
  onChange,
  required,
  dir,
  className = "",
  id,
  ...rest
}) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <div
      dir={dir}
      className={`border border-zinc-300 rounded-xl w-full px-3 pt-2 pb-1 focus-within:border-zinc-400 ${className}`}
    >
      <label
        htmlFor={inputId}
        className="block text-xs text-zinc-400 leading-none mb-1 text-start"
      >
        {label}
      </label>
      <input
        id={inputId}
        type={type}
        required={required}
        value={value}
        onChange={onChange}
        dir={dir}
        className={`w-full text-lg text-zinc-900 outline-none bg-transparent p-1 ${className}`}
        {...rest}
      />
    </div>
  );
}
