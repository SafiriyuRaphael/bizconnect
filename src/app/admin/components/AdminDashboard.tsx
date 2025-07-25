"use client";
import { io, Socket } from "socket.io-client";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import {
  Users,
  Building2,
  MessageCircle,
  Phone,
  Video,
  Database,
  TrendingUp,
  TrendingDown,
  Activity,
  Zap,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
} from "lucide-react";
import getUserById from "@/lib/profile/getUserById";
import { AnyUser } from "../../../../types";
import getConnectionsAnalytics from "@/lib/admin/getConnectionsAnalytics";
import getTotalBusiness from "@/lib/admin/getTotalBusiness";
import getLastBusinessUser from "@/lib/admin/getLastBusiness";

type ConnectionsMade = {
  from: string;
  to: string;
};

type Status = {
  chatService: string;
  voiceCalls: string;
  videoCalls: string;
  database: string;
};

type Props = {
  allBusinesses: {
    count: number;
    change: string;
  };
  ConnectionsAnalytics: {
    totalConnections: any;
    thisWeekConnections: any;
    lastWeekConnections: any;
    percentageIncrease: any;
  };
  lastBusiness: AnyUser;
};

const AdminDashboard = ({
  allBusinesses,
  ConnectionsAnalytics,
  lastBusiness,
}: Props) => {
  const { data: session } = useSession();
  const socketRef = useRef<Socket | null>(null);
  const [activeUsers, setActiveUsers] = useState(0);
  const [activeCalls, setActiveCalls] = useState(0);
  const [status, setStatus] = useState<Status | null>(null);
  const [BusinessesCount, setAllBusinessesCount] = useState<{
    count: number;
    change: string;
  }>(allBusinesses);
  const [connectionsAnalytics, setConnectionsAnalytics] = useState<{
    totalConnections: any;
    thisWeekConnections: any;
    lastWeekConnections: any;
    percentageIncrease: any;
  }>(ConnectionsAnalytics);
  const [newBusiness, setnewBusiness] = useState<AnyUser>(lastBusiness);

  const [recentActivities, setRecentActivities] = useState<
    Array<{
      id: string;
      type: "registration" | "call" | "connection";
      message: string;
      timestamp: Date;
      color: string;
    }>
  >([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      socketRef.current = io(process.env.NEXT_PUBLIC_API_URL);
      socketRef.current.emit("register", session?.user?.id);

      socketRef.current.on("active-users", (data: string[]) => {
        console.log("🔥 Active Users: ", data);
        setActiveUsers(data.length);
      });

      socketRef.current.on(
        "activeCalls",
        (data: { total: number; calls: ConnectionsMade[] }) => {
          setActiveCalls(data.total);
        }
      );

      socketRef.current.on("call-initiated", (data: { callerName: string }) => {
        addActivity(
          "call",
          `${data.callerName} initiated a video call`,
          "bg-blue-500"
        );
      });

      socketRef.current.on("newConnection", async (data: ConnectionsMade) => {
        console.log("Chat sent: ", data);
        if (data) {
          const receiver = await getUserById(data.to);
          const caller = await getUserById(data.from);
          const from = receiver?.businessName || receiver?.fullName;
          const to = caller?.businessName || caller?.fullName;

          addActivity(
            "connection",
            `New Connection made between ${from} and ${to}`,
            "bg-purple-500"
          );
        }
      });

      const statusInterval = setInterval(() => {
        socketRef.current?.emit("check-status");
      }, 5000);

      socketRef.current.on("status-update", (data: Status) => {
        console.log("📡 Service Status:", data);
        setStatus(data);
      });

      return () => {
        clearInterval(statusInterval);
        socketRef.current?.disconnect();
      };
    }
  }, [session?.user?.id]);

  // setInterval(async () => {
  //   const allBusinesses = await getTotalBusiness();
  //   setAllBusinessesCount(allBusinesses);
  //   const ConnectionsAnalytics = await getConnectionsAnalytics();
  //   setConnectionsAnalytics(ConnectionsAnalytics);

  //   const lastBusiness = await getLastBusinessUser();
  //   setnewBusiness(lastBusiness);
  // }, 5000);

  const addActivity = (
    type: "registration" | "call" | "connection",
    message: string,
    color: string
  ) => {
    const newActivity = {
      id: Date.now().toString(),
      type,
      message,
      timestamp: new Date(),
      color,
    };
    setRecentActivities((prev) => [newActivity, ...prev.slice(0, 4)]);
  };

  // Add initial business registration activity
  useEffect(() => {
    if (newBusiness?.businessName || newBusiness?.fullName) {
      addActivity(
        "registration",
        `New business registered: ${
          newBusiness.businessName || newBusiness.fullName
        }`,
        "bg-green-500"
      );
    }
  }, [lastBusiness]);

  const getStatusIcon = (statusValue: string) => {
    switch (statusValue?.toLowerCase()) {
      case "online":
      case "active":
      case "healthy":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "warning":
      case "degraded":
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case "offline":
      case "error":
      case "unhealthy":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (statusValue: string) => {
    switch (statusValue?.toLowerCase()) {
      case "online":
      case "active":
      case "healthy":
        return "text-green-600";
      case "warning":
      case "degraded":
        return "text-yellow-600";
      case "offline":
      case "error":
      case "unhealthy":
      case "unknown":
        return "text-red-600";
      default:
        return "text-gray-500";
    }
  };

  const stats = [
    {
      label: "Total Businesses",
      value: BusinessesCount.count.toLocaleString(),
      change: BusinessesCount.change,
      icon: Building2,
      color: "from-blue-500 to-blue-600",
      textColor: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      label: "Active Users",
      value: activeUsers.toLocaleString(),
      icon: Users,
      color: "from-green-500 to-green-600",
      textColor: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      label: "Total Connections",
      value: connectionsAnalytics.totalConnections?.toLocaleString() || "0",
      change: `${connectionsAnalytics.percentageIncrease || 0}%`,
      icon: MessageCircle,
      color: "from-purple-500 to-purple-600",
      textColor: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      label: "Active Calls",
      value: activeCalls.toLocaleString(),
      icon: Phone,
      color: "from-orange-500 to-orange-600",
      textColor: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Real-time business analytics and system monitoring
            </p>
          </div>
          <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-sm border">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600">Live</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="group relative overflow-hidden bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div
                className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity duration-300"
                style={{
                  backgroundImage: `linear-gradient(to bottom right, ${
                    stat.color.split(" ")[1]
                  }, ${stat.color.split(" ")[3]})`,
                }}
              ></div>

              <div className="p-6 relative">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className={`p-2 rounded-xl ${stat.bgColor}`}>
                        <stat.icon className={`w-5 h-5 ${stat.textColor}`} />
                      </div>
                      <p className="text-sm font-medium text-gray-600">
                        {stat.label}
                      </p>
                    </div>
                    <p className="text-3xl font-bold text-gray-900 mb-2">
                      {stat.value}
                    </p>
                  </div>
                </div>

                {stat.change && (
                  <div className="flex items-center">
                    {parseFloat(stat.change) >= 0 ? (
                      <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                    )}
                    <span
                      className={`text-sm font-medium ${
                        parseFloat(stat.change) >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {stat.change}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activities - Takes 2 columns */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Recent Activities
                  </h3>
                  <p className="text-sm text-gray-500">
                    Live updates from your platform
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                {recentActivities.length > 0 ? (
                  recentActivities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start space-x-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                    >
                      <div
                        className={`w-3 h-3 rounded-full ${activity.color} mt-2 flex-shrink-0`}
                      ></div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900 leading-relaxed">
                          {activity.message}
                        </p>
                        <div className="flex items-center mt-2 text-xs text-gray-500">
                          <Clock className="w-3 h-3 mr-1" />
                          {formatTimeAgo(activity.timestamp)}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Activity className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No recent activities</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* System Status */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    System Status
                  </h3>
                  <p className="text-sm text-gray-500">
                    All systems operational
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                {[
                  {
                    label: "Chat Service",
                    value: status?.chatService || "checking...",
                    icon: MessageCircle,
                  },
                  {
                    label: "Voice Calls",
                    value: status?.voiceCalls || "checking...",
                    icon: Phone,
                  },
                  {
                    label: "Video Calls",
                    value: status?.videoCalls || "checking...",
                    icon: Video,
                  },
                  {
                    label: "Database",
                    value: status?.database || "checking...",
                    icon: Database,
                  },
                ].map((service, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                  >
                    <div className="flex items-center space-x-3">
                      <service.icon className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-900">
                        {service.label}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(service.value)}
                      <span
                        className={`text-sm font-medium capitalize ${getStatusColor(
                          service.value
                        )}`}
                      >
                        {service.value}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
