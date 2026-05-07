import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import TemplateEditor from "./pages/TemplateEditor";
import Layout from "./components/Layout";
import { NavbarProvider } from "./context/NavbarContext";

import AuthGuard from "./components/AuthGuard";

export default function App() {
  return (
    <NavbarProvider>
      <BrowserRouter>
        <AuthGuard>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/template/:name" element={<TemplateEditor />} />
            </Route>
          </Routes>
        </AuthGuard>
      </BrowserRouter>
    </NavbarProvider>
  );
}
