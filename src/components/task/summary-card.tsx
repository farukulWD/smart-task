// components/task/SummaryCard.tsx
"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { ReactNode } from "react";

type SummaryCardProps = {
  label: string;
  value: number;
  color: "blue" | "orange" | "green";
  icon: ReactNode;
};

const bgColors = {
  blue: "bg-blue-100",
  orange: "bg-orange-100",
  green: "bg-green-100",
};

const textColors = {
  blue: "text-gray-900",
  orange: "text-orange-600",
  green: "text-green-600",
};

export default function SummaryCard({
  label,
  value,
  color,
  icon,
}: SummaryCardProps) {
  return (
    <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{label}</p>
              <motion.p
                className={`text-2xl font-bold ${textColors[color]}`}
                key={value}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                {value}
              </motion.p>
            </div>
            <motion.div
              className={`h-12 w-12 ${bgColors[color]} rounded-lg flex items-center justify-center`}
              whileHover={{ rotate: 5 }}
              transition={{ duration: 0.2 }}
            >
              {icon}
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
