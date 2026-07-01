/**
 * Fetch methodes for user api calls
 * @author Peter Rutschmann
 */


const getBaseUrl = () => {
    const protocol = process.env.REACT_APP_API_PROTOCOL;
    const host = process.env.REACT_APP_API_HOST;
    const port = process.env.REACT_APP_API_PORT;
    const path = process.env.REACT_APP_API_PATH;
    const portPart = port ? `:${port}` : '';
    return `${protocol}://${host}${portPart}${path}`;
};

const getAuthHeaders = (token, headers = {}) => {
    if (!token) {
        return headers;
    }

    return {
        ...headers,
        Authorization: `Bearer ${token}`
    };
};

const getErrorMessage = async (response, fallbackMessage) => {
    const text = await response.text();

    if (!text) {
        return fallbackMessage;
    }

    try {
        const data = JSON.parse(text);
        if (Array.isArray(data.message)) {
            return data.message.join(', ');
        }
        return data.message || data.answer || fallbackMessage;
    } catch {
        return text;
    }
};

export const getUsers = async (token) => {
    const API_URL = getBaseUrl();

    if (!token) {
        throw new Error('Bitte zuerst einloggen.');
    }

    try {
        const response = await fetch(`${API_URL}/users`, {
            method: 'Get',
            headers: getAuthHeaders(token, {
                'Accept': 'application/json'
            })
        });

        if (!response.ok) {
            throw new Error(await getErrorMessage(response, 'Server response failed.'));
        }

        const data = await response.json();
        console.log('User successfully got:', data);
        return data;
    } catch (error) {
        console.error('Failed to get user:', error.message);
        throw new Error('Failed to get user. ' || error.message);
    }
}

export const getUserById = async (id, token) => {
    const API_URL = getBaseUrl();

    if (!token) {
        throw new Error('Bitte zuerst einloggen.');
    }

    const response = await fetch(`${API_URL}/users/${id}`, {
        method: 'GET',
        headers: getAuthHeaders(token, {
            'Accept': 'application/json'
        })
    });

    if (!response.ok) {
        throw new Error(await getErrorMessage(response, 'Benutzer konnte nicht geladen werden.'));
    }

    return await response.json();
};

export const updateUser = async (id, content, token) => {
    const API_URL = getBaseUrl();

    if (!token) {
        throw new Error('Bitte zuerst einloggen.');
    }

    const response = await fetch(`${API_URL}/users/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(token, {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }),
        body: JSON.stringify({
            firstName: content.firstName,
            lastName: content.lastName,
            role: content.role
        })
    });

    if (!response.ok) {
        throw new Error(await getErrorMessage(response, 'Benutzer konnte nicht gespeichert werden.'));
    }

    return await response.json();
};

export const postUser = async (content) => {
    const protocol = process.env.REACT_APP_API_PROTOCOL; // "http"
    const host = process.env.REACT_APP_API_HOST; // "localhost"
    const port = process.env.REACT_APP_API_PORT; // "8080"
    const path = process.env.REACT_APP_API_PATH; // "/api"
    const portPart = port ? `:${port}` : ''; // port is optional
    const API_URL = `${protocol}://${host}${portPart}${path}`;

    try {
        const response = await fetch(`${API_URL}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                firstName: `${content.firstName}`,
                lastName: `${content.lastName}`,
                email: `${content.email}`,
                password: `${content.password}`,
                passwordConfirmation: `${content.passwordConfirmation}`
            })
        });

        if (!response.ok) {
            throw new Error(await getErrorMessage(response, 'Server response failed.'));
        }
        const data = await response.json();
        console.log('User successfully posted:', data);
        return data;
    } catch (error) {
        console.error('Failed to post user:', error.message);
        throw new Error('Failed to save user. ' || error.message);
    }
};

export const postPasswordResetRequest = async (email) => {
    const API_URL = getBaseUrl();
    const response = await fetch(`${API_URL}/password-reset/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
    });
    if (!response.ok) throw new Error(await response.text());
};

export async function getPasswordResetValidate(token) {
    const response = await fetch(`${getBaseUrl()}/password-reset/validate?token=${token}`);
    if (!response.ok) {
        throw new Error("Token ungültig oder abgelaufen.");
    }
    return response.text(); // ← text() statt json()
}

export async function postPasswordResetConfirm(token, newPassword, confirmPassword) {
    const response = await fetch(`${getBaseUrl()}/password-reset/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword, confirmPassword }),
    });
    if (!response.ok) {
        const message = await response.text(); // ← text() statt json()
        throw new Error(message || "Fehler beim Zurücksetzen.");
    }
    return response.text(); // ← text() statt json()
}

export const postUserLogin = async (content) => {
    const protocol = process.env.REACT_APP_API_PROTOCOL; // "http"
    const host = process.env.REACT_APP_API_HOST; // "localhost"
    const port = process.env.REACT_APP_API_PORT; // "8080"
    const path = process.env.REACT_APP_API_PATH; // "/api"
    const portPart = port ? `:${port}` : ''; // port is optional
    const API_URL = `${protocol}://${host}${portPart}${path}`;

    try {
        const response = await fetch(`${API_URL}/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: `${content.email}`,
                password: `${content.password}`
            })
        });

        if (!response.ok) {
            throw new Error(await getErrorMessage(response, 'Server response failed.'));
        }

        const data = await response.json();
        console.log('User successfully logged in:', data);
        return data;
    } catch (error) {
        console.error('Failed to login user:', error.message);
        throw new Error('Failed to login user. ' + error.message);
    }
};
