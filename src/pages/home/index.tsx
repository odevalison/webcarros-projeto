import { PostgrestError } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Container } from '../../components/container'
import { Input } from '../../components/input'
import supabase from '../../services/supabase'
import type { CarProps } from '../../types/car-props'
import { priceFormat } from '../../utils/price-format'
import { numberFormat } from '../../utils/number-format'

export function Home() {
  const [cars, setCars] = useState<CarProps[]>([])
  const [loadedImages, setLoadedImages] = useState<string[]>([])
  const [input, setInput] = useState('')

  useEffect(() => {
    getCars()
  }, [])

  const getCars = async () => {
    try {
      const { data, error } = await supabase
        .schema('public')
        .from('cars')
        .select('*')
        .order('created_at', { ascending: false })
        .overrideTypes<CarProps[], { merge: false }>()

      if (error && !data) {
        console.error('Erro ao capturar lista de carros:', error.message)
        return
      }

      setCars(data)
    } catch (error) {
      if (error instanceof PostgrestError) {
        console.error('Erro ao capturar lista de carros:', error.message)
      }
    }
  }

  const handleLoadImages = (id: string) => {
    setLoadedImages(alredyLoadedImages => [...alredyLoadedImages, id])
  }

  const handleSearchCar = async () => {
    if (!input) {
      getCars()
      return
    }

    setCars([])
    setLoadedImages([])

    const { data: queryData } = await supabase
      .schema('public')
      .from('cars')
      .select('*')
      .ilike('name', `%${input}%`)
      .overrideTypes<CarProps[], { merge: false }>()

    if (!queryData?.length) {
      console.log('Nenhum carro encontrado.')
      return
    }

    setCars(queryData)
  }

  return (
    <Container>
      <section className='mx-auto flex w-full max-w-6xl items-center justify-center gap-3 rounded-lg bg-white px-4 py-5'>
        <Input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder='Digite o nome do carro...'
        />

        <button
          onClick={handleSearchCar}
          className='cursor-hover bg-red h-12 cursor-pointer rounded-lg px-8 py-2 text-xl/tight font-bold text-white sm:px-20'
        >
          Buscar
        </button>
      </section>

      <h1 className='mt-14 mb-4 text-center text-2xl/tight font-bold'>
        Carros novos e usados em todo o Brasil
      </h1>

      <main className='grid grid-cols-1 gap-11 md:grid-cols-2 lg:grid-cols-3'>
        {cars.map(car => (
          <section
            key={car.id}
            className='relative w-full rounded-lg bg-white drop-shadow'
          >
            <Link to={`/car/${car.id}`}>
              <div
                style={{
                  display: loadedImages.includes(car.id) ? 'none' : 'block',
                }}
                className='absolute h-69 w-full rounded-lg bg-zinc-200'
              ></div>

              <img
                src={car.images[0].url}
                alt={car.name}
                onLoad={() => handleLoadImages(car.id)}
                style={{
                  display: loadedImages.includes(car.id) ? 'block' : 'none',
                }}
                className='max-h-69 w-full rounded-lg object-cover transition-transform hover:scale-101'
              />
              <p className='mt-4 mb-2 px-3 text-base/normal font-bold uppercase'>
                {car.name}
              </p>
            </Link>

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
