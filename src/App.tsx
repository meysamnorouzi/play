import { Outlet } from 'react-router-dom'
import ScrollToTop from './components/ScrollToTop'
import SWUpdateNotification from './components/SWUpdateNotification'
import './App.css'

function App() {
  return (
    <div className="app-layout">
      <ScrollToTop />
      <SWUpdateNotification />
      <Outlet />
    </div>
  )
}

export default App
