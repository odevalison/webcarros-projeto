import { PostgrestError } from '@supabase/supabase-js'
import { useContext, useEffect, useState } from 'react'
import { FiTrash2 } from 'react-icons/fi'
import { Container } from '../../components/container'
import { HeaderDashboard } from '../../components/header-dashboard'
import { AuthContext } from '../../context/auth-context'
import supabase from '../../services/supabase'
import { priceFormat } from '../../utils/price-format'
import type { CarProps } from '../../types/car-props'
import { numberFormat } from '../../utils/number-format'

export function Dashboard() {
  const { user } = useContext(AuthContext)

  const [userCars, setUserCars] = useState<CarProps[]>([])
  const [loadedImages, setLoadedImages] = useState<string[]>([])

  useEffect(() => {
    if (!user?.id) {
      return
    }

    const getUserCars = async () => {
      try {
        const { data, error } = await supabase
          .schema('public')
          .from('cars')
          .select('*')
          .eq('owner_uid', user.id)
          .order('created_at', { ascending: false })
          .overrideTypes<CarProps[], { merge: false }>()

        if (error || !data) {
          console.log('Erro ao pegar carros do usuario', error.message)
          return
        }

        setUserCars(data)
      } catch (error) {
        if (error instanceof PostgrestError) {
          console.log('Erro ao pegar carros do usuario:', error.message)
        }
      }
    }

    getUserCars()
  }, [user])

  const handleLoadImage = (id: string) => {
    setLoadedImages(alreadyLoadedImages => [...alreadyLoadedImages, id])
  }

  const handleDeleteCar = async (car: CarProps) => {
    try {
      const { data, error } = await supabase
        .schema('public')
        .from('cars')
        .delete()
        .eq('id', car.id)

      if (error && !data) {
        console.log('Erro ao excluir carro:', error.message)
        return
      }

      car.images.map(async image => {
        const imagePath = `${image.imagePath}`

        const { error } = await supabase.storage
          .from('images')
          .remove([imagePath])

        if (error) {
          console.log(error.message)
          return
        }

        setUserCars(cars => cars.filter(item => item.id !== car.id))
      })
    } catch (error) {
      if (error instanceof Error) {
        console.log('Erro ao deletar carro:', error.message)
      }
    }
  }

  return (
    <Container>
      <HeaderDashboard />

      <main className='grid grid-cols-1 gap-11 md:grid-cols-2 lg:grid-cols-3'>
        {userCars.map(car => (
          <section
            key={car.id}
            className='relative w-full rounded-lg bg-white drop-shadow'
          >
            <div
              style={{
                display: loadedImages.includes(car.id) ? 'none' : 'block',
              }}
              className='absolute h-69 w-full rounded-lg bg-zinc-200'
            ></div>

            <button
              onClick={() => handleDeleteCar(car)}
              className='absolute top-2 right-3 z-20 flex size-16 cursor-pointer items-center justify-center rounded-full bg-white drop-shadow'
            >
              <FiTrash2 size={30} color='#000' />
            </button>

            <img
              src={car.images[0].url}
              alt={car.name}
              onLoad={() => handleLoadImage(car.id)}
              className='mb-2 max-h-69 w-full rounded-lg object-cover'
            />
            <p className='mt-4 mb-2 px-3 text-base/normal font-bold uppercase'>
              {car.name}
            </p>

            <div className='flex flex-col px-3'>
              <div className='mb-8 flex gap-5 text-base/tight text-black'>
                <span>{car.year}</span>
                <li>{numberFormat(Number(car.km))} km</li>
              </div>

              <strong className='text-2xl/normal font-bold text-black'>
                {priceFormat(Number(car.price))}
              </strong>
            </div>

            <div className='my-2 h-[1.5px] w-full bg-zinc-200'></div>

            <p className='mb-2 px-3 text-base/normal text-black'>{car.city}</p>
          </section>
        ))}
      </main>
    </Container>
  )
}
