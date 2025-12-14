import React from "react";

const SocialLogin = () => {
  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}/auth/google`;
  };

  return (
    <div className="w-full flex justify-center mt-3">
      <button
        onClick={handleGoogleLogin}
        className="flex items-center justify-center gap-2 border border-gray-400 rounded-md py-2 px-4 hover:bg-gray-100 transition"
      >
        <img
          src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
          alt="Google Logo"
          className="w-5 h-5"
        />
        <span>Continue with Google</span>
      </button>
    </div>
  );
};

export default SocialLogin;
