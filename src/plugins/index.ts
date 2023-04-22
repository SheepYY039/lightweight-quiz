/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

// Plugins
import { loadFonts } from "./webfontloader";
import vuetify from "./vuetify";
import router from "../router";
import { firebaseApp } from "./firebase";

// Types
import type { App } from "vue";
import { VueFire } from "vuefire";
import { Plugin  } from "vue-responsive-video-background-player";

export function registerPlugins(app: App) {
  loadFonts();
  app.use(vuetify).use(Plugin).use(router).use(VueFire, { firebaseApp, modules: [] });
}
