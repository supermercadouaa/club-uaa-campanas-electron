import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    invoke: (channel: string, data?: unknown) =>
      ipcRenderer.invoke(channel, data),
    on: (channel: string, func: (...args: unknown[]) => void) =>
      ipcRenderer.on(channel, (event, ...args) => func(...args)),
    once: (channel: string, func: (...args: unknown[]) => void) =>
      ipcRenderer.once(channel, (event, ...args) => func(...args)),
    removeListener: (channel: string, func: (...args: unknown[]) => void) =>
      ipcRenderer.removeListener(channel, func),
  },
  api: {
    // Database
    dbCredentialsExist: () => ipcRenderer.invoke('db:credentials-exist'),
    dbSaveCredentials: (creds: any) => ipcRenderer.invoke('db:save-credentials', creds),
    dbTestConnection: (creds: any) => ipcRenderer.invoke('db:test-connection', creds),
    dbInit: () => ipcRenderer.invoke('db:init'),
    dbAuthLogin: (email: string, password: string) => ipcRenderer.invoke('db:auth-login', email, password),
    dbChangePassword: (email: string, password: string) => ipcRenderer.invoke('db:change-password', email, password),
    dbCreateCampaign: (data: any) => ipcRenderer.invoke('db:create-campaign', data),
    dbClose: () => ipcRenderer.invoke('db:close'),
  },
});
