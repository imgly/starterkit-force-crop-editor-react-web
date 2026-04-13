/**
 * CE.SDK Force Crop Editor Starterkit - React Entry Point
 *
 * Demonstrates the CE.SDK force crop feature for enforcing specific aspect ratios
 * on images. The force crop API ensures images meet required dimensions for
 * platforms like Instagram, LinkedIn, or Facebook.
 *
 * @see https://img.ly/docs/cesdk/js/getting-started/
 * @see https://img.ly/docs/cesdk/js/user-interface/customization/force-crop-c2854e/
 */

import type { Configuration } from '@cesdk/cesdk-js';
import { createRoot } from 'react-dom/client';

import App from './app/App';

// ============================================================================
// Configuration
// ============================================================================

const config: Configuration = {
  // Unique user identifier for analytics (customize for your app)
  userId: 'starterkit-force-crop-editor-user'

  // Local assets (uncomment and set path for self-hosted assets)
  // baseURL: `/assets/`,

  // License key (required for production)
  // license: 'YOUR_LICENSE_KEY',
};

// ============================================================================
// Initialize React Application
// ============================================================================

const container = document.getElementById('root');
if (!container) {
  throw new Error('Root container not found');
}

const root = createRoot(container);
root.render(<App config={config} />);
