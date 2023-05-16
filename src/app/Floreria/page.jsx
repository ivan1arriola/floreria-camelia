import Image from 'next/image'
import Carrusel from '../components/Carrusel'
import styles from './Floreria.module.css'
import Link from 'next/link'

const fetchFotos = async () => {
  const url = 'https://admin.floreriacamelia.com/imagenes/floreria'
  const res = await fetch(url)
  const data = await res.json()
  return data.archivos.map((archivo) => archivo.enlace)
}

const Floreria = async () => {
  const fotos = await fetchFotos()
  return (
    <div className={styles.container}>

      <div className={styles.div_background}>
        <Image src='floreriaCamelia.svg' alt='logo-camelia' width={200} height={200} />
      </div>

      <h1>Bienvenidos a Florería Camelia</h1>

      <p>
        Somos una florería ubicada enfrente al Cementerio del Norte con más de
        30 años de experiencia. <br />
        También nos dedicamos a la venta de obras funerarias.
      </p>

      <Link href='/#contacto'>
        <button>Contactar</button>
      </Link>

      <Carrusel title='Fotos de Camelia' fotos={fotos} />

    </div>
  )
}

export default Floreria
