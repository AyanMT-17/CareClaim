import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, ArrowRight, CheckCircle, Lock, Zap } from "lucide-react";

const features = [
  {
    icon: Lock,
    title: "Secure & Encrypted",
    description: "End-to-end encryption ensures your data is always protected",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Process claims in minutes, not days, with our AI-powered system",
  },
  {
    icon: CheckCircle,
    title: "Transparent Process",
    description: "Track every step of your claim with real-time updates",
  },
];

export default function Index() {
  const navigate = useNavigate();

  // In a real app, check if user is already authenticated
  useEffect(() => {
    const isAuthenticated = false; // This would check actual auth state
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-neon-cyan/10 rounded-full blur-3xl animate-pulse-neon"></div>
          <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-neon-purple/10 rounded-full blur-3xl animate-pulse-neon delay-1000"></div>
          <div className="absolute bottom-0 left-1/2 w-80 h-80 bg-neon-pink/10 rounded-full blur-3xl animate-pulse-neon delay-2000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <div className="text-center">
            {/* Logo */}
            <div className="flex items-center justify-center mb-8 animate-fade-in">
              <div className="relative">
                <Shield className="h-16 w-16 text-neon-cyan animate-pulse-neon" />
                <div className="absolute inset-0 h-16 w-16 bg-neon-cyan/20 rounded-full blur-lg"></div>
              </div>
            </div>

            {/* Headline */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-slide-up">
              <span className="gradient-neon-text">Secure</span>
              <span className="text-white">Claim</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed animate-slide-up delay-200">
              Revolutionary healthcare claims management powered by blockchain technology. 
              Secure, transparent, and efficient processing for all stakeholders.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-slide-up delay-300">
              <Button
                onClick={() => navigate("/login")}
                className="h-14 px-8 text-lg font-semibold bg-gradient-to-r from-neon-cyan to-neon-purple hover:shadow-lg hover:shadow-neon-cyan/25 text-dark-bg transition-all duration-300"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              
              <Button
                variant="outline"
                className="h-14 px-8 text-lg font-semibold border-neon-cyan text-neon-cyan hover:bg-neon-cyan/10 hover:border-neon-cyan/80 transition-all duration-300"
              >
                Watch Demo
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 animate-slide-up delay-500">
              <div className="text-center">
                <div className="text-4xl font-bold gradient-neon-text mb-2">99.9%</div>
                <div className="text-gray-400">Uptime Guarantee</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold gradient-neon-text mb-2">2.5M+</div>
                <div className="text-gray-400">Claims Processed</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold gradient-neon-text mb-2">24/7</div>
                <div className="text-gray-400">Support Available</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-dark-bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why Choose SecureClaim?
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Built with cutting-edge technology to revolutionize healthcare claims processing
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="glass-effect p-8 rounded-xl border border-neon-cyan/20 hover:border-neon-cyan/40 transition-all duration-300 animate-slide-up"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-neon-cyan to-neon-purple rounded-lg flex items-center justify-center mb-6">
                    <Icon className="h-6 w-6 text-dark-bg" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Claims Process?
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Join thousands of healthcare professionals already using SecureClaim
          </p>
          <Button
            onClick={() => navigate("/login")}
            className="h-14 px-8 text-lg font-semibold bg-gradient-to-r from-neon-cyan to-neon-purple hover:shadow-lg hover:shadow-neon-cyan/25 text-dark-bg transition-all duration-300"
          >
            Start Your Free Trial
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
