import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { FiLoader } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import z from 'zod'
import supabase from '../../services/supabase'
import { Input } from '../input'
import toast from 'react-hot-toast'

const formSchema = z.object({
  email: z
    .email('Insira um e-mail valido.')
    .nonempty('O campo e-mail e obrigatorio.'),
  password: z.string().nonempty('O campo senha e obrigatorio.'),
})
export type FormData = z.infer<typeof formSchema>

export function LoginForm() {
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  })

  useEffect(() => {
    const handleLogOut = async () => {
      await supabase.auth.signOut()
    }
    handleLogOut()
  }, [])

  const handleLogin = async (data: FormData) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })

    if (error) {
      toast.error('Erro ao fazer login')
      return
    }

    toast.success('Logado com sucesso!')
    navigate('/dashboard', { replace: true })
  }

  return (
    <form
      className='flex w-full max-w-xl flex-col gap-3 rounded-lg bg-white p-4'
      onSubmit={handleSubmit(handleLogin)}
    >
      <Input
        type='email'
        placeholder='Digite seu e-mail...'
        error={errors.email?.message}
        {...register('email')}
      />

      <Input
        type='password'
        placeholder='Digite sua senha...'
        error={errors.password?.message}
        {...register('password')}
      />

      <button
        type='submit'
        className='flex h-11 w-full items-center justify-center gap-1 rounded-lg bg-zinc-900 font-bold text-white disabled:bg-zinc-700 disabled:text-zinc-100'
        disabled={isSubmitting}
      >
        {isSubmitting && <FiLoader size={18} className='animate-spin' />}
        {isSubmitting ? 'Entrando...' : 'Acessar'}
      </button>
    </form>
  )
}
