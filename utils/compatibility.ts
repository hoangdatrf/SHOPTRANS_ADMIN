// Compatibility matrix for FCL services
// 'X' = incompatible (cannot add to cart)
// 'O' = compatible (can add normally)
// 'WARNING' = conditional (show popup confirmation)

export type CompatibilityStatus = 'X' | 'O' | 'WARNING'

export const FCL_COMPATIBILITY_MATRIX: Record<number, Record<number, CompatibilityStatus>> = {
  // AT ORIGIN Services (1-5)
  1: { // Full EXW service
    1: 'X', 2: 'X', 3: 'X', 4: 'O', 5: 'O',
    16: 'O', 17: 'O', 18: 'O', 19: 'O', 20: 'O',
    28: 'O', 29: 'O', 30: 'O', 31: 'O', 32: 'O', 33: 'O', 34: 'O'
  },
  2: { // Full FCA service
    1: 'X', 2: 'X', 3: 'WARNING', 4: 'O', 5: 'O',
    16: 'O', 17: 'O', 18: 'O', 19: 'O', 20: 'O',
    28: 'O', 29: 'O', 30: 'O', 31: 'O', 32: 'O', 33: 'O', 34: 'O'
  },
  3: { // Customs clearance service only (origin)
    1: 'X', 2: 'WARNING', 3: 'X', 4: 'O', 5: 'O',
    16: 'O', 17: 'O', 18: 'O', 19: 'O', 20: 'O',
    28: 'O', 29: 'O', 30: 'O', 31: 'O', 32: 'O', 33: 'O', 34: 'O'
  },
  4: { // Buy cargo insurance
    1: 'O', 2: 'O', 3: 'O', 4: 'O', 5: 'O',
    16: 'O', 17: 'O', 18: 'O', 19: 'O', 20: 'O',
    28: 'O', 29: 'O', 30: 'O', 31: 'O', 32: 'O', 33: 'O', 34: 'O'
  },
  5: { // Collect/pay charges as nominated
    1: 'O', 2: 'O', 3: 'O', 4: 'O', 5: 'O',
    16: 'O', 17: 'O', 18: 'O', 19: 'O', 20: 'O',
    28: 'O', 29: 'O', 30: 'O', 31: 'O', 32: 'O', 33: 'O', 34: 'O'
  },
  
  // OCEAN/AIR FREIGHT Services (16-20)
  16: { // Place booking at the offered rate
    1: 'O', 2: 'O', 3: 'O', 4: 'O', 5: 'O',
    16: 'X', 17: 'X', 18: 'X', 19: 'X', 20: 'O',
    28: 'O', 29: 'O', 30: 'O', 31: 'O', 32: 'O', 33: 'O', 34: 'O'
  },
  17: { // Place booking at SPOT rate
    1: 'O', 2: 'O', 3: 'O', 4: 'O', 5: 'O',
    16: 'X', 17: 'X', 18: 'X', 19: 'X', 20: 'O',
    28: 'O', 29: 'O', 30: 'O', 31: 'O', 32: 'O', 33: 'O', 34: 'O'
  },
  18: { // Handle the shipment under an available booking
    1: 'O', 2: 'O', 3: 'O', 4: 'O', 5: 'O',
    16: 'X', 17: 'X', 18: 'X', 19: 'X', 20: 'O',
    28: 'O', 29: 'O', 30: 'O', 31: 'O', 32: 'O', 33: 'O', 34: 'O'
  },
  19: { // Place booking under available service contract / quotation
    1: 'O', 2: 'O', 3: 'O', 4: 'O', 5: 'O',
    16: 'X', 17: 'X', 18: 'X', 19: 'X', 20: 'O',
    28: 'O', 29: 'O', 30: 'O', 31: 'O', 32: 'O', 33: 'O', 34: 'O'
  },
  20: { // Switch bill of lading
    1: 'O', 2: 'O', 3: 'O', 4: 'O', 5: 'O',
    16: 'O', 17: 'O', 18: 'O', 19: 'O', 20: 'O',
    28: 'O', 29: 'O', 30: 'O', 31: 'O', 32: 'O', 33: 'O', 34: 'O'
  },
  
  // AT DESTINATION Services (28-34)
  28: { // Full DAP service
    1: 'O', 2: 'O', 3: 'O', 4: 'O', 5: 'O',
    16: 'O', 17: 'O', 18: 'O', 19: 'O', 20: 'O',
    28: 'X', 29: 'X', 30: 'X', 31: 'WARNING', 32: 'O', 33: 'O', 34: 'X'
  },
  29: { // Full DDU service
    1: 'O', 2: 'O', 3: 'O', 4: 'O', 5: 'O',
    16: 'O', 17: 'O', 18: 'O', 19: 'O', 20: 'O',
    28: 'X', 29: 'X', 30: 'X', 31: 'O', 32: 'O', 33: 'O', 34: 'X'
  },
  30: { // Full DDP service
    1: 'O', 2: 'O', 3: 'O', 4: 'O', 5: 'O',
    16: 'O', 17: 'O', 18: 'O', 19: 'O', 20: 'O',
    28: 'X', 29: 'X', 30: 'X', 31: 'O', 32: 'O', 33: 'O', 34: 'X'
  },
  31: { // Customs clearance service only (destination)
    1: 'O', 2: 'O', 3: 'O', 4: 'O', 5: 'O',
    16: 'O', 17: 'O', 18: 'O', 19: 'O', 20: 'O',
    28: 'WARNING', 29: 'O', 30: 'O', 31: 'X', 32: 'O', 33: 'O', 34: 'O'
  },
  32: { // Buy cargo insurance (destination)
    1: 'O', 2: 'O', 3: 'O', 4: 'O', 5: 'O',
    16: 'O', 17: 'O', 18: 'O', 19: 'O', 20: 'O',
    28: 'O', 29: 'O', 30: 'O', 31: 'O', 32: 'O', 33: 'O', 34: 'O'
  },
  33: { // Collect/pay charges as nominated (destination)
    1: 'O', 2: 'O', 3: 'O', 4: 'O', 5: 'O',
    16: 'O', 17: 'O', 18: 'O', 19: 'O', 20: 'O',
    28: 'O', 29: 'O', 30: 'O', 31: 'O', 32: 'O', 33: 'O', 34: 'O'
  },
  34: { // Consignee Delivery Order (D/O) Release Service
    1: 'O', 2: 'O', 3: 'O', 4: 'O', 5: 'O',
    16: 'O', 17: 'O', 18: 'O', 19: 'O', 20: 'O',
    28: 'X', 29: 'X', 30: 'X', 31: 'O', 32: 'O', 33: 'O', 34: 'O'
  }
}

