const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return { 'Authorization': `Bearer ${token}` };
};

const getBaseUrl = () => {
    const protocol = process.env.REACT_APP_API_PROTOCOL;
    const host = process.env.REACT_APP_API_HOST;
    const port = process.env.REACT_APP_API_PORT;
    const path = process.env.REACT_APP_API_PATH;
    const portPart = port ? `:${port}` : '';
    return `${protocol}://${host}${portPart}${path}`;
}

export const getUsers = async () => {
    const API_URL = getBaseUrl();

    try {
        const response = await fetch(`${API_URL}/users`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                ...getAuthHeader()
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Server response failed.');
        }

        const data = await response.json();
        console.log('User successfully got:', data);
        return data;
    } catch (error) {
        console.error('Failed to get user:', error.message);
        throw new Error('Failed to get user. ' || error.message);
    }
};

export const postUser = async (content) => {
    const API_URL = getBaseUrl();

    try {
        const response = await fetch(`${API_URL}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeader()
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
            const errorData = await response.json();
            throw new Error(errorData.message || 'Server response failed.');
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
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader()
        },
        body: JSON.stringify({ email }),
    });
    if (!response.ok) throw new Error(await response.text());
};

export async function getPasswordResetValidate(token) {
    const response = await fetch(`${getBaseUrl()}/password-reset/validate?token=${token}`, {
        headers: {
            ...getAuthHeader()
        }
    });
    if (!response.ok) {
        throw new Error("Token ungültig oder abgelaufen.");
    }
    return response.text();
}

export async function postPasswordResetConfirm(token, newPassword, confirmPassword) {
    const response = await fetch(`${getBaseUrl()}/password-reset/confirm`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...getAuthHeader()
        },
        body: JSON.stringify({ token, newPassword, confirmPassword }),
    });
    if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Fehler beim Zurücksetzen.");
    }
    return response.text();
}

export const postUserLogin = async (content) => {
    const API_URL = getBaseUrl();

    try {
        const response = await fetch(`${API_URL}/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeader()
            },
            body: JSON.stringify({
                email: `${content.email}`,
                password: `${content.password}`
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Server response failed.');
        }

        const data = await response.json();
        console.log('User successfully logged in:', data);
        return data;
    } catch (error) {
        console.error('Failed to login user:', error.message);
        throw new Error('Failed to login user. ' + error.message);
    }
};