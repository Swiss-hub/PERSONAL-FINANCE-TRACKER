const BASE_URL = "http://localhost:8000/api";

// Store refresh token
let refreshToken = localStorage.getItem("refresh_token") || null;

// refresh token stored in localStorage

export const setRefreshToken = (token) => {
    refreshToken = token;
    localStorage.setItem("refresh_token", token);
};

export const clearTokens = () => {
    refreshToken = null;
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("token");
};

export const refreshAccessToken = async () => {
    if (!refreshToken) {
        throw new Error("No refresh token available");
    }
    
    try {
        const response = await fetch(`${BASE_URL}/token/refresh/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ refresh: refreshToken }),
        });

        if (!response.ok) {
            clearTokens();
            throw new Error("Failed to refresh token");
        }

        const data = await response.json();
        localStorage.setItem("token", data.access);
        return data.access;
    } catch (error) {
        clearTokens();
        throw error;
    }
};

export const getTransactions = ( token ) =>
    apiFetch("/transactions/", token);

export const createTransaction = ( token, data ) =>
    apiFetch("/transactions/", token, {
        method: "POST",
        body: JSON.stringify(data),
    });

export const updateTransaction = ( token, id, data ) =>
    apiFetch(`/transactions/${id}/`, token, {
        method: "PUT",
        body: JSON.stringify(data),
    });

export const deleteTransaction = ( token, id ) =>
    apiFetch(`/transactions/${id}/`, token, {
        method: "DELETE",
    });

export const apiFetch = async (endpoint, token, options = {}) => {
    // request start

    const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options.headers,
        },
    });

    // If token is invalid, try to refresh it
    if (response.status === 401 && token) {
        try {
            // received 401, attempt refresh

            const newToken = await refreshAccessToken();
            // Retry the request with the new token
            const retryResponse = await fetch(`${BASE_URL}${endpoint}`, {
                ...options,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${newToken}`,
                    ...options.headers,
                },
            });

            // retry response logged

            if (!retryResponse.ok) {
                const error = await retryResponse.json();
                throw error;
            }

            // Handle 204 No Content responses
            if (retryResponse.status === 204) {
                return null;
            }

            return retryResponse.json();
        } catch (error) {
            // If refresh fails, redirect to login
            window.location.href = "/login";
            throw error;
        }
    }

    // response received

    if (!response.ok) {
        const error = await response.json();
        throw error;
    }

    // Handle 204 No Content responses
    if (response.status === 204) {
        return null;
    }

    return response.json();
};


export const getSummary = ( token ) =>
    apiFetch("/summary/", token);