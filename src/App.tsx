import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import WelfareSearch from "./pages/WelfareSearch";
import WelfareDetail from "./pages/WelfareDetail";
import Phone from "./pages/Phone";
import MyPage from "./pages/MyPage";
import EditProfile from "./pages/EditProfile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/" element={<Home />} />
        <Route path="/welfare-search" element={<WelfareSearch />} />
        <Route path="/welfare/:serviceId" element={<WelfareDetail />} />
        <Route path="/phone" element={<Phone />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/mypage/edit" element={<EditProfile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
