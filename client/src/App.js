import React, { Fragment } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
// Redux
import { Provider } from 'react-redux';
import store from './store';

import './App.css';

const App = () => {
    return (
        <Provider store={store}>
            <Router>
                <Fragment>
                    <Navbar />
                    <Route exact path="/">
                        <Landing></Landing>
                    </Route>
                    <section className="container">
                        <Switch>
                            <Route exact path="/register">
                                <Register></Register>
                            </Route>
                            <Route exact path="/login">
                                <Login></Login>
                            </Route>
                        </Switch>
                    </section>
                </Fragment>
            </Router>
        </Provider>
    );
};

export default App;
