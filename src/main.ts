import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http'; // ✅ AJOUTÉ
import { AppComponent } from './app.component';
import { appRoutes } from './app.routes';

bootstrapApplication(AppComponent, {
  providers: [
    provideAnimations(),
    provideRouter(appRoutes),
    provideHttpClient() // ✅ AJOUTÉ pour résoudre l'erreur HttpClient
  ]
}).catch(err => console.error(err));
