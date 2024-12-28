import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/Tabs';
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SignInOptions1 from "../SignInOptions1/SigninOptions1";
import SignInOptions2 from "../SignInOptions2/SignInOptions2";
import { signUp, signIn } from "../../api/api";
import { SignUpFormData, SignInFormData } from "../../types/formTypes";

const ToggleSwitch: React.FC = () => {
  const [selected, setSelected] = useState<"Sign Up" | "Sign In">("Sign Up");

  // Form data for Sign Up
  const [signUpData, setSignUpData] = useState<SignUpFormData>({
    username: "",
    password: "",
    confirmPassword: "",
  });

  // Form data for Sign In
  const [signInData, setSignInData] = useState<SignInFormData>({
    username: "",
    password: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const navigate = useNavigate(); // Use navigate to redirect after success

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    // Check if there's a token in localStorage on component mount
    const token = localStorage.getItem("authToken");
    if (token) {
      setIsAuthenticated(true);
      navigate("/space"); // Redirect to /space if the token exists
    }
  }, [navigate]);

  // Handle input change for Sign Up and Sign In forms
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (selected === "Sign Up") {
      setSignUpData((prev) => ({ ...prev, [name]: value }));
    } else {
      setSignInData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle form submission for Sign Up
  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    const usernamePattern = /^[a-zA-Z0-9]+$/;
    if (!usernamePattern.test(signUpData.username)) {
      setError("Username should be alphanumeric only.");
      setLoading(false);
      return;
    }

    if (signUpData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      setLoading(false);
      return;
    }

    if (signUpData.password !== signUpData.confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const { confirmPassword, ...dataToSend } = signUpData; // Exclude confirmPassword
      const payload = { ...dataToSend, role: "user" }; // Add role field directly
      const response = await signUp(payload);
      console.log("Signup response:", response);

      if (!response.success) {
        setError(`Error: ${response.message || "Signup failed"}`);
      } else {
        setSuccessMessage("Signup successful! Now, sign in.");
        setSelected("Sign In"); // Automatically switch to Sign In form
      }
    } catch (error: any) {
      const errorMessage = error?.message || "Signup failed";
      setError(errorMessage);
      console.error("Signup failed:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission for Sign In
  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    if (!signInData.username || !signInData.password) {
      setError("Please enter both username and password.");
      setLoading(false);
      return;
    }

    try {
      const response = await signIn(signInData);
      console.log("SignIn response:", response);

      if (!response.success) {
        setError(`Error: ${response.message || "SignIn failed"}`);
      } else {
        setSuccessMessage("Sign-in successful! Welcome back.");
        setIsAuthenticated(true); // Mark as authenticated
        localStorage.setItem("authToken", response.token); // Store the token in localStorage
        navigate("/space"); // Redirect to /space after successful sign-in
      }
    } catch (error: any) {
      const errorMessage = error?.message || "SignIn failed";
      setError(errorMessage);
      console.error("SignIn failed:", error);
    } finally {
      setLoading(false);
    }
  };

  // Conditional rendering for the space page
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center w-full font-inter px-5">
        {/* Tabs with onValueChange handler */}
        <Tabs value={selected} onValueChange={(value: string) => setSelected(value as "Sign Up" | "Sign In")} className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="Sign Up" className="w-full font-semibold">Sign Up</TabsTrigger>
            <TabsTrigger value="Sign In" className="w-full font-semibold">Sign In</TabsTrigger>
          </TabsList>
          <TabsContent value="Sign Up" className="w-full">
            {/* Sign Up Form */}
            <form onSubmit={handleSignUpSubmit} className="flex flex-col gap-2 font-inter text-black w-full">
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={signUpData.username}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8239ff] w-full"
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={signUpData.password}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8239ff] w-full"
              />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={signUpData.confirmPassword}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8239ff] w-full"
              />
              <button
                type="submit"
                className="bg-[#7525ff] text-white py-2 text-sm rounded-md hover:bg-[#651edd] transition duration-300 w-full"
                disabled={loading}
              >
                {loading ? "Signing up..." : "Sign Up"}
              </button>
            </form>
            {error && <div className="text-red-500 text-sm mt-2 w-full">{error}</div>}
            {successMessage && <div className="text-green-500 text-sm mt-2 w-full">{successMessage}</div>}
            <div className="flex items-center justify-center my-4 w-full">
              <div className="w-1/4 border-b border-gray-300"></div>
              <span className="mx-2 text-sm text-gray-500">or</span>
              <div className="w-1/4 border-b border-gray-300"></div>
            </div>
            <SignInOptions1 />
          </TabsContent>
          <TabsContent value="Sign In" className="w-full">
            {/* Sign In Form */}
            <form onSubmit={handleSignInSubmit} className="flex flex-col gap-2 font-inter text-black w-full">
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={signInData.username}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8239ff] w-full"
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={signInData.password}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8239ff] w-full"
              />
              <button
                type="submit"
                className="bg-[#7525ff] text-white py-2 text-sm rounded-md hover:bg-[#651edd] transition duration-300 w-full"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>
            {error && <div className="text-red-500 text-sm mt-2 w-full">{error}</div>}
            {successMessage && <div className="text-green-500 text-sm mt-2 w-full">{successMessage}</div>}
            <div className="flex items-center justify-center my-4 w-full">
              <div className="w-1/4 border-b border-gray-300"></div>
              <span className="mx-2 text-sm text-gray-500">or</span>
              <div className="w-1/4 border-b border-gray-300"></div>
            </div>
            <SignInOptions2 />
          </TabsContent>
        </Tabs>
      </div>
    );
  }
};

export default ToggleSwitch;
