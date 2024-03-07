import React, {useEffect, useState} from "react";
import {api, handleError} from "helpers/api";
import {Spinner} from "components/ui/Spinner";
import {Button} from "components/ui/Button";
import {useNavigate} from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Game.scss";
import {User} from "types";

const Player = ({user}: { user: User }) => (
    <div className="player container" style={{display: 'flex', gap: '20px' }}>
      <div className="player username">{user.username}</div>
      <div className="player status">{user.status}</div>
      <div className="player id">id: {user.id}</div>
    </div>
);


//     <div className="player name">{user.name}</div>
//     <div className="player id">id: {user.id}</div>

Player.propTypes = {
  user: PropTypes.object,
};

const Game = () => {
    // use react-router-dom's hook to access navigation, more info: https://reactrouter.com/en/main/hooks/use-navigate
    const navigate = useNavigate();

    // define a state variable (using the state hook).
    // if this variable changes, the component will re-render, but the variable will
    // keep its value throughout render cycles.
    // a component can have as many state variables as you like.
    // more information can be found under https://react.dev/learn/state-a-components-memory and https://react.dev/reference/react/useState
    const [users, setUsers] = useState<User[]>(null);

    const logout = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/login");
                return;
            }
            const id = localStorage.getItem("id");
            const response = await api.post(`/userslogout/${id}`, {headers: {Authorization: `Bearer ${token}`}});

            // Check if the logout was successful based on the response status
            if (response.status === 200) {
                localStorage.removeItem("token");
                console.log("YEEESSSSSSSS");
                navigate("/login");
            } else {
                console.error("Logout failed:", response);
                console.log("ELLLLSEEEEE");
            }
        } catch (error) {
            localStorage.removeItem("token");
            localStorage.removeItem("id");
            navigate("/login")
            console.error("Error during logout:", error);
        }
    };

    // the effect hook can be used to react to change in your component.
    // in this case, the effect hook is only run once, the first time the component is mounted
    // this can be achieved by leaving the second argument an empty array.
    // for more information on the effect hook, please see https://react.dev/reference/react/useEffect
    useEffect(() => {
        // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
        async function fetchData() {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    navigate("/login");
                    return;
                }
                const response = await api.get("/users", {headers: {Authorization: `Bearer ${token}`}});

                // delays continuous execution of an async operation for 1 second.
                // This is just a fake async call, so that the spinner can be displayed
                // feel free to remove it :)
                await new Promise((resolve) => setTimeout(resolve, 1000));
                if (response.data === "") {
                    localStorage.removeItem("token");
                    navigate("/login");
                }

                // Get the returned users and update the state.
                setUsers(response.data);


                // This is just some data for you to see what is available.
                // Feel free to remove it.
                console.log("request to:", response.request.responseURL);
                console.log("status code:", response.status);
                console.log("status text:", response.statusText);
                console.log("requested data:", response.data);

                // See here to get more data.
                console.log(response);
            } catch (error) {
                alert(
                    `Something went wrong while fetching the users: \n${handleError(
                        error
                    )}`
                );
                localStorage.removeItem("token");
                navigate("/login");
            }
        }

        fetchData();
    }, []);

    let content = <Spinner/>;

    let content1;

    if (Array.isArray(users)) {
        content1 = (
            <div className="game">
                <ul className="game user-list">
                    {users.map((user: User) => (
                        <li key={user.id} onClick={() => navigate("/profile/" + user.id)}>
                            <Player user={user}/>
                        </li>
                    ))}
                </ul>
                <Button width="100%" onClick={() => logout()}>
                    Logout
                </Button>
            </div>
        );
    } else {
        // Handle the case when users is not an array (e.g., set content to a loading state or an error message)
        content1 = <p>Error: Users data is not in the expected format.</p>;
    }

    return (
        <BaseContainer className="game container">
            <h2>Happy Coding!</h2>
            <p className="game paragraph">
                Get all users from secure endpoint:
            </p>
            {content}
        </BaseContainer>
    );
}
export default Game;

