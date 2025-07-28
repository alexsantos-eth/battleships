import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { AuthProvider } from "@/components/auth/AuthProvider";
import { UserProfilePanel } from "@/components/ui/UserProfilePanel";
import { Navigation } from "@/components/layouts/Navigation";
import { FloatingProfileButton } from "@/components/ui/FloatingProfileButton";
import { FloatingLogoutButton } from "@/components/ui/FloatingLogoutButton";
import { AuthDebug } from "@/components/debug/AuthDebug";
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