// Compatibility matrix for LCL services
export const LCL_COMPATIBILITY_MATRIX: Record<number, Record<number, CompatibilityStatus>> = {
  // AT ORIGIN Services (6-10)
  6: { // Full EXW service
    6: 'X', 7: 'X', 8: 'X', 9: 'O', 10: 'O',
    21: 'O', 22: 'O', 23: 'O', 24: 'O',
    35: 'O', 36: 'O', 37: 'O', 38: 'O', 39: 'O', 40: 'O', 41: 'O'
  },
  7: { // Full FCA service
    6: 'X', 7: 'X', 8: 'WARNING', 9: 'O', 10: 'O',
    21: 'O', 22: 'O', 23: 'O', 24: 'O',
    35: 'O', 36: 'O', 37: 'O', 38: 'O', 39: 'O', 40: 'O', 41: 'O'
  },
  8: { // Customs clearance service only (origin)
    6: 'X', 7: 'WARNING', 8: 'X', 9: 'O', 10: 'O',
    21: 'O', 22: 'O', 23: 'O', 24: 'O',
    35: 'O', 36: 'O', 37: 'O', 38: 'O', 39: 'O', 40: 'O', 41: 'O'
  },
  9: { // Buy cargo insurance
    6: 'O', 7: 'O', 8: 'O', 9: 'X', 10: 'O',
    21: 'O', 22: 'O', 23: 'O', 24: 'O',
    35: 'O', 36: 'O', 37: 'O', 38: 'O', 39: 'O', 40: 'O', 41: 'O'
  },
  10: { // Collect/pay charges as nominated
    6: 'O', 7: 'O', 8: 'O', 9: 'O', 10: 'X',
    21: 'O', 22: 'O', 23: 'O', 24: 'O',
    35: 'O', 36: 'O', 37: 'O', 38: 'O', 39: 'O', 40: 'O', 41: 'O'
  },
  
  // OCEAN/AIR FREIGHT Services (21-24)
  21: { // Place booking at the offered rate
    6: 'O', 7: 'O', 8: 'O', 9: 'O', 10: 'O',
    21: 'X', 22: 'X', 23: 'X', 24: 'O',
    35: 'O', 36: 'O', 37: 'O', 38: 'O', 39: 'O', 40: 'O', 41: 'O'
  },
  22: { // Handle the shipment under an available booking
    6: 'O', 7: 'O', 8: 'O', 9: 'O', 10: 'O',
    21: 'X', 22: 'X', 23: 'X', 24: 'O',
    35: 'O', 36: 'O', 37: 'O', 38: 'O', 39: 'O', 40: 'O', 41: 'O'
  },
  23: { // Place booking under available service contract / quotation
    6: 'O', 7: 'O', 8: 'O', 9: 'O', 10: 'O',
    21: 'X', 22: 'X', 23: 'X', 24: 'O',
    35: 'O', 36: 'O', 37: 'O', 38: 'O', 39: 'O', 40: 'O', 41: 'O'
  },
  24: { // Switch bill of lading
    6: 'O', 7: 'O', 8: 'O', 9: 'O', 10: 'O',
    21: 'O', 22: 'O', 23: 'O', 24: 'X',
    35: 'O', 36: 'O', 37: 'O', 38: 'O', 39: 'O', 40: 'O', 41: 'O'
  },
  
  // AT DESTINATION Services (35-41)
  35: { // Full DAP service
    6: 'O', 7: 'O', 8: 'O', 9: 'O', 10: 'O',
    21: 'O', 22: 'O', 23: 'O', 24: 'O',
    35: 'X', 36: 'X', 37: 'X', 38: 'WARNING', 39: 'O', 40: 'O', 41: 'X'
  },
  36: { // Full DDU service
    6: 'O', 7: 'O', 8: 'O', 9: 'O', 10: 'O',
    21: 'O', 22: 'O', 23: 'O', 24: 'O',
    35: 'X', 36: 'X', 37: 'X', 38: 'X', 39: 'O', 40: 'O', 41: 'X'
  },
  37: { // Full DDP service
    6: 'O', 7: 'O', 8: 'O', 9: 'O', 10: 'O',
    21: 'O', 22: 'O', 23: 'O', 24: 'O',
    35: 'X', 36: 'X', 37: 'X', 38: 'X', 39: 'O', 40: 'O', 41: 'X'
  },
  38: { // Customs clearance service only (destination)
    6: 'O', 7: 'O', 8: 'O', 9: 'O', 10: 'O',
    21: 'O', 22: 'O', 23: 'O', 24: 'O',
    35: 'WARNING', 36: 'X', 37: 'X', 38: 'X', 39: 'O', 40: 'O', 41: 'O'
  },
  39: { // Buy cargo insurance (destination)
    6: 'O', 7: 'O', 8: 'O', 9: 'O', 10: 'O',
    21: 'O', 22: 'O', 23: 'O', 24: 'O',
    35: 'O', 36: 'O', 37: 'O', 38: 'O', 39: 'X', 40: 'O', 41: 'O'
  },
  40: { // Collect/pay charges as nominated (destination)
    6: 'O', 7: 'O', 8: 'O', 9: 'O', 10: 'O',
    21: 'O', 22: 'O', 23: 'O', 24: 'O',
    35: 'O', 36: 'O', 37: 'O', 38: 'O', 39: 'O', 40: 'X', 41: 'O'
  },
  41: { // Consignee Delivery Order (D/O) Release Service
    6: 'O', 7: 'O', 8: 'O', 9: 'O', 10: 'O',
    21: 'O', 22: 'O', 23: 'O', 24: 'O',
    35: 'X', 36: 'X', 37: 'X', 38: 'O', 39: 'O', 40: 'O', 41: 'O'
  }
}

