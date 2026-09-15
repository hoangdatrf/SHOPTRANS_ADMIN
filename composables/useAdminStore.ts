import { useState } from '#imports'

export const useAdminStore = () => {
  const usersCount = useState('admin-users-count', () => 0)
  const fclCount = useState('admin-fcl-count', () => 0)

  return {
    usersCount,
    fclCount
  }
}
