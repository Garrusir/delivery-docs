import { Switch, Route, Redirect } from 'react-router-dom';
import {CreateOrderPage} from "./pages/CreateOrderPage";
import {ViewOrderListPage} from "./pages/ViewOrderListPage";
import {ViewOrderDetailPage} from "./pages/ViewOrderDetailPage";
import {AuthPage} from "./pages/AuthPage"
import {RegistrationPage} from "./pages/RegistrationPage"
import {EditProfilePage} from "./pages/EditProfilePage";
// import {useAuth} from "./context/AuthContext";


export const useRoutes = (currentUser)=> {
  // const {currentUser} = useAuth();
  // console.log('currentUser routes', currentUser.role);

  if (currentUser && currentUser.role === 'courier') {
    return (
      <Switch>
        <Route path="/orders-open" exact>
          <ViewOrderListPage page="open"/>
        </Route>
        <Route path="/orders-taken" exact>
          <ViewOrderListPage page="taken"/>
        </Route>
        <Route path="/detail/:id">
          <ViewOrderDetailPage />
        </Route>
        <Route path="/profile">
          <EditProfilePage />
        </Route>
        <Redirect to="/orders-open" />
      </Switch>
    )
  }

  if (currentUser && currentUser.role === 'user') {
    return (
      <Switch>
        <Route path="/orders" exact>
          <ViewOrderListPage page="my" />
        </Route>
        <Route path="/create" exact>
          <CreateOrderPage />
        </Route>
        <Route path="/detail/:id">
          <ViewOrderDetailPage />
        </Route>
        <Route path="/profile">
          <EditProfilePage />
        </Route>
        <Redirect to="/create" />
      </Switch>
    )
  }

  return (
    <Switch>
      <Route path="/" exact>
        <AuthPage />
      </Route>
      <Route path="/registration" exact>
        <RegistrationPage />
      </Route>
      <Redirect to="/"/>
    </Switch>
  )
}
