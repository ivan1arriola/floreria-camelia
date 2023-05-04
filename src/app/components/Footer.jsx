import React from 'react'
import { SocialIcon } from 'react-social-icons'
import style from './styles/Footer.module.css'

const Footer = () => {
  return (
    <footer className={style.container}>
      <Icono url='https://www.instagram.com/floreriacameliauy/' />
      <Icono url='https://www.facebook.com/floreriacameliauy' />
      <Icono url='https://api.whatsapp.com/send/?phone=59899084029' />
    </footer>
  )
}

const Icono = ({ url }) => {
  return (
    <div style={{ margin: '0.5rem' }}>
      <SocialIcon url={url} target='_blank' />
    </div>
  )
}

export default Footer
