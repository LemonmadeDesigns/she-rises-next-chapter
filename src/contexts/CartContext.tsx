import { createContext, useContext, useReducer, ReactNode } from "react";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
  image?: string;
}

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}

type CartAction = 
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' };

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
} | null>(null);

// Security: Validate cart item data
const validateCartItem = (item: CartItem): boolean => {
  // Validate required fields
  if (!item.id || !item.name || typeof item.price !== 'number' || typeof item.quantity !== 'number') {
    console.error('Invalid cart item: missing required fields');
    return false;
  }

  // Validate price is positive and reasonable
  if (item.price < 0 || item.price > 10000) {
    console.error('Invalid cart item: price out of range');
    return false;
  }

  // Validate quantity is positive integer and within limits
  if (item.quantity < 1 || item.quantity > 99 || !Number.isInteger(item.quantity)) {
    console.error('Invalid cart item: quantity out of range');
    return false;
  }

  // Validate string fields length
  if (item.name.length > 200 || item.id.length > 100) {
    console.error('Invalid cart item: string fields too long');
    return false;
  }

  return true;
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      // Security: Validate item before adding
      if (!validateCartItem(action.payload)) {
        console.error('Attempted to add invalid item to cart');
        return state; // Return unchanged state
      }

      const existingItemIndex = state.items.findIndex(
        item => item.id === action.payload.id &&
                item.size === action.payload.size &&
                item.color === action.payload.color
      );

      let newItems: CartItem[];

      if (existingItemIndex > -1) {
        const newQuantity = state.items[existingItemIndex].quantity + action.payload.quantity;

        // Security: Limit max quantity per item
        if (newQuantity > 99) {
          console.error('Maximum quantity limit reached');
          return state;
        }

        newItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: newQuantity }
            : item
        );
      } else {
        // Security: Limit total number of unique items in cart
        if (state.items.length >= 50) {
          console.error('Maximum cart items limit reached');
          return state;
        }

        newItems = [...state.items, action.payload];
      }

      const total = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);

      return {
        items: newItems,
        total,
        itemCount
      };
    }

    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => 
        !(item.id === action.payload)
      );
      
      const total = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);

      return {
        items: newItems,
        total,
        itemCount
      };
    }

    case 'UPDATE_QUANTITY': {
      if (action.payload.quantity <= 0) {
        return cartReducer(state, { type: 'REMOVE_ITEM', payload: action.payload.id });
      }

      // Security: Validate quantity
      if (!Number.isInteger(action.payload.quantity) || action.payload.quantity > 99) {
        console.error('Invalid quantity update attempted');
        return state;
      }

      const newItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      );

      const total = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);

      return {
        items: newItems,
        total,
        itemCount
      };
    }

    case 'CLEAR_CART':
      return {
        items: [],
        total: 0,
        itemCount: 0
      };

    default:
      return state;
  }
};

const initialState: CartState = {
  items: [],
  total: 0,
  itemCount: 0
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};