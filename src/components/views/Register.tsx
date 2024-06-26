import React, { useState } from "react";
import { api, handleError } from "helpers/api";
import User from "models/User";
import {useNavigate} from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/Login.scss";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";

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
    const navigate = useNavigate();
    const [name, setName] = useState<string>(null);
    const [username, setUsername] = useState<string>(null);

    const doRegister = async () => {
        try {
            const requestBody = JSON.stringify({ name, username });
            const response = await api.post("/users", requestBody);

            // I wanted to use a header for the Token but it does not work
            // and I do not understand why.
            // Therefore Token implementation with body

            const user = new User(response.data);
            console.log("------------------------------");
            console.log("request to Register:", response.request.responseURL);
            console.log("Created User: ", response.data);
            console.log("THIS Response:", response)
            console.log("TOKEN in FIle:", response.headers.authorization);
            const token = response.headers["authorization"];
            console.log("Token: ", token);
            console.log("------------------------------");

            // Store the id, token and username local. username for changing it to last valid value
            localStorage.setItem("token", token);
            localStorage.setItem("id", user.id);
            localStorage.setItem("username", username)

            // Login successfully worked --> navigate to the route /game in the GameRouter
            navigate("/game");
        } catch (error) {
            alert(
                `Something went wrong during the register: \n${handleError(error)}`
            );
        }
    };

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
                    <div className="login button-container" style={{display: 'flex', gap: '20px' }}>
                        <Button
                            disabled={!username || !name}
                            width="50%"
                            onClick={() => doRegister()}
                        >
                            Register Now
                        </Button>
                        <Button
                            width="50%"
                            onClick={() => navigate("/Login")}
                        >
                            Back to Login
                        </Button>
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