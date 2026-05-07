import { useUser, SignOutButton, SignInButton } from "@clerk/clerk-react";

/**
 * A simple Guard component that restricts access to the application
 * based on a hardcoded list of allowed email addresses.
 */
const ALLOWED_EMAILS = [
  "your-email@gmail.com", // Replace with your actual email
  "admin@example.com"
];

export default function AuthGuard({ children }) {
  const { isLoaded, isSignedIn, user } = useUser();

  // Wait for Clerk to load
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // If not signed in, show a clean login splash screen
  if (!isSignedIn) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50 p-6 text-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 max-w-md w-full">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">IEDC DocGen</h1>
          <p className="text-gray-500 mb-8">Please sign in to access the document generator.</p>
          <div className="btn-primary w-full flex justify-center py-3">
             <SignInButton mode="modal" />
          </div>
        </div>
      </div>
    );
  }

  // Check if the email is in the allowlist
  const userEmail = user.primaryEmailAddress?.emailAddress;
  const isAllowed = ALLOWED_EMAILS.includes(userEmail);

  if (!isAllowed) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50 p-6 text-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 max-w-md w-full">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-500 mb-6">
            Your email <strong>{userEmail}</strong> is not authorized to use this application.
          </p>
          <div className="flex flex-col gap-3">
            <div className="btn-outline w-full flex justify-center py-2.5">
               <SignOutButton />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If signed in and allowed, render the children (the rest of the app)
  return children;
}
