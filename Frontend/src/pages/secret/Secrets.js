import '../../App.css';
import React, { useEffect, useState } from 'react';
import { getSecretsforUser } from "../../comunication/FetchSecrets";

/**
 * Secrets Component - Zeigt die Secrets des Benutzers an
 * @param {Object} loginValues - Login-Daten des Benutzers
 */
const Secrets = ({ loginValues }) => {
    const [secrets, setSecrets] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchSecrets = async () => {
            setErrorMessage('');
            if (!loginValues.email) {
                console.error('Secrets: Keine gültige E-Mail, bitte zuerst einloggen:', loginValues);
                setErrorMessage("Keine gültige E-Mail, bitte zuerst einloggen.");
            } else {
                try {
                    const data = await getSecretsforUser(loginValues);
                    console.log('Fetched Secrets:', data);
                    setSecrets(data);
                } catch (error) {
                    console.error('Fehler beim Abrufen der Secrets:', error.message);
                    setErrorMessage("Fehler beim Abrufen der Secrets: " + error.message);
                }
            }
        };
        fetchSecrets();
    }, [loginValues]);

    return (
        <>
            <h1>Meine Secrets</h1>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            <div>
                <h2>Secrets</h2>
                <table border="1">
                    <thead>
                    <tr>
                        <th>Secret ID</th>
                        <th>User ID</th>
                        <th>Details</th>
                    </tr>
                    </thead>
                    <tbody>
                    {secrets?.length > 0 ? (
                        secrets.map(secret => {
                            const content = JSON.parse(secret.content); // JSON parsen
                            return (
                                <tr key={secret.id}>
                                    <td>{secret.id}</td>
                                    <td>{secret.userId}</td>
                                    <td>
                                        {Object.entries(content).map(([key, value]) => (
                                            <div key={key}>
                                                <strong>{key}:</strong> {value}
                                            </div>
                                        ))}
                                    </td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan="3">Keine Secrets verfügbar</td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default Secrets;