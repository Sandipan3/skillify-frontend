import { useEffect, useState } from "react";
import api from "../../api/api";
import toast from "react-hot-toast";

export default function AdminTicketRequests() {
  const [tickets, setTickets] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchTickets();
  }, [page]);

  const fetchTickets = async () => {
    try {
      setLoading(true);

      const res = await api.get(`/ticket?page=${page}`);

      setTickets(res.data.data.tickets || []);
      setTotalPages(res.data.data.totalPages || 1);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch tickets");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, action) => {
    try {
      await api.patch(`/ticket/${id}`, { action });
      toast.success(`Request ${action}`);
      fetchTickets();
    } catch (err) {
      toast.error("Action failed");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-blue-500 flex items-center justify-center text-white">
        Loading requests...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-500 p-4 md:p-8">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl md:text-3xl font-bold text-blue-600 mb-6 text-center">
          Pending Role Requests
        </h2>

        {/* Empty state */}
        {tickets.length === 0 ? (
          <p className="text-center text-gray-500">No pending requests</p>
        ) : (
          <div className="space-y-4">
            {tickets.map((t) => (
              <div
                key={t._id}
                className="border rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
              >
                {/* User info */}
                <div className="space-y-1 text-sm md:text-base">
                  <p className="font-semibold text-gray-800">{t.user?.email}</p>
                  <p className="text-gray-600">
                    Requested:{" "}
                    <span className="font-medium capitalize">
                      {t.requestedRole}
                    </span>
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAction(t._id, "approved")}
                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => handleAction(t._id, "rejected")}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white rounded-lg"
          >
            Prev
          </button>

          <span className="flex items-center font-medium text-gray-700">
            Page {page} of {totalPages}
          </span>

          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white rounded-lg"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
