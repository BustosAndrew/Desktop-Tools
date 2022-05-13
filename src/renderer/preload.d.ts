import { Channels } from '../main/preload';

declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        sendMessage(channel: Channels, args: unknown[]): void;
        on(
          channel: string,
          func: (...args: unknown[]) => void
        ): (() => void) | undefined;
        once(channel: string, func: (...args: unknown[]) => void): void;
        getPathOnce(channel: any, func: any): void;
        getPath(): void;
        isValidPath(arg: string): Promise<string>;
        changeFilenames(arg: any[]): Promise<object>;
        changeFolderNames(arg: any[]): Promise<any>;
        generateTxtFile(arg: any[]): Promise<string>;
      };
    };
  }
}

export {};
