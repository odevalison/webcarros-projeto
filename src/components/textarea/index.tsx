import { useId, type Ref, type TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  ref?: Ref<HTMLTextAreaElement>;
  error?: string;
  label?: string;
}

export function Textarea({ label, error, ref, ...props }: TextareaProps) {
  const id = useId(); // gerando id do textarea

  return (
    <div>
      {label && (
        <label
          htmlFor={id}
          className={`text-base/loose font-bold ${error && "text-red-500"}`}
        >
          {label}
        </label>
      )}

      <textarea
        {...props}
        ref={ref}
        id={id}
        style={{ borderColor: error ? "#fb2c36" : "#71717b" }}
        className="block h-24 w-full rounded-lg border p-3 text-base/normal text-zinc-600 outline-none placeholder:text-base/normal placeholder:text-zinc-600"
      />
      {error && (
        <p className="my-1 text-base/normal font-medium text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}
1241241;
