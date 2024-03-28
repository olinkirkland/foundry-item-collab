import { createApp } from 'vue';
import './assets/css/styles.css';
import './assets/css/item-styles.css';
import App from './App.vue';
import Panel from './components/Panel.vue';

const app = createApp(App);
app.component('panel', Panel);

app.mount('#app');
