import type { ReactNode } from 'react'

export function Container({ children }: { children: ReactNode }) {
  return (
    <div className='mx-auto w-full max-w-full px-4 py-5'>
      <>{children}</>
    </div>
  )
}
