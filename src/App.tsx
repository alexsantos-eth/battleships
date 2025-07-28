import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { AuthProvider } from "@/components/auth/AuthProvider";
import { Navigation } from "@/components/layouts/Navigation";
import Home from "@/pages/Home";
import Match from "@/pages/Match";
import Playground from "@/pages/Playground";
import UserProfilePage from "@/pages/UserProfile";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/match" element={<Match />} />
          <Route path="/playground" element={<Playground />} />
          <Route path="/profile" element={<UserProfilePage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
