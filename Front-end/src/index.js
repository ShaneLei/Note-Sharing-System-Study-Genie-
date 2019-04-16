import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import ReduxPromise from "redux-promise";

import reducers from "./reducers";
import Login from "./components/login";
import NotesLayout from "./components/notes_layout";
import Register from "./components/register";
import PrivateRoute from "./private_route";

import TopBar from "./components/top_bar";
import LeftPanel from "./components/left_panel";
import FeedsLayout from "./components/feeds_layout";
import VisualizeLayout from "./components/visualize_layout";
import GroupsLayout from "./components/groups_layout";
import GroupNotesLayout from "./components/group_notes_layout";


const createStoreWithMiddleware = applyMiddleware(ReduxPromise)(createStore);

const LoginContainer = () => (
  <div className="container">
    <Route path="/register" component={Register} />
    <Route path="/login" component={Login} />
  </div>
);

const DefaultContainer = () => (
  <div className="container">
    <TopBar />
    <LeftPanel />
    <PrivateRoute exact path="/notes"> <NotesLayout /> </PrivateRoute>
    <PrivateRoute exact path="/feeds"> <FeedsLayout /> </PrivateRoute>
    <PrivateRoute exact path="/visualize"> <VisualizeLayout/> </PrivateRoute>
    <PrivateRoute exact path="/groups_overview"> <GroupsLayout /> </PrivateRoute>
    <PrivateRoute exact path="/groups/:groupname"> <GroupNotesLayout /> </PrivateRoute>
    <PrivateRoute exact path="/labels/:labelname"> <NotesLayout /> </PrivateRoute>
  </div>
);

ReactDOM.render(
  <Provider store={createStoreWithMiddleware(reducers)}>
    <BrowserRouter>
      <div>
        <Switch>
          {/* <PrivateRoute exact path="/home">
            <HomeLayout />
          </PrivateRoute> */}
          <Route exact path="/login" component={LoginContainer} />
          <Route exact path="/register" component={LoginContainer} />
          <PrivateRoute><DefaultContainer/></PrivateRoute>
        </Switch>
      </div>
    </BrowserRouter>
  </Provider>,
  document.querySelector(".container-fluid")
);
