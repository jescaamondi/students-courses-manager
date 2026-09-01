"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { createStudent, updateStudent, getCourses } from "@/lib/api";
import { FormStateTracker } from "@/components/FormStateTracker";

const schema = z.object({
  firstName: z
    .string()
    .min(2, "Minimum 2 characters")
    .max(50, "Maximum 50 characters"),
  lastName: z
    .string()
    .min(2, "Minimum 2 characters")
    .max(50, "Maximum 50 characters"),
  email: z.string().email("Must be a valid email"),
  courseIds: z.array(z.number()).default([]),
});

export function StudentForm({ student, onSuccess, onCancel }) {
  const queryClient = useQueryClient();
  const isEditing = !!student;

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState,
    setValue,
    watch,
    getFieldState,
  } = useForm({
    mode: "onBlur",
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      courseIds: [],
    },
  });

  const { data: courses } = useQuery({
    queryKey: ["courses"],
    queryFn: () => getCourses("limit=100"),
  });

  useEffect(() => {
    if (student) {
      reset({
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
        courseIds: student.courseIds || [],
      });
    }
  }, [student, reset]);

  const mutation = useMutation({
    mutationFn: (data) => {
      if (isEditing) return updateStudent(student.id, data);
      return createStudent(data);
    },
    onSuccess: (payload) => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      if (isEditing)
        queryClient.invalidateQueries({ queryKey: ["student", student.id] });
      reset();
      onSuccess?.(payload.data);
    },
    onError: (err) => {
      if (err.status === 400 || err.status === 409) {
        Object.entries(err.fields).forEach(([field, messages]) => {
          setError(field, { message: messages[0] });
        });
      } else {
        setError("root", { message: err.message });
      }
    },
  });

  const onSubmit = (values) => mutation.mutate(values);
  const courseIds = watch("courseIds") || [];
  const emailState = getFieldState("email", formState);

  return (
    <div className="bg-neutral-900 p-6 rounded-xl border border-neutral-800 mb-6">
      <h2 className="text-xl font-bold mb-4 text-white">
        {isEditing ? `Edit Student #${student.id}` : "Add Student"}
      </h2>

      <FormStateTracker formState={formState} />

      {formState.errors.root && (
        <div className="mb-4 p-3 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg text-sm">
          {formState.errors.root.message}
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="flex flex-col gap-4"
      >
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-400">
            First Name
          </label>
          <input
            {...register("firstName")}
            className={`bg-neutral-950 border rounded-lg px-4 py-2.5 text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-neutral-600 transition-all ${
              formState.errors.firstName
                ? "border-red-500/50 focus:ring-red-500/30"
                : "border-neutral-700"
            }`}
          />
          {formState.errors.firstName && (
            <span className="text-red-400 text-xs">
              {formState.errors.firstName.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-400">Last Name</label>
          <input
            {...register("lastName")}
            className={`bg-neutral-950 border rounded-lg px-4 py-2.5 text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-neutral-600 transition-all ${
              formState.errors.lastName
                ? "border-red-500/50 focus:ring-red-500/30"
                : "border-neutral-700"
            }`}
          />
          {formState.errors.lastName && (
            <span className="text-red-400 text-xs">
              {formState.errors.lastName.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-400">Email</label>
          <input
            type="email"
            {...register("email")}
            className={`bg-neutral-950 border rounded-lg px-4 py-2.5 text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-neutral-600 transition-all ${
              emailState.invalid
                ? "border-red-500/50 focus:ring-red-500/30"
                : "border-neutral-700"
            }`}
          />
          {formState.errors.email && (
            <span className="text-red-400 text-xs">
              {formState.errors.email.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-400">Courses</label>
          <select
            multiple
            value={courseIds.map(String)}
            onChange={(e) => {
              const selected = Array.from(e.target.selectedOptions).map((o) =>
                Number(o.value),
              );
              setValue("courseIds", selected, { shouldValidate: true });
            }}
            className="bg-neutral-950 border border-neutral-700 rounded-lg px-4 py-2.5 text-white min-h-[120px] focus:outline-none focus:ring-2 focus:ring-neutral-600"
          >
            {courses?.map((c) => (
              <option key={c.id} value={c.id} className="py-1">
                {c.code} — {c.title}
              </option>
            ))}
          </select>
          <span className="text-xs text-neutral-500">
            Hold Ctrl/Cmd to select multiple
          </span>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={formState.isSubmitting || mutation.isPending}
            className="bg-white text-black py-2.5 px-6 font-bold rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {formState.isSubmitting || mutation.isPending
              ? "Saving…"
              : isEditing
                ? "Update"
                : "Save"}
          </button>
          {isEditing && (
            <button
              type="button"
              onClick={onCancel}
              className="bg-neutral-800 text-gray-200 py-2.5 px-6 font-bold rounded-lg hover:bg-neutral-700 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
