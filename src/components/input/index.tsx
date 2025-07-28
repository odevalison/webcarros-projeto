import { useId, type InputHTMLAttributes, type Ref } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  ref?: Ref<HTMLInputElement>
  error?: string
  label?: string
}

export function Input({
  type = 'text',
  label,
  error,
  ref,
  ...props
}: InputProps) {
  const id = useId() // gerando id pro input...

  return (
    <div className='w-full'>
      {label && (
        <label
          htmlFor={id}
          className={`text-base/loose font-bold ${error && 'text-red-500'}`}
        >
          {label}
        </label>
      )}

      <input
        {...props}
        type={type}
        ref={ref}
        id={id}
        style={{ borderColor: error ? '#fb2c36' : '#71717b' }}
        className='block h-12 w-full rounded-lg border p-3 text-base/normal text-zinc-600 outline-none placeholder:text-base/normal placeholder:text-zinc-600'
      />

      {error && (
        <p className='my-1 text-base/normal font-medium text-red-500'>
          {error}
        </p>
      )}
    </div>
  )
}
