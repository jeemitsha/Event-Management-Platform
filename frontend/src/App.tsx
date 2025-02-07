import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { EventProvider } from './context/EventContext';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import ProtectedRoute from './components/auth/ProtectedRoute';
import EventList from './components/events/EventList';
import EventForm from './components/events/EventForm';
import EventDetails from './components/events/EventDetails';
import Navbar from './components/layout/Navbar';
import { useNavigate } from 'react-router-dom';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AuthProvider>
        <EventProvider>
          <Router>
            <Navbar />
            <main className="container mx-auto px-4 py-8">
              <Routes>
                {/* Public routes */}
                <Route path="/login" element={<LoginForm />} />
                <Route path="/register" element={<RegisterForm />} />

                {/* Protected routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <EventList />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/events/new"
                  element={
                    <ProtectedRoute>
                      <EventForm 
                        onSuccess={() => window.location.href = '/dashboard'} 
                        onCancel={() => window.location.href = '/dashboard'} 
                      />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/events/:id"
                  element={
                    <ProtectedRoute>
                      <EventDetailsWrapper />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/events/:id/edit"
                  element={
                    <ProtectedRoute>
                      <EventForm 
                        isEditing={true}
                        onSuccess={() => window.location.href = '/dashboard'} 
                        onCancel={() => window.location.href = '/dashboard'} 
                      />
                    </ProtectedRoute>
                  }
                />

                {/* Redirect root to login if not authenticated */}
                <Route
                  path="/"
                  element={<Navigate to="/login" replace />}
                />
              </Routes>
            </main>
          </Router>
        </EventProvider>
      </AuthProvider>
    </div>
  );
}

// Wrapper component to handle eventId and onClose props
function EventDetailsWrapper() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <EventDetails 
      eventId={id} 
      onClose={() => navigate('/dashboard')} 
    />
  );
}

export default App;
