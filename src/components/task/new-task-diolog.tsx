import React from "react";
import ResponsiveDialog from "../responsive-dialog";
import { TaskForm } from "./task-form";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function NewTaskDialog({ onOpenChange, open }: Props) {
  return (
    <ResponsiveDialog
      title="New Task"
      description="Add New your task"
      onOpenChange={onOpenChange}
      open={open}
    >
      <TaskForm onCancel={() => onOpenChange(false)} />
    </ResponsiveDialog>
  );
}

export default NewTaskDialog;