// Compatibility matrix for Air services
export const AIR_COMPATIBILITY_MATRIX: Record<number, Record<number, CompatibilityStatus>> = {
  // AT ORIGIN Services (11-15)
  11: { // Full EXW service
    11: 'X', 12: 'X', 13: 'X', 14: 'O', 15: 'O',
    25: 'O', 26: 'O', 27: 'O',
    42: 'O', 43: 'O', 44: 'O', 45: 'O', 46: 'O', 47: 'O', 48: 'O'
  },
  12: { // Full FCA service
    11: 'X', 12: 'X', 13: 'WARNING', 14: 'O', 15: 'O',
    25: 'O', 26: 'O', 27: 'O',
    42: 'O', 43: 'O', 44: 'O', 45: 'O', 46: 'O', 47: 'O', 48: 'O'
  },
  13: { // Customs clearance service only (origin)
    11: 'X', 12: 'WARNING', 13: 'X', 14: 'O', 15: 'O',
    25: 'O', 26: 'O', 27: 'O',
    42: 'O', 43: 'O', 44: 'O', 45: 'O', 46: 'O', 47: 'O', 48: 'O'
  },
  14: { // Buy cargo insurance
    11: 'O', 12: 'O', 13: 'O', 14: 'X', 15: 'O',
    25: 'O', 26: 'O', 27: 'O',
    42: 'O', 43: 'O', 44: 'O', 45: 'O', 46: 'X', 47: 'O', 48: 'O'
  },
  15: { // Collect/pay charges as nominated
    11: 'O', 12: 'O', 13: 'O', 14: 'O', 15: 'X',
    25: 'O', 26: 'O', 27: 'O',
    42: 'O', 43: 'O', 44: 'O', 45: 'O', 46: 'O', 47: 'X', 48: 'O'
  },
  
  // OCEAN/AIR FREIGHT Services (25-27)
  25: { // Place booking at the offered rate
    11: 'O', 12: 'O', 13: 'O', 14: 'O', 15: 'O',
    25: 'X', 26: 'X', 27: 'X',
    42: 'O', 43: 'O', 44: 'O', 45: 'O', 46: 'O', 47: 'O', 48: 'O'
  },
  26: { // Handle the shipment under an available booking
    11: 'O', 12: 'O', 13: 'O', 14: 'O', 15: 'O',
    25: 'X', 26: 'X', 27: 'X',
    42: 'O', 43: 'O', 44: 'O', 45: 'O', 46: 'O', 47: 'O', 48: 'O'
  },
  27: { // Place booking under available service contract / quotation
    11: 'O', 12: 'O', 13: 'O', 14: 'O', 15: 'O',
    25: 'X', 26: 'X', 27: 'X',
    42: 'O', 43: 'O', 44: 'O', 45: 'O', 46: 'O', 47: 'O', 48: 'O'
  },
  
  // AT DESTINATION Services (42-48)
  42: { // Full DAP service
    11: 'O', 12: 'O', 13: 'O', 14: 'O', 15: 'O',
    25: 'O', 26: 'O', 27: 'O',
    42: 'X', 43: 'X', 44: 'X', 45: 'WARNING', 46: 'O', 47: 'O', 48: 'X'
  },
  43: { // Full DDU service
    11: 'O', 12: 'O', 13: 'O', 14: 'O', 15: 'O',
    25: 'O', 26: 'O', 27: 'O',
    42: 'X', 43: 'X', 44: 'X', 45: 'X', 46: 'O', 47: 'O', 48: 'X'
  },
  44: { // Full DDP service
    11: 'O', 12: 'O', 13: 'O', 14: 'O', 15: 'O',
    25: 'O', 26: 'O', 27: 'O',
    42: 'X', 43: 'X', 44: 'X', 45: 'X', 46: 'O', 47: 'O', 48: 'X'
  },
  45: { // Customs clearance service only (destination)
    11: 'O', 12: 'O', 13: 'O', 14: 'O', 15: 'O',
    25: 'O', 26: 'O', 27: 'O',
    42: 'WARNING', 43: 'X', 44: 'X', 45: 'X', 46: 'O', 47: 'O', 48: 'O'
  },
  46: { // Buy cargo insurance (destination)
    11: 'O', 12: 'O', 13: 'O', 14: 'X', 15: 'O',
    25: 'O', 26: 'O', 27: 'O',
    42: 'O', 43: 'O', 44: 'O', 45: 'O', 46: 'X', 47: 'O', 48: 'O'
  },
  47: { // Collect/pay charges as nominated (destination)
    11: 'O', 12: 'O', 13: 'O', 14: 'O', 15: 'X',
    25: 'O', 26: 'O', 27: 'O',
    42: 'O', 43: 'O', 44: 'O', 45: 'O', 46: 'O', 47: 'X', 48: 'O'
  },
  48: { // Consignee Delivery Order (D/O) Release Service
    11: 'O', 12: 'O', 13: 'O', 14: 'O', 15: 'O',
    25: 'O', 26: 'O', 27: 'O',
    42: 'X', 43: 'X', 44: 'X', 45: 'O', 46: 'O', 47: 'O', 48: 'O'
  }
}

