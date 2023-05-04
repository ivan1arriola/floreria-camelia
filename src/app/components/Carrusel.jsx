import React from 'react'
import Image from 'next/image'
import styles from './styles/Carrusel.module.css'

const Carrusel = ({ fotos, title }) => {
  return (
    <div>
      <h4>{title}</h4>
      <ul className={styles.listImages}>
        {fotos.map((foto, index) => {
          return (
            <li key={index}>
              <Image src={foto} alt={`foto-${index}`} width={500} height={500} />
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default Carrusel
