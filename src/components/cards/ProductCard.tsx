import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Star } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User as SupabaseUser } from '@supabase/supabase-js';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  sizes?: string[];
  colors?: string[];
  inStock: boolean;
  featured: boolean;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [imageError, setImageError] = useState(false);
  const { dispatch } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();

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

    dispatch({
      type: 'ADD_ITEM',
      payload: {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.images[0]
      }
    });

    toast({
      title: "Added to cart!",
      description: `${product.name} has been added to your cart.`,
    });
  };

  return (
    <Card className="overflow-hidden shadow-soft hover:border-2 hover:border-lotus-rose transition-all duration-300 bg-white group h-full flex flex-col">
      <Link to={`/shop/${product.id}`}>
        <div className="aspect-square relative overflow-hidden bg-warm-cream">
          {!imageError ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <div className="text-center p-4">
                <div className="text-gray-500 mb-2">📦</div>
                <div className="text-xs text-gray-600">{product.name}</div>
              </div>
            </div>
          )}
          {product.featured && (
            <Badge className="absolute top-3 left-3 bg-crown-gold text-royal-plum">
              <Star className="h-3 w-3 mr-1" />
              Featured
            </Badge>
          )}
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Badge variant="secondary" className="text-white bg-red-600">
                Out of Stock
              </Badge>
            </div>
          )}
        </div>
      </Link>
      
      <CardContent className="p-4 flex-1 flex flex-col">
        <div className="mb-3">
          <Badge variant="outline" className="text-xs mb-2 capitalize">
            {product.category}
          </Badge>
          <Link to={`/shop/${product.id}`}>
            <h3 className="font-semibold text-royal-plum hover:text-lotus-rose transition-colors">
              {product.name}
            </h3>
          </Link>
        </div>
        
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2 flex-1">
          {product.description}
        </p>

        <div className="mt-auto">
          {/* Colors section - appears before price/actions */}
          {product.colors && product.colors.length > 0 && (
            <div className="mb-3 flex gap-1 justify-center">
              {product.colors.slice(0, 3).map((color, index) => (
                <div
                  key={index}
                  className="w-4 h-4 rounded-full border border-gray-300"
                  style={{ backgroundColor: color.toLowerCase().replace(' ', '') }}
                  title={color}
                />
              ))}
              {product.colors.length > 3 && (
                <span className="text-xs text-muted-foreground ml-1">
                  +{product.colors.length - 3} more
                </span>
              )}
            </div>
          )}

          {/* Price */}
          <div className="mb-3 text-center">
            <span className="text-lg font-bold text-royal-plum">
              ${product.price.toFixed(2)}
            </span>
          </div>

          {/* Action buttons - centered and aligned */}
          <div className="flex gap-2 justify-center">
            <Link to={`/shop/${product.id}`}>
              <Button variant="outline" size="sm">
                View Details
              </Button>
            </Link>
            {product.inStock && (
              <Button
                size="sm"
                onClick={handleAddToCart}
                className="bg-crown-gold hover:bg-crown-gold/90 text-royal-plum"
              >
                <ShoppingCart className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;