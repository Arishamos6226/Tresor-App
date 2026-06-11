import React, {useState} from 'react';
import './RegisterUser.css';

function RegisterUser() {
    const [credentials, setCredentials] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        passwordConfirmation: "",
        passwordStrength: 0,
        recaptchaVerified: false
    });
    const [errorMessage, setErrorMessage] = useState("");
    const [showPasswords, setShowPasswords] = useState(false);

    const evaluatePasswordStrength = (password) => {
        const rules = [/[\d]/, /[a-z]/, /[A-Z]/, /[@#$%^&+=]/, /^\S+$/, /^.{8,20}$/];
        const passed = rules.filter(rule => rule.test(password)).length;
        return Math.round((passed / rules.length) * 100);
    };

    const handlePasswordChange = (e) => {
        const password = e.target.value;
        setCredentials(prev => ({
            ...prev,
            password,
            passwordStrength: evaluatePasswordStrength(password)
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (credentials.password !== credentials.passwordConfirmation) {
            setErrorMessage("Passwords do not match!");
            return;
        }
        setErrorMessage("");
        // Hier können Sie die Registrierung logik hinzufügen
        console.log("Form submitted", credentials);
    };

    return (
        <div>
            <h2>Register user</h2>
            <form onSubmit={handleSubmit}>
                <section>
                    <aside>
                        <div>
                            <label>Firstname:</label>
                            <input
                                type="text"
                                value={credentials.firstName}
                                onChange={(e) =>
                                    setCredentials(prevValues => ({...prevValues, firstName: e.target.value}))}
                                required
                                placeholder="Please enter your firstname *"
                            />
                        </div>
                        <div>
                            <label>Lastname:</label>
                            <input
                                type="text"
                                value={credentials.lastName}
                                onChange={(e) =>
                                    setCredentials(prevValues => ({...prevValues, lastName: e.target.value}))}
                                required
                                placeholder="Please enter your lastname *"
                            />
                        </div>
                        <div>
                            <label>Email:</label>
                            <input
                                type="text"
                                value={credentials.email}
                                onChange={(e) =>
                                    setCredentials(prevValues => ({...prevValues, email: e.target.value}))}
                                required
                                placeholder="Please enter your email"
                            />
                        </div>
                    </aside>
                    <aside>
                        <div>
                            <label>Password:</label>
                            <input
                                type={showPasswords ? "text" : "password"}
                                value={credentials.password}
                                onChange={handlePasswordChange}
                                onClick={() => setShowPasswords(true)}
                                onBlur={() => setShowPasswords(false)}
                                required
                                placeholder="Please enter your pwd *"
                            />
                            <div style={{
                                height: "10px",
                                width: "100%",
                                backgroundColor: "#ddd",
                                borderRadius: "5px",
                                marginTop: "5px"
                            }}>
                                <div style={{
                                    height: "100%",
                                    width: `${credentials.passwordStrength}%`,
                                    backgroundColor: `hsl(${credentials.passwordStrength}, 100%, 50%)`,
                                    borderRadius: "5px"
                                }}></div>
                            </div>
                            <p style={{marginTop: "5px", fontWeight: "bold"}}>
                                {credentials.passwordStrength}%
                            </p>
                        </div>
                        <div>
                            <label>Password confirmation:</label>
                            <input
                                type={showPasswords ? "text" : "password"}
                                value={credentials.passwordConfirmation}
                                onChange={(e) =>
                                    setCredentials(prevValues => ({
                                        ...prevValues,
                                        passwordConfirmation: e.target.value
                                    }))}
                                required
                                placeholder="Please confirm your pwd *"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={() => setShowPasswords(prev => !prev)}
                            style={{
                                marginTop: "10px",
                                padding: "5px 10px",
                                cursor: "pointer"
                            }}
                        >
                            {showPasswords ? "Passwörter verbergen" : "Passwörter anzeigen"}
                        </button>
                    </aside>
                </section>
                <button type="submit">Register</button>
                {errorMessage && <p style={{color: 'red'}}>{errorMessage}</p>}
            </form>
        </div>
    );
}

export default RegisterUser;