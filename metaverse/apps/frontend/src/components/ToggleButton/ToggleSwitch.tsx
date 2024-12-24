import React, { useState } from "react";
import SignInOptions1 from "../SignInOptions1/SigninOptions1";
import SignInOptions2 from "../SignInOptions2/SignInOptions2";
import { signUp } from "../../api/api"; 
import { SignUpFormData } from "../../types/formTypes"; // Import types for form data

const ToggleSwitch: React.FC = () => {
  const [selected, setSelected] = useState<"Sign Up" | "Sign In">("Sign Up");
  const [formData, setFormData] = useState<SignUpFormData>({
    username: "",
    password: "",
    role: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null); // Clear any previous errors
    setSuccessMessage(null); // Clear success message

    // Validation: Username should be alphanumeric
    const usernamePattern = /^[a-zA-Z0-9]+$/;
    if (!usernamePattern.test(formData.username)) {
      setError("Username should be alphanumeric only.");
      setLoading(false);
      return;
    }

    // Validation: Role should be either 'Admin' or 'User'
    if (formData.role !== "Admin" && formData.role !== "User") {
      setError("Role must be either 'Admin' or 'User'.");
      setLoading(false);
      return;
    }

    try {
      const response = await signUp(formData);
      console.log("Signup successful:", response);
      setSuccessMessage("Signup successful! Welcome aboard.");
    } catch (error) {
      setError(error.message);
      console.error("Signup failed:", error);
      alert(`Signup failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-full font-inter">
      {/* Toggle Switch */}
      <div className="relative flex items-center w-11/12 h-10 mb-4 bg-gray-50 rounded-md border border-[#8239ff]">
        {/* Sliding background */}
        <div
          className={`absolute top-0 left-0 w-1/2 h-full bg-[#7525ff] rounded-md transition-transform duration-300 ${
            selected === "Sign Up" ? "translate-x-0" : "translate-x-full"
          }`}
        ></div>

        {/* Sign Up Button */}
        <button
          onClick={() => setSelected("Sign Up")}
          className={`relative z-10 flex-1 flex items-center justify-center text-center font-semibold transition-colors duration-300 ${
            selected === "Sign Up" ? "text-white" : "text-black"
          }`}
        >
          Sign Up
        </button>

        {/* Sign In Button */}
        <button
          onClick={() => setSelected("Sign In")}
          className={`relative z-10 flex-1 flex items-center justify-center text-center font-semibold transition-colors duration-300 ${
            selected === "Sign In" ? "text-white" : "text-black"
          }`}
        >
          Sign In
        </button>
      </div>

      {/* Divider */}
      <hr className="my-4 w-full border-[#8239ff]" />

      {/* Conditional Rendering for Sign Up and Sign In */}
      <div className="w-11/12 mt-2">
        {selected === "Sign Up" ? (
          <>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-2 font-inter text-black"
            >
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#8239ff]"
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#8239ff]"
              />
              <input
                type="text"
                name="role"
                placeholder="Role (Admin or User)"
                value={formData.role}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#8239ff]"
              />
              <button
                type="submit"
                className="bg-[#7525ff] text-white py-2 text-sm rounded-md hover:bg-[#651edd] transition duration-300"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </form>

            {error && (
              <div className="text-red-500 text-sm mt-2">{error}</div>
            )}

            {successMessage && (
              <div className="text-green-500 text-sm mt-2">{successMessage}</div>
            )}

            {/* "OR" Divider */}
            <div className="flex items-center justify-center my-4">
              <div className="w-1/4 border-b border-gray-300"></div>
              <span className="mx-2 text-sm text-gray-500">or</span>
              <div className="w-1/4 border-b border-gray-300"></div>
            </div>

            <SignInOptions1 />
          </>
        ) : (
          <SignInOptions2 />
        )}
      </div>
    </div>
  );
};

export default ToggleSwitch;
