import React from "react";
import { Switch, Route } from "react-router-dom";
import "antd/dist/antd.css";
import "bootstrap/dist/css/bootstrap.min.css";

import Profile from "./pages/Profile";
import Home from "./pages/Home";
import useFirebaseAuth from "./hooks/useFirebaseAuth";
import routes from "./utils/routes";
import Dashboard from "./pages/Dashboard";
import ShopItem from "./pages/ShopItem";
import Cart from "./pages/Cart";
import OrderConfirmation from "./pages/OrderConfirmation";
import Orders from "./pages/Orders";

function App() {
  useFirebaseAuth();

  return (
    <>
      <Switch>
        <Route path={routes.home} exact>
          <Home />
        </Route>
        <Route path={routes.profile}>
          <Profile />
        </Route>
        <Route path={routes.shopItemID}>
          <ShopItem />
        </Route>
        <Route path={routes.dashboard}>
          <Dashboard />
        </Route>
        <Route path={routes.cart}>
          <Cart />
        </Route>
        <Route path={routes.orderConfirmation}>
          <OrderConfirmation />
        </Route>
        <Route path={routes.orders}>
          <Orders />
        </Route>
      </Switch>
    </>
  );
}

export default App;
