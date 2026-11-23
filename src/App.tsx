import { BrowserRouter, Routes, Route } from 'react-router-dom'
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
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
