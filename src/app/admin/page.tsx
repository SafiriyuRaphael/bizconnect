"use client";
import { io, Socket } from "socket.io-client";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";

const AdminDashboard = () => {
  const { data: session } = useSession();
  const socketRef = useRef<Socket | null>(null);
  const [activeUsers, setActiveUsers] = useState(0);
  const [activeCalls, setActiveCalls] = useState(0);
  const stats = [
    {
      label: "Total Businesses",
      value: "1,234",
      change: "+12%",
      color: "text-blue-600",
    },
    {
      label: "Active Users",
      value: "5,678",
      change: "+8%",
      color: "text-green-600",
    },
    {
      label: "Connections Made",
      value: "3,456",
      change: "+15%",
      color: "text-purple-600",
    },
    {
      label: "Active Calls",
      value: "23",
      change: "+5%",
      color: "text-orange-600",
    },
  ];

  useEffect(() => {
    socketRef.current = io(process.env.NEXT_PUBLIC_API_URL);
    socketRef.current.emit("register", session?.user.id);

    socketRef.current.on("active-users", (data: string[]) => {
      console.log("🔥 Active Users: ", data);
      setActiveUsers(data.length);
    });

    socketRef.current.on("activeCalls", (data: string[]) => {
      console.log("🔥 Active Calls: ", data);
      setActiveCalls(data.length);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [session?.user.id]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`text-sm font-medium ${stat.color}`}>
                {stat.change}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Recent Activities</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm">
                New business registered: Tech Solutions Inc
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm">
                User John Doe initiated a video call
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-sm">
                Connection made between Marketing Hub and Finance Plus
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">System Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Chat Service</span>
              <span className="text-green-600 text-sm">Online</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Voice Calls</span>
              <span className="text-green-600 text-sm">Online</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Video Calls</span>
              <span className="text-green-600 text-sm">Online</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Database</span>
              <span className="text-green-600 text-sm">Online</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
