"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Lightbulb, FileText, XCircle, RotateCcw } from "lucide-react";
import { AdvisorMetricsSkeleton } from "./loading/AdvisorMetricsSkeleton";
import { fetchDashboardStats } from "@/lib/api/dashboard";

interface DashboardMetrics {
  totalApplications: number;
  underwritingApplications: number;
  declinedApplications: number;
  pendingRenewals: number;
}

const AdvisorDashboardHome: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadMetrics() {
      try {
        setLoading(true);
        const data = await fetchDashboardStats();
        if (data.success) {
          // Map backend data to frontend metrics structure
          const stats = data.data.stats;
          setMetrics({
            totalApplications: stats.totalApplications ?? 0,
            underwritingApplications: stats.underwritingApplications ?? 0,
            declinedApplications: stats.declinedApplications ?? 0,
            pendingRenewals: stats.pendingRenewals ?? 0,
          });
          setError(null);
        } else {
          setError("Failed to load dashboard metrics");
        }
      } catch (err) {
        setError("Failed to load dashboard metrics");
      } finally {
        setLoading(false);
      }
    }
    loadMetrics();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          <AdvisorMetricsSkeleton />
        ) : error ? (
          <div className="col-span-4 text-center text-red-600">{error}</div>
        ) : (
          <>
            {/* Total Applications Card */}
            <Card className="p-4 flex items-center justify-between shadow-sm border border-l-4 border-[#A0D468] rounded-lg">
              <div className="flex flex-col justify-center">
                <h3 className="text-sm font-medium text-gray-500">Total Applications</h3>
                <p className="text-2xl font-bold text-[#A0D468] mt-0.5">
                  {metrics?.totalApplications}
                </p>
              </div>
              <FileText className="h-8 w-8 text-[#A0D468]" />
            </Card>

            {/* Underwriting Card */}
            <Card className="p-4 flex items-center justify-between shadow-sm border border-l-4 border-[#7eb238] rounded-lg">
              <div className="flex flex-col justify-center">
                <h3 className="text-sm font-medium text-gray-500">Submitted</h3>
                <p className="text-2xl font-bold text-[#7eb238] mt-0.5">
                  {metrics?.underwritingApplications}
                </p>
              </div>
              <Lightbulb className="h-8 w-8 text-[#7eb238]" />
            </Card>

            {/* Declined Applications Card */}
            <Card className="p-4 flex items-center justify-between shadow-sm border border-l-4 border-[#5C8D2B] rounded-lg">
              <div className="flex flex-col justify-center">
                <h3 className="text-sm font-medium text-gray-500">Declined Applications</h3>
                <p className="text-2xl font-bold text-[#5C8D2B] mt-0.5">
                  {metrics?.declinedApplications}
                </p>
              </div>
              <XCircle className="h-8 w-8 text-[#5C8D2B]" />
            </Card>

            {/* Pending Renewals Card */}
            <Card className="p-4 flex items-center justify-between shadow-sm border border-l-4 border-[#4F6F2E] rounded-lg">
              <div className="flex flex-col justify-center">
                <h3 className="text-sm font-medium text-gray-500">Inactive</h3>
                <p className="text-2xl font-bold text-[#4F6F2E] mt-0.5">
                  {metrics?.pendingRenewals}
                </p>
              </div>
              <RotateCcw className="h-8 w-8 text-[#4F6F2E]" />
            </Card>
          </>
        )}
      </div>

      <Card className="p-6 shadow-sm border border-gray-200 min-h-[200px] flex items-center justify-center text-gray-500 text-lg">
        {loading ? (
          <p>Loading recent activity...</p>
        ) : (
          <p>Recent activity or quick actions will go here.</p>
        )}
      </Card>
    </div>
  );
};

export default AdvisorDashboardHome;
