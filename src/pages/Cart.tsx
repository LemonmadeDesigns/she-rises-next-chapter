import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import Layout from "@/components/layout/Layout";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/components/ui/use-toast";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, ShoppingCart } from "lucide-react";

const Cart = () => {
  const { state, dispatch } = useCart();
  const { toast } = useToast();

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      dispatch({ type: 'REMOVE_ITEM', payload: id });
      toast({
        title: "Item removed",
        description: "Item has been removed from your cart.",
      });
    } else {
      dispatch({ 
        type: 'UPDATE_QUANTITY', 
        payload: { id, quantity: newQuantity } 
      });
    }
  };

  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
    toast({
      title: "Item removed",
      description: "Item has been removed from your cart.",
    });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart.",
    });
  };

  const subtotal = state.total;
  const shipping = subtotal >= 50 ? 0 : 8.99;
  const tax = subtotal * 0.0875; // 8.75% tax rate
  const total = subtotal + shipping + tax;

  if (state.items.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-24 h-24 bg-warm-cream rounded-full flex items-center justify-center mx-auto mb-8">
              <ShoppingBag className="h-12 w-12 text-muted-foreground" />
            </div>
            <h1 className="font-serif text-3xl font-bold text-royal-plum mb-4">
              Your Cart is Empty
            </h1>
            <p className="text-muted-foreground mb-8">
              Looks like you haven't added anything to your cart yet. Start shopping to fill it up!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/shop">
                <Button size="lg" className="bg-crown-gold hover:bg-crown-gold/90 text-royal-plum font-bold">
                  Start Shopping
                </Button>
              </Link>
              <Link to="/">
                <Button size="lg" variant="outline">
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link to="/shop" className="flex items-center gap-2 text-muted-foreground hover:text-royal-plum mb-2">
              <ArrowLeft className="h-4 w-4" />
              Continue Shopping
            </Link>
            <h1 className="font-serif text-3xl font-bold text-royal-plum">
              Shopping Cart ({state.itemCount} {state.itemCount === 1 ? 'item' : 'items'})
            </h1>
          </div>
          
          <Button 
            variant="outline" 
            onClick={clearCart}
            className="text-red-600 border-red-600 hover:bg-red-50"
          >
            Clear Cart
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {state.items.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <div className="w-24 h-24 bg-warm-cream rounded-lg overflow-hidden flex-shrink-0">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-royal-plum text-lg mb-2">
                        {item.name}
                      </h3>
                      
                      <div className="flex gap-4 text-sm text-muted-foreground mb-4">
                        {item.size && (
                          <span>Size: <span className="font-medium">{item.size}</span></span>
                        )}
                        {item.color && (
                          <span>Color: <span className="font-medium">{item.color}</span></span>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="h-8 w-8 p-0"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          
                          <span className="w-12 text-center font-medium">
                            {item.quantity}
                          </span>
                          
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="h-8 w-8 p-0"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Price and Remove */}
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="font-bold text-royal-plum">
                              ${(item.price * item.quantity).toFixed(2)}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              ${item.price.toFixed(2)} each
                            </div>
                          </div>
                          
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeItem(item.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardContent className="p-6">
                <h3 className="font-serif text-xl font-bold text-royal-plum mb-6">
                  Order Summary
                </h3>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>
                      {shipping === 0 ? (
                        <span className="text-green-600 font-medium">FREE</span>
                      ) : (
                        `$${shipping.toFixed(2)}`
                      )}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between text-lg font-bold text-royal-plum">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                {subtotal < 50 && (
                  <div className="bg-warm-cream rounded-lg p-4 mb-6">
                    <p className="text-sm text-royal-plum">
                      <strong>Spend ${(50 - subtotal).toFixed(2)} more</strong> for free shipping!
                    </p>
                  </div>
                )}

                <Link to="/checkout">
                  <Button 
                    size="lg" 
                    className="w-full bg-crown-gold hover:bg-crown-gold/90 text-royal-plum font-bold mb-4"
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Proceed to Checkout
                  </Button>
                </Link>

                <div className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-crown-gold rounded-full"></div>
                    <span>Free shipping on orders $50+</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-crown-gold rounded-full"></div>
                    <span>30-day return policy</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-crown-gold rounded-full"></div>
                    <span>Secure checkout process</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-crown-gold rounded-full"></div>
                    <span>100% of profits support our mission</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Mission Statement */}
        <div className="mt-16 bg-gradient-soft rounded-2xl p-8 text-center">
          <h3 className="font-serif text-2xl font-bold text-royal-plum mb-4">
            Your Purchase Makes a Difference
          </h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Every item in your cart directly supports She Rises programs that help women rebuild 
            their lives with dignity and hope. Thank you for being part of our mission.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Cart;