// Check compatibility between two service IDs
export function checkCompatibility(serviceId1: number, serviceId2: number, serviceType: 'fcl' | 'lcl' | 'air'): CompatibilityStatus {
  let matrix: Record<number, Record<number, CompatibilityStatus>> | undefined
  
  if (serviceType === 'fcl') {
    matrix = FCL_COMPATIBILITY_MATRIX
  } else if (serviceType === 'lcl') {
    matrix = LCL_COMPATIBILITY_MATRIX
  } else if (serviceType === 'air') {
    matrix = AIR_COMPATIBILITY_MATRIX
  } else {
    return 'O'
  }
  
  if (!matrix) {
    return 'O' // Default to compatible if not in matrix
  }
  
  const serviceMatrix = matrix[serviceId1]
  if (!serviceMatrix) {
    return 'O' // Default to compatible if not in matrix
  }
  
  return serviceMatrix[serviceId2] || 'O'
}

// Check if service can be added to cart based on existing cart items
// cartItems should include serviceType for proper filtering
export function canAddToCart(
  serviceId: number, 
  cartItems: Array<{ id: number; serviceType?: 'fcl' | 'lcl' | 'air' }>, 
  serviceType: 'fcl' | 'lcl' | 'air'
): { canAdd: boolean; status: CompatibilityStatus; conflictingServiceId?: number } {
  // Filter cart items by same serviceType
  const sameTypeCartItems = cartItems.filter(item => item.serviceType === serviceType)
  
  // If no items of same type in cart, can always add
  if (sameTypeCartItems.length === 0) {
    return { canAdd: true, status: 'O' }
  }
  
  const cartItemIds = sameTypeCartItems.map(item => item.id)
  
  // Check compatibility with all items in cart (same type)
  for (const cartItemId of cartItemIds) {
    const status = checkCompatibility(cartItemId, serviceId, serviceType)
    if (status === 'X') {
      return { canAdd: false, status: 'X', conflictingServiceId: cartItemId }
    }
  }
  
  // Check if any item in cart conflicts with this service
  for (const cartItemId of cartItemIds) {
    const status = checkCompatibility(serviceId, cartItemId, serviceType)
    if (status === 'X') {
      return { canAdd: false, status: 'X', conflictingServiceId: cartItemId }
    }
  }
  
  // Check for warnings
  for (const cartItemId of cartItemIds) {
    const status1 = checkCompatibility(cartItemId, serviceId, serviceType)
    const status2 = checkCompatibility(serviceId, cartItemId, serviceType)
    if (status1 === 'WARNING' || status2 === 'WARNING') {
      return { canAdd: true, status: 'WARNING', conflictingServiceId: cartItemId }
    }
  }
  
  return { canAdd: true, status: 'O' }
}
