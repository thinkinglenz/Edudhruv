// AMP (Accelerated Mobile Pages) custom element type declarations
// Allows TypeScript to recognize AMP-specific HTML elements

declare namespace JSX {
  interface IntrinsicElements {
    'amp-auto-ads': {
      type?: string;
      'data-ad-client'?: string;
      children?: React.ReactNode;
    };
    'amp-img': {
      src?: string;
      alt?: string;
      width?: string | number;
      height?: string | number;
      layout?: string;
      className?: string;
    };
    'amp-sidebar': {
      id?: string;
      layout?: string;
      side?: string;
      children?: React.ReactNode;
    };
    'amp-analytics': {
      type?: string;
      children?: React.ReactNode;
    };
  }
}

export {};
