// Shared status helpers for tasks.

//Ordered list of valid task statuses used by the board.
//If we ever change columns (add new one, reorder) we do it in one place.
export const STATUS_FLOW = ['BACKLOG', 'TODO', 'IN_PROGRESS', 'DONE'];

//Check if provided status is one of the allowed statuses.
export function isValidStatus(status) {
  return STATUS_FLOW.includes(status);
}

// Used by the board advance endpoint to enforce "move only one column to the right".
export function isNextStatus(from, to) {
  const fromIndex = STATUS_FLOW.indexOf(from);
  const toIndex = STATUS_FLOW.indexOf(to);

  if (fromIndex === -1 || toIndex === -1) return false;

  return toIndex - fromIndex === 1;
}
