import React, { useState } from 'react';
import { X, Plus, Minus, CreditCard, Trash2, ShoppingBag } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useUserActivities } from '../context/UserActivitiesContext';
import { useAuth } from '../context/AuthContext';
import { UserActivity } from '../data/mockActivities';
import { activityService } from '../services/apiService';

interface ShoppingCartProps {
  isOpen: boolean;
  onClose: () => void;
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({ isOpen, onClose }) => {
  const { addActivity } = useUserActivities();
  const { cart, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useApp();
  const { user } = useAuth();
  const [showPayment, setShowPayment] = useState(false);
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    name: '',
    email: '',
    address: '',
  });
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setPaymentError('Please log in to complete your purchase');
      return;
    }

    setIsProcessing(true);
    setPaymentError(null);

    try {
      // Generate a transaction ID for the payment
      const transactionId = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Prepare order data for API
      const orderData = {
        userId: user.id,
        items: cart.map(item => ({
          productId: item.product.id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          image: item.product.image,
          type: item.product.category || 'product'
        })),
        total: getTotalPrice(),
        status: 'confirmed',
        paymentInfo: {
          cardNumber: `****-****-****-${paymentData.cardNumber.slice(-4)}`, // Mask card number for security
          name: paymentData.name,
          email: paymentData.email,
          address: paymentData.address,
          paymentMethod: 'card',
          transactionId: transactionId
        }
      };

      // Create order in backend
      const response = await activityService.createOrder(orderData);
      
      if (response.success) {
        setPaymentSuccess(true);
        
        // Also add to local activities for immediate UI update
        const dateStr = new Date().toISOString().split('T')[0];
        addActivity({
          id: response.data._id,
          type: 'purchase',
          date: dateStr,
          status: 'confirmed',
          details: {
            items: cart.map(item => ({ product: item.product, quantity: item.quantity })),
            total: getTotalPrice()
          }
        } as UserActivity);

        // Clear cart and close modal after success
        setTimeout(() => {
          clearCart();
          setPaymentSuccess(false);
          setShowPayment(false);
          onClose();
          // Reset payment data
          setPaymentData({
            cardNumber: '',
            expiryDate: '',
            cvv: '',
            name: '',
            email: '',
            address: '',
          });
        }, 3000);
      } else {
        throw new Error(response.error || 'Failed to process payment');
      }
    } catch (error) {
      console.error('Payment processing error:', error);
      setPaymentError(error instanceof Error ? error.message : 'Payment processing failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl sm:rounded-2xl max-w-sm sm:max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
              <span>Shopping Cart</span>
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          {paymentSuccess ? (
            <div className="text-center py-8 sm:py-12">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-6 h-6 sm:w-8 sm:h-8 text-green-500" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-green-600 mb-2">Payment Successful!</h3>
              <p className="text-gray-600 text-sm sm:text-base">Your order has been confirmed. Thank you for your purchase!</p>
            </div>
          ) : showPayment ? (
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">Payment Information</h3>
              <form onSubmit={handlePayment} className="space-y-3 sm:space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={paymentData.name}
                      onChange={(e) => setPaymentData({ ...paymentData, name: e.target.value })}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm sm:text-base"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={paymentData.email}
                      onChange={(e) => setPaymentData({ ...paymentData, email: e.target.value })}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm sm:text-base"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    value={paymentData.address}
                    onChange={(e) => setPaymentData({ ...paymentData, address: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm sm:text-base"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Card Number
                  </label>
                  <input
                    type="text"
                    value={paymentData.cardNumber}
                    onChange={(e) => setPaymentData({ ...paymentData, cardNumber: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm sm:text-base"
                    placeholder="1234 5678 9012 3456"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      value={paymentData.expiryDate}
                      onChange={(e) => setPaymentData({ ...paymentData, expiryDate: e.target.value })}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm sm:text-base"
                      placeholder="MM/YY"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      CVV
                    </label>
                    <input
                      type="text"
                      value={paymentData.cvv}
                      onChange={(e) => setPaymentData({ ...paymentData, cvv: e.target.value })}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm sm:text-base"
                      placeholder="123"
                      required
                    />
                  </div>
                </div>

                {paymentError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                    <p className="text-red-700 text-sm">{paymentError}</p>
                  </div>
                )}

                <div className="border-t pt-3 sm:pt-4 mt-4 sm:mt-6">
                  <div className="flex justify-between items-center mb-3 sm:mb-4">
                    <span className="text-base sm:text-lg font-semibold">Total:</span>
                    <span className="text-xl sm:text-2xl font-bold text-orange-500">₹{getTotalPrice().toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowPayment(false);
                      setPaymentError(null);
                    }}
                    disabled={isProcessing}
                    className="flex-1 border border-gray-300 text-gray-700 py-2 sm:py-3 px-3 sm:px-4 rounded-lg sm:rounded-xl font-semibold hover:bg-gray-50 transition-colors text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Back to Cart
                  </button>
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white py-2 sm:py-3 px-3 sm:px-4 rounded-lg sm:rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Processing...
                      </>
                    ) : (
                      'Pay Now'
                    )}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div>
              {cart.length === 0 ? (
                <div className="text-center py-8 sm:py-12">
                  <ShoppingBag className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-base sm:text-lg">Your cart is empty</p>
                  <p className="text-gray-400 text-xs sm:text-sm mt-2">Add some items to get started!</p>
                </div>
              ) : (
                <div>
                  <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                    {cart.map((item) => (
                      <div key={item.product.id} className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 bg-gray-50 rounded-lg sm:rounded-xl">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-800 text-sm sm:text-base truncate">{item.product.name}</h4>
                          <p className="text-xs sm:text-sm text-gray-600">₹{item.product.price}</p>
                        </div>
                        <div className="flex items-center space-x-1 sm:space-x-2">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="p-1 rounded-full hover:bg-gray-200 transition-colors"
                          >
                            <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
                          </button>
                          <span className="w-6 sm:w-8 text-center font-semibold text-sm sm:text-base">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="p-1 rounded-full hover:bg-gray-200 transition-colors"
                          >
                            <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="p-1 sm:p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                        >
                          <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-3 sm:pt-4">
                    <div className="flex justify-between items-center mb-3 sm:mb-4">
                      <span className="text-base sm:text-lg font-semibold">Total:</span>
                      <span className="text-xl sm:text-2xl font-bold text-orange-500">₹{getTotalPrice().toFixed(2)}</span>
                    </div>
                    <button
                      onClick={() => setShowPayment(true)}
                      className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-2 sm:py-3 px-3 sm:px-4 rounded-lg sm:rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300 flex items-center justify-center space-x-2 text-sm sm:text-base"
                    >
                      <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>Proceed to Payment</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;