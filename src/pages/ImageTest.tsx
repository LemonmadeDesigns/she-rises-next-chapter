import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ImageTest() {
  const testImages = [
    '/images/products/spiral-notebooks.jpg',
    '/images/products/coffee-mug.jpg',
    '/images/products/white-baseball-cap.jpg',
    '/images/products/blue-baseball-cap.jpg',
    '/images/products/mouse-pad.jpg'
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-20">
        <h1 className="text-3xl font-bold mb-8">Image Test Page</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testImages.map((src, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>Image {index + 1}</CardTitle>
                <p className="text-sm text-gray-600">Path: {src}</p>
              </CardHeader>
              <CardContent>
                <div className="aspect-square bg-gray-100 mb-4">
                  <img
                    src={src}
                    alt={`Test image ${index + 1}`}
                    className="w-full h-full object-cover"
                    onLoad={() => console.log(`✅ Image loaded: ${src}`)}
                    onError={(e) => {
                      console.error(`❌ Failed to load image: ${src}`);
                      console.error('Error details:', e);
                    }}
                  />
                </div>
                <div className="text-xs">
                  <p>Check console for load status</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Direct Links Test</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {testImages.map((src, index) => (
                <div key={index} className="flex items-center gap-4">
                  <span className="w-6">{index + 1}.</span>
                  <a
                    href={`http://localhost:8081${src}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm"
                  >
                    {src}
                  </a>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}