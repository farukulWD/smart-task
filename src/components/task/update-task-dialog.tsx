import React from "react";
import ResponsiveDialog from "../responsive-dialog";
import { TaskForm } from "./task-form";
import { Task } from "@/lib/types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialTask: Task;
}

function UpdateTaskDialog({ onOpenChange, open, initialTask }: Props) {
  return (
    <ResponsiveDialog
      title="New Task"
      description="Add New your task"
      onOpenChange={onOpenChange}
      open={open}
    >
      <TaskForm onCancel={() => onOpenChange(false)} task={initialTask} />
    </ResponsiveDialog>
  );
}

export default UpdateTaskDialog;
