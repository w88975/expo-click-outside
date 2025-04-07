import { NativeModule, requireNativeModule } from 'expo';

import { ExpoClickOutsideModuleEvents } from './ExpoClickOutside.types';

declare class ExpoClickOutsideModule extends NativeModule<ExpoClickOutsideModuleEvents> {
  PI: number;
  hello(): string;
  setValueAsync(value: string): Promise<void>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<ExpoClickOutsideModule>('ExpoClickOutside');
