
export const openDB = () => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open("taskDatabase", 1);
  
      request.onupgradeneeded = event => {
        const db = event.target.result;
        const objectStore = db.createObjectStore("tasks", { keyPath: "id", autoIncrement: true });
        objectStore.createIndex("status", "status", { unique: false });
        objectStore.createIndex("dueDate", "dueDate", { unique: false });
      };
  
      request.onsuccess = event => {
        const db = event.target.result;
        resolve(db);
      };
  
      request.onerror = event => {
        reject(event.target.error);
      };
    });
  };