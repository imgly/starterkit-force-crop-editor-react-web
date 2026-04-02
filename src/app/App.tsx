/**
 * CE.SDK Force Crop Editor - Main Application Component
 *
 * This component manages the application state and renders either:
 * - SelectionUI: For choosing image, crop preset, and mode
 * - CreativeEditor: For editing with the selected configuration
 */

import React, { useState } from 'react';
import { CreativeEditor } from '@cesdk/cesdk-js/react';
import type CreativeEditorSDK from '@cesdk/cesdk-js';
import type { Configuration } from '@cesdk/cesdk-js';

import SelectionUI from './SelectionUI';
import {
  initForceCropEditor,
  DEFAULT_CROP_PRESETS,
  SAMPLE_IMAGES,
  type CropPreset,
  type CropModeId,
  type ImageConfig
} from '../imgly';

import styles from './App.module.css';

// ============================================================================
// Types
// ============================================================================

interface AppProps {
  config: Partial<Configuration>;
}

// ============================================================================
// Main Application Component
// ============================================================================

export default function App({ config }: AppProps) {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<ImageConfig>(SAMPLE_IMAGES[0]);
  const [selectedPreset, setSelectedPreset] = useState<CropPreset>(DEFAULT_CROP_PRESETS[0]);
  const [selectedMode, setSelectedMode] = useState<CropModeId>('always');

  /**
   * Handle selection completion from SelectionUI
   */
  const handleSelectionComplete = (
    image: ImageConfig,
    preset: CropPreset,
    mode: CropModeId
  ) => {
    setSelectedImage(image);
    setSelectedPreset(preset);
    setSelectedMode(mode);
    setIsEditorOpen(true);
  };

  /**
   * Initialize the editor with selected configuration
   */
  const handleEditorInit = async (cesdk: CreativeEditorSDK) => {
    // Expose cesdk instance globally for automated testing
    (window as unknown as { cesdk: CreativeEditorSDK }).cesdk = cesdk;

    // Initialize the force crop editor with selected configuration
    await initForceCropEditor(cesdk, {
      preset: selectedPreset,
      mode: selectedMode,
      image: selectedImage
    });

    console.log('Force Crop Editor initialized');
    console.log('Image:', selectedImage.alt);
    console.log('Preset:', selectedPreset.label.en);
    console.log('Mode:', selectedMode);
  };

  // ============================================================================
  // Render
  // ============================================================================

  if (!isEditorOpen) {
    return (
      <SelectionUI
        images={SAMPLE_IMAGES}
        presets={DEFAULT_CROP_PRESETS}
        onComplete={handleSelectionComplete}
      />
    );
  }

  return (
    <div className={styles.editorContainer}>
      <CreativeEditor config={config} init={handleEditorInit} />
    </div>
  );
}
