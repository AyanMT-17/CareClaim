import { useState } from "react";
import Layout from "@/components/Layout.jsx";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils.js";
import {
  Search,
  Filter,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  FileText,
  DollarSign,
  Calendar,
  ArrowUpDown,
} from "lucide-react";

// Mock data for claims
const mockClaims = [
  {
    id: "CLM-2024-001",
    patientName: "John Smith",
    provider: "City Medical Center",
    date: "2024-01-15",
    amount: 2450.00,
    status: "approved",
    type: "Outpatient",
    lastUpdate: "2024-01-20",
  },
  {
    id: "CLM-2024-002",
    patientName: "Sarah Johnson",
    provider: "Downtown Clinic",
    date: "2024-01-18",
    amount: 890.50,
    status: "pending",
    type: "Emergency",
    lastUpdate: "2024-01-22",
  },
  {
    id: "CLM-2024-003",
    patientName: "Michael Davis",
    provider: "Metro Hospital",
    date: "2024-01-20",
    amount: 5200.00,
    status: "under_review",
    type: "Surgery",
    lastUpdate: "2024-01-24",
  },
  {
    id: "CLM-2024-004",
    patientName: "Emily Chen",
    provider: "Family Health Care",
    date: "2024-01-22",
    amount: 320.00,
    status: "rejected",
    type: "Consultation",
    lastUpdate: "2024-01-25",
  },
  {
    id: "CLM-2024-005",
    patientName: "Robert Wilson",
    provider: "Specialist Center",
    date: "2024-01-25",
    amount: 1580.75,
    status: "processing",
    type: "Diagnostic",
    lastUpdate: "2024-01-26",
  },
];

const statusConfig = {
  approved: {
    label: "Approved",
    color: "neon-green",
    bgColor: "bg-neon-green/10",
    textColor: "text-neon-green",
    borderColor: "border-neon-green/30",
    icon: CheckCircle,
  },
  pending: {
    label: "Pending",
    color: "neon-yellow",
    bgColor: "bg-neon-yellow/10",
    textColor: "text-neon-yellow",
    borderColor: "border-neon-yellow/30",
    icon: Clock,
  },
  under_review: {
    label: "Under Review",
    color: "neon-orange",
    bgColor: "bg-neon-orange/10",
    textColor: "text-neon-orange",
    borderColor: "border-neon-orange/30",
    icon: AlertTriangle,
  },
  processing: {
    label: "Processing",
    color: "neon-cyan",
    bgColor: "bg-neon-cyan/10",
    textColor: "text-neon-cyan",
    borderColor: "border-neon-cyan/30",
    icon: Clock,
  },
  rejected: {
    label: "Rejected",
    color: "red-500",
    bgColor: "bg-red-500/10",
    textColor: "text-red-400",
    borderColor: "border-red-500/30",
    icon: XCircle,
  },
};

export default function DashboardPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortField, setSortField] = useState("date");
  const [sortDirection, setSortDirection] = useState("desc");

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const filteredClaims = mockClaims
    .filter((claim) => {
      const matchesSearch =
        claim.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        claim.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        claim.provider.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || claim.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let aValue, bValue;
      
      switch (sortField) {
        case "amount":
          aValue = a.amount;
          bValue = b.amount;
          break;
        case "date":
          aValue = new Date(a.date);
          bValue = new Date(b.date);
          break;
        case "patient":
          aValue = a.patientName;
          bValue = b.patientName;
          break;
        default:
          return 0;
      }
      
      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const stats = [
    {
      title: "Total Claims",
      value: "1,247",
      change: "+12%",
      changeType: "increase",
      icon: FileText,
      color: "neon-cyan",
    },
    {
      title: "Approved Claims",
      value: "1,089",
      change: "+8%",
      changeType: "increase",
      icon: CheckCircle,
      color: "neon-green",
    },
    {
      title: "Pending Review",
      value: "127",
      change: "-5%",
      changeType: "decrease",
      icon: Clock,
      color: "neon-yellow",
    },
    {
      title: "Total Value",
      value: "$2.4M",
      change: "+15%",
      changeType: "increase",
      icon: DollarSign,
      color: "neon-purple",
    },
  ];

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-gray-400">Overview of your claims and recent activity</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card
                key={stat.title}
                className="glass-effect border-gray-700 hover:border-neon-cyan/30 transition-all duration-300"
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-400">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold text-white mt-1">
                        {stat.value}
                      </p>
                      <div className="flex items-center mt-2">
                        {stat.changeType === "increase" ? (
                          <TrendingUp className="h-4 w-4 text-neon-green mr-1" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-400 mr-1" />
                        )}
                        <span
                          className={cn(
                            "text-sm font-medium",
                            stat.changeType === "increase"
                              ? "text-neon-green"
                              : "text-red-400"
                          )}
                        >
                          {stat.change}
                        </span>
                      </div>
                    </div>
                    <div className={`p-3 rounded-lg bg-${stat.color}/10`}>
                      <Icon className={`h-6 w-6 text-${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Claims Table */}
        <Card className="glass-effect border-gray-700">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <CardTitle className="text-xl text-white">Recent Claims</CardTitle>
              
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search claims..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-dark-bg-secondary border-gray-600 text-white focus:border-neon-cyan"
                  />
                </div>
                
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40 bg-dark-bg-secondary border-gray-600 text-white">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent className="bg-dark-bg-secondary border-gray-600">
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="under_review">Under Review</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">
                      Claim ID
                    </th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSort("patient")}
                        className="text-gray-400 hover:text-white p-0"
                      >
                        Patient
                        <ArrowUpDown className="ml-1 h-3 w-3" />
                      </Button>
                    </th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">
                      Provider
                    </th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSort("date")}
                        className="text-gray-400 hover:text-white p-0"
                      >
                        Date
                        <ArrowUpDown className="ml-1 h-3 w-3" />
                      </Button>
                    </th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSort("amount")}
                        className="text-gray-400 hover:text-white p-0"
                      >
                        Amount
                        <ArrowUpDown className="ml-1 h-3 w-3" />
                      </Button>
                    </th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">
                      Type
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClaims.map((claim) => {
                    const status = statusConfig[claim.status];
                    const StatusIcon = status.icon;
                    
                    return (
                      <tr
                        key={claim.id}
                        className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors"
                      >
                        <td className="py-4 px-4">
                          <span className="font-mono text-sm text-neon-cyan">
                            {claim.id}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-white font-medium">
                          {claim.patientName}
                        </td>
                        <td className="py-4 px-4 text-gray-300">
                          {claim.provider}
                        </td>
                        <td className="py-4 px-4 text-gray-300">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                            {new Date(claim.date).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="py-4 px-4 text-white font-semibold">
                          ${claim.amount.toLocaleString()}
                        </td>
                        <td className="py-4 px-4">
                          <Badge
                            className={cn(
                              "flex items-center gap-1 w-fit",
                              status.bgColor,
                              status.textColor,
                              status.borderColor
                            )}
                          >
                            <StatusIcon className="h-3 w-3" />
                            {status.label}
                          </Badge>
                        </td>
                        <td className="py-4 px-4 text-gray-300">
                          {claim.type}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              
              {filteredClaims.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-400">No claims found matching your criteria.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
