import React from 'react'

const Horario = () => {
  const hora = new Date().getHours()
  const estado = hora >= 8 && hora <= 17 ? 'Abierto' : 'Cerrado'
  const mensaje = hora >= 8 && hora <= 17 ? 'Hasta las 17hs' : 'Le atenderemos mañana a partir de las 8am'
  const dias = ['Lunes a Viernes: 8am - 17pm', 'Sábados: 8am - 13pm']

  return (
    <div style={{ backgroundColor: '#f8f9fa', border: '1px solid rgba(0,0,0,.125)', borderRadius: '.25rem' }}>
      <div>
        <h5>Horario</h5>
        {dias.map((dia, index) => (
          <div key={index}>{dia}</div>
        ))}
        <div className={`text-estado ${hora >= 8 && hora <= 17 ? 'text-abierto' : 'text-cerrado'}`}>
          {estado}
        </div>
        <div>{mensaje}</div>
      </div>
    </div>
  )
}

export default Horario
