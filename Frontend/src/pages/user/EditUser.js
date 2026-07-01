import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {getUserById, updateUser} from "../../comunication/FetchUser";

const EditUser = ({loginValues}) => {
    const {id} = useParams();
    const navigate = useNavigate();

    const [formValues, setFormValues] = useState({
        firstName: '',
        lastName: '',
        email: '',
        role: 'USER'
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            if (!loginValues.token) {
                setErrorMessage('Bitte zuerst einloggen.');
                setIsLoading(false);
                return;
            }

            if (loginValues.role !== 'ADMIN') {
                setErrorMessage('Diese Seite ist nur für Admins verfügbar.');
                setIsLoading(false);
                return;
            }

            try {
                const user = await getUserById(id, loginValues.token);
                setFormValues({
                    firstName: user.firstName || '',
                    lastName: user.lastName || '',
                    email: user.email || '',
                    role: user.role || 'USER'
                });
                setErrorMessage('');
            } catch (error) {
                setErrorMessage(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUser();
    }, [id, loginValues]);

    const handleChange = (event) => {
        const {name, value} = event.target;
        setFormValues(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');

        try {
            await updateUser(id, {
                firstName: formValues.firstName,
                lastName: formValues.lastName,
                role: formValues.role
            }, loginValues.token);
            setSuccessMessage('Benutzer wurde erfolgreich gespeichert.');
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    if (isLoading) {
        return <p>Benutzer wird geladen...</p>;
    }

    return (
        <>
            <h1>Benutzer bearbeiten</h1>

            <form onSubmit={handleSubmit}>
                <div>
                    <label>Vorname:</label>
                    <input
                        type="text"
                        name="firstName"
                        value={formValues.firstName}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label>Nachname:</label>
                    <input
                        type="text"
                        name="lastName"
                        value={formValues.lastName}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formValues.email}
                        readOnly
                    />
                </div>

                <div>
                    <label>Rolle:</label>
                    <select
                        name="role"
                        value={formValues.role}
                        onChange={handleChange}
                    >
                        <option value="USER">USER</option>
                        <option value="ADMIN">ADMIN</option>
                    </select>
                </div>

                <button type="submit">Speichern</button>
                <button type="button" onClick={() => navigate('/user/users')}>
                    Zurück
                </button>
            </form>

            {successMessage && <p style={{color: 'green'}}>{successMessage}</p>}
            {errorMessage && <p style={{color: 'red'}}>{errorMessage}</p>}
        </>
    );
};

export default EditUser;

