/**
 * CE.SDK Force Crop Editor - Initialization Module
 *
 * This module provides the main entry point for initializing the force crop editor.
 * Import and call `initForceCropEditor()` to configure a CE.SDK instance for
 * photo editing with force crop functionality.
 *
 * The force crop feature allows you to enforce specific aspect ratios on images,
 * such as Instagram Portrait (4:5), LinkedIn Profile (1:1), or Facebook Shared (1.91:1).
 *
 * @see https://img.ly/docs/cesdk/js/getting-started/
 * @see https://img.ly/docs/cesdk/js/user-interface/customization/force-crop-c2854e/
 */

import CreativeEditorSDK from '@cesdk/cesdk-js';

import {
  BlurAssetSource,
  ColorPaletteAssetSource,
  DemoAssetSources,
  EffectsAssetSource,
  FiltersAssetSource,
  PagePresetsAssetSource,
  StickerAssetSource,
  TextAssetSource,
  TextComponentAssetSource,
  TypefaceAssetSource,
  UploadAssetSources,
  VectorShapeAssetSource
} from '@cesdk/cesdk-js/plugins';

// Configuration and plugins
import { PhotoEditorConfig } from './config/plugin';
import { setupBackgroundRemovalPlugin } from './plugins/background-removal';

// Re-export for external use
export { PhotoEditorConfig } from './config/plugin';
export { setupBackgroundRemovalPlugin } from './plugins/background-removal';

// ============================================================================
// Types
// ============================================================================

/**
 * Configuration for a crop preset.
 */
export interface CropPreset {
  id: string;
  label: {
    en: string;
  };
  meta: {
    thumbUri: string;
    icon: string;
    thumbAlt: string;
  };
  payload: {
    transformPreset: {
      type: 'FixedAspectRatio';
      width: number;
      height: number;
      designUnit: 'Pixel';
    };
  };
  groups: string[];
}

/**
 * Crop mode options.
 * - 'always': Always opens crop mode when force crop is applied
 * - 'ifNeeded': Opens crop mode only if the image doesn't match the aspect ratio
 * - 'silent': Applies cropping silently without user interaction
 */
export type CropModeId = 'always' | 'ifNeeded' | 'silent';

/**
 * Image configuration for force crop.
 */
export interface ImageConfig {
  full: string;
  thumb: string;
  width: number;
  height: number;
  alt: string;
}

// ============================================================================
// Default Crop Presets
// ============================================================================

const CASE_ASSET_PATH = 'https://img.ly/showcases/cesdk/cases/force-crop';

/**
 * Default crop presets for common social media formats.
 */
export const DEFAULT_CROP_PRESETS: CropPreset[] = [
  {
    id: 'custom-portrait-post',
    label: { en: 'Portrait Post (4:5)' },
    meta: {
      thumbUri: `${CASE_ASSET_PATH}/thumb-instagram.png`,
      icon: `${CASE_ASSET_PATH}/logo-instagram.svg`,
      thumbAlt: 'Instagram Logo'
    },
    payload: {
      transformPreset: {
        type: 'FixedAspectRatio',
        width: 4,
        height: 5,
        designUnit: 'Pixel'
      }
    },
    groups: ['custom-ratio']
  },
  {
    id: 'custom-profile-photo',
    label: { en: 'Profile Photo (1:1)' },
    meta: {
      thumbUri: `${CASE_ASSET_PATH}/thumb-linkedin.png`,
      icon: `${CASE_ASSET_PATH}/logo-linkedin.svg`,
      thumbAlt: 'LinkedIn Logo'
    },
    payload: {
      transformPreset: {
        type: 'FixedAspectRatio',
        width: 1,
        height: 1,
        designUnit: 'Pixel'
      }
    },
    groups: ['custom-ratio']
  },
  {
    id: 'custom-shared-image',
    label: { en: 'Shared Image (1.91:1)' },
    meta: {
      thumbUri: `${CASE_ASSET_PATH}/thumb-facebook.png`,
      icon: `${CASE_ASSET_PATH}/logo-facebook.svg`,
      thumbAlt: 'Facebook Logo'
    },
    payload: {
      transformPreset: {
        type: 'FixedAspectRatio',
        width: 1.91,
        height: 1,
        designUnit: 'Pixel'
      }
    },
    groups: ['custom-ratio']
  }
];

// ============================================================================
// Default Sample Image
// ============================================================================

/**
 * Sample images for demonstration purposes.
 */
export const SAMPLE_IMAGES: ImageConfig[] = [
  {
    full: `${CASE_ASSET_PATH}/image-1.png`,
    thumb: `${CASE_ASSET_PATH}/image-1.png`,
    width: 800,
    height: 1200,
    alt: 'Photographer with camera'
  },
  {
    full: `${CASE_ASSET_PATH}/image-2.png`,
    thumb: `${CASE_ASSET_PATH}/image-2.png`,
    width: 1200,
    height: 800,
    alt: 'Mountain landscape'
  },
  {
    full: `${CASE_ASSET_PATH}/image-3.png`,
    thumb: `${CASE_ASSET_PATH}/image-3.png`,
    width: 1200,
    height: 1200,
    alt: 'Healthy salad bowl'
  }
];

