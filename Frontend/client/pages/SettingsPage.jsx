import Layout from "@/components/Layout.jsx";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, User, Bell, Shield, CreditCard } from "lucide-react";
import { useNavigate } from "react-router-dom";

const settingsCategories = [
  {
    icon: User,
    title: "Profile Settings",
    description: "Manage your personal information and preferences",
    color: "neon-cyan",
  },
  {
    icon: Bell,
    title: "Notifications",
    description: "Configure email and push notification preferences",
    color: "neon-green",
  },
  {
    icon: Shield,
    title: "Security",
    description: "Password, two-factor authentication, and security settings",
    color: "neon-purple",
  },
  {
    icon: CreditCard,
    title: "Billing",
    description: "Payment methods and subscription management",
    color: "neon-orange",
  },
];

export default function SettingsPage() {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
            <p className="text-gray-400">Manage your account and application preferences</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {settingsCategories.map((category) => {
              const Icon = category.icon;
              return (
                <Card
                  key={category.title}
                  className="glass-effect border-gray-700 hover:border-neon-cyan/30 transition-all duration-300 cursor-pointer"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 rounded-lg bg-${category.color}/10`}>
                        <Icon className={`h-6 w-6 text-${category.color}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-2">
                          {category.title}
                        </h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                          {category.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card className="glass-effect border-gray-700">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-neon-cyan to-neon-purple rounded-full flex items-center justify-center mx-auto mb-6">
                <Settings className="h-8 w-8 text-dark-bg" />
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-4">
                Settings Configuration
              </h2>
              
              <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
                Detailed settings panels for profile management, security configuration, 
                notification preferences, and account settings are coming soon.
              </p>
              
              <Button
                onClick={() => navigate("/dashboard")}
                className="bg-gradient-to-r from-neon-cyan to-neon-purple text-dark-bg hover:shadow-lg hover:shadow-neon-cyan/25"
              >
                Return to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
