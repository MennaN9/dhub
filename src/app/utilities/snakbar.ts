
/**
 * Snackbar 
 * 
 * https://material.angular.io/components/snack-bar/overview
 */
import { MatSnackBar } from '@angular/material/snack-bar';
import { Injectable, Injector } from '@angular/core';


export interface Body {
    message: string;
    action: string;
    duration: number;
}

@Injectable({
    providedIn: 'root'
})
export class SnackBar {

    snackBar: MatSnackBar;
    constructor(private inject: Injector) {
        this.snackBar = this.inject.get(MatSnackBar);
    }

    /**
     * show snackbar
     * 
     * 
     * @param message 
     * @param action 
     * @param duration 
     * 
     */
    openSnackBar(body: Body) {
        this.snackBar.open(body.message, body.action, {
            duration: body.duration,
        });
    }
}
