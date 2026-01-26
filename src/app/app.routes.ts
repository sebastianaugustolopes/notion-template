import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Signup } from './pages/signup/signup';
import { Dashboard } from './pages/dashboard/dashboard';
import { ProjectDetail } from './pages/project-detail/project-detail';
import { Calendar } from './pages/calendar/calendar';
import { Projects } from './pages/projects/projects';
import { Settings } from './pages/settings/settings';
import { AuthGuard } from './services/auth-guard';

export const routes: Routes = [
    {
        path: "",
        redirectTo: "login",
        pathMatch: "full",
    },
    {
        path: "login",
        component: Login,
    },
    {
        path: "signup",
        component: Signup,
    },
    {
        path: "dashboard",
        component: Dashboard,
        canActivate: [AuthGuard],
    },
    {
        path: "calendar",
        component: Calendar,
        canActivate: [AuthGuard],
    },
    {
        path: "projects",
        component: Projects,
        canActivate: [AuthGuard],
    },
    {
        path: "settings",
        component: Settings,
        canActivate: [AuthGuard],
    },
    {
        path: "project/:id",
        component: ProjectDetail,
        canActivate: [AuthGuard],
    },
    {
        path: "**",
        redirectTo: "login",
    }
];
