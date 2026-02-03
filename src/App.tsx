import { Outlet } from 'react-router-dom'
import ScrollToTop from './components/ScrollToTop'
import './App.css'

function App() {
  return (
    <div className="app-layout">
      <ScrollToTop />
      <Outlet />
    </div>
  )
}

export default App
