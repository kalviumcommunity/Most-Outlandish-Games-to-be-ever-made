import './App.css'
import { BrowserRouter } from 'react-router-dom'
import AllRoutes from './AllRoutes'
import Navbar from './components/Navbar'

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="app-content">
        <AllRoutes/>
      </div>
    </BrowserRouter>
  )
}

export default App