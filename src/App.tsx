import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Layout } from './components/layout/Layout';
import { LoginPage } from './app/pages/auth/LoginPage';
import { ProtectedRoute } from './app/pages/auth/ProtectedRoute';
import { DashboardPage } from './app/pages/DashboardPage';
import { ProductsPage } from './app/pages/products';
import { OrdersPage } from './app/pages/orders';
import { ClientsPage } from './app/pages/clients/ClientsPage';
import { CategoriesPage } from './app/pages/categories/CategoriesPage';
import { RoutinesPage } from './app/pages/routines';
import { ReviewsPage } from './app/pages/reviews/ReviewsPage';
import { PromotionsPage } from './app/pages/promotions/PromotionsPage';
import { CouponsPage } from './app/pages/coupons';
import { ProfilePage } from './app/pages/profile/ProfilePage';
import { ProductSectionsPage } from './app/pages/product-sections';
import { HeroSectionsPage } from './app/pages/hero-sections';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Auth Routes */}
          <Route path="/auth/login" element={<LoginPage />} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="routines" element={<RoutinesPage />} />
            <Route path="customers" element={<ClientsPage />} />
            <Route path="categories" element={<CategoriesPage />} />
            <Route path="reviews" element={<ReviewsPage />} />
            <Route path="promotions" element={<PromotionsPage />} />
            <Route path="coupons" element={<CouponsPage />} />
            <Route path="product-sections" element={<ProductSectionsPage />} />
            <Route path="hero-sections" element={<HeroSectionsPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
