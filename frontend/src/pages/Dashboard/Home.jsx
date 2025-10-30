import EcommerceMetrics from "../../components/ecommerce/EcommerceMetrics";
import MonthlySalesChart from "../../components/ecommerce/MonthlySalesChart";
import StatisticsChart from "../../components/ecommerce/StatisticsChart";
import MonthlyTarget from "../../components/ecommerce/MonthlyTarget";
import RecentOrders from "../../components/ecommerce/RecentOrders";
import DemographicCard from "../../components/ecommerce/DemographicCard";
import PageMeta from "../../components/common/PageMeta";
import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function Home() {
  const [metrics, setMetrics] = useState({
    totalUsers: 0,
    totalManagers: 0,
    totalDrivers: 0,
    totalTrips: 0,
  });

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await api.get("/dashboard-metrics");
        setMetrics(res.data);
        console.log(setMetrics);
        
      } catch (err) {
        console.error(err);
      }
    };
    fetchMetrics();
  }, []);

  return (
    <>
      <PageMeta
        title="Inventaix | Dashboard"
        description="This is dashboard of inventaix company"
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6 xl:col-span-12">
          <EcommerceMetrics metrics={metrics} />

          <MonthlySalesChart />
        </div>

        {/* <div className="col-span-12 xl:col-span-5">
          <MonthlyTarget />
        </div> */}

        <div className="col-span-12">
          <StatisticsChart />
        </div>

        <div className="col-span-12">
          <RecentOrders />
        </div>
      </div>
    </>
  );
}
