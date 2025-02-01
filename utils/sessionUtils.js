// utils/sessionUtils.js

export const getSessionData = (session) => {
    if (!session) {
      return {
        name: null,
        email: null,
        image: "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y", // default image
        isAuthenticated: false
      };
    }
  
    return {
      name: session.user?.name || "Guest User",
      email: session.user?.email || null,
      image: session.user?.image || "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y",
      isAuthenticated: true
    };
  };
  
  // Helper function to check if session is valid
  export const isValidSession = (session) => {
    return session && session.user;
  };
  
  // Helper function to get formatted user name (e.g., first name only)
  export const getFormattedName = (session) => {
    if (!session?.user?.name) return "Guest";
    return session.user.name.split(' ')[0]; // Returns first name only
  };
  
  // Helper function to get user initials
  export const getUserInitials = (session) => {
    if (!session?.user?.name) return "G";
    return session.user.name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };