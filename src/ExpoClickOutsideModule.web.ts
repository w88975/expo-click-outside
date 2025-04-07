import { registerWebModule, NativeModule } from 'expo';

import { ExpoClickOutsideModuleEvents } from './ExpoClickOutside.types';

class ExpoClickOutsideModule extends NativeModule<ExpoClickOutsideModuleEvents> {
  PI = Math.PI;
  async setValueAsync(value: string): Promise<void> {
    this.emit('onChange', { value });
  }
  hello() {
    return 'Hello world! 👋';
  }
}

export default registerWebModule(ExpoClickOutsideModule);
