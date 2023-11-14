import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { About } from "./pages";
import { NotFound } from "./pages";

export const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};
