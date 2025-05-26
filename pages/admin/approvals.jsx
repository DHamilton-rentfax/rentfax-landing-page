// pages/admin/approvals.jsx
import React, { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectRoute";
import { useAuth } from "../../context/AuthContext";

function ApprovalsPageContent() {
  const { user } = useAuth();
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch pending on mount
  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await fetch("/api/admin/pending-editors");
        const data = await res.json();
        setPending(data);
      } catch (err) {
        console.error("Failed to load pending editors", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function update(userId, action) {
    setLoading(true);
    try {
      await fetch("/api/admin/update-editor-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, action }),
      });
      setPending((p) => p.filter((u) => u._id !== userId));
    } catch (err) {
      console.error("Failed to update status", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="pt-24 px-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Approve New Editors</h1>
      {loading && <p className="text-gray-500">Loading…</p>}
      {!loading && pending.length === 0 && (
        <p className="text-gray-600">No pending requests.</p>
      )}
      <ul className="space-y-4">
        {pending.map((u) => (
          <li
            key={u._id}
            className="flex justify-between items-center p-4 border rounded"
          >
            <div>
              <p className="font-medium">{u.email}</p>
              <p className="text-sm text-gray-500">
                Requested: {new Date(u.createdAt).toLocaleString()}
              </p>
            </div>
            <div className="space-x-2">
              <button
                disabled={loading}
                onClick={() => update(u._id, "approve")}
                className="px-3 py-1 bg-green-600 text-white rounded disabled:opacity-50"
              >
                Approve
              </button>
              <button
                disabled={loading}
                onClick={() => update(u._id, "reject")}
                className="px-3 py-1 bg-red-600 text-white rounded disabled:opacity-50"
              >
                Reject
              </button>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}

export default function ApprovalsPage() {
  // Wrap the content in your own ProtectedRoute (editors+admins)
  return (
    <ProtectedRoute>
      <ApprovalsPageContent />
    </ProtectedRoute>
  );
}
