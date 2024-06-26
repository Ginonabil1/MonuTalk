import React, { useEffect, useState } from 'react'
import { BrowserRouter, Routes , Route } from 'react-router-dom'
import { SyncLoader } from 'react-spinners'
import Home from './Home'
import Log from './LoginRegister'
import Admin from './Admin1'
import User from './User'
import './App.css'


const App = () => {
  const [Loading , setloading] = useState(false);

  useEffect(() => {
    setloading(true);
    setTimeout(() => {
      setloading(false)
    },1500)
  },[])

  return (
    <BrowserRouter>

      {Loading?
      <div className='loading'>
        <SyncLoader color="white" size={15}/>
      </div> :

      <>

      <Routes>

      <Route path='/' element={<Home />} />
      <Route path='LoginRegister' element={<Log />} />
      <Route path='Admin' element={<Admin />} />
      <Route path='User' element={<User />} />

      </Routes>
      </>
    }
    </BrowserRouter>
  )
}

export default App