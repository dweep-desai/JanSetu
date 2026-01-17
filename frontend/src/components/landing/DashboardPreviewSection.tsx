import { 
  TrendingUp, 
  Users, 
  FileText, 
  Activity,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const dashboardStats = [
  {
    title: "Total Services",
    value: "1,536",
    change: "+12%",
    trend: "up",
    icon: FileText,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    title: "Monthly Users",
    value: "2.4M",
    change: "+18%",
    trend: "up",
    icon: Users,
    color: "text-jansetu-green",
    bgColor: "bg-jansetu-green/10",
  },
  {
    title: "Transactions",
    value: "856K",
    change: "+8%",
    trend: "up",
    icon: TrendingUp,
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    title: "Active Sessions",
    value: "45.2K",
    change: "-3%",
    trend: "down",
    icon: Activity,
    color: "text-jansetu-purple",
    bgColor: "bg-jansetu-purple/10",
  },
];

const topServices = [
  { name: "Aadhaar Services", usage: 85, color: "bg-primary" },
  { name: "PAN Card", usage: 72, color: "bg-accent" },
  { name: "Passport", usage: 65, color: "bg-jansetu-green" },
  { name: "EPFO", usage: 58, color: "bg-jansetu-purple" },
  { name: "DigiLocker", usage: 45, color: "bg-jansetu-red" },
];

const stateData = [
  { state: "Maharashtra", users: "8.2M" },
  { state: "Uttar Pradesh", users: "7.5M" },
  { state: "Karnataka", users: "5.1M" },
  { state: "Tamil Nadu", users: "4.8M" },
  { state: "Gujarat", users: "4.2M" },
];

export const DashboardPreviewSection = () => {
  return (
    <section id="dashboard" className="section-padding">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-block px-4 py-1.5 bg-jansetu-green/10 text-jansetu-green rounded-full text-sm font-medium mb-4">
            Platform Analytics
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Real-time Platform Dashboard
          </h2>
          <p className="text-muted-foreground text-lg">
            Monitor service performance, user engagement, and system health at a glance
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          {dashboardStats.map((stat, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-10 h-10 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <div className={`flex items-center gap-1 text-sm ${
                    stat.trend === "up" ? "text-jansetu-green" : "text-jansetu-red"
                  }`}>
                    {stat.change}
                    {stat.trend === "up" ? (
                      <ArrowUpRight className="w-4 h-4" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4" />
                    )}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-foreground">{stat.value}</h3>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Dashboard Preview Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Service Usage Chart */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Top Services by Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topServices.map((service, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-foreground">{service.name}</span>
                      <span className="text-sm text-muted-foreground">{service.usage}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full ${service.color} rounded-full transition-all duration-1000`}
                        style={{ width: `${service.usage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* State-wise Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Top States by Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stateData.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-xs font-medium text-primary">
                        {index + 1}
                      </span>
                      <span className="text-sm font-medium text-foreground">{item.state}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{item.users}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Health Bar */}
        <Card className="mt-6">
          <CardContent className="p-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-jansetu-green rounded-full animate-pulse" />
                <span className="text-sm font-medium text-foreground">All Systems Operational</span>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span>API Response: <span className="text-jansetu-green font-medium">45ms</span></span>
                <span>Uptime: <span className="text-jansetu-green font-medium">99.98%</span></span>
                <span>Last Updated: <span className="font-medium">2 mins ago</span></span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
