import Catalog from './pages/catalog.tsx'
import StoreNavigation from './pages/store-navigation.tsx'
import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom';
import Category from './pages/category.tsx';
import Admin from './pages/admin.tsx';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Catalog />} />
      <Route path="navigation" element={<StoreNavigation />} />
      <Route path="/category/:name" element={<Category />} />
      <Route path="/admin" element={<Admin />} />
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
