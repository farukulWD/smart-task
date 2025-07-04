"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Lightbulb, Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { useTranslation } from "@/hooks/use-locale";
import { Task } from "@/lib/types";

interface SubtaskSuggestionsProps {
  task: Task;
  onClose: () => void;
  onCreateTask: (taskData: Omit<Task, "id" | "createdAt">) => void;
}

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const suggestionVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.3,
    },
  }),
};

export function SubtaskSuggestions({
  task,
  onClose,
  onCreateTask,
}: SubtaskSuggestionsProps) {
  const { t } = useTranslation();
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const generateSuggestions = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/suggest-subtasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: task.title,
          description: task.description,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 503) {
          setError(t("aiServiceOverloaded"));
        } else if (response.status === 429) {
          setError(t("apiQuotaExceeded"));
        } else {
          setError(data.error || t("failedToGenerateSuggestions"));
        }
        return;
      }

      setSuggestions(data.suggestions);
      setRetryCount(0);
    } catch (err) {
      console.error("Error generating suggestions:", err);
      setError(t("networkError"));
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1);
    generateSuggestions();
  };

  const createSubtaskAsTask = (suggestion: string, index: number) => {
    const subtaskData = {
      title: `${task.title} - Step ${index + 1}`,
      description: suggestion,
      status: "pending" as const,
      dueDate: task.dueDate,
    };
    onCreateTask(subtaskData);
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/5 bg-opacity-10 flex items-center justify-center p-4 z-50"
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={onClose}
      >
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={(e) => e.stopPropagation()}
        >
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div>
                <CardTitle className="flex items-center">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatDelay: 3,
                    }}
                  >
                    <Lightbulb className="h-5 w-5 text-yellow-500 mr-2" />
                  </motion.div>
                  {t("aiSubtaskSuggestions")}
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  {t("breakDownTask", { title: task.title })}
                </p>
              </div>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <X className="h-4 w-4" />
                </Button>
              </motion.div>
            </CardHeader>
            <CardContent>
              {/* Task Info */}
              <motion.div
                className="mb-6 p-4 bg-gray-50 rounded-lg"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h3 className="font-semibold text-gray-900">{task.title}</h3>
                {task.description && (
                  <p className="text-sm text-gray-600 mt-1">
                    {task.description}
                  </p>
                )}
                <Badge variant="secondary" className="mt-2">
                  {t("due", {
                    date: task?.dueDate
                      ? new Date(task.dueDate).toLocaleDateString()
                      : "",
                  })}
                </Badge>
              </motion.div>

              {suggestions?.length === 0 && !loading && !error && (
                <motion.div
                  className="text-center py-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                    }}
                  >
                    <Lightbulb className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  </motion.div>
                  <p className="text-gray-600 mb-4">
                    {t("getAiPoweredSuggestions")}
                  </p>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      onClick={generateSuggestions}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Lightbulb className="h-4 w-4 mr-2" />
                      {t("generateSubtaskSuggestions")}
                    </Button>
                  </motion.div>
                </motion.div>
              )}

              {loading && (
                <motion.div
                  className="text-center w-full md:min-w-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    }}
                  >
                    <Loader2 className="h-8 w-8 text-blue-600 mx-auto mb-4" />
                  </motion.div>
                  <p className="text-gray-600">
                    {retryCount > 0
                      ? t("retryingAttempt", { count: retryCount + 1 })
                      : t("generatingAiSuggestions")}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    {t("thisMayTakeMoments")}
                  </p>
                </motion.div>
              )}

              {/* Error State */}
              {error && (
                <motion.div
                  className="text-center py-8"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <motion.div
                    animate={{ x: [0, -10, 10, -10, 10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                  </motion.div>
                  <p className="text-red-600 mb-4">{error}</p>
                  <div className="flex justify-center space-x-2">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        onClick={handleRetry}
                        variant="outline"
                        disabled={loading}
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        {t("tryAgain")}
                      </Button>
                    </motion.div>
                    {error.includes("overloaded") && (
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          onClick={() => {
                            setTimeout(handleRetry, 5000);
                          }}
                          variant="secondary"
                          disabled={loading}
                        >
                          {t("waitAndRetry")}
                        </Button>
                      </motion.div>
                    )}
                  </div>
                  {retryCount > 0 && (
                    <p className="text-sm text-gray-500 mt-2">
                      {t("retryAttempts", { count: retryCount })}
                    </p>
                  )}
                </motion.div>
              )}

              {suggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {t("suggestedSubtasks")}
                    </h3>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        onClick={generateSuggestions}
                        variant="outline"
                        size="sm"
                        disabled={loading}
                      >
                        {loading ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                          <RefreshCw className="h-4 w-4 mr-2" />
                        )}
                        {t("regenerate")}
                      </Button>
                    </motion.div>
                  </div>

                  <div className="space-y-3">
                    <AnimatePresence>
                      {suggestions.map((suggestion, index) => (
                        <motion.div
                          key={index}
                          custom={index}
                          variants={suggestionVariants}
                          initial="hidden"
                          animate="visible"
                          className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 cursor-pointer transition-colors"
                          onClick={() => createSubtaskAsTask(suggestion, index)}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              createSubtaskAsTask(suggestion, index);
                            }
                          }}
                          whileHover={{ scale: 1.02, x: 5 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <motion.div
                            className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium"
                            whileHover={{ rotate: 5 }}
                          >
                            {index + 1}
                          </motion.div>
                          <div className="flex-1">
                            <p className="text-gray-800">{suggestion}</p>
                            <p className="text-xs text-blue-600 mt-1">
                              {t("clickToCreateTask")}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>

                  <motion.div
                    className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <p className="text-sm text-yellow-800">
                      <strong>{t("tipTitle")}</strong> {t("tipMessage")}
                    </p>
                  </motion.div>
                </motion.div>
              )}

              <motion.div
                className="mt-6 flex justify-end"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button onClick={onClose} variant="outline">
                    {t("close")}
                  </Button>
                </motion.div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
