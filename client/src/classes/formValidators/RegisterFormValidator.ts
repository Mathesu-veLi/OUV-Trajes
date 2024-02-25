import { createFormError } from '@/utils/createFormError';
import { IUserForm, UserFormValidator } from './UserFormValidator';

export class RegisterFormValidator extends UserFormValidator {
  constructor(form: IUserForm) {
    super(form);
  }

  protected name = this.form.name;
  protected email = this.form.email as HTMLInputElement;
  protected password = this.form.password as HTMLInputElement;
  protected confirmPassword = this.form.confirmPassword;

  public async isValid() {
    return (
      super.isValid() &&
      this.confirmPasswordIsValid() &&
      this.nameIsValid() &&
      !(await this.emailIsRegistered())
    );
  }

  protected nameIsValid(): boolean {
    return this.name?.value.length !== 0;
  }

  protected confirmPasswordIsValid(): boolean {
    return this.confirmPassword?.value === this.password.value;
  }

  public async showErrors(): Promise<void> {
    super.showErrors();

    if (this.name && !this.nameIsValid())
      createFormError(this.name, 'Name must not be empty');
    else document.querySelector('#nameError')?.remove();

    if (this.confirmPassword && !this.confirmPasswordIsValid())
      createFormError(this.confirmPassword, "Passwords don't match");
    else document.querySelector('#confirmPasswordError')?.remove();

    if (await this.emailIsRegistered())
      createFormError(this.email, 'Email already registered');
    else document.querySelector('#emailError')?.remove();
  }
}