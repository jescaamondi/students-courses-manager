"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCourses, deleteCourse } from "@/lib/api";
import { useState } from "react";
import { CourseForm } from "./forms/CourseForm";

export function CourseList() {
  const queryClient = useQueryClient();
  const [editingCourse, setEditingCourse] = useState(null);
  const [search, setSearch] = useState("");

  const {
    data: courses,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["courses", search],
    queryFn: () =>
      getCourses(
        search ? `search=${encodeURIComponent(search)}&limit=100` : "limit=100",
      ),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCourse,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["courses"] }),
  });

  if (isLoading)
    return (
      <div className="p-8 text-center text-neutral-500">Loading courses…</div>
    );
  if (error)
    return (
      <div className="p-8 text-center text-red-400">
        Failed to load courses.
      </div>
    );

  if (editingCourse) {
    return (
      <CourseForm
        course={editingCourse}
        onSuccess={() => setEditingCourse(null)}
        onCancel={() => setEditingCourse(null)}
      />
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search courses…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-600 w-64"
        />
      </div>

      {courses?.length === 0 ? (
        <p className="text-neutral-500 text-center py-8">No courses found.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-neutral-800">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-neutral-900 text-neutral-400 text-xs uppercase tracking-wider">
                <th className="p-4 border-b border-neutral-800">Code</th>
                <th className="p-4 border-b border-neutral-800">Title</th>
                <th className="p-4 border-b border-neutral-800">Instructor</th>
                <th className="p-4 border-b border-neutral-800">Credits</th>
                <th className="p-4 border-b border-neutral-800">Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses?.map((c) => (
                <tr
                  key={c.id}
                  className="border-b border-neutral-800/50 hover:bg-neutral-900/50 transition-colors"
                >
                  <td className="p-4 font-bold text-white font-mono">
                    {c.code}
                  </td>
                  <td className="p-4 text-gray-200">{c.title}</td>
                  <td className="p-4 text-neutral-400">{c.instructor}</td>
                  <td className="p-4 text-neutral-500">{c.credits}</td>
                  <td className="p-4">
                    <button
                      onClick={() => setEditingCourse(c)}
                      className="bg-neutral-800 text-gray-200 px-3 py-1.5 text-xs font-semibold rounded-md hover:bg-neutral-700 transition-colors mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete ${c.code} — ${c.title}?`)) {
                          deleteMutation.mutate(c.id);
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
