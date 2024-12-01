import { useRouter } from 'next/navigation';
import { IconDashboard, IconProject, IconEpic, IconStory, IconTask, IconReport, IconToken } from '@/components/icons';

const menuItems = [
  { label: "Dashboard", icon: IconDashboard, path: "/dashboard" },
  { label: "Projects", icon: IconProject, path: "/projects" },
  { label: "Epics", icon: IconEpic, path: "/epics" },
  { label: "User Stories", icon: IconStory, path: "/stories" },
  { label: "Tasks", icon: IconTask, path: "/tasks" },
  { label: "Reports", icon: IconReport, path: "/reports" },
  { label: "Token Balance", icon: IconToken, path: "/tokens" },
];

export default function Sidebar() {
  const router = useRouter();

  return (
    <aside className="w-64 h-screen bg-gray-900 text-white fixed left-0 top-0">
      <div className="p-6">
        <h1 className="text-xl font-bold mb-8">QuantumScribe</h1>
        <nav>
          {menuItems.map((item) => (
            <button
              key={item.label}
              onClick={() => router.push(item.path)}
              className="flex items-center w-full px-4 py-3 mb-2 text-gray-300 rounded-lg hover:bg-gray-800 hover:text-white transition-colors"
            >
              <item.icon className="w-5 h-5 mr-3" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
} 