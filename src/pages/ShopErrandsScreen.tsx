import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ShoppingBag,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  MapPin,
  X,
  Apple,
  Pill,
  Tv,
  Gift,
  UtensilsCrossed,
  Home as HomeIcon,
  Search,
  ChevronRight } from
'lucide-react';
import { useAppContext } from '../contexts/AppContext';
import { mockRider } from '../data/mockData';
interface ShopCategory {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
  bg: string;
  itemCount: number;
}
interface ShopItem {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  unit: string;
}
interface CartItem extends ShopItem {
  quantity: number;
}
const categories: ShopCategory[] = [
{
  id: 'groceries',
  name: 'Groceries',
  icon: Apple,
  color: 'text-green-600',
  bg: 'bg-green-50',
  itemCount: 6
},
{
  id: 'food',
  name: 'Food & Drinks',
  icon: UtensilsCrossed,
  color: 'text-orange-500',
  bg: 'bg-orange-50',
  itemCount: 5
},
{
  id: 'pharmacy',
  name: 'Pharmacy',
  icon: Pill,
  color: 'text-red-500',
  bg: 'bg-red-50',
  itemCount: 4
},
{
  id: 'home',
  name: 'Home & Kitchen',
  icon: HomeIcon,
  color: 'text-blue-500',
  bg: 'bg-blue-50',
  itemCount: 4
},
{
  id: 'electronics',
  name: 'Electronics',
  icon: Tv,
  color: 'text-purple-500',
  bg: 'bg-purple-50',
  itemCount: 4
},
{
  id: 'gifts',
  name: 'Gift Shop',
  icon: Gift,
  color: 'text-pink-500',
  bg: 'bg-pink-50',
  itemCount: 3
}];

const allItems: ShopItem[] = [
// Groceries
{
  id: 'g1',
  name: 'Fresh Tomatoes',
  price: 800,
  image: '🍅',
  category: 'groceries',
  unit: '1 kg'
},
{
  id: 'g2',
  name: 'Rice (Local)',
  price: 4500,
  image: '🍚',
  category: 'groceries',
  unit: '5 kg bag'
},
{
  id: 'g3',
  name: 'Avocado Oil',
  price: 2200,
  image: '🫗',
  category: 'groceries',
  unit: '1 litre'
},
{
  id: 'g4',
  name: 'Onions',
  price: 600,
  image: '🧅',
  category: 'groceries',
  unit: '1 kg'
},
{
  id: 'g5',
  name: 'Maize Flour (Unga)',
  price: 1500,
  image: '🌾',
  category: 'groceries',
  unit: '2 kg'
},
{
  id: 'g6',
  name: 'Fresh Pepper',
  price: 500,
  image: '🌶️',
  category: 'groceries',
  unit: '500g'
},
// Food & Drinks
{
  id: 'f1',
  name: 'Pilau Rice Plate',
  price: 2500,
  image: '🍛',
  category: 'food',
  unit: '1 plate'
},
{
  id: 'f2',
  name: 'Nyama Choma (Beef)',
  price: 3000,
  image: '🥩',
  category: 'food',
  unit: '10 sticks'
},
{
  id: 'f3',
  name: 'Passion Juice',
  price: 1500,
  image: '🍹',
  category: 'food',
  unit: '1 bottle'
},
{
  id: 'f4',
  name: 'Puff Puff',
  price: 500,
  image: '🧁',
  category: 'food',
  unit: '12 pcs'
},
{
  id: 'f5',
  name: 'Tamarind Juice',
  price: 800,
  image: '🥤',
  category: 'food',
  unit: '1 litre'
},
// Pharmacy
{
  id: 'p1',
  name: 'Paracetamol',
  price: 300,
  image: '💊',
  category: 'pharmacy',
  unit: '1 pack'
},
{
  id: 'p2',
  name: 'Vitamin C',
  price: 1200,
  image: '🍊',
  category: 'pharmacy',
  unit: '30 tablets'
},
{
  id: 'p3',
  name: 'First Aid Kit',
  price: 5500,
  image: '🩹',
  category: 'pharmacy',
  unit: '1 kit'
},
{
  id: 'p4',
  name: 'Hand Sanitizer',
  price: 800,
  image: '🧴',
  category: 'pharmacy',
  unit: '500ml'
},
// Home & Kitchen
{
  id: 'h1',
  name: 'LED Bulb',
  price: 1500,
  image: '💡',
  category: 'home',
  unit: '1 pc'
},
{
  id: 'h2',
  name: 'Detergent',
  price: 2000,
  image: '🧹',
  category: 'home',
  unit: '1 kg'
},
{
  id: 'h3',
  name: 'Cooking Gas',
  price: 8500,
  image: '🔥',
  category: 'home',
  unit: '12.5 kg'
},
{
  id: 'h4',
  name: 'Water Dispenser',
  price: 15000,
  image: '🚰',
  category: 'home',
  unit: '1 pc'
},
// Electronics
{
  id: 'e1',
  name: 'Phone Charger',
  price: 3500,
  image: '🔌',
  category: 'electronics',
  unit: '1 pc'
},
{
  id: 'e2',
  name: 'Earbuds',
  price: 8000,
  image: '🎧',
  category: 'electronics',
  unit: '1 pair'
},
{
  id: 'e3',
  name: 'Power Bank',
  price: 12000,
  image: '🔋',
  category: 'electronics',
  unit: '10000mAh'
},
{
  id: 'e4',
  name: 'USB Cable',
  price: 1500,
  image: '🔗',
  category: 'electronics',
  unit: '1 pc'
},
// Gifts
{
  id: 'gi1',
  name: 'Gift Basket',
  price: 15000,
  image: '🎁',
  category: 'gifts',
  unit: '1 basket'
},
{
  id: 'gi2',
  name: 'Flowers Bouquet',
  price: 8000,
  image: '💐',
  category: 'gifts',
  unit: '1 bouquet'
},
{
  id: 'gi3',
  name: 'Chocolate Box',
  price: 5500,
  image: '🍫',
  category: 'gifts',
  unit: '1 box'
}];

