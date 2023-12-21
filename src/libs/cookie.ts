import Cookies, { CookieGetOptions, CookieSetOptions } from 'universal-cookie';

// Function to get a cookie by name
export function getCookie(name: string, options?: CookieGetOptions) {
    const cookies = new Cookies();

    return cookies.get(name, { ...options });
}

export function getServerSideCookie(name: string, serverCookie: any, options?: CookieSetOptions) {
    const cookies = new Cookies(serverCookie, { path: '/', ...options });

    return cookies.get(name);
}

// Function to set a cookie
export function setCookie(name: string, value: string, options?: CookieSetOptions) {
    const cookies = new Cookies();

    cookies.set(name, value, { path: '/', ...options });
}

// Function to remove a cookie by name
export function removeCookie(name: string, options?: CookieSetOptions) {
    const cookies = new Cookies();

    cookies.remove(name, { path: '/', ...options });
}

// Function to check if a cookie with a given name exists
export function hasCookie(name: string, options?: CookieGetOptions) {
    return getCookie(name, { ...options }) !== undefined;
}

// Function to get all cookies
export function getAllCookies() {
    const cookies = new Cookies();

    return cookies.getAll();
}
