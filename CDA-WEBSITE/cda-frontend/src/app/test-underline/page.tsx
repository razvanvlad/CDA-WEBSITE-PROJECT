'use client';
import { useState } from 'react';
import UnderlinedTitle from '@/components/UnderlinedTitle';

const colors = [
  { name: 'Orange', value: '#FD8721' },
  { name: 'Pink', value: '#FF5FA0' },
  { name: 'Purple', value: '#7B61FF' },
  { name: 'Light Blue', value: '#4FC3F7' },
  { name: 'Green', value: '#34C759' },
  { name: 'Roz', value: '#FF60DF' },
];

export default function TestUnderlinePage() {
  const [selectedColor, setSelectedColor] = useState('#FF60DF');
  const [strokeWidth, setStrokeWidth] = useState(11);
  const [curveIntensity, setCurveIntensity] = useState(0.08);
  const [underlineOffset, setUnderlineOffset] = useState(-8);

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-4xl mx-auto px-8">
        {/* Header */}
        <h1 className="text-4xl font-bold mb-12 text-center">
          Underline Component Tester
        </h1>

        {/* Controls Section */}
        <div className="bg-gray-50 rounded-lg p-8 border border-gray-200 mb-16">
          <h2 className="text-2xl font-semibold mb-6">Controls</h2>

          {/* Color Picker */}
          <div className="mb-8">
            <label className="block text-sm font-medium mb-4">
              Underline Color
            </label>
            <div className="grid grid-cols-6 gap-4">
              {colors.map((color) => (
                <button
                  key={color.value}
                  onClick={() => setSelectedColor(color.value)}
                  className={`w-12 h-12 rounded-full transition-all ${selectedColor === color.value
                    ? 'ring-4 ring-offset-2'
                    : 'hover:scale-110'
                    }`}
                  style={{
                    backgroundColor: color.value,
                  }}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          {/* Stroke Width Slider */}
          <div className="mb-8">
            <label className="block text-sm font-medium mb-2">
              Stroke Width: <span className="font-bold">{strokeWidth}px</span>
            </label>
            <input
              type="range"
              min="5"
              max="20"
              step="1"
              value={strokeWidth}
              onChange={(e) => setStrokeWidth(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Curve Intensity Slider */}
          <div className="mb-8">
            <label className="block text-sm font-medium mb-2">
              Curve Intensity:{' '}
              <span className="font-bold">{curveIntensity.toFixed(2)}</span>
            </label>
            <input
              type="range"
              min="0"
              max="0.1"
              step="0.005"
              value={curveIntensity}
              onChange={(e) => setCurveIntensity(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Underline Offset Slider */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Underline Offset:{' '}
              <span className="font-bold">{underlineOffset}px</span>
            </label>
            <input
              type="range"
              min="-20"
              max="5"
              step="1"
              value={underlineOffset}
              onChange={(e) => setUnderlineOffset(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <p className="text-xs text-gray-500 mt-2">
              Negative values move underline down, positive values move it up
            </p>
          </div>
        </div>

        {/* Test Examples Section */}
        <div className="space-y-16">
          <h2 className="text-3xl font-bold mb-8">Test Examples</h2>

          {/* Short Title */}
          <div>
            <h2 className="text-5xl font-bold mb-4">
              <UnderlinedTitle
                underlineColor={selectedColor}
                strokeWidth={strokeWidth}
                curveIntensity={curveIntensity}
                underlineOffset={underlineOffset}
              >
                About Us
              </UnderlinedTitle>
            </h2>
            <p className="text-gray-600 mt-6">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>

          {/* Medium Title */}
          <div>
            <h2 className="text-5xl font-bold mb-4">
              <UnderlinedTitle
                underlineColor={selectedColor}
                strokeWidth={strokeWidth}
                curveIntensity={curveIntensity}
                underlineOffset={underlineOffset}
              >
                Learn More About Us
              </UnderlinedTitle>
            </h2>
            <p className="text-gray-600 mt-6">
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </p>
          </div>

          {/* Long Title */}
          <div>
            <h2 className="text-5xl font-bold mb-4">
              <UnderlinedTitle
                underlineColor={selectedColor}
                strokeWidth={strokeWidth}
                curveIntensity={curveIntensity}
                underlineOffset={underlineOffset}
              >
                Your Digital Marketing Partner Today
              </UnderlinedTitle>
            </h2>
            <p className="text-gray-600 mt-6">
              Duis aute irure dolor in reprehenderit in voluptate velit esse
              cillum dolore eu fugiat nulla pariatur.
            </p>
          </div>

          {/* Very Short Title */}
          <div>
            <h2 className="text-5xl font-bold mb-4">
              <UnderlinedTitle
                underlineColor={selectedColor}
                strokeWidth={strokeWidth}
                curveIntensity={curveIntensity}
                underlineOffset={underlineOffset}
              >
                Services
              </UnderlinedTitle>
            </h2>
            <p className="text-gray-600 mt-6">
              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
              officia deserunt mollit anim id est laborum.
            </p>
          </div>

          {/* Extra Long Title */}
          <div>
            <h2 className="text-5xl font-bold mb-4">
              <UnderlinedTitle
                underlineColor={selectedColor}
                strokeWidth={strokeWidth}
                curveIntensity={curveIntensity}
                underlineOffset={underlineOffset}
              >
                Comprehensive Digital Solutions For Modern Businesses
              </UnderlinedTitle>
            </h2>
            <p className="text-gray-600 mt-6">
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem
              accusantium doloremque laudantium, totam rem aperiam.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
