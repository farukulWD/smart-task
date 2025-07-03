"use client";
import { LanguageSwitcher } from "@/components/task/language-switcher";
import NewTaskDialog from "@/components/task/new-task-diolog";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/use-locale";
import { Task } from "@/lib/types";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";

export default function TaskManager() {
  const { t } = useTranslation();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [onOpenAd, setOnOpenAd] = useState(false);

  // Load tasks from localStorage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem("smart-tasks");
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("smart-tasks", JSON.stringify(tasks));
  }, [tasks]);

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

        {/* Add Task Button */}
        <motion.div className="mb-8 max-w-fit">
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

        {/* Task Form Modal */}
        <AnimatePresence>
          {onOpenAd && (
            <NewTaskDialog open={onOpenAd} onOpenChange={setOnOpenAd} />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
