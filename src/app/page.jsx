import styles from './page.module.css'
import Image from 'next/image'
import Link from 'next/link'

export default function Home () {
  return (
    <div className={styles.container}>
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
    </div>
  )
}
