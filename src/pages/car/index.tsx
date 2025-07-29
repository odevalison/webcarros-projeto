import { useEffect, useState } from 'react'
import { FaWhatsapp } from 'react-icons/fa'
import { useNavigate, useParams } from 'react-router-dom'
import { Container } from '../../components/container'
import supabase from '../../services/supabase'
import type { CarProps } from '../../types/car-props'
import { priceFormat } from '../../utils/price-format'
import { Swiper, SwiperSlide } from 'swiper/react'
import { numberFormat } from '../../utils/number-format'

export function CarDetails() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [car, setCar] = useState<CarProps>()
  const [slidesPerView, setSlidesPerView] = useState<number>(2)

  useEffect(() => {
    const getCar = async () => {
      if (!id) {
        navigate('/')
        return
      }

      const { error, data } = await supabase
        .from('cars')
        .select('*')
        .eq('id', id)
        .single<CarProps>()

      if (error && !data) {
        navigate('/')
        return
      }

      setCar({ ...data })
    }

    getCar()
  }, [id])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 720) {
        setSlidesPerView(1)
      } else {
        setSlidesPerView(2)
      }
    }

    handleResize()

    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <>
      {!!car && (
        <Swiper
          slidesPerView={slidesPerView}
          pagination={{ clickable: true }}
          navigation
        >
          {car?.images.map(image => (
            <SwiperSlide key={image.id}>
              <img
                src={image.url}
                alt={image.name}
                className='h-96 w-full object-cover'
              />
            </SwiperSlide>
          ))}
        </Swiper>
      )}

      <Container>
        {car && (
          <main className='my-2 w-full rounded-xl bg-white px-6 py-5'>
            <div className='mb-2 flex flex-col items-center justify-between sm:flex-row'>
              <h1 className='text-3xl/normal font-bold text-black'>
                {car?.name}
              </h1>
              <strong className='text-3xl/normal font-bold text-black'>
                {priceFormat(Number(car?.price))}
              </strong>
            </div>

            <p className='text-lg/normal text-black'>{car?.model}</p>

            <div className='mt-11 mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-0'>
              <div>
                <p className='text-base/loose'>Cidade</p>
                <strong>{car?.city}</strong>
              </div>
              <div>
                <p className='text-base/loose'>Ano</p>
                <strong>{car?.year}</strong>
              </div>
              <div>
                <p className='text-base/loose'>Km rodados</p>
                <strong>{numberFormat(Number(car?.km))}</strong>
              </div>
            </div>

            <strong className='text-base/loose'>Descrição</strong>
            <p className='mb-4 text-base/relaxed'>{car?.description}</p>

            <strong>Telefone / WhatsApp</strong>
            <p>{car?.whatsapp}</p>

            <a
              href={`https://api.whatsapp.com/send?phone=${car?.whatsapp}&text=Ola, vi esse ${car?.name} e fiquei interessado!`}
              target='_blank'
              className='mt-9 mb-6 flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-green-600 text-base/normal font-bold text-white transition-all hover:bg-green-700 sm:text-lg/normal'
            >
              Enviar mensagem WhatsApp
              <FaWhatsapp size={24} color='#FFF' />
            </a>
          </main>
        )}
      </Container>
    </>
  )
}
