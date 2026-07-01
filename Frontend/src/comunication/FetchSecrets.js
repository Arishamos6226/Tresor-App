const getApiUrl = () => {
    const protocol = process.env.REACT_APP_API_PROTOCOL;
    const host = process.env.REACT_APP_API_HOST;
    const port = process.env.REACT_APP_API_PORT;
    const path = process.env.REACT_APP_API_PATH;
    const portPart = port ? `:${port}` : '';
    return `${protocol}://${host}${portPart}${path}`;
};

const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return { 'Authorization': `Bearer ${token}` };
};

// Post secret to server
export const postSecret = async ({ loginValues, content }) => {
    const API_URL = getApiUrl();

    try {
        const response = await fetch(`${API_URL}/secrets`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeader()
            },
            body: JSON.stringify({
                email: loginValues.email,
                encryptPassword: loginValues.password,
                content: content
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Server response failed.');
        }

        const data = await response.json();
        console.log('Secret successfully posted:', data);
        return data;
    } catch (error) {
        console.error('Error posting secret:', error.message);
        throw new Error('Failed to save secret. ' || error.message);
    }
};

// Get all secrets for a user identified by its email
export const getSecretsforUser = async (loginValues) => {
    const API_URL = getApiUrl();

    try {
        const response = await fetch(`${API_URL}/secrets/byemail`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeader()
            },
            body: JSON.stringify({
                email: loginValues.email,
                encryptPassword: loginValues.password
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Server response failed.');
        }
        const data = await response.json();
        console.log('Secret successfully got:', data);
        return data;
    } catch (error) {
        console.error('Failed to get secrets:', error.message);
        throw new Error('Failed to get secrets. ' || error.message);
    }
};

export const deleteSecret = async (id) => {
    const API_URL = getApiUrl();

    const response = await fetch(`${API_URL}/secrets/${id}`, {
        method: 'DELETE',
        headers: {
            ...getAuthHeader()
        }
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(text || 'Failed to delete secret');
    }

    return await response.text();
};

export const updateSecret = async (id, loginValues, content) => {
    const API_URL = getApiUrl();

    const response = await fetch(`${API_URL}/secrets/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader()
        },
        body: JSON.stringify({
            email: loginValues.email,
            encryptPassword: loginValues.password,
            content: content
        }),
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(text || 'Failed to update secret');
    }

    return await response.json();
};