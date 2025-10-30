import Chart from "react-apexcharts";
import ChartTab from "../common/ChartTab";
import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function StatisticsChart() {
  const [dates, setDates] = useState([]);
  const [bookings, setBookings] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/weekly-statistics");
        setDates(res.data.dates);
        setBookings(res.data.bookings);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const options = {
    chart: { type: "bar", height: 250, toolbar: { show: false } },
    colors: ["#465FFF"],
    xaxis: { categories: dates },
    dataLabels: { enabled: false },
    grid: { yaxis: { lines: { show: true } } },
    stroke: { show: true, width: 2, colors: ["transparent"] },
  };

  const series = [
    {
      name: "Bookings",
      data: bookings,
    },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
        <div className="w-full">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Weekend Bookings (Sat - Mon)
          </h3>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="min-w-[1000px] xl:min-w-full">
          <Chart options={options} series={series} type="bar" height={250} />
        </div>
      </div>
    </div>
  );
}
