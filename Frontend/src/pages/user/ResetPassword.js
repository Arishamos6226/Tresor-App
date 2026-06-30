import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { getPasswordResetValidate, postPasswordResetConfirm } from "../../comunication/FetchUser";

function ResetPassword() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [tokenValid, setTokenValid] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [passwords, setPasswords] = useState({ newPassword: '', confirmPassword: '' });

    const token = searchParams.get("token");

    const evaluatePasswordStrength = (password) => {
        const rules = [/[\d]/, /[a-z]/, /[A-Z]/, /[@#$%^&+=]/, /^\S+$/, /^.{8,20}$/];
        const passed = rules.filter(rule => rule.test(password)).length;
        return Math.round((passed / rules.length) * 100);
    };

    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        setPasswords(prev => ({
            ...prev,
            newPassword,
            passwordStrength: evaluatePasswordStrength(newPassword),
        }));
    };

    useEffect(() => {
        const validateToken = async () => {
            try {
                await getPasswordResetValidate(token);
                setTokenValid(true);
            } catch (err) {
                setError("Token ist ungültig oder abgelaufen.");
            } finally {
                setLoading(false);
            }
        };
        validateToken();
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (passwords.newPassword !== passwords.confirmPassword) {
            setError("Passwörter stimmen nicht überein.");
            return;
        }
        try {
            await postPasswordResetConfirm(token, passwords.newPassword, passwords.confirmPassword);
            alert("Passwort erfolgreich zurückgesetzt.");
            navigate("/user/login");
        } catch (err) {
            setError("Fehler beim Zurücksetzen des Passworts.");
        }
    };

    if (loading) return <p>Token wird überprüft...</p>;
    if (error) return <div><p>{error}</p><button onClick={() => navigate("/login")}>Zurück zum Login</button></div>;


    return (
        <div>
            <h2>Passwort zurücksetzen</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Neues Passwort:</label>
                    <input
                        type="password"
                        value={passwords.newPassword}
                        onChange={handlePasswordChange}
                        required
                        placeholder="Bitte neues Passwort eingeben"
                    />
                </div>
                <div>
                    <label>Passwort bestätigen:</label>
                    <input
                        type="password"
                        value={passwords.confirmPassword}
                        onChange={(e) =>
                            setPasswords(prev => ({ ...prev, confirmPassword: e.target.value }))
                        }
                        required
                        placeholder="Bitte Passwort bestätigen"
                    />
                </div>
                <div style={{
                    height: "10px",
                    width: "25%",
                    backgroundColor: "#ddd",
                    borderRadius: "5px",
                    marginTop: "5px"
                }}>
                    <div style={{
                        height: "100%",
                        width: `${passwords.passwordStrength}%`,
                        backgroundColor: `hsl(${passwords.passwordStrength}, 100%, 50%)`,
                        borderRadius: "5px"
                    }}></div>
                </div>
                <p style={{ marginTop: "5px", fontWeight: "bold" }}>
                    {passwords.passwordStrength}%
                </p>
                <button type="submit">Passwort zurücksetzen</button>
                {error && <p style={{ color: "red" }}>{error}</p>}
            </form>
        </div>
    );
}

export default ResetPassword;