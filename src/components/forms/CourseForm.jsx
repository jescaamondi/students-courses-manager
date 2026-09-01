"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { createCourse, updateCourse } from "@/lib/api";
import { FormStateTracker } from "@/components/FormStateTracker";

const schema = z.object({
  code: z
    .string()
    .regex(/^[A-Za-z]{2,6}[0-9]{2,4}$/, "2–6 letters then 2–4 numbers"),
  title: z
    .string()
    .min(3, "Minimum 3 characters")
    .max(100, "Maximum 100 characters"),
  instructor: z
    .string()
    .min(2, "Minimum 2 characters")
    .max(60, "Maximum 60 characters"),
  credits: z.coerce.number().min(1, "Minimum 1").max(6, "Maximum 6"),
});

export function CourseForm({ course, onSuccess, onCancel }) {
  const queryClient = useQueryClient();
  const isEditing = !!course;

  const { register, handleSubmit, setError, reset, formState, getFieldState } =
    useForm({
      mode: "onBlur",
      resolver: zodResolver(schema),
      defaultValues: {
        code: "",
        title: "",
        instructor: "",
        credits: 3,
      },
    });

  useEffect(() => {
    if (course) {
      reset({
        code: course.code,
        title: course.title,
        instructor: course.instructor,
        credits: course.credits,
      });
    }
  }, [course, reset]);

  const mutation = useMutation({
    mutationFn: (data) => {
      if (isEditing) return updateCourse(course.id, data);
      return createCourse(data);
    },
    onSuccess: (payload) => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      if (isEditing)
        queryClient.invalidateQueries({ queryKey: ["course", course.id] });
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
  const codeState = getFieldState("code", formState);

  return (
    <div className="bg-neutral-900 p-6 rounded-xl border border-neutral-800 mb-6">
      <h2 className="text-xl font-bold mb-4 text-white">
        {isEditing ? `Edit Course #${course.id}` : "Add Course"}
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
            Code (e.g. WEB101)
          </label>
          <input
            {...register("code")}
            className={`bg-neutral-950 border rounded-lg px-4 py-2.5 text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-neutral-600 transition-all ${
              codeState.invalid
                ? "border-red-500/50 focus:ring-red-500/30"
                : "border-neutral-700"
            }`}
          />
          {formState.errors.code && (
            <span className="text-red-400 text-xs">
              {formState.errors.code.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-400">Title</label>
          <input
            {...register("title")}
            className={`bg-neutral-950 border rounded-lg px-4 py-2.5 text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-neutral-600 transition-all ${
              formState.errors.title
                ? "border-red-500/50 focus:ring-red-500/30"
                : "border-neutral-700"
            }`}
          />
          {formState.errors.title && (
            <span className="text-red-400 text-xs">
              {formState.errors.title.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-400">
            Instructor
          </label>
          <input
            {...register("instructor")}
            className={`bg-neutral-950 border rounded-lg px-4 py-2.5 text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-neutral-600 transition-all ${
              formState.errors.instructor
                ? "border-red-500/50 focus:ring-red-500/30"
                : "border-neutral-700"
            }`}
          />
          {formState.errors.instructor && (
            <span className="text-red-400 text-xs">
              {formState.errors.instructor.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-400">
            Credits (1–6)
          </label>
          <input
            type="number"
            {...register("credits")}
            className={`bg-neutral-950 border rounded-lg px-4 py-2.5 text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-neutral-600 transition-all ${
              formState.errors.credits
                ? "border-red-500/50 focus:ring-red-500/30"
                : "border-neutral-700"
            }`}
          />
          {formState.errors.credits && (
            <span className="text-red-400 text-xs">
              {formState.errors.credits.message}
            </span>
          )}
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
