import type { ImageProps } from './image-props'

export interface CarProps {
  id: string
  name: string
  model: string
  description: string
  year: string
  owner_uid: string
  price: string
  city: string
  km: string
  whatsapp: string
  images: ImageProps[]
}
