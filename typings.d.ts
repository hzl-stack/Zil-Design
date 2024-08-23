import type { ReactElement, SVGProps } from 'react';

declare module '*.css';
declare module '*.less' {
  const content: { [className: string]: string };
  export = content;
}
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.bmp';
declare module '*.svg' {
  export function ReactComponent(props: SVGProps<SVGSVGElement>): ReactElement;

  const url: string;
  export default url;
}
declare module '*.json' {
  const content: Record<string, any>;
  export default content;
}

declare module '*.md' {
  const content: string;
  export default content;
}

// declare global {
//   interface Window {
//     businessConfig: {
//       platformBaseURL?: string;
//       baseURL?: string;
//       headers?: Record<string, any>;
//       aliossURL?: string;
//       minioOssURL?: string;
//       [key: string]: unknown;
//     };
//     token: string;
//     user: {
//       id: number;
//       localeLanguageCode: string;
//     };
//   }
// }

// declare const PLATFORM_URL: string;

// interface Window {
//   token: string;
//   user: {
//     id: number;
//     localeLanguageCode: string;
//   };
// }

// declare namespace NodeJS {
//   interface Global {
//     window: Window;
//   }
// }
