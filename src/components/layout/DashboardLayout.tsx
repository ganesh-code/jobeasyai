import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  LogOut,
  Settings,
  LayoutDashboard,
  Briefcase,
  Search,
  Home,
  User,
  Sparkles,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useEffect, useState } from "react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

interface UserData {
  first_name: string;
  last_name: string;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) throw new Error("No user found");

        // Get name from user_profiles
        const { data: profileData, error: profileError } = await supabase
          .from("user_profiles")
          .select("first_name, last_name")
          .eq("user_id", user.id)
          .single();

        if (profileError && profileError.code !== "PGRST116") {
          throw profileError;
        }

        setUserData({
          first_name: profileData?.first_name || "",
          last_name: profileData?.last_name || "",
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Failed to sign out");
    } else {
      navigate("/auth");
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const sidebarItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: Home,
    },
    {
      title: "Find Jobs",
      href: "/find-jobs",
      icon: Search,
    },
    {
      title: "My Applications",
      href: "/applied-jobs",
      icon: Briefcase,
    },
    {
      title: "Profile",
      href: "/profile",
      icon: User,
    },
    {
      title: "Settings",
      href: "/settings",
      icon: Settings,
    },
    {
      title: "Upgrade",
      href: "/upgrade",
      icon: Sparkles,
      className: "text-yellow-500 hover:text-yellow-600",
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 p-4 flex flex-col">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">JobEasyAI</h1>
        </div>

        <nav className="flex-1">
          <ul className="space-y-1">
            {sidebarItems.map((item) => (
              <li key={item.title}>
                <Link to={item.href}>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start ${item.className || ""} ${
                      isActive(item.href)
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.title}
                  </Button>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-auto pt-4 border-t border-gray-200">
          <Button
            variant="ghost"
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto">
          <div className="py-8 px-4">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
