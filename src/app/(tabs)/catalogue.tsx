import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Keyboard,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { AppButton, SearchTextInput } from '@/components/ui';
import ProductSection from '@/components/ProductSection';
import ProductCard from '@/components/ProductCard';
import {
  CATALOGUE_CATEGORIES,
  CATALOGUE_SECTIONS,
  ORDER_AGAIN_PRODUCTS,
} from '@/constants/catalogue';
import type { Product } from '@/types';

export default function CatalogueScreen() {
  const [searchQuery, setSearchQuery] = useState('');


  // Filter products when search query is entered
  const filteredSearchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const query = searchQuery.toLowerCase().trim();
    const allProducts = CATALOGUE_SECTIONS.flatMap((s) => s.products);
    const seen = new Set<string>();
    return allProducts.filter((product) => {
      if (seen.has(product.id)) return false;
      seen.add(product.id);
      return (
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.supplier.toLowerCase().includes(query)
      );
    });
  }, [searchQuery]);

  const handleSeeAll = (sectionId: string, sectionTitle?: string) => {
    const title = sectionTitle || (sectionId === 'order_again' ? 'Order again' : sectionId);
    router.push({
      pathname: '/(tabs)/category',
      params: { id: sectionId, name: title },
    });
  };


  const handleProductPress = (product: Product) => {
    console.log(`Product pressed: ${product.name} (${product.id})`);
  };

  const handleAddToCart = (product: Product, quantity: number) => {
    console.log(`Cart updated: ${product.name} x${quantity}`);
  };

  const handleCategoryPress = (categoryId: string, categoryName: string) => {
    router.push({
      pathname: '/(tabs)/category',
      params: { id: categoryId, name: categoryName },
    });
  };


  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View className="flex-1">
          {/* Top Search Input */}
          <View className="px-5 pt-2 pb-6 bg-white">
            <SearchTextInput
              placeholder="Search all product"
              value={searchQuery}
              onChangeText={setSearchQuery}
              showClearButton={Boolean(searchQuery)}
              onClear={() => setSearchQuery('')}
            />
          </View>

          {/* Search Results or Full Catalogue */}
          {filteredSearchResults !== null ? (
            <View className="flex-1 px-5 pt-2">
              <Text className="font-dm-bold text-[16px] text-black mb-3">
                Search Results ({filteredSearchResults.length})
              </Text>
              {filteredSearchResults.length === 0 ? (
                <View className="items-center justify-center py-12">
                  <Text className="font-dm-regular text-sm text-[#6B7280]">
                    No products found for &quot;{searchQuery}&quot;
                  </Text>
                </View>

              ) : (
                <FlatList
                  data={filteredSearchResults}
                  keyExtractor={(item) => item.id}
                  numColumns={2}
                  columnWrapperStyle={{ justifyContent: 'space-around', marginBottom: 16 }}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ paddingBottom: 110 }}
                  renderItem={({ item }) => (
                    <ProductCard
                      product={item}
                      onPress={handleProductPress}
                      onAddToCart={handleAddToCart}
                    />
                  )}
                />
              )}
            </View>
          ) : (
            <ScrollView
              className="flex-1"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 110 }}
              contentInsetAdjustmentBehavior="automatic"
              
            >
              {/* 1. Order Again Section */}
              <ProductSection
                title="Order again"
                products={ORDER_AGAIN_PRODUCTS}
                onSeeAll={() => handleSeeAll('order_again')}
                onProductPress={handleProductPress}
                onAddToCart={handleAddToCart}
              />

              {/* 2. Categories Section */}
              <View className="mb-6 px-5">
                <Text className="font-dm-semibold text-lg text-black mb-3">
                  Categories
                </Text>
                <View className="flex-row flex-wrap gap-2.5">
                  {CATALOGUE_CATEGORIES.map((cat) => (
                    <AppButton
                      key={cat.id}
                      variant="outline"
                      size="lg"
                      label={cat.name}
                      leftIcon={<View className="w-5 h-5 rounded-full bg-surface" />}
                      onPress={() => handleCategoryPress(cat.id, cat.name)}
                    />
                  ))}
                </View>
              </View>

              {/* 3. Category Sections */}
              {CATALOGUE_SECTIONS.filter((s) => s.id !== 'order_again').map((section) => (
                <ProductSection
                  key={section.id}
                  title={section.title}
                  products={section.products}
                  onSeeAll={() => handleSeeAll(section.id, section.title)}
                  onProductPress={handleProductPress}
                  onAddToCart={handleAddToCart}
                />
              ))}


            </ScrollView>
          )}
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}
