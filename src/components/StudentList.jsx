"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getStudents, deleteStudent } from "@/lib/api";
import { useState } from "react";
import { StudentForm } from "./forms/StudentForm";

export function StudentList() {
  const queryClient = useQueryClient();
  const [editingStudent, setEditingStudent] = useState(null);
  const [search, setSearch] = useState("");

  const {
    data: students,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["students", search],
    queryFn: () =>
      getStudents(
        search ? `search=${encodeURIComponent(search)}&limit=100` : "limit=100",
      ),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteStudent,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["students"] }),
  });

  if (isLoading)
    return (
      <div className="p-8 text-center text-neutral-500">Loading students…</div>
    );
  if (error)
    return (
      <div className="p-8 text-center text-red-400">
        Failed to load students.
      </div>
    );

  if (editingStudent) {
    return (
      <StudentForm
        student={editingStudent}
        onSuccess={() => setEditingStudent(null)}
        onCancel={() => setEditingStudent(null)}
      />
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search students…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-600 w-64"
        />
      </div>

      {students?.length === 0 ? (
        <p className="text-neutral-500 text-center py-8">No students found.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-neutral-800">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-neutral-900 text-neutral-400 text-xs uppercase tracking-wider">
                <th className="p-4 border-b border-neutral-800">ID</th>
                <th className="p-4 border-b border-neutral-800">Name</th>
                <th className="p-4 border-b border-neutral-800">Email</th>
                <th className="p-4 border-b border-neutral-800">Courses</th>
                <th className="p-4 border-b border-neutral-800">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students?.map((s) => (
                <tr
                  key={s.id}
                  className="border-b border-neutral-800/50 hover:bg-neutral-900/50 transition-colors"
                >
                  <td className="p-4 text-neutral-500 font-mono text-sm">
                    {s.id}
                  </td>
                  <td className="p-4 font-medium text-white">
                    {s.firstName} {s.lastName}
                  </td>
                  <td className="p-4 text-neutral-400">{s.email}</td>
                  <td className="p-4 text-neutral-500">
                    {s.courseIds?.length || 0}
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => setEditingStudent(s)}
                      className="bg-neutral-800 text-gray-200 px-3 py-1.5 text-xs font-semibold rounded-md hover:bg-neutral-700 transition-colors mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete ${s.firstName} ${s.lastName}?`)) {
                          deleteMutation.mutate(s.id);
                        }
                      }}
                      className="bg-red-500/10 text-red-400 border border-red-500/20 px-3 py-1.5 text-xs font-semibold rounded-md hover:bg-red-500/20 transition-colors disabled:opacity-50"
                      disabled={deleteMutation.isPending}
                    >
                      {deleteMutation.isPending ? "…" : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
