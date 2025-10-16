import type { PropsWithChildren, CSSProperties } from 'react';

export function Overlay({
  children,
  style,
}: PropsWithChildren & { style?: CSSProperties }) {
  return (
    <div
      style={{
        position: 'absolute',
        top: '10px',
        left: '10px',
        zIndex: 1,
        backgroundColor: 'white',
        borderRadius: '20px',
        padding: '20px',
        width: 'fit-content',
        boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px',
        ...style,
      }}
    >
      {children}
    </div>
  );
}
