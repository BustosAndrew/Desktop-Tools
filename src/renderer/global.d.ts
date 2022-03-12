declare let window: Window;
export interface IElectron {
  ipcRenderer: {
    getPathOnce(channel: any, func: any): void;
    getPath(): void;
    isValidPath(arg: string): Promise<string>;
    changeFilenames(arg: any[]): Promise<object>;
    generateTxtFile(arg: string[]): Promise<string>;
  };
}
declare global {
  interface Window {
    electron: IElectron;
  }
}
export {};
