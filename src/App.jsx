import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import About from "./pages/About";

export default function App() {
  return (
    <BrowserRouter>
      <Sidebar />
      <div style={{
        marginLeft: "220px",
        minHeight: "100vh",
        background: "#080c14",
        flex: 1,
        minWidth: 0,
      }}>
        <Routes>
          <Route path="/"          element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/about"     element={<About />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}