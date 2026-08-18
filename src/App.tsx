import { Browsion App() {
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
