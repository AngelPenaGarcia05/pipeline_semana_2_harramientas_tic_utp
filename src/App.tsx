import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { StoreProvider } from './context/StoreContext'
import Layout from './components/layout/Layout'
import StorePage from './pages/StorePage'
import InventoryPage from './pages/InventoryPage'
import SalesPage from './pages/SalesPage'
import ToastViewport from './components/ui/ToastViewport'

export default function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<StorePage />} />
            <Route path="/inventario" element={<InventoryPage />} />
            <Route path="/ventas" element={<SalesPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <ToastViewport />
    </StoreProvider>
  )
}