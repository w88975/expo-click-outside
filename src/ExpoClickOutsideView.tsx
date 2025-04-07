import { requireNativeView } from 'expo';
import * as React from 'react';

import { ExpoClickOutsideViewProps } from './ExpoClickOutside.types';

const NativeView: React.ComponentType<ExpoClickOutsideViewProps> =
  requireNativeView('ExpoClickOutside');

export default function ExpoClickOutsideView(props: ExpoClickOutsideViewProps) {
  return <NativeView {...props} />;
}