type ScreenView = 'categories' | 'items' | 'cart';
export const ShopErrandsScreen = () => {
  const navigate = useNavigate();
  const { addOrder } = useAppContext();
  const [view, setView] = useState<ScreenView>('categories');
  const [selectedCategory, setSelectedCategory] = useState<ShopCategory | null>(
    null
  );
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isOrdering, setIsOrdering] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState('Kilimani, Nairobi');
  const cartTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const deliveryFee = 1500;
  const addToCart = (item: ShopItem) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === item.id);
      if (existing) {
        return prev.map((c) =>
        c.id === item.id ?
        {
          ...c,
          quantity: c.quantity + 1
        } :
        c
        );
      }
      return [
      ...prev,
      {
        ...item,
        quantity: 1
      }];

    });
  };
  const updateQuantity = (itemId: string, delta: number) => {
    setCart((prev) =>
    prev.
    map((c) =>
    c.id === itemId ?
    {
      ...c,
      quantity: c.quantity + delta
    } :
    c
    ).
    filter((c) => c.quantity > 0)
    );
  };
  const getItemQuantity = (itemId: string) => {
    return cart.find((c) => c.id === itemId)?.quantity || 0;
  };
  const handleSelectCategory = (cat: ShopCategory) => {
    setSelectedCategory(cat);
    setView('items');
  };
  const handleConfirmOrder = () => {
    setIsOrdering(true);
    setTimeout(() => {
      void (async () => {
      const itemNames = cart.map((c) => c.name).join(', ');
      const newOrder = {
        id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
        date: new Date().toISOString(),
        pickup: {
          address: 'SwiftDrop Market Hub, Nairobi'
        },
        dropoff: {
          address: deliveryAddress
        },
        packageType: 'Medium Box' as const,
        urgency: 'Normal' as const,
        status: 'Rider Assigned' as const,
        price: cartTotal + deliveryFee,
        note: `Shop Errands: ${itemNames}`,
        rider: {
          ...mockRider,
          id: 'r3',
          name: 'Blessing A.',
          avatar:
          'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
        }
      };
      await addOrder(newOrder);
      setCart([]);
      navigate('/tracking', {
        state: {
          orderId: newOrder.id
        }
      });
      })();
    }, 2000);
  };
  const filteredItems = selectedCategory ?
  allItems.filter((item) => item.category === selectedCategory.id) :
  allItems;
  const searchedItems = searchQuery ?
  allItems.filter((item) =>
  item.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) :
  [];
  // ─── CATEGORIES VIEW ───
  const renderCategories = () =>
  <motion.div
    initial={{
      opacity: 0
    }}
    animate={{
      opacity: 1
    }}
    className="p-6 space-y-6">
    
      {/* Search */}
      <div className="flex items-center bg-white rounded-2xl px-4 py-3 border border-gray-100 shadow-sm">
        <Search size={20} className="text-gray-400 mr-3" />
        <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search for items..."
        className="bg-transparent flex-1 outline-none text-dark placeholder-gray-400 font-medium text-sm" />
      
      </div>

      {/* Search Results */}
      {searchQuery &&
    <div className="space-y-3">
          <h3 className="font-bold text-dark text-sm">
            Results for "{searchQuery}" ({searchedItems.length})
          </h3>
          {searchedItems.length > 0 ?
      <div className="grid grid-cols-2 gap-3">
              {searchedItems.map((item) => renderItemCard(item))}
            </div> :

      <p className="text-gray-500 text-sm text-center py-8">
              No items found
            </p>
      }
        </div>
    }

      {/* Categories Grid */}
      {!searchQuery &&
    <>
          <div>
            <h3 className="font-bold text-dark text-lg mb-1">
              What do you need?
            </h3>
            <p className="text-gray-500 text-sm">
              We'll shop and deliver it to you
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {categories.map((cat, index) => {
          const Icon = cat.icon;
          return (
            <motion.button
              key={cat.id}
              initial={{
                opacity: 0,
                y: 20
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              transition={{
                delay: index * 0.05
              }}
              whileTap={{
                scale: 0.95
              }}
              onClick={() => handleSelectCategory(cat)}
              className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-start text-left space-y-3">
              
                  <div
                className={`w-12 h-12 ${cat.bg} rounded-xl flex items-center justify-center`}>
                
                    <Icon size={24} className={cat.color} />
                  </div>
                  <div>
                    <h3 className="font-bold text-dark text-sm">{cat.name}</h3>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      {cat.itemCount} items
                    </p>
                  </div>
                </motion.button>);

        })}
          </div>

          {/* Popular Items */}
          <div>
            <h3 className="font-bold text-dark mb-3">Popular Items</h3>
            <div className="flex space-x-3 overflow-x-auto no-scrollbar pb-2">
              {allItems.slice(0, 5).map((item) =>
          <motion.div
            key={item.id}
            whileTap={{
              scale: 0.95
            }}
            className="min-w-[140px] bg-white rounded-2xl p-3 shadow-sm border border-gray-100">
            
                  <div className="text-4xl mb-2">{item.image}</div>
                  <h4 className="font-semibold text-dark text-xs truncate">
                    {item.name}
                  </h4>
                  <p className="text-[10px] text-gray-500">{item.unit}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="font-bold text-dark text-sm">
                      KSh {item.price.toLocaleString()}
                    </span>
                    <button
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart(item);
                }}
                className="w-7 h-7 bg-brand rounded-full flex items-center justify-center">
                
                      <Plus size={14} className="text-dark" strokeWidth={3} />
                    </button>
                  </div>
                </motion.div>
          )}
            </div>
          </div>
        </>
    }
    </motion.div>;

  // ─── ITEM CARD ───
  const renderItemCard = (item: ShopItem) => {
    const qty = getItemQuantity(item.id);
    return (
      <motion.div
        key={item.id}
        initial={{
          opacity: 0,
          scale: 0.95
        }}
        animate={{
          opacity: 1,
          scale: 1
        }}
        className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100">
        
        <div className="text-4xl mb-2 text-center">{item.image}</div>
        <h4 className="font-semibold text-dark text-sm truncate">
          {item.name}
        </h4>
        <p className="text-[10px] text-gray-500 mb-2">{item.unit}</p>
        <div className="flex justify-between items-center">
          <span className="font-bold text-dark text-sm">
            KSh {item.price.toLocaleString()}
          </span>
          {qty > 0 ?
          <div className="flex items-center space-x-2 bg-brand/10 rounded-full px-1 py-0.5">
              <button
              onClick={() => updateQuantity(item.id, -1)}
              className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm">
              
                <Minus size={12} className="text-dark" strokeWidth={3} />
              </button>
              <span className="text-sm font-bold text-dark w-4 text-center">
                {qty}
              </span>
              <button
              onClick={() => addToCart(item)}
              className="w-6 h-6 bg-brand rounded-full flex items-center justify-center">
              
                <Plus size={12} className="text-dark" strokeWidth={3} />
              </button>
            </div> :

          <button
            onClick={() => addToCart(item)}
            className="w-7 h-7 bg-brand rounded-full flex items-center justify-center">
            
              <Plus size={14} className="text-dark" strokeWidth={3} />
            </button>
          }
        </div>
      </motion.div>);

  };
  // ─── ITEMS VIEW ───
  const renderItems = () =>
  <motion.div
    initial={{
      opacity: 0,
      x: 20
    }}
    animate={{
      opacity: 1,
      x: 0
    }}
    className="p-6 space-y-4">
    
      <div className="flex items-center space-x-3 mb-2">
        {selectedCategory &&
      <>
            <div
          className={`w-10 h-10 ${selectedCategory.bg} rounded-xl flex items-center justify-center`}>
          
              <selectedCategory.icon
            size={20}
            className={selectedCategory.color} />
          
            </div>
            <div>
              <h3 className="font-bold text-dark text-lg">
                {selectedCategory.name}
              </h3>
              <p className="text-xs text-gray-500">
                {filteredItems.length} items available
              </p>
            </div>
          </>
      }
      </div>

      <div className="grid grid-cols-2 gap-3">
        {filteredItems.map((item) => renderItemCard(item))}
      </div>
    </motion.div>;

  // ─── CART VIEW ───
  const renderCart = () =>
  <motion.div
    initial={{
      opacity: 0,
      y: 20
    }}
    animate={{
      opacity: 1,
      y: 0
    }}
    className="flex flex-col h-full">
    
      <div className="flex-1 overflow-y-auto p-6 space-y-4 pb-48 no-scrollbar">
        {cart.length === 0 ?
      <div className="flex flex-col items-center justify-center pt-20 text-center">
            <ShoppingCart
          size={64}
          className="text-gray-300 mb-4"
          strokeWidth={1} />
        
            <h3 className="font-bold text-dark text-lg">Your cart is empty</h3>
            <p className="text-sm text-gray-500 mt-1">
              Add items to get started
            </p>
            <button
          onClick={() => setView('categories')}
          className="mt-6 bg-brand text-dark font-bold px-6 py-3 rounded-full">
          
              Browse Items
            </button>
          </div> :

      <>
            <h3 className="font-bold text-dark text-lg">
              Your Cart ({cartCount} {cartCount === 1 ? 'item' : 'items'})
            </h3>

            {cart.map((item) =>
        <motion.div
          key={item.id}
          layout
          initial={{
            opacity: 0,
            x: -20
          }}
          animate={{
            opacity: 1,
            x: 0
          }}
          exit={{
            opacity: 0,
            x: 20
          }}
          className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center">
          
                <div className="text-3xl mr-4">{item.image}</div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-dark text-sm truncate">
                    {item.name}
                  </h4>
                  <p className="text-xs text-gray-500">{item.unit}</p>
                  <p className="font-bold text-dark text-sm mt-1">
                    KSh {(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
              onClick={() => updateQuantity(item.id, -1)}
              className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
              
                    {item.quantity === 1 ?
              <Trash2 size={14} className="text-red-500" /> :

              <Minus size={14} className="text-dark" strokeWidth={3} />
              }
                  </button>
                  <span className="text-sm font-bold text-dark w-5 text-center">
                    {item.quantity}
                  </span>
                  <button
              onClick={() => addToCart(item)}
              className="w-8 h-8 bg-brand rounded-full flex items-center justify-center">
              
                    <Plus size={14} className="text-dark" strokeWidth={3} />
                  </button>
                </div>
              </motion.div>
        )}

            {/* Delivery Address */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-brand/10 rounded-full flex items-center justify-center mr-3">
                    <MapPin size={20} className="text-brand-dark" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">
                      Deliver to
                    </p>
                    <p className="text-sm font-bold text-dark">
                      {deliveryAddress}
                    </p>
                  </div>
                </div>
                <ChevronRight size={20} className="text-gray-400" />
              </div>
            </div>

            {/* Price Summary */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-3">
              <h3 className="font-bold text-dark">Order Summary</h3>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">
                  Subtotal ({cartCount} items)
                </span>
                <span className="font-medium text-dark">
                  KSh {cartTotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Delivery Fee</span>
                <span className="font-medium text-dark">
                  KSh {deliveryFee.toLocaleString()}
                </span>
              </div>
              <div className="pt-3 mt-1 border-t border-gray-100 flex justify-between items-center">
                <span className="font-bold text-dark">Total</span>
                <span className="text-xl font-bold text-brand-dark">
                  KSh {(cartTotal + deliveryFee).toLocaleString()}
                </span>
              </div>
            </div>
          </>
      }
      </div>

      {/* Confirm Button */}
      {cart.length > 0 &&
    <div className="bg-white border-t border-gray-100 p-4 pb-safe absolute bottom-0 left-0 right-0 shadow-up z-20">
          <button
        onClick={handleConfirmOrder}
        disabled={isOrdering}
        className="w-full py-4 rounded-full font-bold text-lg bg-brand text-dark shadow-md active:scale-[0.98] transition-all flex justify-center items-center">
        
            {isOrdering ?
        <motion.div
          animate={{
            rotate: 360
          }}
          transition={{
            repeat: Infinity,
            duration: 1,
            ease: 'linear'
          }}
          className="w-6 h-6 border-2 border-dark border-t-transparent rounded-full" /> :


        `Place Order · KSh ${(cartTotal + deliveryFee).toLocaleString()}`
        }
          </button>
        </div>
    }
    </motion.div>;

  // ─── HEADER ───
  const getHeaderTitle = () => {
    if (view === 'cart') return 'My Cart';
    if (view === 'items' && selectedCategory) return selectedCategory.name;
    return 'Shop Errands';
  };
  const handleBack = () => {
    if (view === 'cart') {
      setView(selectedCategory ? 'items' : 'categories');
    } else if (view === 'items') {
      setView('categories');
      setSelectedCategory(null);
    } else {
      navigate(-1);
    }
  };
  return (
    <motion.div
      initial={{
        opacity: 0,
        x: 20
      }}
      animate={{
        opacity: 1,
        x: 0
      }}
      exit={{
        opacity: 0,
        x: -20
      }}
      className="flex flex-col h-full bg-gray-50">
      
      {/* Header */}
      <div className="bg-white px-6 pt-10 pb-4 shadow-sm flex items-center justify-between z-10">
        <div className="flex items-center">
          <button
            onClick={handleBack}
            className="p-2 -ml-2 bg-gray-50 rounded-full">
            
            <ArrowLeft size={20} className="text-dark" />
          </button>
          <h1 className="text-lg font-bold text-dark ml-4">
            {getHeaderTitle()}
          </h1>
        </div>

        {/* Cart Button */}
        {view !== 'cart' &&
        <button
          onClick={() => setView('cart')}
          className="relative p-2 bg-gray-50 rounded-full">
          
            <ShoppingCart size={22} className="text-dark" />
            {cartCount > 0 &&
          <motion.span
            initial={{
              scale: 0
            }}
            animate={{
              scale: 1
            }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-brand text-dark text-[10px] font-bold rounded-full flex items-center justify-center">
            
                {cartCount}
              </motion.span>
          }
          </button>
        }
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-24">
        <AnimatePresence mode="wait">
          {view === 'categories' && renderCategories()}
          {view === 'items' && renderItems()}
          {view === 'cart' && renderCart()}
        </AnimatePresence>
      </div>

      {/* Floating Cart Bar (when browsing with items in cart) */}
      {view !== 'cart' && cartCount > 0 &&
      <motion.div
        initial={{
          y: 100
        }}
        animate={{
          y: 0
        }}
        className="absolute bottom-0 left-0 right-0 p-4 pb-safe z-20">
        
          <button
          onClick={() => setView('cart')}
          className="w-full bg-dark text-white py-4 rounded-2xl font-bold flex items-center justify-between px-6 shadow-lg">
          
            <div className="flex items-center">
              <ShoppingCart size={20} className="mr-2" />
              <span>
                {cartCount} {cartCount === 1 ? 'item' : 'items'}
              </span>
            </div>
            <span>KSh {cartTotal.toLocaleString()}</span>
          </button>
        </motion.div>
      }
    </motion.div>);

};