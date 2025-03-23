import type { App } from 'vue';
import Loading from './common/Loading.vue';
import ErrorMessage from './common/ErrorMessage.vue';
import ConfirmDialog from './common/ConfirmDialog.vue';

export default {
  install: (app: App) => {
    app.component('Loading', Loading);
    app.component('ErrorMessage', ErrorMessage);
    app.component('ConfirmDialog', ConfirmDialog);
  }
};

export {
  Loading,
  ErrorMessage,
  ConfirmDialog
}; 