// services/authService.js
import { getSession } from "next-auth/react";

class AuthService {
  static async isAuthenticated() {
    const session = await getSession();
    return !!session;
  }

  static async getProtectedRoutes() {
    return [
      "/profile",
      "/assessments",
      "/dashboard",
      "/counseling",
      "/complete-profile",
    ];
  }

  static async handleAuthRedirect(path) {
    const isAuthenticated = await this.isAuthenticated();
    const protectedRoutes = await this.getProtectedRoutes();
    
    if (!isAuthenticated && protectedRoutes.some(route => path.startsWith(route))) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
    }

    return null;
  }
}

export default AuthService;