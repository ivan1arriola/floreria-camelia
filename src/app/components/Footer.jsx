import React from 'react'
import { SocialIcon } from 'react-social-icons'
import style from './styles/Footer.module.css'
import Link from 'next/link'

const Footer = () => {
  return (
    <footer className={style.container}>
      <div className='social-icons'>
        <SocialIcon url='https://www.instagram.com/floreriacameliauy/' target='_blank' />
        <SocialIcon url='https://www.facebook.com/floreriacameliauy/' target='_blank' />
        <SocialIcon url='https://api.whatsapp.com/send/?phone=59899084029' target='_blank' />
      </div>
      <div className='mobile-number'>
        <Link href='tel:59899084029'>
          +598 99 084 029
        </Link>
      </div>
      <div className='copyright'>
        <p>Copyright © 2023 Florería Camelia</p>
      </div>
    </footer>
  )
}

export default Footer
