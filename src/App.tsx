import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import AuthProvider from "@/components/AuthProvider";
import UserProfilePanel from "@/components/UserProfilePanel";
import Navigation from "@/components/Navigation";
import FloatingProfileButton from "@/components/FloatingProfileButton";
import FloatingLogoutButton from "@/components/FloatingLogoutButton";
import AuthDebug from "@/components/AuthDebug";
import Home from "@/pages/Home";
import Match from "@/pages/Match";
import Playground from "@/pages/Playground";
import UserProfilePage from "@/pages/UserProfile";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Navigation />
        <UserProfilePanel />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/match" element={<Match />} />
          <Route path="/playground" element={<Playground />} />
          <Route path="/profile" element={<UserProfilePage />} />
        </Routes>
        <FloatingProfileButton />
        <FloatingLogoutButton />
        <AuthDebug />
      </Router>
    </AuthProvider>
  );
};

export default App;
