export function arrayBufferToBase64(buffer: Uint8Array): string {
  return btoa(String.fromCharCode.apply(null, [...new Uint8Array(buffer)]));
}

export function base64ToArrayBuffer(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

export const invertColors = () => {
  document.body.classList.toggle('dark-theme');
  const isDarkTheme = document.body.classList.contains('dark-theme');
  document.cookie = `darkTheme=${isDarkTheme}; path=/; max-age=31536000`;
}

export const checkTheme = () => {
  const cookies = document.cookie.split(';');
  const darkThemeCookie = cookies.find(cookie => cookie.trim().startsWith('darkTheme='));
  if (darkThemeCookie) {
    const isDarkTheme = darkThemeCookie.split('=')[1] === 'true';
    if (isDarkTheme) {
      document.body.classList.add('dark-theme');
    }
  }
}
