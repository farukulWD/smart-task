"use client";

import * as React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/use-locale";
import { Task } from "@/lib/types";
import { CustomDatePicker } from "../date-picker";
import { toast } from "sonner";

interface TaskFormProps {
  task?: Task | null;
  onCancel: () => void;
}

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  dueDate: z.date(),
  status: z.enum(["pending", "completed"]),
});

type TaskFormValues = z.infer<typeof formSchema>;

export function TaskForm({ task, onCancel }: TaskFormProps) {
  const { t } = useTranslation();

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: task?.title ?? "",
      description: task?.description ?? "",
      dueDate: task?.dueDate ?? new Date(),
      status: task?.status ?? "pending",
    },
  });

  const isEdit = !!task;
  const preTasks = localStorage.getItem("smart-tasks");
  const tasks: Task[] = preTasks ? JSON.parse(preTasks) : [];

  const addTask = (taskData: Omit<Task, "id" | "createdAt">) => {
    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem("smart-tasks", JSON.stringify([...tasks, newTask]));
  };

  const updateTask = (taskData: Omit<Task, "id" | "createdAt">) => {
    if (!isEdit) return;

    const updatedTask = tasks.map((t) =>
      t.id === task.id ? { ...t, taskData } : task
    );
    localStorage.setItem("smart-tasks", JSON.stringify(updatedTask));
  };

  const handleFormSubmit = (values: TaskFormValues) => {
    if (isEdit) {
      updateTask({ ...values, description: values.description ?? "" });
      toast.success("Task update success");
    } else {
      addTask({
        ...values,
        description: values.description ?? "",
        dueDate: new Date(values.dueDate),
      });
      toast.success("Task added success");
    }

    form.reset();

    onCancel();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("titleRequired")}</FormLabel>
              <FormControl>
                <Input placeholder={t("titlePlaceholder")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("description")}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t("descriptionPlaceholder")}
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dueDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("dueDateRequired")}</FormLabel>
              <FormControl>
                <CustomDatePicker
                  onChange={field.onChange}
                  date={field.value}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {task && (
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("status")}</FormLabel>
                <FormControl>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-md"
                    {...field}
                  >
                    <option value="pending">{t("pending")}</option>
                    <option value="completed">{t("completed")}</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div className="flex justify-between gap-x-2">
          <Button
            className="text-red-400 hover:text-red-500"
            onClick={() => onCancel()}
            type="button"
            variant="outline"
          >
            {t("cancel")}
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700" type="submit">
            {task ? t("updateTask") : t("addTask")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
