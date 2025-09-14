import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Layout from "@/components/layout/Layout";
import Hero from "@/components/sections/Hero";
import SectionHeader from "@/components/sections/SectionHeader";
import ProductCard from "@/components/cards/ProductCard";
import { Search, Filter } from "lucide-react";
import productsData from "@/content/products.json";

const Shop = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("name");

  const { products, categories } = productsData;

  // Filter and sort products
  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "name":
          return a.name.localeCompare(b.name);
        case "featured":
          return (b.featured || false) ? 1 : -1;
        default:
          return 0;
      }
    });

  const featuredProducts = products.filter(product => product.featured === true);

  return (
    <Layout>
      {/* Hero Section */}
      <Hero
        title="She Rises Shop"
        subtitle="Support our mission while getting beautiful, meaningful products that celebrate empowerment and resilience."
        backgroundColor="#4B2E6D"
      >
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Button size="lg" className="bg-crown-gold hover:bg-crown-gold/90 text-royal-plum font-bold">
            Shop Featured Items
          </Button>
          <Button size="lg" className="hero-button-secondary btn-force-visible">
            View All Categories
          </Button>
        </div>
      </Hero>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-20 bg-gradient-soft">
          <div className="container mx-auto px-4">
            <SectionHeader
              title="Featured Products"
              subtitle="Hand-picked items that support our mission and celebrate women's empowerment"
            />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={{...product, featured: product.featured || false}} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Products */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="All Products"
            subtitle="Discover our full collection of meaningful products"
          />

          {/* Filters and Search */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Category Filter */}
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id} className="capitalize">
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Sort */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name A-Z</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="featured">Featured First</SelectItem>
                  </SelectContent>
                </Select>

                {/* Clear Filters */}
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("all");
                    setSortBy("name");
                  }}
                  className="flex items-center gap-2"
                >
                  <Filter className="h-4 w-4" />
                  Clear Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Products Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={{...product, featured: product.featured || false}} />
              ))}
            </div>
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <h3 className="text-xl font-semibold text-royal-plum mb-2">
                  No products found
                </h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search or filter criteria
                </p>
                <Button 
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("all");
                  }}
                  className="bg-crown-gold hover:bg-crown-gold/90 text-royal-plum"
                >
                  Clear Search
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-20 bg-royal-plum text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6">
            Every Purchase Makes a Difference
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            When you shop with She Rises, you're not just getting quality products—you're directly 
            supporting programs that help women rebuild their lives with dignity and hope.
          </p>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold text-crown-gold mb-2">100%</div>
              <p className="text-white/90">of profits support our programs</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-crown-gold mb-2">300+</div>
              <p className="text-white/90">women supported annually</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-crown-gold mb-2">Local</div>
              <p className="text-white/90">products when possible</p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Shop;