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
declare module '*.svg';
declare module '*.json' {
  const content: Record<string, any>;
  export default content;
}

declare module '*.md' {
  const content: string;
  export default content;
}
