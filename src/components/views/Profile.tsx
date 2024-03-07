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
//                placeholder="Undefined"
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
    const [status, setStatus] = useState(null)
    let { profile_id } = useParams();
    const id = localStorage.getItem("id");
    const [canuseredit, setCanUserEdit] = useState(null);
    const [iseditbuttonon, setIsEditButtonOn] = useState(null);

    useEffect(() => {
        const fetchDataProfile = async () => {
            try {
                console.log("----------------------------------")
                console.log("PROFILE ID:", profile_id);
                const response = await api.get(`/users/${profile_id}`);
                console.log("I BIIIIMMMMMMMS:", response.data)
                // Get the returned user and update a new object.
                const user = new User(response.data);
                setCanUserEdit(id === profile_id);
                console.log("-------------------------------", response);
                setUsername(user.username);
                setBirthday(user.birthday);
                setEntrydate(user.entrydate);
                setStatus(user.status);
            } catch (error) {
                alert(
                    `Something went wrong while fetching the users: \n${handleError(
                        error
                    )}`
                );
            }
        };

        fetchDataProfile();
    }, []); // Add id as a dependency to useEffect

    const UpdateUser = async () => {
        setIsEditButtonOn(false);
        try {
            const token = localStorage.getItem("token");
            console.log("HUuUuuhhhhuhuhuhuhuh :::::::: Birthday:", birthday);
            const requestBody = JSON.stringify({username, birthday, id});
            // Use backticks for template literals to correctly interpolate self_id
            console.log("Request Body: ", requestBody);
            const response = await api.put(`/users/${id}`, requestBody, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log("Thats response.data", response.data);
            console.log("thats the response:", response);
            console.log("----------------------");
            console.log("TOKEN:", localStorage.getItem("token"));
            if(response.status === 204){
                localStorage.setItem("username", username);
                console.log("THIS SHOULD WORK");
            }
            // Handle the response, update UI, or perform any other actions as needed
            console.log("User updated successfully:", response.data);
        } catch (error) {
            console.log("---------------------birthday", localStorage.getItem("birthday"));
            setBirthday(localStorage.getItem("birthday"));
            setUsername(localStorage.getItem("username"));
            alert(
                `Something went wrong while updating the user: \n${handleError(error)}`
            );
        }
    };

    const updateBirthday = async (n) => {
        const parsedDate = new Date(n);
        // Check if the parsed date is a valid date and it's not NaN
        if (!isNaN(parsedDate.getTime())) {
            localStorage.setItem("birthday", n);
            setBirthday(n);
        } else {
            setBirthday(n);
            if(birthday === ""){
                setBirthday(null);
            }
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
                            onChange={(n) => updateBirthday(n)}
                        />
                    ) : (
                        <FormField
                            label="Birthday"
                            value={birthday}
                        />
                    )}
                    <FormField
                        label="Entrydate"
                        value={entrydate}

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