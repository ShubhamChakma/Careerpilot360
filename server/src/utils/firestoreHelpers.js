/**
 * Formats a Firestore document snapshot.
 * @param {object} doc - Document snapshot
 * @returns {object|null} Formatted document with ID
 */
export function formatDoc(doc) {
  if (!doc || !doc.exists) return null;
  return {
    id: doc.id,
    ...doc.data()
  };
}

/**
 * Formats a Firestore query snapshot list.
 * @param {object} snapshot - Query snapshot
 * @returns {Array} List of formatted documents
 */
export function formatSnapshot(snapshot) {
  if (!snapshot || !snapshot.docs) return [];
  return snapshot.docs.map(doc => formatDoc(doc));
}
