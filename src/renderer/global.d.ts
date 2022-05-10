declare let window: Window;
export interface IElectron {
  ipcRenderer: {
    on(channel: any, func: any): void;
    getPathOnce(channel: any, func: any): void;
    getPath(): void;
    isValidPath(arg: string): Promise<string>;
    changeFilenames(arg: any[]): Promise<object>;
    changeFolderNames(arg: any[]): Promise<any>;
    generateTxtFile(arg: any[]): Promise<string>;
  };
}
declare global {
  interface Window {
    electron: IElectron;
  }
}
export {};
