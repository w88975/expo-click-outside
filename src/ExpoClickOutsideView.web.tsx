import * as React from 'react';

import { ExpoClickOutsideViewProps } from './ExpoClickOutside.types';

export default function ExpoClickOutsideView(props: ExpoClickOutsideViewProps) {
  return (
    <div>
      <iframe
        style={{ flex: 1 }}
        src={props.url}
        onLoad={() => props.onLoad({ nativeEvent: { url: props.url } })}
      />
    </div>
  );
}
