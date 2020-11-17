import './App.css';
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import Header from './components/Header/Header';
import Login from './Screens/Login/Login';
import MyAccountRecords from './Screens/MyAccountRecords/MyAccountRecords';
import Transactions from './Screens/Transactions/Transactions';
import ParticularUser from './Screens/ParticularUser/ParticularUser';
import AllUsers from './Screens/AllUser/AllUser';
import { useEffect, useState } from 'react';
import * as Authaction from './server/Server';

const App = () => {
  const role = localStorage.getItem('role');
  const token = localStorage.getItem('token');
  const [data, setData] = useState({token:token, role:role});

  useEffect(() => {
    const data = Authaction.authCheckState();
    setData(data)
  },[])

  let routes = (
    <>
      <Route path="/login" component={() => <Login />} />
      <Redirect to="/login" />
    </>
  );
  if (data.token && data.role === 'ROLE_CUSTOMER') {
    routes = (
      <>
        <Header role={data.role} />
        <Route path="/transaction" >
          <Transactions />
        </Route>
        <Route path="/myAccountRecords">
          <MyAccountRecords />
        </Route>
        <Route exact path="/" render={() => (<Redirect to="/myAccountRecords" />)} />
      </>
    );
  }

  if (data.token && data.role === 'ROLE_BANKER') {
    routes = (
      <>
        <Header role={data.role} />
        <Route path="/allUser" >
          <AllUsers />
        </Route>
        <Route exact path="/particularUser/:id">
          <ParticularUser />
        </Route>
        <Route exact path="/" render={() => (<Redirect to="/allUser" />)} />
      </>
    );
  }
  return (
    <Router>
      {routes}
    </Router>
  );
}

export default App;
