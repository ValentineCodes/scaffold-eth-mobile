import { useCallback, useState } from "react";
import EncryptedStorage from "react-native-encrypted-storage";

/**
 * Type for useSecureStorage return object.
 */
interface UseSecureStorageReturn {
  saveItem: <T>(key: string, value: T) => Promise<void>;
  getItem: <T>(key: string) => Promise<T | null>;
  removeItem: (key: string) => Promise<void>;
  loading: boolean;
  error: string | null;
}

/**
 * A custom React hook for interacting with react-native-encrypted-storage.
 * It provides methods to securely store, retrieve, and remove sensitive data.
 *
 * @returns {UseSecureStorageReturn} The functions and states for secure storage.
 */
export function useSecureStorage(): UseSecureStorageReturn {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Save a key-value pair to EncryptedStorage.
   *
   * @template T - The type of the value being stored.
   * @param {string} key - The key to store the value under.
   * @param {T} value - The value to store (will be stringified if an object).
   * @returns {Promise<void>} - A promise that resolves when the operation is complete.
   */
  const saveItem = useCallback(
    async <T>(key: string, value: T): Promise<void> => {
      try {
        setLoading(true);
        setError(null);
        const stringValue =
          typeof value === "object" ? JSON.stringify(value) : String(value);
        await EncryptedStorage.setItem(key, stringValue);
      } catch (err) {
        setError((err as Error).message || "Failed to save item.");
        console.error("useSecureStorage saveItem error:", err);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  /**
   * Retrieve a value by key from EncryptedStorage.
   *
   * @template T - The expected type of the stored value.
   * @param {string} key - The key of the value to retrieve.
   * @returns {Promise<T | null>} - A promise resolving to the retrieved value (parsed if JSON) or null if not found.
   */
  const getItem = useCallback(async <T>(key: string): Promise<T | null> => {
    try {
      setLoading(true);
      setError(null);
      const value = await EncryptedStorage.getItem(key);
      return value ? (JSON.parse(value) as T) : null;
    } catch (err) {
      setError((err as Error).message || "Failed to retrieve item.");
      console.error("useSecureStorage getItem error:", err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Remove a value by key from EncryptedStorage.
   *
   * @param {string} key - The key of the value to remove.
   * @returns {Promise<void>} - A promise that resolves when the operation is complete.
   */
  const removeItem = useCallback(async (key: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      await EncryptedStorage.removeItem(key);
    } catch (err) {
      setError((err as Error).message || "Failed to remove item.");
      console.error("useSecureStorage removeItem error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    saveItem,
    getItem,
    removeItem,
    loading,
    error,
  };
}
