import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import About from "./pages/About";

export default function App() {
  return (
    <BrowserRouter>
      <Sidebar />

      <div style={{ marginLeft: "200px", padding: "20px" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/about" element={<About />} />"
        </Routes>
      </div>
    </BrowserRouter>
  );
}