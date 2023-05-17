import React from 'react'
import style from './styles/Formulario.module.css'

const Formulario = ({ email }) => {
  return (
    <article className={style.form_card}>
      <h2>Formulario de contacto</h2>
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
    </article>
  )
}

export default Formulario
