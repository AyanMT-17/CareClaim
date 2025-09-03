import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils.js";
import {
  Shield,
  User,
  Stethoscope,
  Building2,
  ClipboardCheck,
  ArrowRight,
  Eye,
  EyeOff,
} from "lucide-react";

const roles = [
  {
    id: "patient",
    name: "Patient",
    description: "Submit and track your medical claims",
    icon: User,
    color: "neon-cyan",
  },
  {
    id: "provider",
    name: "Healthcare Provider",
    description: "Manage patient claims and documentation",
    icon: Stethoscope,
    color: "neon-green",
  },
  {
    id: "insurer",
    name: "Insurance Company",
    description: "Review and process claims efficiently",
    icon: Building2,
    color: "neon-purple",
  },
  {
    id: "auditor",
    name: "Claims Auditor",
    description: "Audit and verify claim authenticity",
    icon: ClipboardCheck,
    color: "neon-orange",
  },
];

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!selectedRole || !email || !password) return;

    setIsLoading(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    // In a real app, this would validate credentials and set auth state
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <Shield className="h-12 w-12 text-neon-cyan animate-pulse-neon" />
              <div className="absolute inset-0 h-12 w-12 bg-neon-cyan/20 rounded-full blur-lg"></div>
            </div>
          </div>
          <h1 className="text-4xl font-bold gradient-neon-text mb-2">
            SecureClaim
          </h1>
          <p className="text-gray-400 text-lg">
            Secure, transparent, and efficient claims management
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Role Selection */}
          <div className="space-y-6 animate-slide-up">
            <div>
              <h2 className="text-2xl font-semibold text-white mb-2">
                Select Your Role
              </h2>
              <p className="text-gray-400">
                Choose how you'll be using SecureClaim
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {roles.map((role) => {
                const Icon = role.icon;
                const isSelected = selectedRole === role.id;
                return (
                  <Card
                    key={role.id}
                    className={cn(
                      "cursor-pointer transition-all duration-300 border-2",
                      isSelected
                        ? `border-${role.color} bg-${role.color}/5 shadow-lg shadow-${role.color}/20`
                        : "border-gray-700 hover:border-gray-600 bg-dark-bg-secondary"
                    )}
                    onClick={() => setSelectedRole(role.id)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div
                          className={cn(
                            "p-3 rounded-lg",
                            isSelected
                              ? `bg-${role.color}/20 text-${role.color}`
                              : "bg-gray-700 text-gray-400"
                          )}
                        >
                          <Icon className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                          <h3
                            className={cn(
                              "font-semibold mb-1",
                              isSelected
                                ? `text-${role.color}`
                                : "text-white"
                            )}
                          >
                            {role.name}
                          </h3>
                          <p className="text-sm text-gray-400 leading-relaxed">
                            {role.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Login Form */}
          <Card className="glass-effect border-neon-cyan/20 animate-slide-up">
            <CardHeader>
              <CardTitle className="text-2xl text-white">Sign In</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-300">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-dark-bg-secondary border-gray-600 text-white focus:border-neon-cyan focus:ring-neon-cyan/20"
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-300">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-dark-bg-secondary border-gray-600 text-white focus:border-neon-cyan focus:ring-neon-cyan/20 pr-10"
                      placeholder="Enter your password"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-neon-cyan"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className={cn(
                    "w-full h-12 text-base font-semibold transition-all duration-300",
                    selectedRole && email && password
                      ? "bg-gradient-to-r from-neon-cyan to-neon-purple hover:shadow-lg hover:shadow-neon-cyan/25 text-dark-bg"
                      : "bg-gray-700 text-gray-400 cursor-not-allowed"
                  )}
                  disabled={!selectedRole || !email || !password || isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-dark-bg border-t-transparent rounded-full animate-spin"></div>
                      <span>Signing In...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span>Sign In</span>
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  )}
                </Button>

                <div className="text-center">
                  <Button
                    type="button"
                    variant="link"
                    className="text-neon-cyan hover:text-neon-cyan/80"
                  >
                    Forgot your password?
                  </Button>
                </div>
              </form>

              <div className="mt-6 pt-6 border-t border-gray-700">
                <p className="text-center text-gray-400">
                  Don't have an account?{" "}
                  <Button
                    variant="link"
                    className="text-neon-cyan hover:text-neon-cyan/80 p-0"
                  >
                    Request Access
                  </Button>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
