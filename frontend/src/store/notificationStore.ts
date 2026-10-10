import { create } from "zustand";

export type NotificationItem = {
  id: string;
  title: string;
  message: string;
  type: "order" | "system" | "chat" | "success";
  createdAt: string;
  read: boolean;
};

type NotificationStore = {
  notifications: NotificationItem[];
  addNotification: (
    notification: Omit<NotificationItem, "id" | "createdAt" | "read">
  ) => void;
  markAllRead: () => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
};

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],

  addNotification: (notification) =>
    set((state) => ({
      notifications: [
        {
          ...notification,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          read: false,
        },
        ...state.notifications,
      ].slice(0, 30),
    })),

  markAllRead: () =>
    set((state) => ({
      notifications: state.notifications.map((item) => ({
        ...item,
        read: true,
      })),
    })),

  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter(
        (item) => item.id !== id
      ),
    })),

  clearNotifications: () => set({ notifications: [] }),
}));
