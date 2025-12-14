import { createBrowserRouter } from 'react-router-dom'
import App from '../App'
import Home from '../pages/home/Home'
import LoginPage from '../pages/auth/LoginPage'
import RegisterPage from '../pages/auth/RegisterPage'
import OnboardingPage from '../pages/onboarding/OnboardingPage'
import TransactionsPage from '../pages/transactions/TransactionsPage'
import CategoriesPage from '../pages/categories/CategoriesPage'
import WalletPage from '../pages/wallet/WalletPage'
import ProfilePage from '../pages/profile/ProfilePage'
import ChildrenPage from '../pages/children/ChildrenPage'
import ChildDetailPage from '../pages/children/ChildDetailPage'
import DefineTaskPage from '../pages/children/DefineTaskPage'
import MessagesPage from '../pages/messages/MessagesPage'
import ProtectedRoute from './ProtectedRoute'
import MainLayout from '../components/MainLayout'

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <App />
    ),
    children: [
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <MainLayout />,
            children: [
              {
                index: true,
                element: <Home />,
              },
              {
                path: 'transactions',
                element: <TransactionsPage />,
              },
              {
                path: 'categories',
                element: <CategoriesPage />,
              },
              {
                path: 'wallet',
                element: <WalletPage />,
              },
              {
                path: 'profile',
                element: <ProfilePage />,
              },
              {
                path: 'children',
                element: <ChildrenPage />,
              },
              {
                path: 'children/:id',
                element: <ChildDetailPage />,
              },
              {
                path: 'children/:id/define-task',
                element: <DefineTaskPage />,
              },
              {
                path: 'messages',
                element: <MessagesPage />,
              },
            ],
          },
        ],
      },
      {
        path: 'onboarding',
        element: <OnboardingPage />,
      },
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'register',
        element: <RegisterPage />,
      },
    ],
  },
])


