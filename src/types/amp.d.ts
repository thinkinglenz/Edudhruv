// AMP (Accelerated Mobile Pages) custom element type declarations.
//
// IMPORTANT: do NOT add a top-level `import` or `export` to this file.
// Doing so turns it into a module, which makes the `JSX` namespace
// augmentation below LOCAL (and silently ignored). Keeping it a plain
// ambient script file lets it augment the GLOBAL JSX namespace so all
// `amp-*` elements are recognized across the app.

declare namespace JSX {
  interface IntrinsicElements {
    "amp-auto-ads": any;
    "amp-img": any;
    "amp-sidebar": any;
    "amp-analytics": any;
  }
}
