const DB_NAME = 'TodoDB';
const STORE_NAME = 'TasksStore';

export interface Task {
    id?: number;
    name: string;
    description: string;
    status: 'created' | 'in progress' | 'done';
  }

export class TaskModel {
    constructor() {
        const request = indexedDB.open(DB_NAME, 1);
        request.onupgradeneeded = () => {
            const db = request.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
            }
        };
    }

    public async getTasks(): Promise<Task[]> {
        return new Promise((resolve) => {
            const request = indexedDB.open(DB_NAME);
            request.onsuccess = () => {
            const db = request.result;
            const transaction = db.transaction(STORE_NAME, 'readonly');
            const store = transaction.objectStore(STORE_NAME);
            const tasksRequest = store.getAll();
            tasksRequest.onsuccess = () => resolve(tasksRequest.result);
            };
        });
    };
      
    public async addTask (task: Omit<Task, 'id'>) {
        return new Promise((resolve) => {
            const request = indexedDB.open(DB_NAME);
            request.onsuccess = () => {
            const db = request.result;
            const transaction = db.transaction(STORE_NAME, 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            store.add(task);
            transaction.oncomplete = () => resolve(true);
            };
        });
    };
      
    public async updateTask (task: Task) {
        return new Promise((resolve) => {
            const request = indexedDB.open(DB_NAME);
            request.onsuccess = () => {
            const db = request.result;
            const transaction = db.transaction(STORE_NAME, 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            store.put(task);
            transaction.oncomplete = () => resolve(true);
            };
        });
    };
      
    public async deleteTask (id: number) {
        return new Promise((resolve) => {
            const request = indexedDB.open(DB_NAME);
            request.onsuccess = () => {
            const db = request.result;
            const transaction = db.transaction(STORE_NAME, 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            store.delete(id);
            transaction.oncomplete = () => resolve(true);
            };
        });
    };
}