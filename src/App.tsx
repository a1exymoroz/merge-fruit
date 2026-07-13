import { Provider } from 'react-redux';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './auth/AuthProvider';
import { MergeFruitGame, TechStackPage } from './components';
import ProtectedRoute from './components/auth/ProtectedRoute';
import GlobalTechStackLink from './components/ui/GlobalTechStackLink';
import { useDocumentTitle } from './hooks/useDocumentTitle';
import { store } from './store';
import './App.css';

function AppRoutes() {
  useDocumentTitle();

  return (
    <>
      <GlobalTechStackLink />
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MergeFruitGame />
            </ProtectedRoute>
          }
        />
        <Route
          path="/stack"
          element={
            <ProtectedRoute>
              <TechStackPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <BrowserRouter>
          <div className="App">
            <AppRoutes />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </Provider>
  );
}

export default App;
