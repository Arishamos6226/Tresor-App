import { useNavigate } from 'react-router-dom';
import { useState } from "react";
import { postUserLogin, postPasswordResetRequest } from "../../comunication/FetchUser";

/**
 * LoginUser
 */
function LoginUser({ loginValues, setLoginValues }) {
    const navigate = useNavigate();

    const [errorMessage, setErrorMessage] = useState('');
    const [showModal, setShowModal] = useState(false);

    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        setErrorMessage('');

        try {
            const loginResponse = await postUserLogin(loginValues);
            setLoginValues(prev => ({
                ...prev,
                userId: loginResponse.userId,
                role: loginResponse.role || '',
                token: loginResponse.token || ''
            }));
            navigate('/');
        } catch (error) {
            console.error('Failed to fetch to server:', error.message);
            setErrorMessage(error.message);
        }
    };

    const handlePasswordReset = async () => {
        setMessage('');
        setError('');

        try {
            await postPasswordResetRequest(email);
            setMessage("Falls diese Email existiert, wurde ein Reset-Link gesendet.");
        } catch (err) {
            setError("Fehler beim Senden der Anfrage.");
        }
    };

    return (
        <div>
            <h2>Login user</h2>

            <form onSubmit={handleSubmit}>
                <section>
                    <aside>

                        <div>
                            <label>Email:</label>
                            <input
                                type="text"
                                value={loginValues.email}
                                onChange={(e) =>
                                    setLoginValues(prev => ({
                                        ...prev,
                                        email: e.target.value
                                    }))
                                }
                                required
                                placeholder="Please enter your email *"
                            />
                        </div>

                        <div>
                            <label>Password:</label>
                            <input
                                type="password"
                                value={loginValues.password}
                                onChange={(e) =>
                                    setLoginValues(prev => ({
                                        ...prev,
                                        password: e.target.value
                                    }))
                                }
                                required
                                placeholder="Please enter your password *"
                            />
                        </div>

                    </aside>
                </section>

                <button type="submit">Login</button>
            </form>

            {errorMessage && (
                <p style={{ color: "red" }}>
                    {errorMessage}
                </p>
            )}

            <button onClick={() => setShowModal(true)}>
                Passwort vergessen?
            </button>

            {showModal && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        background: "rgba(0,0,0,0.5)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                >
                    <div
                        style={{
                            backgroundColor: "white",
                            padding: "20px",
                            borderRadius: "8px"
                        }}
                    >
                        <h3>Passwort zurücksetzen</h3>

                        <input
                            type="email"
                            placeholder="Email eingeben"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <div style={{ marginTop: "10px" }}>
                            <button onClick={handlePasswordReset}>
                                Reset-Link senden
                            </button>

                            <button
                                onClick={() => setShowModal(false)}
                                style={{ marginLeft: "10px" }}
                            >
                                Abbrechen
                            </button>
                        </div>

                        {message && (
                            <p style={{ color: "green" }}>
                                {message}
                            </p>
                        )}

                        {error && (
                            <p style={{ color: "red" }}>
                                {error}
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default LoginUser;
