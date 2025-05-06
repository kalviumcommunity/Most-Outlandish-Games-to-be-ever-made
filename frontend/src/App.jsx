import './App.css'
import { BrowserRouter } from 'react-router-dom'
import AllRoutes from './AllRoutes'
import Navbar from './components/Navbar'
import styles from './components/Navbar.module.css'

function App() {

  return (
    <BrowserRouter>
      <Navbar />
      <div className={styles.content}>
        <AllRoutes/>
      </div>
    </BrowserRouter>
  )
}

export default App