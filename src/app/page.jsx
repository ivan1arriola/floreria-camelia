import styles from './page.module.css'
import Image from 'next/image'
import Link from 'next/link'
import Horario from './components/Horario'
import Ubicacion from './components/Ubicacion'
import Telefono from './components/Telefono'
import Formulario from './components/Formulario'

export default function Home () {
  return (
    <div className={styles.container}>
      <article>
        <div>
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
        </div>
        <h1>Florería Camelia</h1>
      </article>
      <div className={styles.subcontainer}>
        <Telefono />
        <Horario />
        <Ubicacion />
        <Formulario />
      </div>
    </div>
  )
}
