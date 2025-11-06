import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/AdminDashboard'; // You will create next
import PrivateRoute from './components/PrivateRoute';
import OrphanList from './pages/OrphanList';
import AdoptionRequest from './pages/AdoptionRequest';
import Contact from './pages/Contact';
import Orphans from './pages/Orphans';
import AddOrphan from './pages/AddOrphan';


function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/orphans" element={<OrphanList />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/adopt/:orphanId" element={<AdoptionRequest />} />
        <Route path="/orphans" element={<Orphans />} />
        <Route path="/admin/add-orphan" element={<AddOrphan />} />

        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
