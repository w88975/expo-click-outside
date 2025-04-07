import { NativeModule, requireNativeModule } from "expo";
import { EventEmitter, Platform } from "expo-modules-core";

import { ExpoClickOutsideModuleEvents } from "./ExpoClickOutside.types";

declare class ExpoClickOutsideModule extends NativeModule<ExpoClickOutsideModuleEvents> {
  hello(): Promise<string>;
}

const module = requireNativeModule<ExpoClickOutsideModule>("ExpoClickOutside");

export const emitter = new EventEmitter(module);

export default module;

