export const API_CONFIG = {
    // Bütün backend API'leri için merkezi IP adresi
    // Bu IP adresini projeyi başka bir bilgisayarda (veya gerçek bir sunucuda) 
    // çalıştırdığınızda değiştirebilirsiniz.
    BASE_IP: '192.168.1.135',
    PORT: '5276',
};

export const API_BASE_URL = `http://${API_CONFIG.BASE_IP}:${API_CONFIG.PORT}`;

export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: `${API_BASE_URL}/api/Auth/login`,
        REGISTER: `${API_BASE_URL}/api/Auth/register`,
        ME: `${API_BASE_URL}/api/Auth/me`,
    },
    PROFILE: {
        UPDATE: (userId: string) => `${API_BASE_URL}/api/update/${userId}`,
    },
    PERSONAL_INFO: `${API_BASE_URL}/api/PersonalInformation`,
    TEAM: {
        MY_TEAM: `${API_BASE_URL}/api/TeamMember/my-team`,
        SEARCH_USER: (query: string) => `${API_BASE_URL}/api/TeamMember/search-user?query=${encodeURIComponent(query)}`,
        ADD_BY_ID: `${API_BASE_URL}/api/TeamMember/add-by-id`,
        GENERATE_INVITE: `${API_BASE_URL}/api/TeamMember/generate-invite`,
        ACTIVE_INVITES: `${API_BASE_URL}/api/TeamMember/active-invites`,
        CANCEL_INVITE: (id: number) => `${API_BASE_URL}/api/TeamMember/cancel-invite/${id}`,
    },
};
