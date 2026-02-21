import React from "react";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-700 text-gray-200 py-4 mt-auto">
      <div className="max-w-7xl mx-auto px-4 text-center text-sm">
        © {year} Skillify. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
