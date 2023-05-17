import styles from './page.module.css'
import Image from 'next/image'
import Link from 'next/link'
import Horario from './components/Horario'
import Ubicacion from './components/Ubicacion'
import Contacto from './components/Contacto'

export default function Home () {
  return (
    <div className={styles.container}>
      <article>
        <h1>Floreria Camelia - Obras Funerarias</h1>
        <Link href='/Floreria'>
          <Image
            src='/floreriaCamelia.svg'
            alt='Floreria Camelia Logo'
            width={300}
            height={300}
          />
        </Link>
        <Link href='/ObrasFunerarias'>
          <Image
            src='/obras-funerarias-logo.png'
            alt='Floreria Camelia Logo'
            width={300}
            height={300}
          />
        </Link>
      </article>

      <Horario />
      <Ubicacion />
      <Contacto />
    </div>
  )
}
