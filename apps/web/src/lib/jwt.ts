import { JwtPayload, Role } from "@repo/types";
import { getToken } from "./auth";

export function getRole(): Role | null {
    const token = getToken();
    if (!token) return null;
    try {
        const payload = JSON.parse(atob(token.split('.')[1])) as JwtPayload;
        return payload.role;
    }catch {
        return null;
    }
}

export function isAdmin(): boolean {
    return getRole() === Role.Admin;
}












