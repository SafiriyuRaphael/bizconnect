import { Grid3x3, List, Search } from "lucide-react";
import { useEscrowStore } from "../../store";

export default function Filter({
  handleParamsChange,
}: {
  handleParamsChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
}) {
  const { escrowParams, setViewMode, viewMode } = useEscrowStore();
  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
        <div className="flex-1 max-w-md relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={escrowParams.search}
            onChange={handleParamsChange}
            name="search"
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>

        <div className="flex items-center space-x-3">
          <select
            value={escrowParams.status}
            onChange={handleParamsChange}
            name="status"
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="funded">Funded</option>
            <option value="delivered">Delivered</option>
            <option value="disputed">Disputed</option>
            <option value="released">Released</option>
            <option value="refunded">Refunded</option>
          </select>

          <select
            value={escrowParams.dispute}
            onChange={handleParamsChange}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            <option value="all">All</option>
            <option value="pending">Normal</option>
            <option value="funded">Disputed</option>
          </select>

          <div className="flex items-center border border-gray-300 rounded-lg">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 ${
                viewMode === "grid"
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-500"
              }`}
            >
              <Grid3x3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 ${
                viewMode === "list"
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-500"
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
