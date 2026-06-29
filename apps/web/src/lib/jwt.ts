import { JwtPayload, Role } from "@repo/types";
import { getToken } from "./auth";


function decodeJwtPayload(token: string): JwtPayload | null {
    try{
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const padded = base64.padEnd(base64.length +(4 - (base64.length % 4)) %4, '=');
        return JSON.parse(atob(padded)) as JwtPayload;
    }catch {
        return null;
    }
}




export function getRole(): Role | null {
    const token = getToken();
    if (!token) return null;
    const payload = decodeJwtPayload(token);
    return payload?.role ?? null;
    
}

export function isAdmin(): boolean {
    return getRole() === Role.Admin;
}












