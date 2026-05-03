import '../../App.css';
import React, { useEffect, useState } from 'react';
import { getSecretsforUser, updateSecret, deleteSecret } from "../../comunication/FetchSecrets";

/**
 * Secrets Component
 */
const Secrets = ({ loginValues }) => {

    const [secrets, setSecrets] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    const [editSecret, setEditSecret] = useState(null);
    const [editContent, setEditContent] = useState(null);

    const [deleteSecretId, setDeleteSecretId] = useState(null);

    // 🔹 Secrets laden
    useEffect(() => {
        const fetchSecrets = async () => {
            try {
                if (!loginValues.email) {
                    setErrorMessage("Bitte zuerst einloggen.");
                    return;
                }

                const data = await getSecretsforUser(loginValues);
                setSecrets(data);

            } catch (error) {
                setErrorMessage(error.message);
            }
        };

        fetchSecrets();
    }, [loginValues]);

    // 🔹 Edit starten
    const handleEdit = (secret) => {
        setEditSecret(secret);

        try {
            const parsed = JSON.parse(secret.content);
            setEditContent(parsed);
        } catch {
            setEditContent({});
        }
    };

    // 🔹 Save Edit
    const handleSave = async () => {
        try {
            await updateSecret(editSecret.id, loginValues, editContent);

            // neu laden (einfach & sicher)
            const data = await getSecretsforUser(loginValues);
            setSecrets(data);

            setEditSecret(null);
            setEditContent(null);

        } catch (error) {
            setErrorMessage("Fehler beim Speichern: " + error.message);
        }
    };

    // 🔹 Delete starten
    const handleDelete = (id) => {
        setDeleteSecretId(id);
    };

    // 🔹 Delete bestätigen
    const confirmDelete = async () => {
        try {
            await deleteSecret(deleteSecretId);

            const data = await getSecretsforUser(loginValues);
            setSecrets(data);

            setDeleteSecretId(null);

        } catch (error) {
            setErrorMessage("Fehler beim Löschen: " + error.message);
        }
    };

    // 🔹 Dynamische Eingabefelder basierend auf `kind`
    const renderEditFields = () => {
        switch (editContent.kind) {
            case "note":
                return (
                    <>
                        <div>
                            <label>Title:</label>
                            <input
                                value={editContent.title || ''}
                                onChange={(e) =>
                                    setEditContent({ ...editContent, title: e.target.value })
                                }
                            />
                        </div>
                        <div>
                            <label>Content:</label>
                            <textarea
                                rows={4}
                                value={editContent.content || ''}
                                onChange={(e) =>
                                    setEditContent({ ...editContent, content: e.target.value })
                                }
                            />
                        </div>
                    </>
                );
            case "creditcard":
                return (
                    <>
                        <div>
                            <label>Card Type:</label>
                            <select
                                value={editContent.cardtype || ''}
                                onChange={(e) =>
                                    setEditContent({ ...editContent, cardtype: e.target.value })
                                }
                            >
                                <option value="" disabled>
                                    Please select card type
                                </option>
                                <option value="Visa">Visa</option>
                                <option value="Mastercard">Mastercard</option>
                            </select>
                        </div>
                        <div>
                            <label>Card Number:</label>
                            <input
                                value={editContent.cardnumber || ''}
                                onChange={(e) =>
                                    setEditContent({ ...editContent, cardnumber: e.target.value })
                                }
                            />
                        </div>
                        <div>
                            <label>Expiration (mm/yy):</label>
                            <input
                                value={editContent.expiration || ''}
                                onChange={(e) =>
                                    setEditContent({ ...editContent, expiration: e.target.value })
                                }
                            />
                        </div>
                        <div>
                            <label>CVV:</label>
                            <input
                                value={editContent.cvv || ''}
                                onChange={(e) =>
                                    setEditContent({ ...editContent, cvv: e.target.value })
                                }
                            />
                        </div>
                    </>
                );
            case "credential":
                return (
                    <>
                        <div>
                            <label>Username:</label>
                            <input
                                value={editContent.userName || ''}
                                onChange={(e) =>
                                    setEditContent({ ...editContent, userName: e.target.value })
                                }
                            />
                        </div>
                        <div>
                            <label>Password:</label>
                            <input
                                value={editContent.password || ''}
                                onChange={(e) =>
                                    setEditContent({ ...editContent, password: e.target.value })
                                }
                            />
                        </div>
                        <div>
                            <label>URL:</label>
                            <input
                                value={editContent.url || ''}
                                onChange={(e) =>
                                    setEditContent({ ...editContent, url: e.target.value })
                                }
                            />
                        </div>
                    </>
                );
            default:
                return <p>Unknown kind</p>;
        }
    };

    return (
        <>
            <h1>Meine Secrets</h1>

            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

            {/* 🔹 Tabelle */}
            <table border="1">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>User</th>
                    <th>Content</th>
                    <th>Aktionen</th>
                </tr>
                </thead>

                <tbody>
                {secrets.length > 0 ? (
                    secrets.map(secret => {
                        let content = {};

                        try {
                            content = JSON.parse(secret.content);
                        } catch {}

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

                                <td>
                                    <div className={"action-buttons"}>
                                        <button onClick={() => handleEdit(secret)}>
                                            Bearbeiten
                                        </button>

                                        <button onClick={() => handleDelete(secret.id)}>
                                            Löschen
                                        </button>
                                    </div>

                                </td>
                            </tr>
                        );
                    })
                ) : (
                    <tr>
                        <td colSpan="4">Keine Secrets vorhanden</td>
                    </tr>
                )}
                </tbody>
            </table>

            {/* 🔹 Edit Modal */}
            {editSecret && editContent && (
                <div className="modal">
                    <div className="modal-content">

                        <h2>Secret bearbeiten</h2>

                        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
                            {renderEditFields()}
                            <br />
                            <button type="submit">Speichern</button>
                            <button type="button" onClick={() => setEditSecret(null)}>
                                Abbrechen
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* 🔹 Delete Modal */}
            {deleteSecretId && (
                <div className="modal">
                    <div className="modal-content">

                        <h2>Secret löschen</h2>
                        <p>Sicher löschen?</p>

                        <button onClick={confirmDelete}>Ja</button>
                        <button onClick={() => setDeleteSecretId(null)}>Nein</button>

                    </div>
                </div>
            )}
        </>
    );
};

export default Secrets;