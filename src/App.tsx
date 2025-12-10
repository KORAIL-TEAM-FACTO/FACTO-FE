import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Phone from './pages/Phone'
import MyPage from './pages/MyPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/phone" element={<Phone />} />
        <Route path="/mypage" element={<MyPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
