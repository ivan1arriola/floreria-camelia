import EmailFormCard from './EmailFormCard'
import styles from './styles/Contacto.module.css'

const Contacto = () => {
  return (
    <article>
      <h2>Contacto</h2>
      <div className={styles.container}>

        <div>
          <h3>Teléfono</h3>
          <h4>
            2219 4540 <br />
            Floreria Camelia: 099 084 029 <br />
            Obras Funerarias: 098 863 473
          </h4>
        </div>
        <div>
          <EmailFormCard email='floreriacamelia.uy@gmail.com' />
        </div>
      </div>
    </article>
  )
}

export default Contacto
