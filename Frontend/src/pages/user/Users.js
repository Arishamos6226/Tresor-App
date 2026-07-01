import '../../App.css';
import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {getUsers} from "../../comunication/FetchUser";

/**
 * Users
 * @author Peter Rutschmann
 */
const Users = ({loginValues}) => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                if (!loginValues.token) {
                    setErrorMessage('Bitte zuerst einloggen.');
                    return;
                }

                if (loginValues.role !== 'ADMIN') {
                    setErrorMessage('Diese Seite ist nur für Admins verfügbar.');
                    return;
                }

                const users = await getUsers(loginValues.token);
                console.log(users);
                setUsers(users);
                setErrorMessage('');
            } catch (error) {
                console.error('Failed to fetch to server:', error.message);
                setErrorMessage(error.message);
            }
        };
        fetchUsers();
    }, [loginValues]);

    return (
        <>
            <h1>Benutzerliste</h1>

            <table border="1">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Vorname</th>
                    <th>Nachname</th>
                    <th>Email</th>
                    <th>Rolle</th>
                    <th>Aktion</th>
                </tr>
                </thead>
                <tbody>
                {users.length > 0 ? users.map(user => (
                    <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.firstName}</td>
                        <td>{user.lastName}</td>
                        <td>{user.email}</td>
                        <td>{user.role || 'USER'}</td>
                        <td>
                            <button type="button" onClick={() => navigate(`/user/users/${user.id}`)}>
                                Bearbeiten
                            </button>
                        </td>
                    </tr>
                )) : (
                    <tr>
                        <td colSpan="6">Keine Benutzer vorhanden</td>
                    </tr>
                )}
                </tbody>
            </table>

            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        </>
    );
};

export default Users;
