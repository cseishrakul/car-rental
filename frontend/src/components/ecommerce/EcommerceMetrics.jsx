import { GiMoebiusTriangle } from "react-icons/gi";
import { FiArrowDown, FiArrowUp, FiUsers, FiTruck, FiUserCheck } from "react-icons/fi";

export default function EcommerceMetrics({ metrics }) {

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 md:gap-6">
      {/* Total Users */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl">
          <FiUsers className="text-gray-800 text-2xl" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Total Users</span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {metrics.totalUsers}
            </h4>
          </div>
          <span className="bg-emerald-100 flex p-1 rounded-lg text-emerald-500">
            <FiArrowUp className="mt-1" />
            10%
          </span>
        </div>
      </div>

      {/* Total Trips */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl">
          <FiTruck className="text-gray-800 text-2xl" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Total Trips</span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              
              {metrics.totalTrips}
            </h4>
          </div>
          <span className="bg-emerald-100 flex p-1 rounded-lg text-emerald-500">
            <FiArrowUp className="mt-1" />
            20%
          </span>
        </div>
      </div>

      {/* Total Drivers */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl">
          <FiUserCheck className="text-gray-800 text-2xl" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Total Drivers</span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              
              {metrics.totalDrivers}
            </h4>
          </div>
          <span className="bg-emerald-100 flex p-1 rounded-lg text-emerald-500">
            <FiArrowUp className="mt-1" />
            2%
          </span>
        </div>
      </div>

      {/* Total Managers */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl">
          <GiMoebiusTriangle className="text-gray-800 text-2xl" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Total Managers</span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              
              {metrics.totalManagers}
            </h4>
          </div>
          <span className="bg-red-100 flex p-1 rounded-lg text-red-500">
            <FiArrowDown className="mt-1" />
           10%
          </span>
        </div>
      </div>
    </div>
  );
}
