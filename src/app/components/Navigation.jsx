import Link from 'next/link'
import styles from './styles/Navigation.module.css'

const Navigation = () => {
  return (
    <>
      <header className={styles.container}>
        <nav>
          <ul>
            <li>
              <Link href='/'>Principal</Link>
            </li>
            <li>
              <Link href='/Floreria'>Floreria</Link>
            </li>
            <li>
              <Link href='/ObrasFunerarias'>Obras Funerarias</Link>
            </li>
          </ul>
        </nav>
      </header>
    </>
  )
}

export default Navigation
