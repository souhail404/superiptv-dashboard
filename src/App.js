import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./pages/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Servers from "./pages/server/Servers";
import EditServer from "./pages/server/EditServer";
import AddServer from "./pages/server/AddServer";
import ServerDetails from "./pages/server/ServerDetails";
import Clients from "./pages/client/Clients";
import EditClient from "./pages/client/EditClient";
import AddClient from "./pages/client/AddClient";
import ClientDetails from "./pages/client/ClientDetails";
import NoPage from "./pages/Nopage";
import Codes from "./pages/codes/Codes";
import AddCode from "./pages/codes/AddCode";
import EditCode from "./pages/codes/EditCode";
import CodeDetails from "./pages/codes/CodeDetails";
import Panels from "./pages/panels/Panels";
import AddPanel from "./pages/panels/AddPanel";
import EditPanel from "./pages/panels/EditPanel";
import PanelDetails from "./pages/panels/PanelDetails";
import ServersOrders from "./pages/orders/ServersOrders";
import CodesOrders from "./pages/orders/CodesOrders";
import PanelsOrders from "./pages/orders/PanelsOrders";
import Links from "./pages/link/Links";
import AddLink from "./pages/link/AddLink";
import EditLink from "./pages/link/EditLink";
import Profile from "./pages/Profile";

// dependencies
import { jwtDecode }  from 'jwt-decode';
import { useEffect } from "react";
import { useLogout } from "./hooks/useLogout";
import { useAuthContext } from "./hooks/useAuthContext";
import { ToastContainer } from 'react-toastify';

 

function App() {
  const { user } = useAuthContext()
  const { logout } = useLogout()

  const isTokenExpired = () => {
    const userP = JSON.parse(user)
    if (!userP?.token) {
        console.log('here');
        return true;
    }

    try {
        const decodedToken = jwtDecode(userP?.token);
        const currentTime = Date.now() / 1000;
        return decodedToken.exp < currentTime;
    } catch (error) {
        return true;
    }
  };

  useEffect(() => {
    if (isTokenExpired()) {
        logout();
    }
  }, []);

  return (
    <div id="app">
       <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={user==null ? <Login /> :<Home />} />
              <Route path="profile" element={user==null ? <Login /> :<Profile />} />
              <Route path="orders" >
                <Route index element={user==null ? <Login /> :<ServersOrders />} />
                <Route path="servers" element={user==null ? <Login /> :<ServersOrders />} />
                <Route path="codes" element={user==null ? <Login /> :<CodesOrders />} />
                <Route path="panels" element={user==null ? <Login /> :<PanelsOrders />} />
              </Route>
              <Route path="servers" >
                <Route index element={user==null ? <Login /> :<Servers />} />
                <Route path="add" element={user==null ? <Login /> :<AddServer />} />
                <Route path=":productId/edit" element={user==null ? <Login /> :<EditServer />} />
                <Route path=":productId/details" element={user==null ? <Login /> :<ServerDetails />} />
              </Route>
              <Route path="codes" >
                <Route index element={user==null ? <Login /> :<Codes />} />
                <Route path="add" element={user==null ? <Login /> :<AddCode />} />
                <Route path=":productId/edit" element={user==null ? <Login /> :<EditCode />} />
                <Route path=":productId/details" element={user==null ? <Login /> :<CodeDetails />} />
              </Route>
              <Route path="panels" >
                <Route index element={user==null ? <Login /> :<Panels />} />
                <Route path="add" element={user==null ? <Login /> :<AddPanel />} />
                <Route path=":productId/edit" element={user==null ? <Login /> :<EditPanel />} />
                <Route path=":productId/details" element={user==null ? <Login /> :<PanelDetails />} />
              </Route>
              <Route path="client" >
                <Route index element={user==null ? <Login /> :<Clients />} />
                <Route path="add" element={user==null ? <Login /> :<AddClient />} />
                <Route path=":clientId/edit" element={user==null ? <Login /> :<EditClient />} />
                <Route path=":clientId/details" element={user==null ? <Login /> :<ClientDetails />} />
              </Route>
              <Route path="link" >
                <Route index element={user==null ? <Login /> :<Links />} />
                <Route path="add" element={user==null ? <Login /> :<AddLink />} />
                <Route path=":linkId/edit" element={user==null ? <Login /> :<EditLink />} />
              </Route>
              <Route path="login" element={user==null ? <Login /> :<Login />} />
              <Route path="*" element={<NoPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
        <ToastContainer />
    </div>
  );
}

export default App;
