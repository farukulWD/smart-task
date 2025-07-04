"use client";
import { useTranslation } from "@/hooks/use-locale";
import { Task } from "@/lib/types";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { CheckCircle2, Circle, Edit3, Lightbulb, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { format } from "date-fns";

interface TaskCardProps {
  task: Task;
  onToggleStatus: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onSuggestSubtasks: (id: string) => void;
}

export function TaskCard({
  task,
  onToggleStatus,
  onEdit,
  onDelete,
  onSuggestSubtasks,
}: TaskCardProps) {
  const { t } = useTranslation();
  const isOverdue =
    !!task.dueDate &&
    new Date(task.dueDate) < new Date() &&
    task.status === "pending";

  return (
    <motion.div
      layout
      initial="hidden"
      animate="visible"
      exit="exit"
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className={`transition-all hover:shadow-md ${
          task.status === "completed" ? "opacity-75" : ""
        }`}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3 flex-1">
              <motion.button
                onClick={() => onToggleStatus(task.id)}
                className="mt-1 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {task.status === "completed" ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3, type: "spring" }}
                  >
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  </motion.div>
                ) : (
                  <Circle className="h-5 w-5 text-gray-400 hover:text-blue-500" />
                )}
              </motion.button>
              <div className="flex-1">
                <CardTitle
                  className={`text-lg ${
                    task.status === "completed"
                      ? "line-through text-gray-500"
                      : ""
                  }`}
                >
                  {task.title}
                </CardTitle>
                {task.description && (
                  <p
                    className={`text-sm mt-1 ${
                      task.status === "completed"
                        ? "text-gray-400"
                        : "text-gray-600"
                    }`}
                  >
                    {task.description}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button variant="ghost" size="sm" onClick={() => onEdit(task)}>
                  <Edit3 className="h-4 w-4" />
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(task.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </motion.div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Badge
                  variant={
                    task.status === "completed"
                      ? "default"
                      : isOverdue
                      ? "destructive"
                      : "secondary"
                  }
                >
                  {task.status === "completed"
                    ? t("completed")
                    : isOverdue
                    ? t("overdue")
                    : t("pending")}
                </Badge>
              </motion.div>
              <span className="text-sm text-gray-500">
                {t("due", {
                  date: task.dueDate
                    ? format(new Date(task.dueDate), "MMM dd, yyyy")
                    : "No due date",
                })}
              </span>
            </div>
            {task.status === "pending" && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onSuggestSubtasks(task.id)}
                  className="text-blue-600 border-blue-200 hover:bg-blue-50"
                >
                  <Lightbulb className="h-4 w-4 mr-1" />
                  {t("suggestSubtasks")}
                </Button>
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
