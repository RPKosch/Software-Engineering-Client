import React, { useState, useEffect } from "react";
import { api, handleError } from "helpers/api";
import User from "models/User";
import {useNavigate, useParams} from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/Login.scss";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";

const FormField = (props) => {
    return (
        <div className="login field">
            <label className="login label">{props.label}</label>
            <div className="login input">
                {props.value}
            </div>
        </div>
    );
};

FormField.propTypes = {
    label: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func,
};

const Profile = () => {
    const [users, setUsers] = useState<User[]>(null);
    const [name, setName] = useState<string>(null);
    const [username, setUsername] = useState<string>(null);
    const [count, setCount] = useState<number>(null)
    const [status, setStatus] = useState<string>("OFFLINE")
    const [birthday, setBirthday] = useState<string>("1.1.2014")
    const [entrydate, setEntrydate] = useState<string>("6.4.2002")
    const [id, setId] = useState<number>(1)
    const navigate = useNavigate();
    let { linkid } = useParams(); // Move useParams hook here

    useEffect(() => {
        const fetchDataprofile = async () => {
            try {
                console.log("CURRENT ID: ", linkid);
                const token = localStorage.getItem("token");
                const response = await api.get(`/users/${linkid}`, {headers: { Authorization: `Bearer ${token}` }});
                const user = new User(response.data);
                console.log("THIS IS THE RETURNED DATA: ", user);
                setUsername(user.username);
                setName(user.name);
                //setStatus(user.status);
                //setBirthday(user.get(birthday));
                //setEntrydate(user.get(entrydate));
                setId(user.id);

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

        fetchDataprofile();
    }, []); // Add id as a dependency to useEffect

    // ... (rest of the component)

    return (
        <BaseContainer>
            <div className="profile container">
                <div className="profile form">
                    <FormField
                        label="Username"
                        value={username}
                    />
                    <FormField
                        label="Password"
                        value={name}
                    />
                    <FormField
                        label="Date"
                        value={entrydate}
                    />
                    <FormField
                        label="Birthday"
                        value={birthday}
                    />
                    <FormField
                        label="Status"
                        value={status}
                    />
                    <FormField
                        label="Id"
                        value={id}
                    />
                    <div className="login button-container" style={{display: 'flex', gap: '20px'}}>
                        <Button
                            width="50%"
                        >
                            Login
                        </Button>
                        <Button
                            width="50%"
                            onClick={() => navigate("/game")}
                        >
                            Back to all Profiles
                        </Button>
                    </div>
                </div>
            </div>
        </BaseContainer>
    );
}

export default Profile