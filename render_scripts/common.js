export async function loadShader(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to load shader: ${response.statusText}`);
    }
    return await response.text();
}