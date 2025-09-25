import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import Layout from "@/components/layout/Layout";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User as SupabaseUser } from '@supabase/supabase-js';
import { ShoppingCart, ArrowLeft, Star, Truck, Shield, RefreshCw } from "lucide-react";
import productsData from "@/content/products.json";

const ProductDetail = () => {
  const { productId } = useParams<{ productId: string }>();
  const { dispatch } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    // Get current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const product = productsData.products.find(p => p.id === productId);

  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-royal-plum mb-4">Product Not Found</h1>
          <Link to="/shop">
            <Button className="bg-crown-gold hover:bg-crown-gold/90 text-royal-plum">
              Back to Shop
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const handleAddToCart = () => {
    if (!user) {
      toast({
        title: "Sign In Required",
        description: "Please sign in to add items to your cart.",
        variant: "destructive"
      });
      navigate('/auth');
      return;
    }

    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      toast({
        title: "Please select a size",
        description: "This product requires a size selection.",
        variant: "destructive"
      });
      return;
    }

    if (product.colors && product.colors.length > 0 && !selectedColor) {
      toast({
        title: "Please select a color",
        description: "This product requires a color selection.",
        variant: "destructive"
      });
      return;
    }

    dispatch({
      type: 'ADD_ITEM',
      payload: {
        id: `${product.id}-${selectedSize}-${selectedColor}`,
        name: product.name,
        price: product.price,
        quantity,
        size: selectedSize,
        color: selectedColor,
        image: product.images[selectedImageIndex]
      }
    });

    toast({
      title: "Added to cart!",
      description: `${quantity}x ${product.name} has been added to your cart.`,
    });
  };

  const relatedProducts = productsData.products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8 text-sm text-muted-foreground">
          <Link to="/shop" className="hover:text-royal-plum flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            Back to Shop
          </Link>
          <span>/</span>
          <span className="capitalize">{product.category}</span>
          <span>/</span>
          <span className="text-royal-plum font-medium">{product.name}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square rounded-2xl overflow-hidden bg-warm-cream">
              <img
                src={product.images[selectedImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {product.images.length > 1 && (
              <div className="flex gap-2 justify-center">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImageIndex === index 
                        ? 'border-crown-gold' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} view ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <Badge variant="outline" className="mb-3 capitalize">
                {product.category}
              </Badge>
              {product.featured && (
                <Badge className="mb-3 ml-2 bg-crown-gold text-royal-plum">
                  <Star className="h-3 w-3 mr-1" />
                  Featured
                </Badge>
              )}
              
              <h1 className="font-serif text-3xl md:text-4xl font-bold text-royal-plum mb-4">
                {product.name}
              </h1>
              
              <p className="text-xl text-muted-foreground mb-6">
                {product.description}
              </p>
              
              <div className="text-3xl font-bold text-royal-plum mb-6">
                ${product.price.toFixed(2)}
              </div>
            </div>

            {/* Product Options */}
            <div className="space-y-4">
              {/* Size Selection */}
              {product.sizes && product.sizes.length > 0 && (
                <div>
                  <div className="block text-sm font-medium text-royal-plum mb-2">
                    Size
                  </div>
                  <Select value={selectedSize} onValueChange={setSelectedSize}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a size" />
                    </SelectTrigger>
                    <SelectContent>
                      {product.sizes.map((size) => (
                        <SelectItem key={size} value={size}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Color Selection */}
              {product.colors && product.colors.length > 0 && (
                <div>
                  <div className="block text-sm font-medium text-royal-plum mb-2">
                    Color
                  </div>
                  <Select value={selectedColor} onValueChange={setSelectedColor}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a color" />
                    </SelectTrigger>
                    <SelectContent>
                      {product.colors.map((color) => (
                        <SelectItem key={color} value={color}>
                          {color}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Quantity */}
              <div>
                <div className="block text-sm font-medium text-royal-plum mb-2">
                  Quantity
                </div>
                <Select value={quantity.toString()} onValueChange={(v) => setQuantity(parseInt(v))}>
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1,2,3,4,5,6,7,8,9,10].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Add to Cart */}
            <div className="space-y-4">
              {product.inStock ? (
                <Button
                  onClick={handleAddToCart}
                  size="lg"
                  className="w-full bg-crown-gold hover:bg-crown-gold/90 text-royal-plum font-bold text-lg py-6"
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Add to Cart - ${(product.price * quantity).toFixed(2)}
                </Button>
              ) : (
                <Button size="lg" className="w-full" disabled>
                  Out of Stock
                </Button>
              )}
            </div>

            {/* Product Benefits */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t">
              <div className="text-center">
                <Truck className="h-6 w-6 text-lotus-rose mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">Free shipping on orders $50+</p>
              </div>
              <div className="text-center">
                <Shield className="h-6 w-6 text-lotus-rose mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">Quality guaranteed</p>
              </div>
              <div className="text-center">
                <RefreshCw className="h-6 w-6 text-lotus-rose mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">30-day returns</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <Card>
            <CardContent className="p-8">
              <h3 className="font-serif text-2xl font-bold text-royal-plum mb-4">
                Product Details
              </h3>
              <ul className="space-y-2">
                {product.details.map((detail, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-crown-gold rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-muted-foreground">{detail}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-8">
              <h3 className="font-serif text-2xl font-bold text-royal-plum mb-4">
                Supporting Our Mission
              </h3>
              <p className="text-muted-foreground mb-4">
                Every purchase directly supports She Rises programs that help women rebuild 
                their lives with dignity and hope. Your purchase makes a real difference in 
                our community.
              </p>
              <div className="bg-warm-cream rounded-lg p-4">
                <p className="text-sm text-royal-plum font-medium">
                  100% of profits support transitional housing and reentry services
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h3 className="font-serif text-2xl font-bold text-royal-plum mb-8 text-center">
              You Might Also Like
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Card key={relatedProduct.id} className="overflow-hidden shadow-soft transition-shadow">
                  <Link to={`/shop/${relatedProduct.id}`}>
                    <div className="aspect-square bg-warm-cream">
                      <img
                        src={relatedProduct.images[0]}
                        alt={relatedProduct.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </Link>
                  <CardContent className="p-4">
                    <Link to={`/shop/${relatedProduct.id}`}>
                      <h4 className="font-semibold text-royal-plum hover:text-lotus-rose transition-colors mb-2">
                        {relatedProduct.name}
                      </h4>
                    </Link>
                    <p className="text-lg font-bold text-royal-plum">
                      ${relatedProduct.price.toFixed(2)}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ProductDetail;