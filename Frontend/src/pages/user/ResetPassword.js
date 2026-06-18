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
            navigate("/login");
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
                <input
                    type="password"
                    placeholder="Neues Passwort"
                    value={passwords.newPassword}
                    onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                />
                <input
                    type="password"
                    placeholder="Passwort bestätigen"
                    value={passwords.confirmPassword}
                    onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                />
                <button type="submit">Passwort zurücksetzen</button>
            </form>
        </div>
    );
}

export default ResetPassword;