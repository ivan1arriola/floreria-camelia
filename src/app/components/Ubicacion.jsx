import React from 'react'
import Mapa from './Mapa'

const Ubicacion = () => {
  return (
    <div style={{ backgroundColor: '#f8f9fa', border: '1px solid rgba(0,0,0,.125)', borderRadius: '.25rem' }}>
      <div>
        <h5>Ubicación</h5>
        <h6>Av. Burgues 4298, Montevideo, Uruguay</h6>
        <Mapa />
      </div>
    </div>
  )
}

export default Ubicacion
