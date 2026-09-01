"use client";

import { useState } from "react";
import { StudentForm } from "@/components/forms/StudentForm";
import { CourseForm } from "@/components/forms/CourseForm";
import { StudentList } from "@/components/StudentList";
import { CourseList } from "@/components/CourseList";

export default function Home() {
  const [activeTab, setActiveTab] = useState("students");
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="min-h-screen bg-neutral-950 text-gray-100 p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-white tracking-tight">
        Students & Courses Manager
      </h1>

      <div className="flex gap-1 mb-6 bg-neutral-900 p-1 rounded-lg w-fit">
        <button
          onClick={() => {
            setActiveTab("students");
            setShowForm(false);
          }}
          className={`px-5 py-2 font-semibold rounded-md transition-all ${
            activeTab === "students"
              ? "bg-neutral-700 text-white shadow"
              : "text-gray-400 hover:text-gray-200 hover:bg-neutral-800"
          }`}
        >
          Students
        </button>
        <button
          onClick={() => {
            setActiveTab("courses");
            setShowForm(false);
          }}
          className={`px-5 py-2 font-semibold rounded-md transition-all ${
            activeTab === "courses"
              ? "bg-neutral-700 text-white shadow"
              : "text-gray-400 hover:text-gray-200 hover:bg-neutral-800"
          }`}
        >
          Courses
        </button>
      </div>

      <div className="mb-6">
        <button
          onClick={() => setShowForm((s) => !s)}
          className="bg-white text-black py-2.5 px-6 font-bold rounded-lg hover:bg-gray-200 transition-colors"
        >
          {showForm
            ? "Close Form"
            : activeTab === "students"
              ? "+ Add Student"
              : "+ Add Course"}
        </button>
      </div>

      {showForm && (
        <div className="animate-fade-in">
          {activeTab === "students" ? (
            <StudentForm onSuccess={() => setShowForm(false)} />
          ) : (
            <CourseForm onSuccess={() => setShowForm(false)} />
          )}
        </div>
      )}

      {/* List */}
      <div className="mt-4">
        {activeTab === "students" ? <StudentList /> : <CourseList />}
      </div>
    </div>
  );
}
