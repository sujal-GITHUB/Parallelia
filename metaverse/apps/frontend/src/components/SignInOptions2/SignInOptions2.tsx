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
      icon: "https://cdn-icons-png.flaticon.com/512/5968/5968853.png", // GitLab Icon URL
      label: "Self Hosted GitLab",
    },
    {
      id: 2,
      icon: "https://cdn-icons-png.freepik.com/512/312/312308.png", // SSO Icon URL
      label: "Sign in with SSO",
    },
  ];

  return (
    <div className="flex flex-col gap-4 w-full justify-center">
      {options.map((option) => (
        <button
          key={option.id}
          className="flex items-center gap-4 px-4 py-3 border justify-center border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-300 w-full text-left"
          onClick={() => console.log(`Clicked: ${option.label}`)}
        >
          <img
            src={option.icon}
            alt={`${option.label} Icon`}
            className="w-6 h-6"
          />
          <span className="text-black text-sm font-semibold font-inter">{option.label}</span>
        </button>
      ))}
    </div>
  );
};

export default SignInOptions2;
