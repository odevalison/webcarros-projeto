import { zodResolver } from '@hookform/resolvers/zod'
import { useContext, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { FiLoader } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { AuthContext } from '../../context/auth-context'
import supabase from '../../services/supabase'
import { Input } from '../input'
import toast from 'react-hot-toast'

const formSchema = z.object({
  name: z.string().nonempty('O campo nome e obrigatorio.'),
  email: z
    .email('Insira um e-mail valido.')
    .nonempty('O campo e-mail e obrigatorio.'),
  password: z
    .string()
    .nonempty('O campo senha e obrigatorio.')
    .min(6, 'A senha deve ter pelo menos 6 caracteres.'),
})

export type FormData = z.infer<typeof formSchema>

export function RegisterForm() {
  const { handleInfoUser } = useContext(AuthContext)

  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
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

  const handleRegister = async ({ email, name, password }: FormData) => {
    const {
      data: { user },
      error: signUpError,
    } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { display_name: name } },
    })

    if (!user || signUpError) {
      toast.error('Erro ao criar conta')
      return
    }

    const { data, error } = await supabase
      .schema('public')
      .from('users')
      .insert({
        id: user.id,
        display_name: user.user_metadata.display_name,
      })

    if (!data && error) {
      toast.error('Erro ao adicionar usuario')
      return
    }

    handleInfoUser({ name, email, id: user.id })
    toast.success('Conta criada com sucesso!')
    navigate('/dashboard', { replace: true })
  }

  return (
    <form
      onSubmit={handleSubmit(handleRegister)}
      className='flex w-full max-w-xl flex-col gap-3 rounded-lg bg-white p-4'
    >
      <Input
        placeholder='Digite seu nome completo...'
        error={errors.name?.message}
        {...register('name')}
      />

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
        disabled={isSubmitting}
        className='flex h-11 w-full items-center justify-center gap-1 rounded-lg bg-zinc-900 font-bold text-white disabled:bg-zinc-700 disabled:text-zinc-100'
      >
        {isSubmitting && <FiLoader size={16} />}
        {isSubmitting ? 'Cadastrando...' : 'Cadastrar'}
      </button>
    </form>
  )
}
