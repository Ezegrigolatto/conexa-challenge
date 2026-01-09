const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

export async function fetchFromApi(endpoint: string, options?: RequestInit) {
    const url = `${API_URL}${endpoint}`;
    const response = await fetch(url, options);

    if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    return response.json();
}