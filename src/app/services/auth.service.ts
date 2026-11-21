import { Injectable, NgZone } from '@angular/core';
import {
  GoogleAuthProvider,
  User,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { BehaviorSubject } from 'rxjs';
import { auth, db } from '../firebase/config';

/** Thrown by signIn() when the Google account is not one of the editors. */
export class UnauthorizedAccountError extends Error {
  constructor(readonly email: string | null) {
    super('Account is not authorized');
  }
}

/**
 * Google login restricted to the editor accounts.
 *
 * The list of editors lives only in the Firestore rules (firestore.rules), so
 * the emails do not end up in the public bundle. After login the app reads
 * `_editorCheck/check`, which the rules allow only for editors; any other
 * account is deleted from Firebase Auth and signed out.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  /** undefined = still checking the saved session; null = signed out. */
  readonly user$ = new BehaviorSubject<User | null | undefined>(undefined);

  /** While signIn() runs, it decides what happens to the new account. */
  private signingIn = false;

  constructor(private zone: NgZone) {
    onAuthStateChanged(auth, (user) => {
      if (this.signingIn) return;
      if (!user) return this.emit(null);

      // Restored session: check again (the account may have left the rules)
      this.isEditor().then(
        (ok) => {
          if (ok) return this.emit(user);
          this.emit(null);
          signOut(auth);
        },
        (error) => {
          console.error(error);
          this.emit(null);
        },
      );
    });
  }

  async signIn(): Promise<void> {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });

    this.signingIn = true;
    try {
      const { user } = await signInWithPopup(auth, provider);

      const ok = await this.isEditor().catch(async (error) => {
        await signOut(auth); // could not verify: do not keep the session
        throw error;
      });

      if (!ok) {
        // Remove the account the popup just created; sign out if that fails
        await user.delete().catch(() => signOut(auth));
        this.emit(null);
        throw new UnauthorizedAccountError(user.email);
      }

      this.emit(user);
    } finally {
      this.signingIn = false;
    }
  }

  signOut(): Promise<void> {
    return signOut(auth);
  }

  private async isEditor(): Promise<boolean> {
    try {
      await getDoc(doc(db, '_editorCheck', 'check'));
      return true;
    } catch (error) {
      if ((error as { code?: string })?.code === 'permission-denied') return false;
      throw error;
    }
  }

  private emit(user: User | null): void {
    this.zone.run(() => this.user$.next(user));
  }
}
