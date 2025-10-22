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
  const [selectedSize, setSelectedSize] = useState<'h1' | 'h2'>('h1');
  const [curveIntensity, setCurveIntensity] = useState(0.01);
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

          {/* Size Preset Selector */}
          <div className="mb-8">
            <label className="block text-sm font-medium mb-4">
              Text Size Preset
            </label>
            <div className="flex gap-3">
              <button
                onClick={() => setSelectedSize('h2')}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${selectedSize === 'h2'
                    ? 'bg-blue-500 text-white ring-2 ring-blue-500 ring-offset-2'
                    : 'bg-gray-200 hover:bg-gray-300'
                  }`}
              >
                H2 (Desktop 38px/9px, Mobile 28px/7px)
              </button>
              <button
                onClick={() => setSelectedSize('h1')}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${selectedSize === 'h1'
                    ? 'bg-blue-500 text-white ring-2 ring-blue-500 ring-offset-2'
                    : 'bg-gray-200 hover:bg-gray-300'
                  }`}
              >
                H1 (Desktop 50px/11px, Mobile 38px/9px)
              </button>
            </div>
          </div>

          {/* Stroke Width Slider */}
          <div className="mb-8">
            <label className="block text-sm font-medium mb-2">
              Stroke Width: <span className="font-bold">Auto (Responsive)</span>
            </label>
            <p className="text-xs text-gray-500 mt-1">
              Desktop: {selectedSize === 'h1' ? '11px' : '9px'} | Mobile: {selectedSize === 'h1' ? '9px' : '7px'}
            </p>
            <p className="text-xs text-gray-500 mt-1">Stroke width automatically adjusts based on screen size</p>
          </div>

          {/* Curve Intensity Slider */}
          <div className="mb-8">
            <label className="block text-sm font-medium mb-2">
              Curve Intensity:{' '}
              <span className="font-bold">{curveIntensity.toFixed(3)}</span>
            </label>
            <input
              type="range"
              min="0"
              max="0.05"
              step="0.002"
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
                size={selectedSize}
                underlineColor={selectedColor}
                curveIntensity={curveIntensity}
                underlineOffset={underlineOffset}
              >
                About Us
              </UnderlinedTitle>
            </h2>
          </div>

          {/* Medium Title */}
          <div>
            <h2 className="text-5xl font-bold mb-4">
              <UnderlinedTitle
                size={selectedSize}
                underlineColor={selectedColor}
                curveIntensity={curveIntensity}
                underlineOffset={underlineOffset}
              >
                Learn More About Us
              </UnderlinedTitle>
            </h2>
          </div>

          {/* Long Title */}
          <div>
            <h2 className="text-5xl font-bold mb-4">
              <UnderlinedTitle
                size={selectedSize}
                underlineColor={selectedColor}
                curveIntensity={curveIntensity}
                underlineOffset={underlineOffset}
              >
                Your Digital Marketing Partner Today
              </UnderlinedTitle>
            </h2>
          </div>

          {/* Very Short Title */}
          <div>
            <h2 className="text-5xl font-bold mb-4">
              <UnderlinedTitle
                size={selectedSize}
                underlineColor={selectedColor}
                curveIntensity={curveIntensity}
                underlineOffset={underlineOffset}
              >
                Services
              </UnderlinedTitle>
            </h2>
          </div>

          {/* Extra Long Title */}
          <div>
            <h2 className="text-5xl font-bold mb-4">
              <UnderlinedTitle
                size={selectedSize}
                underlineColor={selectedColor}
                curveIntensity={curveIntensity}
                underlineOffset={underlineOffset}
              >
                Comprehensive Digital Solutions For Modern Businesses
              </UnderlinedTitle>
            </h2>
          </div>
        </div>

        {/* Size Preset Examples */}
        <div className="mt-24 pt-12 border-t border-gray-200">
          <h2 className="text-3xl font-bold mb-8">Size Preset Examples (Manual Controls)</h2>

          {/* H1 Size */}
          <div className="mb-12">
            <p className="text-sm text-gray-500 mb-2">H1 Size (with manual adjustments)</p>
            <h1 className="text-5xl font-bold">
              <UnderlinedTitle
                size="h1"
                underlineColor="#FF60DF"
                curveIntensity={curveIntensity}
                underlineOffset={underlineOffset}
              >
                Learn More About Us
              </UnderlinedTitle>
            </h1>
          </div>

          {/* H2 Size */}
          <div className="mb-12">
            <p className="text-sm text-gray-500 mb-2">H2 Size (with manual adjustments)</p>
            <h2 className="text-4xl font-bold">
              <UnderlinedTitle
                size="h2"
                underlineColor="#7B61FF"
                curveIntensity={curveIntensity}
                underlineOffset={underlineOffset}
              >
                Medium Heading Example
              </UnderlinedTitle>
            </h2>
          </div>
        </div>

        {/* Responsive Size Examples */}
        <div className="mt-24 pt-12 border-t border-gray-200">
          <h2 className="text-3xl font-bold mb-8">Responsive Sizing Test</h2>

          {/* H1 - Desktop 50px/11px, Mobile 38px/9px */}
          <div className="mb-12">
            <p className="text-sm text-gray-500 mb-2">
              H1: Desktop (50px/11px stroke) | Mobile (38px/9px stroke)
            </p>
            <h1 className="font-bold">
              <UnderlinedTitle size="h1" underlineColor="#FF60DF">
                Large Heading Responsive Test
              </UnderlinedTitle>
            </h1>
          </div>

          {/* H2 - Desktop 38px/9px, Mobile 28px/7px */}
          <div className="mb-12">
            <p className="text-sm text-gray-500 mb-2">
              H2: Desktop (38px/9px stroke) | Mobile (28px/7px stroke)
            </p>
            <h2 className="font-bold">
              <UnderlinedTitle size="h2" underlineColor="#7B61FF">
                Medium Heading Responsive Test
              </UnderlinedTitle>
            </h2>
          </div>

          {/* Multi-line Test */}
          <div className="mb-12">
            <p className="text-sm text-gray-500 mb-2">Multi-line Test (resize window)</p>
            <h1 className="font-bold max-w-2xl">
              <UnderlinedTitle size="h1" underlineColor="#FD8721">
                This Is A Very Long Heading That Should Wrap To Multiple Lines And Show Underlines On Each Line
              </UnderlinedTitle>
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
}
