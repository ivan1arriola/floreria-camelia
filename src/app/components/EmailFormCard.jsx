import React from 'react'
import style from './styles/EmailFormCard.module.css'

const EmailFormCard = ({ email }) => {
  return (
    <div className={style.form_card}>
      <h3>Formulario de contacto</h3>
      <div>
        <form target='_blank' action={'https://formsubmit.co/' + email} method='POST'>
          <div>
            <label htmlFor='nombre'>Nombre</label>
            <input
              type='text'
              id='nombre'
              placeholder='Introduce tu nombre'
              name='nombre'
            />
          </div>
          <div>
            <label htmlFor='email'>Email</label>
            <input
              type='email'
              id='email'
              placeholder='Introduce tu email'
              name='email'
            />
          </div>
          <div>
            <label htmlFor='mensaje'>Mensaje</label>
            <textarea
              id='mensaje'
              rows={3}
              placeholder='Introduce tu mensaje'
              name='mensaje'
            />
          </div>
          <button type='submit'>
            Enviar
          </button>
        </form>
      </div>
    </div>
  )
}

export default EmailFormCard
