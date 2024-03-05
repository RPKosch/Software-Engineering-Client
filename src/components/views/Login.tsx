import React, { useState, useEffect } from "react";
import { api, handleError } from "helpers/api";
import User from "models/User";
import {useNavigate} from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/Login.scss";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import {compileString} from "sass";
//import Register from "./Register";

/*
It is possible to add multiple components inside a single file,
however be sure not to clutter your files with an endless amount!
As a rule of thumb, use one file per component and only add small,
specific components that belong to the main one in the same file.
 */
const FormField = (props) => {
  return (
    <div className="login field">
      <label className="login label">{props.label}</label>
      <input
        className="login input"
        placeholder="enter here.."
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
      />
    </div>
  );
};

FormField.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
};

const FormFieldPassword = (props) => {
  return (
      <div className="login field">
        <label className="login label">{props.label}</label>
        <input
            type = "password"
            className="login input"
            placeholder="enter here.."
            value={props.value}
            onChange={(e) => props.onChange(e.target.value)}
        />
      </div>
  );
};

FormFieldPassword.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
};

const Login = () => {
    // use react-router-dom's hook to access navigation, more info: https://reactrouter.com/en/main/hooks/use-navigate


    // define a state variable (using the state hook).
    // if this variable changes, the component will re-render, but the variable will
    // keep its value throughout render cycles.
    // a component can have as many state variables as you like.
    // more information can be found under https://react.dev/learn/state-a-components-memory and https://react.dev/reference/react/useState
    const [users, setUsers] = useState<User[]>(null);
    const [name, setName] = useState<string>(null);
    const [username, setUsername] = useState<string>(null);
    //const [count, setCount] = useState<number>(null)
    const [status, setStatus] = useState<string>("OFFLINE")
    const [birthday, setBirthday] = useState<string>("1.1.2014")
    const [entrydate, setEntrydate] = useState<string>("6.4.2002")
    const [id, setId] = useState<number>(1)
    const navigate = useNavigate();
    // the effect hook can be used to react to change in your component.
    // in this case, the effect hook is only run once, the first time the component is mounted
    // this can be achieved by leaving the second argument an empty array.
    // for more information on the effect hook, please see https://react.dev/reference/react/useEffect
      // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
//      async function fetchData() {
    const fetchData = async () => {
        try {
            /*/
          const token = localStorage.getItem("token");
          const userId = localStorage.getItem("id");
          console.log("Token: ", {token})

             */
          const requestBody = JSON.stringify({ username, name});
          console.log("huhuhhuhhuuhhuh", requestBody);
          const response = await api.post('/users/login', requestBody);

          // delays continuous execution of an async operation for 1 second.
          // This is just a fake async call, so that the spinner can be displayed
          // feel free to remove it :)
          const user = new User(response.data);
          console.log("THIS IS THE RETURNED DATA: ", user);


          if(!response.data) {
              console.log("This USER ISSS EEEMPPPTYYYYY");
          }else {
              console.log("Lets goooo. User login successful!!!");
              localStorage.setItem("token", user.token);
              localStorage.setItem("id", user.id);

              // Login successfully worked --> navigate to the route /game in the GameRouter
              navigate("/game");
          }

          // Get the returned users and update the state.
          //setUsers(response.data);

          // This is just some data for you to see what is available.
          // Feel free to remove it.
          console.log("request to:", response.request.responseURL);
          console.log("status code:", response.status);
          console.log("status text:", response.statusText);
          console.log("requested data:", response.data);

          // See here to get more data.
          console.log("Response:    ", response);
          if (response.name !== name || response.username !== username){
            console.log("ERROR_SELF Password or Username is Incorrect!");
          } else {
              navigate("logindumacher");
          }

        } catch (error) {
          console.error(
              `Something went wrong while fetching the users: \n${handleError(
                  error
              )}`
          );
          console.error("Details:", error);
          alert(
              "Something went wrong while fetching the users! See the console for details.");
        }
    };

    const LoginFunc = () => {
        fetchData();
    };

/*/  useEffect(() => {
    document.title = `U Clicked ${count} times`;
  }, [count]);
/*/
  return (
      <BaseContainer>
        <div className="login container">
          <div className="login form">
            <FormField
                label="Username"
                value={username}
                onChange={(un: string) => setUsername(un)}
            />
            <FormFieldPassword
                label="Password"
                value={name}
                onChange={(n) => setName(n)}
            />
            <div className="login button-container" style={{display: 'flex', gap: '20px'}}>
              <Button
                  disabled={!username || !name}
                  width="50%"
                  onClick={() => LoginFunc()}
              >
                Login
              </Button>
              <Button
                  width="50%"
                  onClick={() => navigate("/register")}
              >
                Create New Account
              </Button>
{/*              <Button width="50%" onClick={() => setCount(count + 1)}>
                (Count: {count})
              </Button>*/}
            </div>
          </div>
        </div>
      </BaseContainer>
  );
};


/**
 * You can get access to the history object's properties via the useLocation, useNavigate, useParams, ... hooks.
 */
export default Login;
