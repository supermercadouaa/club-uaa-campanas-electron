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
  updater: {
    onUpdateAvailable: (fn: (version: string) => void) =>
      ipcRenderer.on('update:available', (_e, version) => fn(version)),
    onUpdateDownloaded: (fn: () => void) =>
      ipcRenderer.on('update:downloaded', () => fn()),
    onStatus: (fn: (status: string) => void) =>
      ipcRenderer.on('update:status', (_e, status) => fn(status)),
    installUpdate: () => ipcRenderer.invoke('update:install'),
    getAppVersion: () => ipcRenderer.invoke('app:version'),
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
    dbGetCampaigns: (data: any) => ipcRenderer.invoke('db:get-campaigns', data),
    dbGetCampaignDetail: (data: any) => ipcRenderer.invoke('db:get-campaign-detail', data),
    dbClose: () => ipcRenderer.invoke('db:close'),
    templatesGet: () => ipcRenderer.invoke('templates:get'),
    templatesGetPath: () => ipcRenderer.invoke('templates:get-path'),
    templatesSetPath: (p: string) => ipcRenderer.invoke('templates:set-path', p),
  },
});
