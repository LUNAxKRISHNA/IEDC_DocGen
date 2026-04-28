import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import TemplateEditor from "./pages/TemplateEditor";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/template/:name" element={<TemplateEditor />} />
      </Routes>
    </BrowserRouter>
  );
}
