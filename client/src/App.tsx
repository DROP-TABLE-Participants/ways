import Catalog from './pages/catalog.tsx'
import StoreNavigation from './pages/store-navigation.tsx'
import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Catalog />} />
      <Route path="navigation" element={<StoreNavigation />} />
    </>
  )
)

function App() {
  return (
    <>
      <RouterProvider router={router}/>
    </>
  )
}

export default App
