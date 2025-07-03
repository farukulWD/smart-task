"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { type Locale, defaultLocale, locales, translations } from "@/lib/i18n"

interface LocaleContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined)

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale)

  useEffect(() => {
    // Load saved locale from localStorage
    const savedLocale = localStorage.getItem("locale") as Locale
    if (savedLocale && locales.includes(savedLocale)) {
      setLocaleState(savedLocale)
    } else {
      // Try to detect browser language
      const browserLang = navigator.language.split("-")[0] as Locale
      if (locales.includes(browserLang)) {
        setLocaleState(browserLang)
      }
    }
  }, [])

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)
    localStorage.setItem("locale", newLocale)
  }

  return <LocaleContext.Provider value={{ locale, setLocale }}>{children}</LocaleContext.Provider>
}

export function useLocale() {
  const context = useContext(LocaleContext)
  if (context === undefined) {
    throw new Error("useLocale must be used within a LocaleProvider")
  }
  return context
}

export function useTranslation() {
  const { locale } = useLocale()

  type TranslationKey = keyof typeof translations[typeof defaultLocale];

  return {
    t: (key: TranslationKey, params?: Record<string, string | number>) => {
      // Import getTranslation directly instead of using require
      import("@/lib/i18n").then(({ getTranslation }) => {
        return getTranslation(locale, key, params)
      })

     
      const translations: Record<string, Record<string, string>> = {
        en: {
          // Header
          appTitle: "Smart Task Manager",
          appSubtitle: "Organize your tasks with AI-powered subtask suggestions",

          // Stats
          totalTasks: "Total Tasks",
          pending: "Pending",
          completed: "Completed",

          // Actions
          addNewTask: "Add New Task",
          addTask: "Add Task",
          updateTask: "Update Task",
          editTask: "Edit Task",
          deleteTask: "Delete Task",
          cancel: "Cancel",
          close: "Close",
          save: "Save",
          tryAgain: "Try Again",
          waitAndRetry: "Wait & Retry",
          regenerate: "Regenerate",

          // Task Status
          overdue: "Overdue",

          // Task Form
          title: "Title",
          titleRequired: "Title *",
          titlePlaceholder: "Enter task title",
          description: "Description",
          descriptionPlaceholder: "Enter task description (optional)",
          dueDate: "Due Date",
          dueDateRequired: "Due Date *",
          status: "Status",

          // AI Suggestions
          suggestSubtasks: "Suggest Subtasks",
          aiSubtaskSuggestions: "AI Subtask Suggestions",
          breakDownTask: 'Break down "{title}" into actionable steps',
          generateSubtaskSuggestions: "Generate Subtask Suggestions",
          suggestedSubtasks: "Suggested Subtasks",
          clickToCreateTask: "Click to create as a new task",
          generatingAiSuggestions: "Generating AI suggestions...",
          thisMayTakeMoments: "This may take a few moments",
          retryingAttempt: "Retrying... (Attempt {count})",
          retryAttempts: "Retry attempts: {count}",

          // Empty States
          noPendingTasks: "No pending tasks",
          noCompletedTasks: "No completed tasks",
          getAiPoweredSuggestions: "Get AI-powered suggestions to break this task into smaller, actionable steps",

          // Tips
          tipTitle: "💡 Tip:",
          tipMessage:
            "Click on any suggestion above to automatically create it as a new task, or copy these suggestions manually.",

          // Errors
          taskTitleRequired: "Task title is required",
          geminiApiKeyNotConfigured: "Gemini API key not configured",
          aiServiceOverloaded: "The AI service is currently overloaded. Please try again in a few moments.",
          apiQuotaExceeded: "API quota exceeded. Please try again later.",
          failedToGenerateSuggestions: "Failed to generate subtask suggestions. Please try again.",
          networkError: "Network error. Please check your connection and try again.",
          internalServerError: "Internal server error",

          // Due dates
          due: "Due: {date}",

          // Task counts
          pendingTasksCount: "Pending Tasks ({count})",
          completedTasksCount: "Completed Tasks ({count})",

          // Language
          language: "Language",
          selectLanguage: "Select Language",
        },
        es: {
          // Header
          appTitle: "Gestor de Tareas Inteligente",
          appSubtitle: "Organiza tus tareas con sugerencias de subtareas impulsadas por IA",

          // Stats
          totalTasks: "Total de Tareas",
          pending: "Pendientes",
          completed: "Completadas",

          // Actions
          addNewTask: "Agregar Nueva Tarea",
          addTask: "Agregar Tarea",
          updateTask: "Actualizar Tarea",
          editTask: "Editar Tarea",
          deleteTask: "Eliminar Tarea",
          cancel: "Cancelar",
          close: "Cerrar",
          save: "Guardar",
          tryAgain: "Intentar de Nuevo",
          waitAndRetry: "Esperar y Reintentar",
          regenerate: "Regenerar",

          // Task Status
          overdue: "Vencida",

          // Task Form
          title: "Título",
          titleRequired: "Título *",
          titlePlaceholder: "Ingresa el título de la tarea",
          description: "Descripción",
          descriptionPlaceholder: "Ingresa la descripción de la tarea (opcional)",
          dueDate: "Fecha de Vencimiento",
          dueDateRequired: "Fecha de Vencimiento *",
          status: "Estado",

          // AI Suggestions
          suggestSubtasks: "Sugerir Subtareas",
          aiSubtaskSuggestions: "Sugerencias de Subtareas IA",
          breakDownTask: 'Descomponer "{title}" en pasos accionables',
          generateSubtaskSuggestions: "Generar Sugerencias de Subtareas",
          suggestedSubtasks: "Subtareas Sugeridas",
          clickToCreateTask: "Haz clic para crear como nueva tarea",
          generatingAiSuggestions: "Generando sugerencias de IA...",
          thisMayTakeMoments: "Esto puede tomar unos momentos",
          retryingAttempt: "Reintentando... (Intento {count})",
          retryAttempts: "Intentos de reintento: {count}",

          // Empty States
          noPendingTasks: "No hay tareas pendientes",
          noCompletedTasks: "No hay tareas completadas",
          getAiPoweredSuggestions:
            "Obtén sugerencias impulsadas por IA para dividir esta tarea en pasos más pequeños y accionables",

          // Tips
          tipTitle: "💡 Consejo:",
          tipMessage:
            "Haz clic en cualquier sugerencia arriba para crearla automáticamente como una nueva tarea, o copia estas sugerencias manualmente.",

          // Errors
          taskTitleRequired: "El título de la tarea es requerido",
          geminiApiKeyNotConfigured: "Clave API de Gemini no configurada",
          aiServiceOverloaded:
            "El servicio de IA está actualmente sobrecargado. Por favor, inténtalo de nuevo en unos momentos.",
          apiQuotaExceeded: "Cuota de API excedida. Por favor, inténtalo más tarde.",
          failedToGenerateSuggestions: "Error al generar sugerencias de subtareas. Por favor, inténtalo de nuevo.",
          networkError: "Error de red. Por favor, verifica tu conexión e inténtalo de nuevo.",
          internalServerError: "Error interno del servidor",

          // Due dates
          due: "Vence: {date}",

          // Task counts
          pendingTasksCount: "Tareas Pendientes ({count})",
          completedTasksCount: "Tareas Completadas ({count})",

          // Language
          language: "Idioma",
          selectLanguage: "Seleccionar Idioma",
        },
        fr: {
          // Header
          appTitle: "Gestionnaire de Tâches Intelligent",
          appSubtitle: "Organisez vos tâches avec des suggestions de sous-tâches alimentées par IA",

          // Stats
          totalTasks: "Total des Tâches",
          pending: "En Attente",
          completed: "Terminées",

          // Actions
          addNewTask: "Ajouter Nouvelle Tâche",
          addTask: "Ajouter Tâche",
          updateTask: "Mettre à Jour Tâche",
          editTask: "Modifier Tâche",
          deleteTask: "Supprimer Tâche",
          cancel: "Annuler",
          close: "Fermer",
          save: "Sauvegarder",
          tryAgain: "Réessayer",
          waitAndRetry: "Attendre et Réessayer",
          regenerate: "Régénérer",

          // Task Status
          overdue: "En Retard",

          // Task Form
          title: "Titre",
          titleRequired: "Titre *",
          titlePlaceholder: "Entrez le titre de la tâche",
          description: "Description",
          descriptionPlaceholder: "Entrez la description de la tâche (optionnel)",
          dueDate: "Date d'Échéance",
          dueDateRequired: "Date d'Échéance *",
          status: "Statut",

          // AI Suggestions
          suggestSubtasks: "Suggérer Sous-tâches",
          aiSubtaskSuggestions: "Suggestions de Sous-tâches IA",
          breakDownTask: 'Décomposer "{title}" en étapes réalisables',
          generateSubtaskSuggestions: "Générer Suggestions de Sous-tâches",
          suggestedSubtasks: "Sous-tâches Suggérées",
          clickToCreateTask: "Cliquez pour créer comme nouvelle tâche",
          generatingAiSuggestions: "Génération de suggestions IA...",
          thisMayTakeMoments: "Cela peut prendre quelques instants",
          retryingAttempt: "Nouvelle tentative... (Tentative {count})",
          retryAttempts: "Tentatives de retry: {count}",

          // Empty States
          noPendingTasks: "Aucune tâche en attente",
          noCompletedTasks: "Aucune tâche terminée",
          getAiPoweredSuggestions:
            "Obtenez des suggestions alimentées par IA pour diviser cette tâche en étapes plus petites et réalisables",

          // Tips
          tipTitle: "💡 Astuce:",
          tipMessage:
            "Cliquez sur n'importe quelle suggestion ci-dessus pour la créer automatiquement comme nouvelle tâche, ou copiez ces suggestions manuellement.",

          // Errors
          taskTitleRequired: "Le titre de la tâche est requis",
          geminiApiKeyNotConfigured: "Clé API Gemini non configurée",
          aiServiceOverloaded: "Le service IA est actuellement surchargé. Veuillez réessayer dans quelques instants.",
          apiQuotaExceeded: "Quota API dépassé. Veuillez réessayer plus tard.",
          failedToGenerateSuggestions: "Échec de la génération de suggestions de sous-tâches. Veuillez réessayer.",
          networkError: "Erreur réseau. Veuillez vérifier votre connexion et réessayer.",
          internalServerError: "Erreur interne du serveur",

          // Due dates
          due: "Échéance: {date}",

          // Task counts
          pendingTasksCount: "Tâches en Attente ({count})",
          completedTasksCount: "Tâches Terminées ({count})",

          // Language
          language: "Langue",
          selectLanguage: "Sélectionner la Langue",
        },
        de: {
          // Header
          appTitle: "Intelligenter Aufgabenmanager",
          appSubtitle: "Organisieren Sie Ihre Aufgaben mit KI-gestützten Unteraufgaben-Vorschlägen",

          // Stats
          totalTasks: "Gesamte Aufgaben",
          pending: "Ausstehend",
          completed: "Abgeschlossen",

          // Actions
          addNewTask: "Neue Aufgabe Hinzufügen",
          addTask: "Aufgabe Hinzufügen",
          updateTask: "Aufgabe Aktualisieren",
          editTask: "Aufgabe Bearbeiten",
          deleteTask: "Aufgabe Löschen",
          cancel: "Abbrechen",
          close: "Schließen",
          save: "Speichern",
          tryAgain: "Erneut Versuchen",
          waitAndRetry: "Warten und Wiederholen",
          regenerate: "Regenerieren",

          // Task Status
          overdue: "Überfällig",

          // Task Form
          title: "Titel",
          titleRequired: "Titel *",
          titlePlaceholder: "Aufgabentitel eingeben",
          description: "Beschreibung",
          descriptionPlaceholder: "Aufgabenbeschreibung eingeben (optional)",
          dueDate: "Fälligkeitsdatum",
          dueDateRequired: "Fälligkeitsdatum *",
          status: "Status",

          // AI Suggestions
          suggestSubtasks: "Unteraufgaben Vorschlagen",
          aiSubtaskSuggestions: "KI-Unteraufgaben-Vorschläge",
          breakDownTask: '"{title}" in umsetzbare Schritte aufteilen',
          generateSubtaskSuggestions: "Unteraufgaben-Vorschläge Generieren",
          suggestedSubtasks: "Vorgeschlagene Unteraufgaben",
          clickToCreateTask: "Klicken Sie, um als neue Aufgabe zu erstellen",
          generatingAiSuggestions: "KI-Vorschläge werden generiert...",
          thisMayTakeMoments: "Dies kann einige Momente dauern",
          retryingAttempt: "Wiederholung... (Versuch {count})",
          retryAttempts: "Wiederholungsversuche: {count}",

          // Empty States
          noPendingTasks: "Keine ausstehenden Aufgaben",
          noCompletedTasks: "Keine abgeschlossenen Aufgaben",
          getAiPoweredSuggestions:
            "Erhalten Sie KI-gestützte Vorschläge, um diese Aufgabe in kleinere, umsetzbare Schritte zu unterteilen",

          // Tips
          tipTitle: "💡 Tipp:",
          tipMessage:
            "Klicken Sie auf einen Vorschlag oben, um ihn automatisch als neue Aufgabe zu erstellen, oder kopieren Sie diese Vorschläge manuell.",

          // Errors
          taskTitleRequired: "Aufgabentitel ist erforderlich",
          geminiApiKeyNotConfigured: "Gemini API-Schlüssel nicht konfiguriert",
          aiServiceOverloaded:
            "Der KI-Service ist derzeit überlastet. Bitte versuchen Sie es in wenigen Augenblicken erneut.",
          apiQuotaExceeded: "API-Kontingent überschritten. Bitte versuchen Sie es später erneut.",
          failedToGenerateSuggestions:
            "Fehler beim Generieren von Unteraufgaben-Vorschlägen. Bitte versuchen Sie es erneut.",
          networkError: "Netzwerkfehler. Bitte überprüfen Sie Ihre Verbindung und versuchen Sie es erneut.",
          internalServerError: "Interner Serverfehler",

          // Due dates
          due: "Fällig: {date}",

          // Task counts
          pendingTasksCount: "Ausstehende Aufgaben ({count})",
          completedTasksCount: "Abgeschlossene Aufgaben ({count})",

          // Language
          language: "Sprache",
          selectLanguage: "Sprache Auswählen",
        },
       
      } 

      const defaultLocale = "en"

      let text = translations[locale]?.[key as string] || translations[defaultLocale][key as string] || key

      // Ensure text is always a string before replacement
      text = String(text);

      if (params) {
        Object.entries(params).forEach(([param, value]) => {
          text = String(text).replace(`{${param}}`, String(value))
        })
      }

      return text
    },
    locale,
  }
}
