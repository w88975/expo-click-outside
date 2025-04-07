// Reexport the native module. On web, it will be resolved to ExpoClickOutsideModule.web.ts
// and on native platforms to ExpoClickOutsideModule.ts
export { default } from './ExpoClickOutsideModule';
export { default as ExpoClickOutsideView } from './ExpoClickOutsideView';
export * from  './ExpoClickOutside.types';
