import { createApp } from 'vue';
import App from './App.vue';
import './assets/css/item-styles.css';
import './assets/css/styles.css';
import Panel from './components/Panel.vue';

const app = createApp(App);
app.component('panel', Panel);

app.mount('#app');
