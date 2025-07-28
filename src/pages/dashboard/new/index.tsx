import { zodResolver } from '@hookform/resolvers/zod'
import type { ChangeEvent } from 'react'
import { useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { FiLoader, FiTrash, FiUpload } from 'react-icons/fi'
import { v4 as uuidV4 } from 'uuid'
import { z } from 'zod'
import { Container } from '../../../components/container'
import { HeaderDashboard } from '../../../components/header-dashboard'
import { Input } from '../../../components/input'
import { Textarea } from '../../../components/textarea'
import { AuthContext } from '../../../context/auth-context'
import supabase from '../../../services/supabase'
import { numberMask } from '../../../utils/number-mask'
import { phoneMask } from '../../../utils/phone-mask'
import { priceMask } from '../../../utils/price-mask'

const schema = z.object({
  name: z.string().nonempty('O nome do carro é obrigatório'),
  model: z.string().nonempty('O modelo do carro é obrigatório'),
  year: z.string().nonempty('O ano do carro é obrigatório'),
  km: z
    .string()
    .nonempty('O km do carro é obrigatório')
    .transform(field => field.replace(/\D/g, '')),
  price: z
    .string()
    .nonempty('O preco do carro é obrigatório')
    .transform(field => field.replace(/\D/g, '')),
  city: z.string().nonempty('Informe a sua cidade'),
  whatsapp: z
    .string()
    .nonempty('O telefone é obrigatório')
    .transform(field => field.replace(/\D/g, ''))
    .refine(field => /^(\d{11})$/.test(field), {
      error: 'Número de telefone inválido',
    }),
  description: z.string().nonempty('Informe uma descrição'),
})

interface ImageItemProps {
  id: string
  name: string
  type: string
  previewUrl: string
  url: string
  imagePath: string
}

type FormData = z.infer<typeof schema>

export function New() {
  const { user } = useContext(AuthContext)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      city: '',
      description: '',
      km: '',
      model: '',
      price: '',
      whatsapp: '',
      year: '',
    },
  })

  const [carImages, setCarImages] = useState<ImageItemProps[]>([])

  const whatsappPhone = watch('whatsapp')
  const km = watch('km')
  const price = watch('price')

  useEffect(() => {
    setValue('whatsapp', phoneMask(whatsappPhone))
    setValue('km', numberMask(km))
    setValue('price', priceMask(price))
  }, [setValue, whatsappPhone, km, price])

  const handleSendFile = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const image = e.target.files[0]

      if (image.type === 'image/jpeg' || image.type === 'image/png') {
        uploadImage(image)
      } else {
        toast.error('Envie uma imagem valida.')
      }
    }
  }

  const uploadImage = async (image: File) => {
    if (!user?.id) {
      return
    }

    const userId = user.id
    const imageUid = uuidV4()

    const imageType = image.type.split('/')[1]
    const imagePath = `${userId}/${imageUid}.${imageType}`

    const { data: uploadData } = await supabase.storage
      .from('images')
      .upload(imagePath, image)

    const { data: imageData } = await supabase.storage
      .from('images')
      .download(uploadData?.path as string)

    const {
      data: { publicUrl },
    } = supabase.storage.from('images').getPublicUrl(imagePath)

    const imageItem = {
      name: imageUid,
      id: userId,
      type: imageType,
      previewUrl: URL.createObjectURL(imageData as Blob),
      url: publicUrl,
      imagePath: imagePath,
    }

    setCarImages(prev => [...prev, imageItem])
  }

  const handleDeleteImage = async (image: ImageItemProps) => {
    const imagePath = `${image.id}/${image.name}.${image.type}`

    await supabase.storage.from('images').remove([`${imagePath}`])

    setCarImages(carImages.filter(img => img.name !== image.name))
  }

  const handleSubmitCar = async (data: FormData) => {
    console.log(data)

    if (carImages.length === 0) {
      toast.error('Envie uma imagem do seu carro')
      return
    }

    const carListImages = carImages.map(image => {
      return {
        name: image.name,
        id: image.id,
        url: image.url,
        imagePath: image.imagePath,
      }
    })

    const { error } = await supabase
      .schema('public')
      .from('cars')
      .insert({
        ...data,
        owner: user?.name as string,
        owner_uid: user?.id as string,
        images: carListImages,
      })

    if (error) {
      toast.error('Erro ao adicionar carro')
      return
    }

    reset()
    setCarImages([])
    toast.success('Carro adicionado com sucesso!')
  }

  return (
    <Container>
      <HeaderDashboard />

      <div className='flex w-full flex-col items-center gap-2 rounded-lg bg-white p-3 md:flex-row'>
        <button className='mr-auto flex h-32 w-full cursor-pointer items-center justify-center rounded-lg border border-zinc-500 md:h-38 md:w-56'>
          {/* Icone de upload: */}
          <div className='absolute cursor-pointer'>
            <FiUpload size={32} color='#000' />
          </div>
          {/* Input: */}
          <div className='size-full'>
            <input
              type='file'
              accept='image/*'
              onChange={handleSendFile}
              className='size-full cursor-pointer opacity-0'
            />
          </div>
        </button>

        {carImages.map(image => (
          <div
            key={image.name}
            className='relative flex h-32 w-full items-center justify-center md:h-38'
          >
            <button
              onClick={() => handleDeleteImage(image)}
              className='absolute'
            >
              <FiTrash color='#FFF' size={28} />
            </button>
            <img
              src={image.previewUrl}
              className='h-32 w-full rounded-lg object-cover md:h-38'
              alt='Foto do carro'
            />
          </div>
        ))}
      </div>

      <div className='mt-4 flex w-full flex-col items-center gap-2 rounded-lg bg-white p-4 sm:flex-row'>
        <form
          onSubmit={handleSubmit(handleSubmitCar)}
          className='flex w-full flex-col gap-4.5'
        >
          <div>
            <Input
              placeholder='Ex: Onix 1.0'
              label='Nome do carro'
              error={errors.name?.message}
              {...register('name')}
            />
          </div>

          <div>
            <Input
              placeholder='Ex: 1.0 Flex, manual'
              label='Modelo do carro'
              error={errors.model?.message}
              {...register('model')}
            />
          </div>

          <div className='flex w-full items-center gap-5 *:flex-1'>
            <div>
              <Input
                placeholder='Ex: 2016/2017'
                label='Ano'
                error={errors.year?.message}
                {...register('year')}
              />
            </div>
            <div>
              <Input
                placeholder='Ex: 23.000'
                label='Km rodados'
                error={errors.km?.message}
                {...register('km')}
              />
            </div>
          </div>

          <div className='flex w-full items-center gap-5 *:flex-1'>
            <div>
              <Input
                placeholder='Ex: 240.000'
                label='Valor em R$'
                error={errors.price?.message}
                {...register('price')}
              />
            </div>
            <div>
              <Input
                placeholder='Ex: Sorocaba - SP'
                label='Cidade'
                error={errors.city?.message}
                {...register('city')}
              />
            </div>
          </div>

          <div>
            <Input
              placeholder='Ex: 015998888678'
              label='Telefone / WhatsApp'
              error={errors.whatsapp?.message}
              {...register('whatsapp')}
            />
          </div>

          <div>
            <Textarea
              placeholder='Digite a descrição completa sobre o carro'
              label='Descrição'
              error={errors.description?.message}
              {...register('description')}
            />
          </div>

          <button
            type='submit'
            className={`flex h-10 cursor-pointer items-center justify-center gap-1 rounded-lg bg-zinc-900 font-medium text-white disabled:bg-zinc-700 disabled:text-zinc-200 ${'disabled:cursor-not-allowed'}`}
            disabled={isSubmitting}
          >
            {isSubmitting && <FiLoader size={16} className='animate-spin' />}
            {isSubmitting ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </form>
      </div>
    </Container>
  )
}
