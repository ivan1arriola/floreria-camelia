import React from 'react'

const Horario = () => {
  const horaApertura = 8
  const horaCierre = 17

  const ahora = new Date()
  const horaActual = ahora.getHours()
  const minutosRestantes = ahora.getMinutes() ? 60 - ahora.getMinutes() : 0

  let mensaje = ''
  if (horaActual >= horaCierre) {
    mensaje = `El establecimiento está cerrado. Abre en ${horaApertura - horaActual - 1} horas y ${minutosRestantes} minutos.`
  } else if (horaActual < horaApertura) {
    mensaje = `El establecimiento está cerrado. Abre en ${horaApertura - horaActual - 1} horas y ${minutosRestantes} minutos.`
  } else {
    mensaje = `El establecimiento está abierto. Cierra en ${horaCierre - horaActual - 1} horas y ${minutosRestantes} minutos.`
  }

  return (
    <article>
      <h2>Horario</h2>
      <h3>Abrimos todos los dias de 8:00 am hasta 05:00 pm </h3>
      <p>{mensaje}</p>
    </article>
  )
}

export default Horario
