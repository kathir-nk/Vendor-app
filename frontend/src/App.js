import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginLayout from './Layout/loginLayout/loginLayout.jsx';
import StoresStartLayout from './Layout/storeStartLayout/storeStartLayout';
import LoginForm from './Components/logincards/loginform/loginform';
import VerifyOtp from './Components/logincards/verifyOTP/verifyOtp';
import Stores from './Components/logincards/stores/stores';
import LoginStart from './Components/logincards/loginStart/loginStart';
import StoreCreateLayout from './Layout/storeCreateLayout/storeCreateLayout.jsx';
import ContactForm from './Components/storeStart/contactForm/contactForm';
import GetContactids from './Components/storeStart/oncontactsubmit/getContact';
import StoreInfo from './Components/storeCreate/storeinfo/storeinfo';
import StoreDoc from './Components/storeCreate/storedoc/storedoc';
import StoreAgree from './Components/storeCreate/storeagree/storeagree';
import HomeLayout from './Layout/homelayout/homeLayout';
import DashBoardLayout from './Layout/dashboardlayout/dashboardLayout';
import 'bootstrap/dist/css/bootstrap.min.css';
import api from './utils/apiinstance';
import { GET_USER_PROFILE } from './utils/api';
import { useDispatch } from 'react-redux';
import { setUser } from './utils/userSlice';
import { useEffect } from 'react';
import ProfileLayout from './Layout/profilelayout/profileLayout';
import ProfileDetail from './Components/profile/profileDetail/profileDetail';
import ProfileShopDetail from './Components/profile/shopDetail/shopDetail';
import LogOut from './Components/profile/logout/logOut';
import Wallet from './Components/profile/wallet/wallet';
import ProfileAbout from './Components/profile/aboutrewar/aboutrewardify';
import ProductLayout from './Layout/productLayout/productLayout';
import ProductListing from './Components/products/productlisting/productlisting';
import AddProduct from './Components/products/addproduct/addproduct';
import NotFound from './Layout/notauthorizedLayout/notFound';
import OrderLayout from './Layout/ordersLayout/orderLayout';
import ConfirmOrders from './Components/orders/confirm/confirmorder';
import PrepareOrders from './Components/orders/prepare/prepareOrder';
import PackOrder from './Components/orders/pack/pack';
import CompleteOrder from './Components/orders/complete/complete';
import Settlement from './Components/payment/settlement/settlement';

function App() {
  const dispatch = useDispatch();

  // ==========================================
  // FIXED: Proper token check
  // ==========================================
  const getToken = () => {
    const token = localStorage.getItem('authToken');
    return token && token !== '' && token !== 'null' && token !== 'undefined' ? token : null;
  };

  const getprofile = async () => {
    const token = getToken();
    if (!token) return;

    try {
      const response = await api.get(GET_USER_PROFILE, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      dispatch(setUser(response?.data));
      console.log('✅ Profile loaded:', response?.data);
    } catch (error) {
      console.error('❌ Error fetching profile:', error?.response?.data || error.message);
      // If 401, clear token
      if (error?.response?.status === 401) {
        localStorage.removeItem('authToken');
      }
    }
  };

  useEffect(() => {
    if (getToken()) {
      getprofile();
    }
  }, []);

  // ==========================================
  // FIXED: Proper auth check
  // ==========================================
  const isVerified = () => {
    return getToken() !== null;
  };

  const ProtectedRoute = ({ element }) => {
    return isVerified() ? element : <Navigate to="/" replace />;
  };

  return (
    <div className="App">
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LoginLayout />}>
            <Route index element={<LoginStart />} />
            <Route path="login" element={<LoginForm />} />
            <Route path="verify" element={<VerifyOtp />} />
            <Route path="stores" element={<Stores />} />
          </Route>

          <Route path="storestart" element={<StoresStartLayout />}>
            <Route index element={<ContactForm />} />
            <Route path="contactids" element={<GetContactids />} />
          </Route>

          <Route path="storeCreation" element={<StoreCreateLayout />}>
            <Route index element={<StoreInfo />} />
            <Route path="storedocs" element={<StoreDoc />} />
            <Route path="storeAgeement" element={<StoreAgree />} />
          </Route>

          {/* Protected Routes */}
          <Route path="home" element={<ProtectedRoute element={<HomeLayout />} />}>
            <Route path="/home" element={<DashBoardLayout />}>
              <Route path="prepare" />
              <Route path="pack" />
              <Route path="complete" />
              <Route path="settlement" element={<Settlement />} />
            </Route>
            <Route path="orders" element={<OrderLayout />}>
              <Route index element={<ConfirmOrders />} />
              <Route path="prepare" element={<PrepareOrders />} />
              <Route path="pack" element={<PackOrder />} />
              <Route path="complete" element={<CompleteOrder />} />
            </Route>
            <Route path="products" element={<ProductLayout />}>
              <Route index element={<ProductListing />} />
              <Route path="addproduct" element={<AddProduct />} />
            </Route>
            <Route path="profile" element={<ProfileLayout />}>
              <Route index element={<ProfileDetail />} />
              <Route path="shopdetail" element={<ProfileShopDetail />} />
              <Route path="wallet" element={<Wallet />} />
              <Route path="aboutrewardify" element={<ProfileAbout />} />
              <Route path="logout" element={<LogOut />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;