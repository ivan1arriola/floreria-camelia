import React from 'react'
import Mapa from './Mapa'
import styles from './styles/Ubicacion.module.css'

const Ubicacion = () => {
  return (
    <article>
      <h2>Ubicación</h2>
      <h3>Av. Burgues 4298, Montevideo, Uruguay</h3>
      <div className={styles.mapa}>
        <Mapa />
      </div>

    </article>
  )
}

export default Ubicacion
