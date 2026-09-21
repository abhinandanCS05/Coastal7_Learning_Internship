import logging
from .database import Database
from .manager import TaskManager
from .models import Task
from .exporter import export_tasks

def main():
    logging.basicConfig(level=logging.INFO, format="%(asctime)s | %(levelname)s | %(message)s",
                        handlers=[logging.FileHandler("logs/task_manager.log"), logging.StreamHandler()])
    db = Database(); db.initialize(); manager = TaskManager(db)
    while True:
        print("\n1.Add  2.List  3.Update  4.Delete  5.Search  6.Export JSON  7.Statistics  8.Exit")
        choice = input("Choose: ").strip()
        try:
            if choice == "1":
                task = manager.add_task(Task(input("Title: "), input("Description: "), priority=input("Priority (low/medium/high): ") or "medium"))
                print("Created:", task.id)
            elif choice == "2":
                [print(r) for r in manager.list_tasks()]
            elif choice == "3":
                i = int(input("Task ID: ")); status=input("Status (blank=keep): ") or None; priority=input("Priority (blank=keep): ") or None
                print(manager.update_task(i, status=status, priority=priority))
            elif choice == "4":
                print("Deleted" if manager.delete_task(int(input("Task ID: "))) else "Not found")
            elif choice == "5":
                [print(r) for r in manager.search_tasks(input("Keyword: "))]
            elif choice == "6": print("Exported:", export_tasks(manager.list_tasks()))
            elif choice == "7": print(manager.statistics())
            elif choice == "8": break
            else: print("Invalid option")
        except (ValueError, TypeError) as e: print("Input error:", e)
        except Exception as e: logging.exception("Unexpected error"); print("Unexpected error:", e)

if __name__ == "__main__": main()
