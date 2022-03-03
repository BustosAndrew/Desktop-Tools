declare let window: Window;
export interface IElectron {
  ipcRenderer: {
    //getMsgOnce(channel: any, func: any): void;
    sendMsg(arg: string): void;
    getMsg(): Promise<string>;
  };
}
declare global {
  interface Window {
    electron: IElectron;
    process: any;
    require: any;
  }
}
export {};
