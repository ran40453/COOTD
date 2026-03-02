const GIST_FILENAME = 'cootd_data.json';

export const INITIAL_DATA_TEMPLATE = {
    closet: [],
    outfits: [],
    settings: {
        gender: 'female',
        language: 'en',
    },
};

export const getStorageCredentials = () => {
    const gistId = localStorage.getItem('cootd_gist_id');
    const token = localStorage.getItem('cootd_github_token');
    return { gistId, token };
};

export const fetchGistData = async () => {
    const { gistId, token } = getStorageCredentials();
    if (!gistId || !token) throw new Error('Missing credentials');

    const res = await fetch(`https://api.github.com/gists/${gistId}`, {
        headers: { Authorization: `token ${token}` },
    });
    if (!res.ok) throw new Error('Fetch failed');
    const gist = await res.json();
    const file = gist.files?.[GIST_FILENAME];
    if (!file) return { ...INITIAL_DATA_TEMPLATE };
    try {
        const parsed = JSON.parse(file.content);
        return sanitizeData(parsed);
    } catch (e) {
        console.error('Data parse error:', e);
        return { ...INITIAL_DATA_TEMPLATE };
    }
};

export const updateGistData = async (data) => {
    const { gistId, token } = getStorageCredentials();
    if (!gistId || !token) throw new Error('Missing credentials');

    const res = await fetch(`https://api.github.com/gists/${gistId}`, {
        method: 'PATCH',
        headers: {
            Authorization: `token ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            files: {
                [GIST_FILENAME]: { content: JSON.stringify(data) },
            },
        }),
    });
    if (!res.ok) throw new Error('Update failed');
    return res.json();
};

export const sanitizeData = (d) => ({
    closet: Array.isArray(d?.closet) ? d.closet : [],
    outfits: Array.isArray(d?.outfits) ? d.outfits : [],
    settings: d?.settings || INITIAL_DATA_TEMPLATE.settings,
});
