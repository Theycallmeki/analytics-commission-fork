import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import About from "./pages/About";
import Insights from "./pages/Insights";
// ❌ REMOVE THIS
// import Recommendations from "./pages/Recommendations";

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
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/about" element={<About />} />

          {/* ✅ ONLY THIS */}
          <Route path="/insights" element={<Insights />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}