/**
 * Default sample image for demonstration purposes.
 */
export const DEFAULT_IMAGE: ImageConfig = SAMPLE_IMAGES[0];

// ============================================================================
// Initialize Force Crop Editor
// ============================================================================

/**
 * Initialize the CE.SDK Force Crop Editor with a complete configuration.
 *
 * This function configures a CE.SDK instance with:
 * - Photo editor UI configuration
 * - Background removal plugin
 * - Asset source plugins (filters, stickers, shapes, etc.)
 * - Force crop functionality with customizable presets and modes
 *
 * @param cesdk - The CreativeEditorSDK instance to configure
 * @param options - Configuration options for force crop
 * @param options.preset - The crop preset to apply (default: Instagram Portrait 4:5)
 * @param options.mode - The crop mode: 'always', 'ifNeeded', or 'silent' (default: 'always')
 * @param options.image - The image configuration to load (default: sample image)
 */
export async function initForceCropEditor(
  cesdk: CreativeEditorSDK,
  options: {
    preset?: CropPreset;
    mode?: CropModeId;
    image?: ImageConfig;
  } = {}
) {
  const {
    preset = DEFAULT_CROP_PRESETS[0], // Default to Instagram Portrait (4:5)
    mode = 'always',
    image = DEFAULT_IMAGE
  } = options;

  // ============================================================================
  // Configuration Plugin
  // ============================================================================

  // Add the photo editor configuration plugin
  // This sets up the UI, features, settings, and i18n for photo editing
  await cesdk.addPlugin(new PhotoEditorConfig());

  // ============================================================================
  // Background Removal Plugin
  // ============================================================================

  // Setup AI-powered background removal
  // Requires: npm install @imgly/background-removal onnxruntime-web
  setupBackgroundRemovalPlugin(cesdk);

  // ============================================================================
  // Asset Source Plugins
  // ============================================================================

  // Asset source plugins provide built-in asset libraries
  await cesdk.addPlugin(new BlurAssetSource());
  await cesdk.addPlugin(new ColorPaletteAssetSource());
  await cesdk.addPlugin(new EffectsAssetSource());
  await cesdk.addPlugin(new FiltersAssetSource());
  await cesdk.addPlugin(new PagePresetsAssetSource());
  await cesdk.addPlugin(new StickerAssetSource());
  await cesdk.addPlugin(new TextAssetSource());
  await cesdk.addPlugin(new TextComponentAssetSource());
  await cesdk.addPlugin(new TypefaceAssetSource());
  await cesdk.addPlugin(new VectorShapeAssetSource());
  await cesdk.addPlugin(
    new UploadAssetSources({
      include: ['ly.img.image.upload']
    })
  );
  await cesdk.addPlugin(
    new DemoAssetSources({
      include: ['ly.img.image.*', 'ly.img.templates.blank.*']
    })
  );

  // ============================================================================
  // Setup Photo Editing Scene
  // ============================================================================

  const engine = cesdk.engine;

  // Hide page title
  engine.editor.setSetting('page/title/show', false);

  // Disable placeholder, preview, and resize features
  cesdk.feature.disable([
    'ly.img.placeholder',
    'ly.img.preview',
    'ly.img.page.resize'
  ]);

  // Create a new scene
  const scene = engine.scene.create('Free');
  engine.scene.setDesignUnit('Pixel');
  const page = engine.block.create('page');
  engine.block.appendChild(scene, page);

  // Set page size based on the image
  engine.block.setWidth(page, image.width);
  engine.block.setHeight(page, image.height);

  // Create image fill
  const fill = engine.block.createFill('image');
  engine.block.setSourceSet(fill, 'fill/image/sourceSet', [
    { uri: image.full, width: image.width, height: image.height }
  ]);
  engine.block.setFill(page, fill);
  engine.block.setContentFillMode(page, 'Cover');

  // Configure page behavior
  engine.block.setScopeEnabled(page, 'fill/change', false);
  engine.block.setScopeEnabled(page, 'fill/changeType', false);
  engine.block.setScopeEnabled(page, 'stroke/change', false);
  engine.editor.setSetting('page/moveChildrenWhenCroppingFill', true);
  engine.block.setClipped(page, true);

  // Zoom auto-fit to page
  await cesdk.actions.run('zoom.toPage', { autoFit: true });

  // Initially select the page
  engine.block.select(page);

  // ============================================================================
  // Force Crop Configuration
  // ============================================================================

  // Hide 'Crop Area' Inputs on Silent mode
  cesdk.feature.disable(['ly.img.crop.size']);

  // Remove all existing crop presets and add our custom one
  engine.asset.removeSource('ly.img.page.presets');
  engine.asset.addLocalSource('ly.img.page.presets');
  engine.asset.addAssetToSource(
    'ly.img.page.presets',
    preset as Parameters<typeof engine.asset.addAssetToSource>[1]
  );

  // Apply force crop with the selected preset and mode
  await cesdk.ui.applyForceCrop(page, {
    mode: mode,
    presetId: preset.id,
    sourceId: 'ly.img.page.presets'
  });
}
