import Layout from "@/components/Layout.jsx";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ClaimsPage() {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="p-6">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="glass-effect border-gray-700">
            <CardContent className="p-12">
              <div className="w-24 h-24 bg-gradient-to-r from-neon-cyan to-neon-purple rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText className="h-12 w-12 text-dark-bg" />
              </div>
              
              <h1 className="text-3xl font-bold text-white mb-4">
                My Claims
              </h1>
              
              <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
                This page will show your claim history, detailed status tracking, and claim management tools. 
                The full claims management interface is coming soon.
              </p>
              
              <div className="space-y-4">
                <Button
                  onClick={() => navigate("/submit")}
                  className="bg-gradient-to-r from-neon-cyan to-neon-purple text-dark-bg hover:shadow-lg hover:shadow-neon-cyan/25"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Submit New Claim
                </Button>
                
                <div className="text-center">
                  <Button
                    onClick={() => navigate("/dashboard")}
                    variant="outline"
                    className="border-neon-cyan text-neon-cyan hover:bg-neon-cyan/10"
                  >
                    View Dashboard
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
