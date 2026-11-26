import { BrowserRouter, Link, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import LandingPage from './pages/LandingPage'
import DirectoryPage from './pages/DirectoryPage'
import MatchPage from './pages/MatchPage'
import DashboardPage from './pages/DashboardPage'
import RegisterPage from './pages/RegisterPage'
import CompanyDetailPage from './pages/CompanyDetailPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<LandingPage />} />
          <Route path="directory" element={<DirectoryPage />} />
          <Route path="directory/:id" element={<CompanyDetailPage />} />
          <Route path="match" element={<MatchPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="*" element={
            <section className="mx-auto max-w-lg px-4 py-16 text-center">
              <h1 className="text-2xl font-bold text-gray-900">Page unavailable</h1>
              <p className="mt-2 text-gray-600">The address does not point to a MatchOS page.</p>
              <Link to="/" className="mt-5 inline-block text-tgpu-blue underline">Return home</Link>
            </section>
          } />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
