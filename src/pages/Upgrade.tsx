import DashboardLayout from "@/components/layout/DashboardLayout";
import { UpgradeSection } from "@/components/upgrade/UpgradeSection";

export default function Upgrade() {
  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
        <UpgradeSection />
      </div>
    </DashboardLayout>
  );
}
