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
};
