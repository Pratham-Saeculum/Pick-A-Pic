import { Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './page/home'
import Detail from './page/detail'

function App() {

  return (
   
    <>
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/details/:id" element={<Detail/>} />
    </Routes>
    </>
  )
}

export default App
