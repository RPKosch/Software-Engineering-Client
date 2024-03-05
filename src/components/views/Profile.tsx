import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { Button } from "components/ui/Button";
import { useNavigate, useParams } from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Profile.scss";
import User from "models/User"

const FormField = (props) => {
    return (
        <div className="login field">
            <label className="login label">{props.label}</label>
            <label className="login labelprofiletext">
                {props.value}
            </label>
        </div>
    );
};

FormField.propTypes = {
    label: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func,
};

const EditField = (props) => {
    return (
        <div className="login field">
            <label className="login label">{props.label}</label>
            <input
                className="login labelprofileedit"
                placeholder="Undefined"
                value={props.value}
                onChange={(e) => props.onChange(e.target.value)}
            />
        </div>
    );
};

EditField.propTypes = {
    label: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func,
};

const Profile = () => {
    const navigate = useNavigate()
    const [username, setUsername] = useState(null);
    const [entrydate, setEntrydate] = useState(null)
    const [birthday, setBirthday] = useState(null)
    const [name, setName] = useState(null)
    const [status, setStatus] = useState(null)
    let { profile_id } = useParams();
    const id = localStorage.getItem("id");
    const [canuseredit, setCanUserEdit] = useState(null);
    const [iseditbuttonon, setIsEditButtonOn] = useState(null);

    useEffect(() => {
        const fetchDataProfile = async () => {
            try {
                const response = await api.get(`/users/${profile_id}`);
                console.log("I BIIIIMMMMMMMS:", response.data)
                // Get the returned user and update a new object.
                const user = new User(response.data);
                setCanUserEdit(id === profile_id);
                console.log("-------------------------------", canuseredit);
                setUsername(user.username);
                setEntrydate(user.entrydate);
                setStatus(user.status);
                setName(user.name);
                setBirthday(user.birthday)
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

        fetchDataProfile();
    }, []); // Add id as a dependency to useEffect

    const UpdateUser = async () => {
        setIsEditButtonOn(false);
        try {
            const token = localStorage.getItem("token");
            const requestBody = JSON.stringify({ name, username, birthday, entrydate, status, id});

            // Use backticks for template literals to correctly interpolate self_id
            const response = await api.put(`/users/${id}`, requestBody, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Handle the response, update UI, or perform any other actions as needed
            console.log("User updated successfully:", response.data);
        } catch (error) {
            console.error(
                `Something went wrong while updating the user: \n${handleError(error)}`
            );
            console.error("Details:", error);
            alert("Something went wrong while updating the user! See the console for details.");
        }
    };

    return (
        <BaseContainer>
            <div className="profile container">
                <div className="profile form">
                    {canuseredit && iseditbuttonon ? (
                        <EditField
                            label="Username"
                            value={username}
                            onChange={(n) => setUsername(n)}
                        />
                    ) : (
                        <FormField
                            label="Username"
                            value={username}
                        />
                    )}
                    {canuseredit && iseditbuttonon ? (
                        <EditField
                            label="Birthday"
                            value={birthday}
                            onChange={(n) => setBirthday(n)}
                        />
                    ) : (
                        <FormField
                            label="Birthday"
                            value={birthday || "Undefined"}
                        />
                    )}
                    <FormField
                        label="Entrydate"
                        value={entrydate || "Undefined"}

                    />
                    <FormField
                        label="Status"
                        value={status}
                    />
                    <div className="login button-container" style={{display: 'flex', gap: '20px'}}>
                        {iseditbuttonon ? (
                            <Button
                                width="50%"
                                disabled={ id !== profile_id }
                                onClick={() => UpdateUser()}
                            >
                                Save
                            </Button>
                        ) : (
                            <Button
                                width="50%"
                                disabled={ id !== profile_id }
                                onClick={() => setIsEditButtonOn(true)}
                            >
                                Edit
                            </Button>
                        )}
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

/**
 * You can get access to the history object's properties via the useLocation, useNavigate, useParams, ... hooks.
 */
export default Profile;