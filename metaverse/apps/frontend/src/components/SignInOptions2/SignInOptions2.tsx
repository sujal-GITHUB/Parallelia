import React from "react";

interface Option {
  id: number;
  icon: string;
  label: string;
}

const SignInOptions2: React.FC = () => {
  const options: Option[] = [
    {
      id: 1,
      icon: "https://cdn4.iconfinder.com/data/icons/logos-brands-7/512/google_logo-google_icongoogle-512.png", // Google Icon URL
      label: "Sign in with Google",
    },
    {
      id: 2,
      icon: "https://w7.pngwing.com/pngs/640/461/png-transparent-apple-logo-company-apple-logo-company-service-computer.png", // Apple Icon URL
      label: "Sign in with Apple",
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* Sign-in options (Google, Apple) */}
      {options.map((option) => (
        <button
          key={option.id}
          className="flex bg-white hover:bg-gray-200 items-center justify-center gap-4 px-4 py-3 border rounded-lg transition duration-300"
          onClick={() => console.log(`Clicked: ${option.label}`)}
        >
          <img src={option.icon} alt={`${option.label} Icon`} className="w-6 h-6" />
          <span className="text-black font-semibold text-sm font-inter">{option.label}</span>
        </button>
      ))}

    </div>
  );
};

export default SignInOptions2;
