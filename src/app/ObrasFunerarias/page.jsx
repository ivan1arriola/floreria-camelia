import Image from 'next/image'
import styles from './ObrasFunerarias.module.css'
import Carrusel from '../components/Carrusel'

const fetchFotos = (tipo) => {
  const url = 'https://admin.floreriacamelia.com/imagenes/' + tipo
  return fetch(url)
    .then(res => res.json())
    .then(data => data.archivos.map((archivo) => archivo.enlace))
}

const ObrasFunerarias = async ({ fondo }) => {
  const placas = await fetchFotos('placas')
  const plaquitas = await fetchFotos('plaquitas')
  const tubulares = await fetchFotos('tubulares')
  return (
    <div className={styles.container}>

      <Image src='/obras-funerarias-logo.png' alt='logo-obras-funerarias' width={200} height={200} />

      <h1>Obras Funerarias</h1>

      <p>
        Somos una empresa dedicada a la elaboración de obras funerarias, con más
        de 30 años de experiencia en el mercado.
        Grabados Laser en Mármol y Acrilico. Placas de acrilico sublimadas.
      </p>

      <Carrusel title='Placas' fotos={placas} />
      <Carrusel title='Plaquitas' fotos={plaquitas} />
      <Carrusel title='Tubulares' fotos={tubulares} />
    </div>
  )
}

export default ObrasFunerarias
