"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Calendar, CheckCircle2, Circle, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/use-locale";
import { Task } from "@/lib/types";
import { LanguageSwitcher } from "../language-switcher";
import NewTaskDialog from "./new-task-dialog";
import SummaryCard from "./summary-card";
import { TaskCard } from "./task-card";
import { Card, CardContent } from "../ui/card";
import UpdateTaskDialog from "./update-task-dialog";
import { SubtaskSuggestions } from "./subtask-suggestions";

export default function TaskView() {
  const { t } = useTranslation();
  const [tasks, setTasks] = useState<Task[]>();
  const [onOpenAd, setOnOpenAd] = useState(false);
  const [updateTask, setUpdateTask] = useState<Task>();
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [suggestingFor, setSuggestingFor] = useState<string | null>(null);

  const loadTasks = () => {
    const saved = localStorage.getItem("smart-tasks");
    if (saved) {
      try {
        setTasks(JSON.parse(saved));
      } catch (error) {
        console.error("Failed to parse tasks:", error);
      }
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);
  const pendingTasks = tasks?.filter((task) => task.status === "pending");
  const completedTasks = tasks?.filter((task) => task.status === "completed");

  const toggleTaskStatus = (id: string) => {
    const changeStatus = tasks?.map((task) =>
      task.id === id
        ? {
            ...task,
            status: task.status === "pending" ? "completed" : "pending",
          }
        : task
    );

    setTasks((changeStatus as Task[]) || []);

    localStorage.setItem("smart-tasks", JSON.stringify(changeStatus));
    loadTasks();
  };

  const deleteTask = (id: string) => {
    const remainTasks = tasks?.filter((task) => task.id !== id);
    setTasks(remainTasks);
    localStorage.setItem("smart-tasks", JSON.stringify(remainTasks));
    loadTasks();
  };
  const handleSuggestSubtasks = (taskId: string) => {
    setSuggestingFor(taskId);
  };

  const addTask = (taskData: Omit<Task, "id" | "createdAt">) => {
    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };

    const updatedTasks = [...(tasks || []), newTask];
    localStorage.setItem("smart-tasks", JSON.stringify(updatedTasks));
    setTasks(updatedTasks);
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4"
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div className="text-center mb-8">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1" />
            <div className="flex-1 text-center">
              <motion.h1
                className="text-4xl font-bold text-gray-900 mb-2"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                {t("appTitle")}
              </motion.h1>
              <motion.p
                className="text-gray-600"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                {t("appSubtitle")}
              </motion.p>
            </div>
            <div className="flex-1 flex justify-end">
              <LanguageSwitcher />
            </div>
          </div>
        </motion.div>

        <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <SummaryCard
            label={t("totalTasks")}
            value={tasks?.length || 0}
            color="blue"
            icon={<Calendar className="h-6 w-6 text-blue-600" />}
          />

          <SummaryCard
            label={t("pending")}
            value={pendingTasks?.length || 0}
            color="orange"
            icon={<Circle className="h-6 w-6 text-orange-600" />}
          />

          <SummaryCard
            label={t("completed")}
            value={completedTasks?.length || 0}
            color="green"
            icon={<CheckCircle2 className="h-6 w-6 text-green-600" />}
          />
        </motion.div>

        <motion.div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pending Tasks */}
          <div>
            <motion.h2
              className="text-2xl font-semibold text-gray-900 mb-4 flex items-center"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Circle className="h-6 w-6 text-orange-500 mr-2" />
              {t("pendingTasksCount", { count: pendingTasks?.length || 0 })}
            </motion.h2>
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {pendingTasks?.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onToggleStatus={toggleTaskStatus}
                    onEdit={(task) => {
                      setUpdateTask(task);
                      setIsEdit(true);
                    }}
                    onDelete={deleteTask}
                    onSuggestSubtasks={handleSuggestSubtasks}
                  />
                ))}
              </AnimatePresence>
              {pendingTasks?.length === 0 && (
                <motion.div initial="hidden" animate="visible">
                  <Card className="border-dashed border-2 border-gray-300">
                    <CardContent className="p-8 text-center">
                      <Circle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">{t("noPendingTasks")}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </div>
          </div>

          {/* Completed Tasks */}
          <div>
            <motion.h2
              className="text-2xl font-semibold text-gray-900 mb-4 flex items-center"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <CheckCircle2 className="h-6 w-6 text-green-500 mr-2" />
              {t("completedTasksCount", { count: completedTasks?.length || 0 })}
            </motion.h2>
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {completedTasks?.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onToggleStatus={toggleTaskStatus}
                    onEdit={(task) => {
                      setUpdateTask(task);
                      setIsEdit(true);
                    }}
                    onDelete={deleteTask}
                    onSuggestSubtasks={handleSuggestSubtasks}
                  />
                ))}
              </AnimatePresence>
              {completedTasks?.length === 0 && (
                <motion.div initial="hidden" animate="visible">
                  <Card className="border-dashed border-2 border-gray-300">
                    <CardContent className="p-8 text-center">
                      <CheckCircle2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">{t("noCompletedTasks")}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Add Task Button */}
        <motion.div className="my-8 max-w-fit">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={() => setOnOpenAd(true)}
              className="bg-blue-600 hover:bg-blue-700"
              size="lg"
            >
              <Plus className="h-5 w-5 mr-2" />
              {t("addNewTask")}
            </Button>
          </motion.div>
        </motion.div>

        {/* Task Modal */}
        <AnimatePresence>
          {onOpenAd && (
            <NewTaskDialog
              open={onOpenAd}
              onOpenChange={(isOpen) => {
                setOnOpenAd(isOpen);
                if (!isOpen) loadTasks();
              }}
            />
          )}
        </AnimatePresence>
        {/* update modal */}
        {updateTask && (
          <AnimatePresence>
            {isEdit && (
              <UpdateTaskDialog
                open={isEdit}
                onOpenChange={(value) => {
                  setIsEdit(value);
                  if (!value) loadTasks();
                }}
                initialTask={updateTask}
              />
            )}
          </AnimatePresence>
        )}

        <AnimatePresence>
          {suggestingFor && tasks && (
            <SubtaskSuggestions
              task={tasks.find((item) => item?.id === suggestingFor) as Task}
              onClose={() => setSuggestingFor(null)}
              onCreateTask={addTask}
            />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
