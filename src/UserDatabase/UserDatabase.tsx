import { useState, useReducer } from "react";
import styles from './UserDatabase.module.css';

// UI - form, 4btn, 3 input, 1 select, 3 default opt

// use state instead of ref because I need to clear the value instead of read the input.value only
// state - filterValue, firstName, lastName, users

// case
// render
// filter
// delete: select user ->
// create
// update
// cancel
// btn status

const getFullName = ({ firstName, lastName }) =>
    [firstName, lastName].join(" ");

enum ACTION {
    CREATE,
    UPDATE,
    DELETE,
    CANCEL
}

// TODO: change to Map? so that the update would be easier
interface User {
    firstName: string,
    lastName: string
}

function reducer(state: User[], action: { type: ACTION }) {
    switch (action.type) {
        case ACTION.CREATE: {
            action.callbackFn();
            return [...state, action.user];
        }
        case ACTION.UPDATE: {
            return [...state.map(user => getFullName(user) === action.oriUser ? action.newUser : user)];
        }
        case ACTION.DELETE: {
            action.callbackFn();
            return [...state.filter((user) => action.user !== getFullName(user))]
        }
    }
    throw Error('Unknown action: ' + action.type);
}


const UserDatabase = () => {
    // TODO: reason to use useReducer - aggregate actions in a single and dedicate place for better maintainancing, trade-off: pass call back to clean up inputs
    const [users, dispatch] = useReducer<User[], string>(reducer, [
        { firstName: "Hans", lastName: "Emil" },
        { firstName: "Max", lastName: "Mustermann" },
        { firstName: "Roman", lastName: "Tisch" },
    ]);

    // TODO: state or ref? reason to use state: I need to clear the value which affect on UI
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [selectedUser, setSelectedUser] = useState<string>();

    // TODO: how to define the type for input onChange event and function
    const handleInputChange = (e, setter) => {
        console.debug(e.target.value);
        setter(e.target.value);
    };
    const clearNameInputs = () => {
        setFirstName('');
        setLastName('')
    }

    const clearSelectedUser = () => setSelectedUser('')

    const isCreateDisabled = !firstName || !lastName || selectedUser;
    const isUpdateDisabled = !firstName || !lastName || !selectedUser;

    return (
        // TODO: form or div? reason to use div: no need special features of form as there are multiple buttons instead of a single submit button
        <div>
            <div>
                <div className="filter">
                    <input type="search" placeholder="Search" />
                    {/* TODO; how to define users's type */}
                    {users.length > 0 && (
                        // TODO: figure out how selection work
                        <div
                            style={{
                                width: "200px",
                                display: "flex",
                                flexDirection: "column",
                            }}
                        >
                            {users.map((user) => {
                                const fullName = getFullName(user);
                                const isSelected = fullName === selectedUser
                                return <button key={fullName} className={isSelected ? styles.selected: ''} onClick={() => {
                                    setSelectedUser(selectedUser ? '' : fullName)
                                }} aria-selected={isSelected}>{fullName}</button>;
                            })}
                        </div>
                    )}
                </div>
                <div className="inputName">
                    <>
                        <label htmlFor="first-name-input">First Name:</label>
                        <input
                            id="first-name-input"
                            onChange={(e) => handleInputChange(e, setFirstName)}
                            value={firstName}
                        />
                    </>
                    <>
                        <label htmlFor="last-name-input">Last Name:</label>
                        <input
                            id="last-name-input"
                            onChange={(e) => handleInputChange(e, setLastName)}
                            value={lastName}
                        />
                    </>
                </div>
            </div>
            <div className="footer">
                <button disabled={isCreateDisabled} onClick={() => { dispatch({ type: ACTION.CREATE, user: { firstName, lastName }, callbackFn: clearNameInputs }) }}>Create</button>
                <button disabled={isUpdateDisabled} onClick={() => dispatch({type: ACTION.UPDATE, oriUser: selectedUser, newUser: {firstName, lastName}, callbackFn: setSelectedUser(getFullName({firstName, lastName}))})}>Update</button>
                <button disabled={!selectedUser} onClick={() => { dispatch({ type: ACTION.DELETE, user: selectedUser, callbackFn: clearSelectedUser }) }}>Delete</button>
                <button disabled={!selectedUser} onClick={() => {setSelectedUser('')}}>Cancel</button>
            </div>
        </div>
    );
};

export default UserDatabase;
